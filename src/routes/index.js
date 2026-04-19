import { Router } from 'express';
import productsRouter from './productsRoutes.js';
import authRouter from './authRoutes.js';
import usersRouter from './userRoutes.js';

const router = Router();

router.use('/products', productsRouter);
router.use('/auth', authRouter);
router.use('/users', usersRouter);

export default router;
