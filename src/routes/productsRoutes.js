import { Router } from 'express';
import {
  createProduct,
  getAllProducts,
  getProductById,
} from '../controllers/productsController.js';

const router = Router();

router.get('/', getAllProducts);
router.get('/:productId', getProductById);
router.post('/', createProduct);

export default router;
