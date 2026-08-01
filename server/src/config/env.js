/**
 * Environment Variable Configuration
 *
 * Validates and exports all environment variables using Zod.
 * Fails fast on missing or invalid configuration.
 */

import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  // Server
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(5000),

  // MongoDB
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),

  // JWT
  JWT_ACCESS_SECRET: z.string().min(1, 'JWT_ACCESS_SECRET is required'),
  JWT_REFRESH_SECRET: z.string().min(1, 'JWT_REFRESH_SECRET is required'),
  JWT_ACCESS_EXPIRY: z.string().default('15m'),
  JWT_REFRESH_EXPIRY: z.string().default('7d'),

  // Stripe (optional in development — will be required for payment phases)
  STRIPE_SECRET_KEY: z.string().optional().default(''),
  STRIPE_PUBLISHABLE_KEY: z.string().optional().default(''),
  STRIPE_WEBHOOK_SECRET: z.string().optional().default(''),

  // Cloudinary (optional — will be required for image upload phases)
  CLOUDINARY_CLOUD_NAME: z.string().optional().default(''),
  CLOUDINARY_API_KEY: z.string().optional().default(''),
  CLOUDINARY_API_SECRET: z.string().optional().default(''),

  // SendGrid (optional)
  SENDGRID_API_KEY: z.string().optional().default(''),
  SENDGRID_FROM_EMAIL: z.string().optional().default(''),

  // Twilio (optional)
  TWILIO_ACCOUNT_SID: z.string().optional().default(''),
  TWILIO_AUTH_TOKEN: z.string().optional().default(''),
  TWILIO_PHONE_NUMBER: z.string().optional().default(''),

  // Client URL for CORS
  CLIENT_URL: z.string().default('http://localhost:5173'),

  // Cafe Config
  CAFE_NAME: z.string().default('Brewline Cafe'),
  CAFE_TIMEZONE: z.string().default('America/New_York'),
  TAX_RATE: z.coerce.number().default(0.08875),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:');
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = Object.freeze(parsed.data);
