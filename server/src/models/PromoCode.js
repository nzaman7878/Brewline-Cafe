import mongoose from 'mongoose';

const promoCodeSchema = new mongoose.Schema({
  code: { 
    type: String, 
    required: true, 
    unique: true, 
    uppercase: true, 
    trim: true 
  },
  discountType: { 
    type: String, 
    enum: ['percentage', 'fixed'], 
    required: true 
  },
  discountValue: { 
    type: Number, 
    required: true,
    validate: {
      validator: function(v) {
        if (this.discountType === 'percentage') return v > 0 && v <= 100;
        return v > 0;
      },
      message: 'Invalid discount value for the discount type.'
    }
  },
  minOrderValue: { 
    type: Number, 
    default: 0 
  },
  maxUses: { 
    type: Number, 
    default: null // null means unlimited
  }, 
  usedCount: { 
    type: Number, 
    default: 0 
  },
  startDate: { 
    type: Date, 
    default: Date.now 
  },
  expiryDate: { 
    type: Date, 
    required: true 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  }
}, { timestamps: true });

export const PromoCode = mongoose.model('PromoCode', promoCodeSchema);
