import { celebrate } from 'celebrate';
import { Router } from 'express';
import {
  createUserSchema,
  loginUserSchema,
} from '../validations/authValidation.js';
import {
  loginUser,
  logoutController,
  registerUser,
} from '../controllers/authController.js';

const router = Router();

router.post('/register', celebrate(createUserSchema), registerUser);
router.post('/login', celebrate(loginUserSchema), loginUser);
router.post('/logout', logoutController);

export default router;
