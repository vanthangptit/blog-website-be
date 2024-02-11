import express from 'express';
import {
  blockUserCtrl,
  unblockUserCtrl
} from './BlockingController';
import { isAuthenticated } from '../../../../middlewares';


const blockingRouter = express.Router();

/**
 * @method Get::Block user
 */
blockingRouter.get(
  '/block/:id',
  isAuthenticated,
  blockUserCtrl
);

/**
 * @method Get::Block user
 */
blockingRouter.get(
  '/unblock/:id',
  isAuthenticated,
  unblockUserCtrl
);

export default blockingRouter;
