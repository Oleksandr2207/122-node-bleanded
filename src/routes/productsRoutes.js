import { Router } from 'express';
import { getAllProducts } from '../controllers/productsController.js';

const router = Router();

router.get('/', getAllProducts);

export default router;
