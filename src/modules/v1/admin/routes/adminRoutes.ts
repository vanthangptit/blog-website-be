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

const adminRouter = express.Router();

/**
 * @method PUT::Admin block user
 */
adminRouter.put(
  '/admin-block/:id',
  isAuthenticated,
  isAuthenticatedWithAdmin,
  adminBlockUserCtrl,
);

/**
 * @method PUT::Admin unblock user
 */
adminRouter.put(
  '/admin-unblock/:id',
  isAuthenticated,
  isAuthenticatedWithAdmin,
  adminUnblockUserCtrl,
);

/**
 * @method DELETE::Deleted user
 */
adminRouter.delete(
  '/',
  isAuthenticatedWithAdmin,
  userDeleteCtrl
);

export default adminRouter;
