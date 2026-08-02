import { Router } from 'express';
import { getActiveOrders, updateOrderStatus, toggleMenuAvailability } from '../controllers/staffController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

// All staff routes require authentication and staff/admin role
router.use(protect);
router.use(authorize('staff', 'admin'));

router.get('/orders', getActiveOrders);
router.put('/orders/:id/status', updateOrderStatus);
router.put('/menu/:id/availability', toggleMenuAvailability);

export default router;
