import mongoose from 'mongoose';

const customizationOptionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  priceAdjustment: { type: Number, default: 0 },
});

const customizationSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., "Size", "Milk Type"
  required: { type: Boolean, default: false },
  options: [customizationOptionSchema],
});

const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      index: true,
    },
    image: {
      type: String, // URL to image
    },
    isAvailable: {
      type: Boolean,
      default: true,
      index: true,
    },
    customizations: [customizationSchema],
  },
  {
    timestamps: true,
  }
);

export const MenuItem = mongoose.model('MenuItem', menuItemSchema);
