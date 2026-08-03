import nodemailer from 'nodemailer';
import { logger } from '../utils/logger.js';

// Setup reusable transporter object using the default SMTP transport
const createTransporter = () => {
  // Use Ethereal for testing if not configured
  if (!process.env.SMTP_HOST) {
    logger.warn('SMTP_HOST not configured. Email will be simulated.');
    return {
      sendMail: async (options) => {
        logger.info(`[SIMULATED EMAIL] To: ${options.to} | Subject: ${options.subject}`);
        return { messageId: 'simulated-id' };
      }
    };
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

const transporter = createTransporter();

export const sendEmail = async ({ to, subject, html }) => {
  if (!to) {
    logger.warn('Cannot send email without a recipient address');
    return;
  }

  const mailOptions = {
    from: process.env.FROM_EMAIL || '"Brewline Cafe" <noreply@brewlinecafe.com>',
    to,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    logger.info(`Email sent to ${to}: ${info.messageId}`);
    return info;
  } catch (error) {
    logger.error(`Error sending email to ${to}: ${error.message}`);
    // Don't throw to prevent blocking the main request cycle (fire-and-forget queue behavior)
  }
};
