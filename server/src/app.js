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
import morgan from 'morgan';
import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFound } from './middleware/notFound.js';
import routes from './routes/index.js';

const app = express();

// ── Security ────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: env.CLIENT_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ── Body Parsing ────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ── Compression ─────────────────────────────
app.use(compression());

// ── Logging ─────────────────────────────────
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ── Routes ──────────────────────────────────
app.use('/api', routes);

// ── Error Handling ──────────────────────────
app.use(notFound);
app.use(errorHandler);

export default app;
