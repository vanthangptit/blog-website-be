import express from 'express';
import {
  getAllPostCtrl,
  getPostByShortUrlCtrl,
  createPostCtrl,
  updatePostCtrl,
  deletePostCtrl,
  toggleLikesCtrl,
  toggleDisLikesCtrl,
  getPostByUserCtrl
} from '../controllers/postController';
import {
  isAuthenticated,
  isGetUserAuth,
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
postRouter.get('/', isGetUserAuth, getAllPostCtrl);

/**
 * @method GET::Get posts by userId
 */
postRouter.get(
  '/my-post',
  isAuthenticated,
  getPostByUserCtrl
);

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
  '/dislikes/:shortUrl',
  isAuthenticated,
  toggleDisLikesCtrl
);

/**
 * @method GET::Get single post by short url
 */
postRouter.get(
  '/:shortUrl',
  isGetUserAuth,
  getPostByShortUrlCtrl
);

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
