import { Router } from 'express';
import { 
  createMenuItem, updateMenuItem, deleteMenuItem,
  getPromoCodes, createPromoCode, updatePromoCode, deletePromoCode,
  getOrders, refundOrder, forceUpdateOrderStatus,
  getAnalytics,
  getUsers, updateUserRole
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';
import { upload } from '../config/cloudinary.js';

const router = Router();

import { validateRequest } from '../middleware/auth.js';
import { createMenuSchema, updateMenuSchema, createPromoSchema } from '../validations/admin.validation.js';

// Protect all routes
router.use(protect);
router.use(authorize('admin'));

// Menu
router.post('/menu', upload.single('image'), validateRequest(createMenuSchema), createMenuItem);
router.put('/menu/:id', upload.single('image'), validateRequest(updateMenuSchema), updateMenuItem);
router.delete('/menu/:id', deleteMenuItem);

// Promos
router.get('/promo-codes', getPromoCodes);
router.post('/promo-codes', validateRequest(createPromoSchema), createPromoCode);
router.put('/promo-codes/:id', validateRequest(createPromoSchema), updatePromoCode);
router.delete('/promo-codes/:id', deletePromoCode);

// Orders & Refunds
router.get('/orders', getOrders);
router.post('/orders/:id/refund', refundOrder);
router.put('/orders/:id/status', forceUpdateOrderStatus);

// Analytics
router.get('/analytics', getAnalytics);

// Users
router.get('/users', getUsers);
router.put('/users/:id/role', updateUserRole);

export default router;
