import { Router } from 'express';
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from '../controllers/productsController.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

router.use('/', authenticate);
router.get('/', getAllProducts);
router.get('/:productId', getProductById);
router.post('/', createProduct);
router.patch('/:productId', updateProduct);
router.delete('/:productId', deleteProduct);

export default router;
