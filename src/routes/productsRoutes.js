import { Router } from 'express';
import { getAllProducts, getProductById } from '../controllers/productsController.js';

const router = Router();

router.get('/', getAllProducts);
router.get('/:productId', getProductById);

export default router;
