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
app.use(helmet());
app.use(cors({
  origin: env.CLIENT_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

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
