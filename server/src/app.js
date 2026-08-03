/**
 * Brewline Cafe — Express Application Configuration
 *
 * Sets up Express with middleware stack:
 * CORS, Helmet, Compression, Cookie Parser, JSON parsing, Logging
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import { requestLogger } from './middleware/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFound } from './middleware/notFound.js';
import routes from './routes/index.js';

import webhookRoutes from './routes/webhooks.js';

const app = express();

// ── Security ────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://js.stripe.com"],
      frameSrc: ["'self'", "https://js.stripe.com"],
      connectSrc: ["'self'", "https://api.stripe.com", env.CLIENT_URL],
      imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
      styleSrc: ["'self'", "'unsafe-inline'"], // unsafe-inline often needed for some libs/React
    },
  },
  crossOriginEmbedderPolicy: false,
}));
app.use(cors({
  origin: env.CLIENT_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

import mongoSanitize from 'express-mongo-sanitize';
import { xssSanitize } from './middleware/xss.js';
import rateLimit from 'express-rate-limit';

// Prevent NoSQL injection
app.use(mongoSanitize());
// Prevent XSS
app.use(xssSanitize());

// Global Rate Limiting
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 200, // Limit each IP to 200 requests per `window` (here, per 15 minutes).
  standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  message: { success: false, message: 'Too many requests from this IP, please try again after 15 minutes' }
});
app.use('/api', globalLimiter);

// ── Webhooks (Must bypass JSON parser) ──────
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }), webhookRoutes);

// ── Body Parsing ────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ── Compression ─────────────────────────────
app.use(compression());

// ── Logging ─────────────────────────────────
app.use(requestLogger);

// ── Routes ──────────────────────────────────
app.use('/api', routes);

// ── Error Handling ──────────────────────────
app.use(notFound);
app.use(errorHandler);

export default app;
