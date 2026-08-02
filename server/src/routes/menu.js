import { Router } from 'express';
import { getMenuItems, getMenuItemById, getCategories } from '../controllers/menuController.js';

const router = Router();

router.get('/', getMenuItems);
router.get('/categories', getCategories);
router.get('/:id', getMenuItemById);

export default router;
