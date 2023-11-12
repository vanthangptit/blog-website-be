import express from 'express';
import {
  userDeleteCtrl,
  adminBlockUserCtrl,
  adminUnblockUserCtrl,
} from '../controllers/adminController';
import {
  isAuthenticated,
  isAuthenticatedWithAdmin,
} from '../../../../middlewares';

const userRouter = express.Router();

/**
 * @method PUT::Admin block user
 */
userRouter.put(
  '/admin-block/:id',
  isAuthenticated,
  isAuthenticatedWithAdmin,
  adminBlockUserCtrl,
);

/**
 * @method PUT::Admin unblock user
 */
userRouter.put(
  '/admin-unblock/:id',
  isAuthenticated,
  isAuthenticatedWithAdmin,
  adminUnblockUserCtrl,
);

/**
 * @method DELETE::Deleted user
 */
userRouter.delete(
  '/',
  isAuthenticatedWithAdmin,
  userDeleteCtrl
);

export default userRouter;
