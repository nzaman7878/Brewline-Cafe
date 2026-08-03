import { Router } from 'express';
import Stripe from 'stripe';
import { Order } from '../models/Order.js';
import { WebhookEvent } from '../models/WebhookEvent.js';
import { getIO } from '../config/socket.js';
import { notificationQueue } from '../services/notificationQueue.js';

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock', {
  apiVersion: '2023-10-16',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_mock';

router.post('/', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    // Verify signature using the raw body buffer provided by express.raw()
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error(`⚠️  Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Idempotency check: Have we processed this event already?
  const existingEvent = await WebhookEvent.findOne({ eventId: event.id });
  if (existingEvent) {
    console.log(`⚡ Webhook ${event.id} already processed`);
    return res.status(200).send('Duplicate event ignored');
  }

  try {
    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        const order = await Order.findOneAndUpdate(
          { paymentIntentId: paymentIntent.id },
          { status: 'paid' },
          { new: true }
        );
        if (order) {
          logger.info(`Order ${order._id} marked as paid`);
          const io = getIO();
          io.of('/orders').to(`order:${order._id}`).emit('payment-success', order);
          io.of('/staff').to('staff:queue').emit('new-order', order);
          
          notificationQueue.notifyOrderConfirmation(order);
        }
        break;
      }
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        // In reality, we might not cancel immediately if they can retry, but per spec we update status
        await Order.findOneAndUpdate(
          { paymentIntentId: paymentIntent.id },
          { status: 'cancelled' } // or 'payment_failed'
        );
        // Here we could integrate email service to notify customer
        break;
      }
      case 'charge.refunded': {
        const charge = event.data.object;
        await Order.findOneAndUpdate(
          { paymentIntentId: charge.payment_intent },
          { status: 'refunded' }
        );
        break;
      }
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Record the event to prevent duplicate processing
    await WebhookEvent.create({ eventId: event.id, type: event.type });

    res.status(200).json({ received: true });
  } catch (error) {
    console.error(`Error processing webhook event:`, error);
    res.status(500).send('Webhook handler failed');
  }
});

export default router;
