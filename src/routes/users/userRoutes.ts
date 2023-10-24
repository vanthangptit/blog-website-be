import express from 'express';
import {
  userRegisterCtrl,
  userLoginCtrl,
  userGetAllCtrl,
  userProfileCtrl,
  userUpdateCtrl,
  userDeleteCtrl,
  whoViewMyProfileCtrl,
  followingCtrl,
  unfollowCtrl,
  blockUserCtrl,
  unblockUserCtrl,
  adminBlockUserCtrl,
  adminUnblockUserCtrl,
  updatePasswordUserCtrl,
} from '../../controllers/users/userController';
import {
  rateLimitMiddleware,
  isAuthenticated,
  isAuthenticatedWithAdmin
} from '../../middlewares';

const userRouter = express.Router();

/**
 * @method POST::Register user
 */
userRouter.post('/register', userRegisterCtrl);

/**
 * @method POST::Login user
 */
userRouter.post('/login', rateLimitMiddleware, userLoginCtrl);

/**
 * @method Get::Get all user
 */
userRouter.get('/', userGetAllCtrl);

/**
 * @method Get::Profile viewers
 */
userRouter.get(
  '/profile-viewers/:id',
  isAuthenticated,
  whoViewMyProfileCtrl
);

/**
 * @method Get::Following
 */
userRouter.get(
  '/following/:id',
  isAuthenticated,
  followingCtrl
);

/**
 * @method Get::UnFollow
 */
userRouter.get(
  '/unfollower/:id',
  isAuthenticated,
  unfollowCtrl
);

/**
 * @method Get::Block user
 */
userRouter.get(
  '/block/:id',
  isAuthenticated,
  blockUserCtrl
);

/**
 * @method Get::unblock user
 */
userRouter.get(
  '/unblock/:id',
  isAuthenticated,
  unblockUserCtrl
);

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
 * @method Get::Get profile user
 */
userRouter.get(
  '/profile/:id',
  isAuthenticated,
  userProfileCtrl
);

/**
 * @method PUT::Updated user
 */
userRouter.put(
  '/',
  isAuthenticated,
  userUpdateCtrl
);

/**
 * @method PUT::Updated password user
 */
userRouter.put(
  'update-password',
  isAuthenticated,
  updatePasswordUserCtrl
);

/**
 * @method DELETE::Deleted user
 */
userRouter.delete(
  '/',
  isAuthenticated,
  userDeleteCtrl
);

export default userRouter;
