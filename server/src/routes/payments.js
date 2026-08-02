import { Router } from 'express';
import { createPaymentIntent } from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect);

router.post('/create-intent', createPaymentIntent);

export default router;
