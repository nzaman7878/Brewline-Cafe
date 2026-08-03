import { sendEmail } from './emailService.js';
import { sendSMS } from './smsService.js';
import { 
  getOrderConfirmationTemplate, 
  getOrderReadyTemplate, 
  getRefundTemplate,
  getWelcomeTemplate
} from '../templates/emailTemplates.js';
import { logger } from '../utils/logger.js';

/**
 * A lightweight async wrapper to process notifications in the background
 * without blocking the HTTP request/response cycle.
 * In a larger production app, this would push to BullMQ or AWS SQS.
 */
class NotificationQueue {
  
  // Enqueue async tasks and execute them, logging on failure
  _dispatch(taskName, taskPromise) {
    Promise.resolve(taskPromise)
      .then(() => logger.info(`Notification task [${taskName}] completed`))
      .catch((err) => logger.error(`Notification task [${taskName}] failed:`, err));
  }

  async notifyOrderConfirmation(order) {
    const email = order.guestEmail || order.customer?.email;
    if (email) {
      this._dispatch('OrderConfirmationEmail', sendEmail({
        to: email,
        subject: 'Brewline Cafe - Order Confirmation',
        html: getOrderConfirmationTemplate(order)
      }));
    }
  }

  async notifyOrderReady(order) {
    const email = order.guestEmail || order.customer?.email;
    if (email) {
      this._dispatch('OrderReadyEmail', sendEmail({
        to: email,
        subject: 'Brewline Cafe - Your order is ready!',
        html: getOrderReadyTemplate(order)
      }));
    }

    const phone = order.guestPhone || order.customer?.phone;
    if (phone) {
      const orderIdShort = order._id.toString().slice(-6).toUpperCase();
      this._dispatch('OrderReadySMS', sendSMS(
        phone, 
        `Hi from Brewline Cafe! Your order #${orderIdShort} is fresh and ready for pickup at the counter.`
      ));
    }
  }

  async notifyRefund(order) {
    const email = order.guestEmail || order.customer?.email;
    if (email) {
      this._dispatch('RefundEmail', sendEmail({
        to: email,
        subject: 'Brewline Cafe - Order Refunded',
        html: getRefundTemplate(order)
      }));
    }
  }

  async notifyWelcome(user) {
    if (user.email) {
      this._dispatch('WelcomeEmail', sendEmail({
        to: user.email,
        subject: 'Welcome to Brewline Cafe!',
        html: getWelcomeTemplate(user)
      }));
    }
  }
}

export const notificationQueue = new NotificationQueue();
