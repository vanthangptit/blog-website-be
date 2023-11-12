import express from 'express';
import { loginCtrl } from '../controllers/loginController';
import {
  rateLimitMiddleware,
  isValidationResult
} from '../../../../middlewares';
import { loginValidation } from './validations/loginValidation';

const loginRouter = express.Router();

loginRouter.post(
  '/',
  loginValidation(),
  isValidationResult,
  rateLimitMiddleware,
  loginCtrl
);

export default loginRouter;
