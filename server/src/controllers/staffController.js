import { Order } from '../models/Order.js';
import { MenuItem } from '../models/MenuItem.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { getIO } from '../config/socket.js';

/**
 * @desc    Get active orders (queue)
 * @route   GET /api/staff/orders
 * @access  Private/Staff
 */
export const getActiveOrders = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = {};
  
  if (status) {
    filter.status = status;
  } else {
    // By default, only show actionable orders in the kitchen queue
    filter.status = { $in: ['paid', 'preparing', 'ready_for_pickup'] };
  }

  // Sort oldest first (FIFO queue)
  const orders = await Order.find(filter).sort('createdAt');
  
  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders
  });
});

/**
 * @desc    Update order status
 * @route   PUT /api/staff/orders/:id/status
 * @access  Private/Staff
 */
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  // Define valid state machine transitions
  const validTransitions = {
    'pending_payment': ['paid', 'cancelled'],
    'paid': ['preparing', 'cancelled', 'refunded'],
    'preparing': ['ready_for_pickup', 'cancelled', 'refunded'],
    'ready_for_pickup': ['completed', 'cancelled', 'refunded'],
    'completed': ['refunded'],
    'cancelled': [],
    'refunded': []
  };

  if (!validTransitions[order.status]?.includes(status)) {
    throw new ApiError(400, `Invalid status transition from '${order.status}' to '${status}'`);
  }

  order.status = status;
  await order.save();

  try {
    const io = getIO();
    
    // 1. Alert the specific customer tracking this order
    io.of('/orders').to(`order:${order._id}`).emit('order-updated', order);
    
    // 2. Alert all staff dashboards to re-render the queue
    io.of('/staff').to('staff:queue').emit('queue-updated', order);
  } catch (error) {
    console.error('Socket error on order update:', error);
  }

  res.status(200).json({
    success: true,
    data: order
  });
});

/**
 * @desc    Toggle menu item availability (86'd items)
 * @route   PUT /api/staff/menu/:id/availability
 * @access  Private/Staff
 */
export const toggleMenuAvailability = asyncHandler(async (req, res) => {
  const item = await MenuItem.findById(req.params.id);

  if (!item) {
    throw new ApiError(404, 'Menu item not found');
  }

  // Toggle availability
  item.isAvailable = !item.isAvailable;
  await item.save();

  try {
    const io = getIO();
    // Alert staff dashboards
    io.of('/staff').to('staff:queue').emit('menu-updated', item);
  } catch (error) {
    console.error('Socket error on menu update:', error);
  }

  res.status(200).json({
    success: true,
    data: item
  });
});
