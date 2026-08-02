import { Router } from 'express';
import { getCart, updateCart, syncCart } from '../controllers/cartController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

// All cart routes are protected
router.use(protect);

router.route('/')
  .get(getCart)
  .put(updateCart);

router.post('/sync', syncCart);

export default router;
