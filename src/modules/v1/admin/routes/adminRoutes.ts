import express from 'express';
import {
  userDeleteCtrl,
  adminBlockUserCtrl,
  adminUnblockUserCtrl,
  adminGetAllUserCtrl,
} from '../controllers/adminController';
import {
  isAuthenticatedWithAdmin,
} from '../../../../middlewares';

const adminRouter = express.Router();

/**
 * @method Get::Get all user
 */
adminRouter.get(
  '/users',
  isAuthenticatedWithAdmin,
  adminGetAllUserCtrl
);

/**
 * @method PUT::Admin block user
 */
adminRouter.put(
  '/admin-block/:id',
  isAuthenticatedWithAdmin,
  adminBlockUserCtrl,
);

/**
 * @method PUT::Admin unblock user
 */
adminRouter.put(
  '/admin-unblock/:id',
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
