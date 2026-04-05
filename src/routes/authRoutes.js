import { celebrate } from 'celebrate';
import { Router } from 'express';
import { createUserSchema } from '../validations/authValidation.js';
import { registerUser } from '../controllers/authController.js';

const router = Router();

router.post('/register', celebrate(createUserSchema), registerUser);

export default router;
