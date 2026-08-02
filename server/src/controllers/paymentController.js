import { MenuItem } from '../models/MenuItem.js';
import { PromoCode } from '../models/PromoCode.js';
import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as stripeService from '../services/stripeService.js';

const TAX_RATE = 0.08875; // 8.875%

/**
 * @desc    Create Stripe Payment Intent based on server-validated cart
 * @route   POST /api/payments/create-intent
 * @access  Private
 */
export const createPaymentIntent = asyncHandler(async (req, res) => {
  const { items, promoCode } = req.body; 
  
  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new ApiError(400, 'Order items cannot be empty');
  }

  let subtotal = 0;

  // 1. Recalculate Subtotal Server-Side (Never trust client)
  for (const item of items) {
    const menuItem = await MenuItem.findById(item.menuItemId);
    if (!menuItem) {
      throw new ApiError(404, `Menu item not found: ${item.menuItemId}`);
    }

    if (!menuItem.isAvailable) {
      throw new ApiError(400, `${menuItem.name} is currently sold out`);
    }

    let itemPrice = menuItem.price;

    // Apply customizations
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
  }

  // 2. Promo Code Calculation
  let discountAmount = 0;
  if (promoCode) {
    const promo = await PromoCode.findOne({ code: promoCode.toUpperCase() });
    if (promo && promo.isActive) {
      const now = new Date();
      if (now >= promo.startDate && now <= promo.expiryDate) {
        if (promo.maxUses === null || promo.usedCount < promo.maxUses) {
          if (subtotal >= promo.minOrderValue) {
             if (promo.discountType === 'percentage') {
               discountAmount = subtotal * (promo.discountValue / 100);
             } else {
               discountAmount = Math.min(subtotal, promo.discountValue);
             }
          }
        }
      }
    }
  }

  // 3. Tax Calculation
  const afterDiscount = Math.max(0, subtotal - discountAmount);
  const taxAmount = afterDiscount * TAX_RATE;
  const total = afterDiscount + taxAmount;
  const amountInCents = Math.round(total * 100);

  if (amountInCents < 50) {
    throw new ApiError(400, 'Order total is below the minimum charge amount (50 cents)');
  }

  // 4. Stripe Customer Management
  const customer = await stripeService.getOrCreateCustomer(req.user);
  
  // Save stripeCustomerId to user if it's new
  if (!req.user.stripeCustomerId) {
    await User.findByIdAndUpdate(req.user._id, { stripeCustomerId: customer.id });
  }

  // 5. Create Payment Intent
  const paymentIntent = await stripeService.createPaymentIntent(
    amountInCents,
    'usd',
    customer.id,
    {
      userId: req.user._id.toString(),
      email: req.user.email,
    }
  );

  res.status(200).json({
    success: true,
    data: {
      clientSecret: paymentIntent.client_secret,
      subtotal: Number(subtotal.toFixed(2)),
      discountAmount: Number(discountAmount.toFixed(2)),
      taxAmount: Number(taxAmount.toFixed(2)),
      total: Number(total.toFixed(2)),
    }
  });
});
