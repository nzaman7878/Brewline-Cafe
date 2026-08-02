import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  menuItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true }, 
  selectedOptions: { type: mongoose.Schema.Types.Mixed },
  imageUrl: { type: String }
});

const orderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  guestEmail: { type: String },
  guestName: { type: String },
  guestPhone: { type: String },
  
  items: [orderItemSchema],
  
  subtotal: { type: Number, required: true },
  tax: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  promoCode: { type: String },
  total: { type: Number, required: true },
  
  status: {
    type: String,
    enum: ['pending_payment', 'paid', 'preparing', 'ready_for_pickup', 'completed', 'cancelled', 'refunded'],
    default: 'pending_payment'
  },
  
  pickupTime: { type: Date, required: true },
  
  paymentIntentId: { type: String },
  clientSecret: { type: String }, // cached for idempotency returns
  
  idempotencyKey: { type: String, unique: true, sparse: true }
}, { timestamps: true });

export const Order = mongoose.model('Order', orderSchema);
