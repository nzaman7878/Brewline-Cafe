import twilio from 'twilio';
import { logger } from '../utils/logger.js';

let client = null;

if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  try {
    client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    logger.info('Twilio SMS client initialized');
  } catch (err) {
    logger.error('Failed to initialize Twilio client:', err);
  }
} else {
  logger.warn('Twilio credentials not found. SMS will be simulated.');
}

export const sendSMS = async (to, body) => {
  if (!to) {
    logger.warn('Cannot send SMS without a recipient phone number');
    return;
  }

  // Basic mock/simulation for development without API keys
  if (!client || !process.env.TWILIO_PHONE_NUMBER) {
    logger.info(`[SIMULATED SMS] To: ${to} | Body: ${body}`);
    return { sid: 'simulated-sid' };
  }

  try {
    const message = await client.messages.create({
      body,
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
    });
    logger.info(`SMS sent to ${to}: ${message.sid}`);
    return message;
  } catch (error) {
    logger.error(`Error sending SMS to ${to}: ${error.message}`);
    // Don't throw to prevent blocking the main request cycle
  }
};
