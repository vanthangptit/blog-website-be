import express from 'express';
import { isAuthenticated } from '../../middlewares';
import {
  commentCreateCtrl,
  commentDeleteCtrl,
  commentUpdateCtrl
} from '../../controllers/comments/commentController';

const commentRouter = express.Router();

/**
 * @method POST::Create comment
 */
commentRouter.post(
  '/:id',
  isAuthenticated,
  commentCreateCtrl
);

/**
 * @method PUT::Updated comment
 */
commentRouter.put(
  '/:id',
  isAuthenticated,
  commentUpdateCtrl
);

/**
 * @method DELETE::Delete comment
 */
commentRouter.delete(
  '/:id',
  isAuthenticated,
  commentDeleteCtrl
);

export default commentRouter;
