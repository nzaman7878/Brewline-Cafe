import { PromoCode } from '../models/PromoCode.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';

/**
 * @desc    Validate a promo code and calculate discount
 * @route   POST /api/promo/validate
 * @access  Public (so users can test codes before login if desired, or Private depending on needs)
 */
export const validatePromo = asyncHandler(async (req, res) => {
  const { code, subtotal } = req.body;

  if (!code || typeof subtotal !== 'number') {
    throw new ApiError(400, 'Promo code and valid order subtotal are required');
  }

  const promo = await PromoCode.findOne({ code: code.toUpperCase() });

  if (!promo) {
    throw new ApiError(404, 'Invalid promo code');
  }

  if (!promo.isActive) {
    throw new ApiError(400, 'This promo code is no longer active');
  }

  const now = new Date();
  if (now < promo.startDate) {
    throw new ApiError(400, 'This promo code is not yet valid');
  }
  
  if (now > promo.expiryDate) {
    throw new ApiError(400, 'This promo code has expired');
  }

  if (promo.maxUses !== null && promo.usedCount >= promo.maxUses) {
    throw new ApiError(400, 'This promo code has reached its usage limit');
  }

  if (subtotal < promo.minOrderValue) {
    throw new ApiError(400, `Minimum order value of $${promo.minOrderValue.toFixed(2)} required to use this code`);
  }

  // Calculate discount amount
  let discountAmount = 0;
  if (promo.discountType === 'percentage') {
    discountAmount = subtotal * (promo.discountValue / 100);
  } else if (promo.discountType === 'fixed') {
    discountAmount = Math.min(subtotal, promo.discountValue); // Don't discount more than the subtotal itself
  }

  res.status(200).json({
    success: true,
    data: {
      code: promo.code,
      discountType: promo.discountType,
      discountValue: promo.discountValue,
      discountAmount: Number(discountAmount.toFixed(2))
    }
  });
});
