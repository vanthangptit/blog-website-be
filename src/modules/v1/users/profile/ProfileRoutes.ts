import express from 'express';
import {
  userProfileCtrl,
  whoViewMyProfileCtrl
} from './ProfileController';
import { isAuthenticated } from '../../../../middlewares';

const profileRouter = express.Router();

/**
 * @method Get::Get profile user
 */
profileRouter.get(
  '/',
  isAuthenticated,
  userProfileCtrl
);

/**
 * @method Get::Profile viewers
 */
profileRouter.get(
  '/viewers/:id',
  isAuthenticated,
  whoViewMyProfileCtrl
);

export default profileRouter;
