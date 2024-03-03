import express from 'express';
import { verifyEmailController } from '../controllers/emailController';

const userRouter = express.Router();

/**
 * @method GET::Verify token email
 */
userRouter.get(
  '/verify',
  verifyEmailController
);

export default userRouter;
