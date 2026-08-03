import { Router } from 'express';
import { 
  createMenuItem, updateMenuItem, deleteMenuItem,
  createPromoCode, updatePromoCode, deletePromoCode,
  getOrders, refundOrder,
  getAnalytics,
  getUsers, updateUserRole
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';
import { upload } from '../config/cloudinary.js';

const router = Router();

// Protect all routes
router.use(protect);
router.use(authorize('admin'));

// Menu
router.post('/menu', upload.single('image'), createMenuItem);
router.put('/menu/:id', upload.single('image'), updateMenuItem);
router.delete('/menu/:id', deleteMenuItem);

// Promos
router.post('/promo-codes', createPromoCode);
router.put('/promo-codes/:id', updatePromoCode);
router.delete('/promo-codes/:id', deletePromoCode);

// Orders & Refunds
router.get('/orders', getOrders);
router.post('/orders/:id/refund', refundOrder);

// Analytics
router.get('/analytics', getAnalytics);

// Users
router.get('/users', getUsers);
router.put('/users/:id/role', updateUserRole);

export default router;
