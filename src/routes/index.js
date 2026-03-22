import { Router } from 'express';
import productsRouter from './productsRoutes.js';

const router = Router();

router.use('/products', productsRouter);

export default router;
