import { NextFunction, Request, Response } from 'express';
import { startSession } from 'mongoose';
import { appError } from '../../../../utils';
import { Post } from '../models/Post';
import { User } from '../../users/models/User';
import {
  getPostByShortUrl,
  getPostById
} from '../services/postServices';
import {
  getCategoryById
} from '../../categories/services/categoryServices';

/**
 * Get posts
 */
export const getAllPostCtrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const posts = await Post.find({ user: req.body.userAuth.id }).populate('category');

    const filteredPosts = posts.length > 0 ?posts.filter(post => {
      const blockedUsers = post?.user?.blocked || [];
      if (typeof blockedUsers !== 'boolean') {
        const isBlocked = blockedUsers.includes(req.body.userAuth.id);
        return isBlocked ? null : post;
      }
    }) : [];

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
    const post = await getPostById(req.params.id);
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
    const post = await getPostByShortUrl(req.params.shortUrl);
    if (!post)
      return next(appError('The post not found', 404));
    if (post.user.toString() === req.body.userAuth.id.toString())
      return next(appError('You are author. You can not dislike this post.', 403));

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
export const getPostByShortUrlCtrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const session = await startSession();
  session.startTransaction();
  const userAuth = req.body.userAuth;

  try {
    const post = await getPostByShortUrl(req.params.shortUrl);
    if (!post) return next(appError('The post not found', 404));

    if (userAuth) {
      if (
        post.user.toString() !== userAuth.id.toString() &&
        !post.numViews.includes(userAuth.id)
      ) {
        post.numViews.push(userAuth.id);
        await post.save();
      }
    }

    const singlePost: any = await Post.findOne({
      shortUrl: req.params.shortUrl
    })
      .populate({
        path: 'user',
        select: { password: 0, email: 0 }
      });

    await session.commitTransaction();
    await session.endSession();
    return res.json({
      statusCode: 200,
      data: singlePost,
      message: 'Get the post successfully',
    });
  } catch (e: any) {
    await session.abortTransaction();
    await session.endSession();
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
    const author = await User.findById(req.body.userAuth.id);

    if (!author) return next(appError('Author not found.', 400));
    if (author.isBlocked) return next(appError('Access denied, account blocked', 403));

     const category = await getCategoryById(categoryId);
     if (!category || category.user.toString() !== req.body.userAuth.id.toString())
       return next(appError('The category id is invalid', 403));

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

    author.posts.push(postCreated);
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
  const idOrShortUrl = req.params.shortUrl;

  try {
    const post = await getPostByShortUrl(idOrShortUrl);
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
  const postId = req.params.id;

  try {
    /**
     * @todo: double check again
     */
    const post = await getPostById(postId);
    if (!post) return next(appError('The post not found', 404));
    if (post.user.toString() !== req.body.userAuth.id.toString())
      return next(appError('You are not allowed to delete this post', 403));

    await Post.findByIdAndDelete(postId);

    return res.json({
      statusCode: 200,
      message: 'Post deleted',
    });
  } catch (e: any) {
    return next(appError(e.message));
  }
};
