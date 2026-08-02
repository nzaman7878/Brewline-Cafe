import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { register, login, refresh, logout, getMe } from '../controllers/authController.js';
import { protect, validateRequest } from '../middleware/auth.js';
import { registerSchema, loginSchema } from '../validators/authValidator.js';

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per `window` (here, per 15 minutes)
  message: { success: false, message: 'Too many attempts, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/register', authLimiter, validateRequest(registerSchema), register);
router.post('/login', authLimiter, validateRequest(loginSchema), login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/me', protect, getMe);

export default router;
