import express from 'express';
import { getTokenCtrl, deleteTokenCtrl } from '../controllers/tokenController';
import { tokenValidation } from './validations/tokenValidation';
import {isValidationResult} from '../../../../../middlewares';

const tokenRouter = express.Router();

/**
 * @method POST::Get new access token
 */
tokenRouter.post(
  '/',
  tokenValidation(),
  isValidationResult,
  getTokenCtrl
);

/**
 * @method DELETE::Delete token
 */
tokenRouter.delete(
  '/',
  tokenValidation(),
  isValidationResult,
  deleteTokenCtrl
);

export default tokenRouter;
