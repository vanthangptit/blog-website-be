import express from 'express';
import {
  getAllPostCtrl,
  getPostByShortUrlCtrl,
  createPostCtrl,
  updatePostCtrl,
  deletePostCtrl,
  getPostByUserCtrl,
  toggleAssociateCtrl,
  toggleSavesCtrl,
  togglePinCtrl
} from '../controllers/postController';
import {
  isAuthenticated,
  isGetUserAuth,
  isValidationResult
} from '../../../../middlewares';
import {
  postValidation,
  paramsPostValidation,
  associateValidation
} from './validations/postValidation';

const postRouter = express.Router();

/**
 * @method GET::Get all post
 */
postRouter.get('/', isGetUserAuth, getAllPostCtrl);

/**
 * @method POST::Saves
 */
postRouter.post(
  '/saves/:id',
  isAuthenticated,
  toggleSavesCtrl
);

/**
 * @method POST::Pinned
 */
postRouter.post(
  '/pin/:id',
  isAuthenticated,
  togglePinCtrl
);

/**
 * @method POST::Associates
 */
postRouter.post(
  '/associates/:id',
  associateValidation(),
  isValidationResult,
  isAuthenticated,
  toggleAssociateCtrl
);

/**
 * @method GET::Get posts by userId
 */
postRouter.get(
  '/my-post',
  isAuthenticated,
  getPostByUserCtrl
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
  '/:id',
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
