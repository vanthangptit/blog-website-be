import express from 'express';
import {
  getAllPostCtrl,
  getPostByIdCtrl,
  createPostCtrl,
  updatePostCtrl,
  deletePostCtrl,
  toggleLikesCtrl,
  toggleDisLikesCtrl,
} from '../../controllers/posts/postController';
import { isAuthenticated } from '../../middlewares';
import { createPostValidation } from '../../domain/validations/PostValidation';

const postRouter = express.Router();

/**
 * @method GET::Get all post
 */
postRouter.get('/', isAuthenticated, getAllPostCtrl);

/**
 * @method GET::Likes
 */
postRouter.get(
  '/likes/:id',
  isAuthenticated,
  toggleLikesCtrl
);

/**
 * @method GET::Dislikes
 */
postRouter.get(
  '/dislikes/:id',
  isAuthenticated,
  toggleDisLikesCtrl
);

/**
 * @method GET::Get post details
 */
postRouter.get(
  '/:id',
  isAuthenticated,
  getPostByIdCtrl
);

/**
 * @method POST::Create post
 */
postRouter.post(
  '/',
  createPostValidation,
  isAuthenticated,
  createPostCtrl
);

/**
 * @method PUT::Updated post
 */
postRouter.put(
  '/:id',
  createPostValidation,
  isAuthenticated,
  updatePostCtrl
);

/**
 * @method DELETE::Deleted post
 */
postRouter.delete(
  '/:id',
  isAuthenticated,
  deletePostCtrl
);

export default postRouter;
