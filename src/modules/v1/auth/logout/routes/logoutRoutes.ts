import express from 'express';
import { logoutCtrl } from '../controllers/logoutController';
import { isValidationResult } from '../../../../../middlewares';
import { logoutValidation } from './validations/logoutValidation';

const logoutRouter = express.Router();

logoutRouter.delete(
  '/',
  logoutValidation(),
  isValidationResult,
  logoutCtrl
);

export default logoutRouter;
