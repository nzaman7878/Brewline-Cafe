import { Order } from '../models/Order.js';
import { MenuItem } from '../models/MenuItem.js';
import { PromoCode } from '../models/PromoCode.js';
import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { refundPaymentIntent } from '../services/stripeService.js';
import { getIO } from '../config/socket.js';
import { cloudinary } from '../config/cloudinary.js';
import { notificationQueue } from '../services/notificationQueue.js';

// ─── MENU ITEM CRUD ──────────────────────────────────────────────

export const createMenuItem = asyncHandler(async (req, res) => {
  const itemData = req.body;
  if (req.file) {
    itemData.imageUrl = req.file.path; // Cloudinary secure URL
  }
  
  if (itemData.customizationOptions) {
    // If sent as FormData string
    if (typeof itemData.customizationOptions === 'string') {
      try {
        itemData.customizationOptions = JSON.parse(itemData.customizationOptions);
      } catch (e) {
        throw new ApiError(400, 'Invalid JSON for customizationOptions');
      }
    }
  }

  const newItem = await MenuItem.create(itemData);
  res.status(201).json({ success: true, data: newItem });
});

export const updateMenuItem = asyncHandler(async (req, res) => {
  const itemData = req.body;
  
  if (req.file) {
    itemData.imageUrl = req.file.path;
  }
  
  if (itemData.customizationOptions && typeof itemData.customizationOptions === 'string') {
    try {
      itemData.customizationOptions = JSON.parse(itemData.customizationOptions);
    } catch (e) {
      throw new ApiError(400, 'Invalid JSON for customizationOptions');
    }
  }

  const updatedItem = await MenuItem.findByIdAndUpdate(req.params.id, itemData, { new: true, runValidators: true });
  if (!updatedItem) throw new ApiError(404, 'Menu item not found');
  
  // Alert connected clients of menu update
  getIO().emit('menu-updated', updatedItem);
  
  res.status(200).json({ success: true, data: updatedItem });
});

export const deleteMenuItem = asyncHandler(async (req, res) => {
  const item = await MenuItem.findByIdAndDelete(req.params.id);
  if (!item) throw new ApiError(404, 'Menu item not found');
  
  res.status(200).json({ success: true, data: {} });
});

// ─── PROMO CODE CRUD ──────────────────────────────────────────────

export const getPromoCodes = asyncHandler(async (req, res) => {
  const promos = await PromoCode.find().sort('-createdAt');
  res.status(200).json({ success: true, data: promos });
});

export const createPromoCode = asyncHandler(async (req, res) => {
  const promo = await PromoCode.create(req.body);
  res.status(201).json({ success: true, data: promo });
});

export const updatePromoCode = asyncHandler(async (req, res) => {
  const promo = await PromoCode.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!promo) throw new ApiError(404, 'Promo code not found');
  res.status(200).json({ success: true, data: promo });
});

export const deletePromoCode = asyncHandler(async (req, res) => {
  const promo = await PromoCode.findByIdAndDelete(req.params.id);
  if (!promo) throw new ApiError(404, 'Promo code not found');
  res.status(200).json({ success: true, data: {} });
});

// ─── ORDER MANAGEMENT & REFUNDS ────────────────────────────────────────

export const getOrders = asyncHandler(async (req, res) => {
  const { status, dateRange } = req.query;
  const filter = {};
  
  if (status) filter.status = status;
  
  // Sort newest first
  const orders = await Order.find(filter).sort('-createdAt');
  res.status(200).json({ success: true, count: orders.length, data: orders });
});

export const refundOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw new ApiError(404, 'Order not found');
  
  if (['cancelled', 'refunded'].includes(order.status)) {
    throw new ApiError(400, 'Order is already cancelled or refunded');
  }
  
  if (!order.paymentIntentId) {
    throw new ApiError(400, 'Cannot refund order without payment intent');
  }

  // Issue refund via Stripe
  try {
    await refundPaymentIntent(order.paymentIntentId);
  } catch (stripeError) {
    throw new ApiError(500, `Stripe refund failed: ${stripeError.message}`);
  }

  // Update order status
  order.status = 'refunded';
  await order.save();

  // Alert tracking screen and staff dashboards
  const io = getIO();
  io.of('/orders').to(`order:${order._id}`).emit('order-updated', order);
  io.of('/staff').to('staff:queue').emit('queue-updated', order);

  notificationQueue.notifyRefund(order);

  res.status(200).json({ success: true, data: order });
});

export const forceUpdateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) throw new ApiError(404, 'Order not found');
  
  order.status = status;
  await order.save();
  
  const io = getIO();
  io.of('/orders').to(`order:${order._id}`).emit('order-updated', order);
  io.of('/staff').to('staff:queue').emit('queue-updated', order);
  
  res.status(200).json({ success: true, data: order });
});

// ─── ANALYTICS ──────────────────────────────────────────────

export const getAnalytics = asyncHandler(async (req, res) => {
  const [totalRevenue, dailyRevenue, topItems, categories] = await Promise.all([
    // 1. Total lifetime revenue (completed orders)
    Order.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, revenue: { $sum: '$total' } } }
    ]),
    
    // 2. Daily revenue time-series
    Order.aggregate([
      { $match: { status: 'completed' } },
      { 
        $group: { 
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$total' },
          ordersCount: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]),
    
    // 3. Top selling items by volume
    Order.aggregate([
      { $match: { status: 'completed' } },
      { $unwind: '$items' },
      { 
        $group: {
          _id: '$items.name',
          quantitySold: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.quantity', '$items.unitPrice'] } }
        }
      },
      { $sort: { quantitySold: -1 } },
      { $limit: 10 }
    ]),

    // 4. Items sold by category
    Order.aggregate([
      { $match: { status: 'completed' } },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'menuitems',
          localField: 'items.menuItemId',
          foreignField: '_id',
          as: 'menuItem'
        }
      },
      { $unwind: '$menuItem' },
      {
        $group: {
          _id: '$menuItem.category',
          count: { $sum: '$items.quantity' }
        }
      }
    ])
  ]);

  res.status(200).json({
    success: true,
    data: {
      totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].revenue : 0,
      dailyRevenue,
      topItems,
      categories
    }
  });
});

// ─── USER MANAGEMENT ──────────────────────────────────────────────

export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').sort('-createdAt');
  res.status(200).json({ success: true, count: users.length, data: users });
});

export const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  if (!['customer', 'staff', 'admin'].includes(role)) {
    throw new ApiError(400, 'Invalid role');
  }

  const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true, runValidators: true }).select('-password');
  if (!user) throw new ApiError(404, 'User not found');
  
  res.status(200).json({ success: true, data: user });
});
