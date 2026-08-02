import { Order } from '../models/Order.js';
import { MenuItem } from '../models/MenuItem.js';
import { PromoCode } from '../models/PromoCode.js';
import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as stripeService from '../services/stripeService.js';

const TAX_RATE = 0.08875;

/**
 * @desc    Create a new order and generate payment intent
 * @route   POST /api/orders
 * @access  Public / Optional Auth
 */
export const createOrder = asyncHandler(async (req, res) => {
  const { items, promoCode, pickupTime, guestEmail, guestName, guestPhone, idempotencyKey } = req.body;

  if (!req.user && !guestEmail) {
    throw new ApiError(400, 'Guest email is required for unauthenticated orders');
  }

  // Idempotency check
  let existingOrder = await Order.findOne({ idempotencyKey });
  if (existingOrder) {
    return res.status(200).json({ success: true, data: existingOrder });
  }

  // 1. Calculate totals
  let subtotal = 0;
  const processedItems = [];

  for (const item of items) {
    const menuItem = await MenuItem.findById(item.menuItemId);
    if (!menuItem) throw new ApiError(404, `Menu item not found: ${item.menuItemId}`);
    if (!menuItem.isAvailable) throw new ApiError(400, `${menuItem.name} is currently sold out`);

    let itemPrice = menuItem.price;
    if (item.selectedOptions) {
      for (const [groupName, optionValue] of Object.entries(item.selectedOptions)) {
        const customGroup = menuItem.customizations.find(c => c.name === groupName);
        if (customGroup) {
          const values = Array.isArray(optionValue) ? optionValue : [optionValue];
          for (const val of values) {
            const customOption = customGroup.options.find(o => o.name === val);
            if (customOption) {
              itemPrice += customOption.priceAdjustment;
            }
          }
        }
      }
    }

    subtotal += (itemPrice * item.quantity);
    processedItems.push({
      menuItemId: menuItem._id,
      name: menuItem.name,
      imageUrl: menuItem.image,
      quantity: item.quantity,
      unitPrice: itemPrice,
      selectedOptions: item.selectedOptions
    });
  }

  // 2. Handle Promo Code Atomically
  let discountAmount = 0;
  if (promoCode) {
    const promo = await PromoCode.findOneAndUpdate(
      { 
        code: promoCode.toUpperCase(), 
        isActive: true, 
        startDate: { $lte: new Date() },
        expiryDate: { $gte: new Date() },
        $or: [{ maxUses: null }, { $expr: { $lt: ["$usedCount", "$maxUses"] } }],
        minOrderValue: { $lte: subtotal }
      },
      { $inc: { usedCount: 1 } },
      { new: true }
    );

    if (!promo) {
      throw new ApiError(400, 'Invalid, expired, or maxed out promo code for this order subtotal');
    }

    if (promo.discountType === 'percentage') {
      discountAmount = subtotal * (promo.discountValue / 100);
    } else {
      discountAmount = Math.min(subtotal, promo.discountValue);
    }
  }

  // 3. Tax and Total
  const afterDiscount = Math.max(0, subtotal - discountAmount);
  const taxAmount = afterDiscount * TAX_RATE;
  const total = afterDiscount + taxAmount;
  const amountInCents = Math.round(total * 100);

  if (amountInCents < 50) {
    throw new ApiError(400, 'Order total is below the minimum charge amount (50 cents)');
  }

  // 4. Create Stripe Intent
  let customerId;
  let email = guestEmail;

  if (req.user) {
    email = req.user.email;
    const customer = await stripeService.getOrCreateCustomer(req.user);
    customerId = customer.id;
    if (!req.user.stripeCustomerId) {
      await User.findByIdAndUpdate(req.user._id, { stripeCustomerId: customer.id });
    }
  } else {
    // Create guest customer
    const customer = await stripeService.getOrCreateCustomer({ email: guestEmail, firstName: guestName, lastName: '' });
    customerId = customer.id;
  }

  // Temporary dummy intent creation - waiting to link it to the actual Order ID
  const paymentIntent = await stripeService.createPaymentIntent(
    amountInCents,
    'usd',
    customerId,
    { email }
  );

  // 5. Save Order
  const order = await Order.create({
    customer: req.user ? req.user._id : null,
    guestEmail,
    guestName,
    guestPhone,
    items: processedItems,
    subtotal,
    tax: taxAmount,
    discount: discountAmount,
    promoCode,
    total,
    pickupTime,
    paymentIntentId: paymentIntent.id,
    clientSecret: paymentIntent.client_secret,
    idempotencyKey
  });

  res.status(201).json({
    success: true,
    data: order
  });
});

/**
 * @desc    Get logged in user orders
 * @route   GET /api/orders/my
 * @access  Private
 */
export const getMyOrders = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;

  const orders = await Order.find({ customer: req.user._id })
    .sort('-createdAt')
    .skip(startIndex)
    .limit(limit);

  const total = await Order.countDocuments({ customer: req.user._id });

  res.status(200).json({
    success: true,
    count: orders.length,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    },
    data: orders
  });
});

/**
 * @desc    Get order by ID
 * @route   GET /api/orders/:id
 * @access  Private / Public if providing correct guest details (simplified to just Private for now)
 */
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  // Ensure owner or admin/staff
  if (order.customer && order.customer.toString() !== req.user._id.toString() && req.user.role === 'customer') {
    throw new ApiError(403, 'Not authorized to access this order');
  }

  res.status(200).json({
    success: true,
    data: order
  });
});

/**
 * @desc    Cancel order
 * @route   POST /api/orders/:id/cancel
 * @access  Private
 */
export const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  if (order.customer && order.customer.toString() !== req.user._id.toString() && req.user.role === 'customer') {
    throw new ApiError(403, 'Not authorized to access this order');
  }

  if (order.status !== 'pending_payment' && order.status !== 'paid') {
    throw new ApiError(400, `Cannot cancel order that is already ${order.status}`);
  }

  order.status = 'cancelled';
  await order.save();

  // If paid, trigger refund via Stripe (future phase)

  res.status(200).json({
    success: true,
    data: order
  });
});
