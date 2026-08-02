import mongoose from 'mongoose';

const webhookEventSchema = new mongoose.Schema({
  eventId: { type: String, required: true, unique: true },
  type: { type: String, required: true },
  processedAt: { type: Date, default: Date.now, expires: '30d' } // Automatically delete records after 30 days
});

export const WebhookEvent = mongoose.model('WebhookEvent', webhookEventSchema);
