/**
 * Route Aggregator
 *
 * Central hub for all API routes.
 * Each route module is mounted at its respective path.
 */

import { Router } from 'express';
import authRoutes from './auth.js';
import menuRoutes from './menu.js';

const router = Router();

// ── Health Check ────────────────────────────
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: '☕ Brewline Cafe API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

import cartRoutes from './cart.js';
import promoRoutes from './promo.js';

// ── Route Modules (will be added in subsequent phases) ──
router.use('/auth', authRoutes);
router.use('/menu', menuRoutes);
router.use('/cart', cartRoutes);
// router.use('/orders', orderRoutes);
router.use('/promo', promoRoutes);
// router.use('/payments', paymentRoutes);
// router.use('/staff', staffRoutes);
// router.use('/admin', adminRoutes);

export default router;
