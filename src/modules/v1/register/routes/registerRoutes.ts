import express from 'express';

import {
  isValidationResult,
} from '../../../../middlewares';
import { registerValidation } from './validations/registerValidation';
import { registerCtrl } from '../controllers/registerController';

const registerRouter = express.Router();

registerRouter.post(
  '/',
  registerValidation(),
  isValidationResult,
  registerCtrl,
);

export default registerRouter;
