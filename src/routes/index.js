import { Router } from 'express';
import productsRouter from './productsRoutes.js';
import authRouter from './authRoutes.js';

const router = Router();

router.use('/products', productsRouter);
router.use('/auth', authRouter);

export default router;
