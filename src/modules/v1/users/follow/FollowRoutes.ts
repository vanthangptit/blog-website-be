import express from 'express';
import {
  followingCtrl,
  unfollowCtrl
} from './FollowController';
import { isAuthenticated } from '../../../../middlewares';

const followRouter = express.Router();

/**
 * @method Get::Following
 */
followRouter.post(
  '/following/:id',
  isAuthenticated,
  followingCtrl
);

/**
 * @method Get::UnFollow
 */
followRouter.post(
  '/unfollower/:id',
  isAuthenticated,
  unfollowCtrl
);

export default followRouter;
