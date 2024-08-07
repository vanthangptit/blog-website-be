import express from 'express';
import {
  isAuthenticated,
  isValidationResult
} from '../../../../middlewares';
import {
  commentCreateCtrl,
  commentDeleteCtrl,
  commentUpdateCtrl,
  getCommentsByPostId,
} from '../controllers/commentController';
import {
  commentValidation
} from './validations/commentValidation';

const commentRouter = express.Router();

/**
 * @method GET::Get comment by post id
 */
commentRouter.get('/:id', getCommentsByPostId);

/**
 * @method POST::Create comment
 */
commentRouter.post(
  '/:id',
  commentValidation(),
  isValidationResult,
  isAuthenticated,
  commentCreateCtrl
);

/**
 * @method PUT::Updated comment
 */
commentRouter.put(
  '/:id',
  commentValidation(),
  isValidationResult,
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
