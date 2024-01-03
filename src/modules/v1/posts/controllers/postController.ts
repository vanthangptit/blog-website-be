import { NextFunction, Request, Response } from 'express';

import { appError } from '../../../../utils';
import { Post } from '../models/Post';
import { User } from '../../users/models/User';
import { getPostByIdOrShortUrl } from '../services/postServices';

/**
 * Get posts
 */
export const getAllPostCtrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const posts = await Post.find({})
      .populate({
        path: 'user',
        select: { password: 0, emailVerified: 0, email: 0 }
      })
      .populate('category');

    const filteredPosts = posts.filter(post => {
      const blockedUsers = post?.user?.blocked || [];
      if (typeof blockedUsers !== 'boolean') {
        const isBlocked = blockedUsers.includes(req.body.userAuth.id);
        return isBlocked ? null : post;
      }
    });

    return res.json({
      statusCode: 200,
      message: 'Get all post successfully',
      data: filteredPosts,
    });
  } catch (e: any) {
    return next(appError(e.message));
  }
};

/**
 * Toggle likes
 */
export const toggleLikesCtrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return next(appError('The post not found', 404));
    if (post.user.toString() === req.body.userAuth.id.toString())
      return next(appError('You are author. You can not like this post.', 400));

    const isLiked = post.likes.includes(req.body.userAuth.id);
    if(isLiked) {
      post.likes = post.likes.filter(like => like.toString() !== req.body.userAuth.id.toString());
    } else {
      post.likes.push(req.body.userAuth.id);
    }

    await post.save();
    return res.json({
      statusCode: 200,
      message: 'You have successfully liked the post',
      data: post,
    });
  } catch (e: any) {
    return next(appError(e.message));
  }
};

/**
 * Toggle disDikes
 */
export const toggleDisLikesCtrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return next(appError('The post not found', 404));
    if (post.user.toString() === req.body.userAuth.id.toString())
      return next(appError('You are author. You can not dislike this post.', 400));

    if(post.disLikes.includes(req.body.userAuth.id)) {
      post.disLikes = post.disLikes.filter(unlike => unlike.toString() !== req.body.userAuth.id.toString());
    } else {
      post.disLikes.push(req.body.userAuth.id);
    }

    await post.save();
    return res.json({
      statusCode: 200,
      message: 'You have successfully dislike the post',
    });
  } catch (e: any) {
    return next(appError(e.message));
  }
};

/**
 * Get post details
 */
export const getPostByIdCtrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const post = await getPostByIdOrShortUrl(req.params.idOrShortUrl);
    if (!post) return next(appError('The post not found', 404));
    if (
      post.user.toString() !== req.body.userAuth.id.toString() &&
      post.numViews.includes(req.body.userAuth.id)
    ) {
      post.numViews.push(req.body.userAuth.id);
      await post.save();
    }

    return res.json({
      statusCode: 200,
      data: post,
      message: 'Get the post successfully',
    });
  } catch (e: any) {
    return next(appError(e.message));
  }
};

/**
 * Create post
 */
export const createPostCtrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    title,
    excerpt,
    description,
    imageUrl,
    shortUrl,
    writer,
    isPublished,
    categoryId,
  } = req.body;

  try {
    // 1. Find the user
    const author = await User.findById(req.body.userAuth.id);

    if (!author) return next(appError('Author not found.', 401));
    if (author.isBlocked) return next(appError('Access denied, account blocked', 403));

    /**todo check category is exists
     * if (!category) return next(appError('The category is invalid', 400));
     * const isCategory = Category.findById(category)
     */

    // 2. Create the post
    const postCreated = await Post.create({
      title,
      excerpt,
      description,
      imageUrl,
      shortUrl,
      writer,
      isPublished,
      user: author._id,
      category: categoryId,
    });

    // 3. Associate user to a post - Push the post into the user posts field
    author.posts.push(postCreated);
    // 4. Save
    await author.save();

    return res.json({
      statusCode: 200,
      message: 'The post was created successfully',
      data: postCreated,
    });
  } catch (e: any) {
    return next(appError(e.message));
  }
};

/**
 * Update post
 */
export const updatePostCtrl = async (req: Request, res: Response, next: NextFunction) => {
  const {
    title,
    excerpt,
    description,
    imageUrl,
    shortUrl,
    isPublished,
    writer,
  } = req.body;
  const idOrShortUrl = req.params.idOrShortUrl;

  try {
    const post = await getPostByIdOrShortUrl(idOrShortUrl);
    if (!post) return next(appError('The post not found', 404));
    if (post.user.toString() !== req.body.userAuth.id.toString())
      return next(appError('You are not allowed to update this post', 403));

    await Post.findOneAndUpdate({
      $or:[ { id: idOrShortUrl }, { shortUrl: idOrShortUrl } ]
    }, {
      title,
      excerpt,
      description,
      imageUrl,
      shortUrl,
      isPublished,
      writer,
    }, { new: true });

    return res.json({
      statusCode: 200,
      message: 'Post updated',
    });
  } catch (e: any) {
    return next(appError(e.message));
  }
};

/**
 * Delete post
 */
export const deletePostCtrl = async (req: Request, res: Response, next: NextFunction) => {
  const idOrShortUrl = req.params.idOrShortUrl;

  try {
    const post = await getPostByIdOrShortUrl(idOrShortUrl);
    if (!post) return next(appError('The post not found', 404));
    if (post.user.toString() !== req.body.userAuth.id.toString())
      return next(appError('You are not allowed to delete this post', 403));

    await Post.findOneAndDelete({
      $or:[ { id: idOrShortUrl }, { _id: idOrShortUrl }, { shortUrl: idOrShortUrl } ]
    });

    return res.json({
      statusCode: 200,
      message: 'Post deleted',
    });
  } catch (e: any) {
    return next(appError(e.message));
  }
};
