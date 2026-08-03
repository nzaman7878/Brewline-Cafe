/**
 * Logger Utility
 *
 * Pino-based structured logger with pretty printing in development.
 */

import pino from 'pino';
import { env } from '../config/env.js';

const options = {
  level: env.NODE_ENV === 'production' ? 'info' : 'debug',
  redact: {
    paths: [
      'req.headers.authorization',
      'req.body.password',
      'req.body.email',
      'req.body.phone',
      'req.body.guestEmail',
      'req.body.guestPhone',
      'req.body.cardNumber',
      'req.body.cvc'
    ],
    censor: '[REDACTED]'
  }
};

// Pretty print in development
if (env.NODE_ENV === 'development') {
  options.transport = {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
    },
  };
}

export const logger = pino(options);
