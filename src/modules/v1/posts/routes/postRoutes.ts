import express from 'express';
import {
  getAllPostCtrl,
  getPostByShortUrlCtrl,
  createPostCtrl,
  updatePostCtrl,
  deletePostCtrl,
  toggleLikesCtrl,
  toggleDisLikesCtrl,
} from '../controllers/postController';
import {
  isAuthenticated,
  isValidationResult
} from '../../../../middlewares';
import {
  postValidation,
  paramsPostValidation
} from './validations/postValidation';

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
 * @method GET::Get single post by short url
 */
postRouter.get('/:shortUrl', getPostByShortUrlCtrl);

/**
 * @method POST::Create post
 */
postRouter.post(
  '/',
  postValidation(true),
  isValidationResult,
  isAuthenticated,
  createPostCtrl
);

/**
 * @method PUT::Updated post
 */
postRouter.put(
  '/:shortUrl',
  postValidation(false),
  isValidationResult,
  isAuthenticated,
  updatePostCtrl
);

/**
 * @method DELETE::Deleted post
 */
postRouter.delete(
  '/:id',
  paramsPostValidation(),
  isValidationResult,
  isAuthenticated,
  deletePostCtrl
);

export default postRouter;
