import { celebrate } from 'celebrate';
import { Router } from 'express';
import {
  createUserSchema,
  loginUserSchema,
  requestResetEmailSchema,
  resetPasswordSchema,
} from '../validations/authValidation.js';
import {
  loginUser,
  logoutController,
  refreshSession,
  registerUser,
  requestResetEmail,
  resetPassword,
} from '../controllers/authController.js';

const router = Router();

router.post('/register', celebrate(createUserSchema), registerUser);
router.post('/login', celebrate(loginUserSchema), loginUser);
router.post('/logout', logoutController);
router.post('/refresh', refreshSession);
router.post(
  '/request-reset-email',
  celebrate(requestResetEmailSchema),
  requestResetEmail,
);

router.post('/reset-password', celebrate(resetPasswordSchema), resetPassword);

export default router;
