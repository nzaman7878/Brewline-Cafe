import { Router } from 'express';
import { createOrder, getMyOrders, getOrderById, cancelOrder } from '../controllers/orderController.js';
import { protect, optionalAuth, validateRequest } from '../middleware/auth.js';
import { createOrderSchema } from '../validators/orderValidator.js';

const router = Router();

router.post('/', optionalAuth, validateRequest(createOrderSchema), createOrder);

router.get('/my', protect, getMyOrders);

router.get('/:id', protect, getOrderById);

router.post('/:id/cancel', protect, cancelOrder);

export default router;
