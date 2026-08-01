/**
 * Request Logging Middleware
 *
 * Uses pino-http for structured request logging.
 */

import pinoHttp from 'pino-http';
import { logger } from '../utils/logger.js';
import { env } from '../config/env.js';

export const requestLogger = pinoHttp({
  logger,
  // Only log failed requests in production to reduce noise
  // Log everything in development
  customLogLevel: (req, res, err) => {
    if (res.statusCode >= 400 || err) {
      return 'error';
    }
    if (res.statusCode >= 300) {
      return 'silent';
    }
    return env.NODE_ENV === 'production' ? 'silent' : 'info';
  },
  serializers: {
    req: (req) => ({
      id: req.id,
      method: req.method,
      url: req.url,
      query: req.query,
      params: req.params,
    }),
    res: (res) => ({
      statusCode: res.statusCode,
    }),
  },
});
