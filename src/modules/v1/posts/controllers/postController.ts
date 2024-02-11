import { NextFunction, Request, Response } from 'express';
import { startSession } from 'mongoose';
import { appError, verifyToken } from '../../../../utils';
import { Post } from '../models/Post';
import { User } from '../../users/userModel';
import {
  getPostByShortUrl,
  getPostById
} from '../services/postServices';
import {
  getCategoryById
} from '../../categories/services/categoryServices';
import { Token } from '../../auth/refreshToken/models/Token';
import { IFPayloadToken } from '../../../../domain/interfaces';
import conf from '../../../../config';

/**
 * Get posts
 */
/**
 * @todo: Maintain
 * @param req
 * @param res
 * @param next
 */
export const getAllPostCtrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const cookies = req.cookies;
  let filteredPosts;

  try {
    const posts = await Post.find({})
      .populate({
        path: 'creator',
        select: { password: 0, email: 0, emailVerified: 0 }
      });

    if (req.body.userAuth) {
      filteredPosts = posts.filter(post => {
        const blockedUsers = post?.creator?.blocked ?? [];
        if (typeof blockedUsers !== 'boolean') {
          const isBlocked = blockedUsers.includes(req.body.userAuth.id);
          return isBlocked ? null : post;
        }
      });
    } else if (cookies.authToken) {
      const userTokenFound = await Token.findOne({ refreshToken: cookies.authToken });

      if (!userTokenFound) {
        const decoded: IFPayloadToken | undefined
          = await verifyToken(cookies.authToken, conf.refreshAccessTokenKey);
        if (decoded) {
          const foundToken = await Token.findOne({ user: decoded.id.toString() });
          if (foundToken) {
            foundToken.refreshToken = [];
            await foundToken.save();
          }
        }
        return next(appError('You are not allowed to get the posts.', 403));
      }

      const decodedUser: IFPayloadToken | undefined = await verifyToken(
        cookies.authToken,
        conf.refreshAccessTokenKey
      );

      if (decodedUser && decodedUser.id.toString() === userTokenFound.user.toString()) {
        filteredPosts = posts.filter(post => {
          const blockedUsers = post?.creator?.blocked ? JSON.parse(JSON.stringify(post?.creator?.blocked)) : [];
          if (typeof blockedUsers !== 'boolean') {
            const isBlocked = blockedUsers.includes(decodedUser.id);
            return isBlocked ? null : post;
          }
        });
      }
    } else {
      filteredPosts = posts;
    }

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
 * Get posts by user
 */
export const getPostByUserCtrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const author = await User.findById(req.body.userAuth.id);
    if (!author) return next(appError('Author not found.', 400));
    if (author.isBlocked) return next(appError('Access denied, your account blocked', 403));

    const posts = await Post.find({ user: req.body.userAuth.id  }).populate('category');

    return res.json({
      statusCode: 200,
      message: 'Get all post successfully',
      data: posts,
    });
  } catch (e: any) {
    return next(appError(e.message));
  }
};

/**
 * Toggle Associates
 */
type AssociateText = 'likes'|'disLikes'|'hearts'|'stars';
const associates: AssociateText[] = ['likes', 'disLikes', 'hearts', 'stars'];
export const toggleAssociateCtrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const session = await startSession();
  session.startTransaction();
  const userId = req.body.userAuth.id;
  const associate: AssociateText = req.body.associate;

  try {
    const post = await getPostById(req.params.id);
    if (!post) return next(appError('The post not found', 400));
    if (post.creator.toString() === userId.toString())
      return next(appError('You are author. You can not like this post.', 400));

    const associateArrayFiltered = associates.filter(item => item !== associate);
    associateArrayFiltered.forEach((text) => {
      if (post[text].includes(userId)) {
        post[text] = post[associate].filter(item => item.toString() !== userId.toString());
      }
    });

    const isActivated = post[associate].includes(userId);
    if(isActivated) {
      post[associate] = post[associate].filter(item => item.toString() !== userId.toString());
    } else {
      post[associate].push(userId);
    }

    await post.save();
    await session.commitTransaction();
    await session.endSession();
    return res.json({
      statusCode: 200,
      message: `Successfully`,
      data: post,
    });
  } catch (e: any) {
    await session.abortTransaction();
    await session.endSession();
    return next(appError(e.message));
  }
};

/**
 * Toggle Saves
 */
export const toggleSavesCtrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const post = await getPostById(req.params.id);
    if (!post)
      return next(appError('The post not found', 404));
    if (post.creator.toString() === req.body.userAuth.id.toString())
      return next(appError('You are author. You can not dislike this post.', 403));

    const isSaved = post.saves.includes(req.body.userAuth.id);
    if (isSaved) {
      post.saves = post.saves.filter(save => save.toString() !== req.body.userAuth.id.toString());
    } else {
      post.saves.push(req.body.userAuth.id);
    }

    await post.save();
    return res.json({
      statusCode: 200,
      message: isSaved ? 'You saved successfully' : 'You unsaved successfully',
    });
  } catch (e: any) {
    return next(appError(e.message));
  }
};

/**
 * Toggle Saves
 */
export const togglePinCtrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const session = await startSession();
  session.startTransaction();
  try {
    const post = await getPostById(req.params.id);
    if (!post)
      return next(appError('The post not found', 404));
    if (post.creator.toString() !== req.body.userAuth.id.toString())
      return next(appError('You are not author. You can not pin this post.', 403));

    post.isPinned = !post.isPinned;

    await post.save();
    await session.commitTransaction();
    await session.endSession();
    return res.json({
      statusCode: 200,
      message: post.isPinned ? 'You pinned successfully' : 'You unpinned successfully',
    });
  } catch (e: any) {
    await session.abortTransaction();
    await session.endSession();
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
        post.creator.toString() !== userAuth.id.toString() &&
        !post.numViews.includes(userAuth.id)
      ) {
        post.numViews.push(userAuth.id);
        await post.save();
      }
    }

    const singlePost = await Post.findOne({
      shortUrl: req.params.shortUrl
    })
      .populate({
        path: 'creator',
        select: { password: 0, email: 0 }
      });
    const postRelated = await Post.find({
      shortUrl: { $ne: req.params.shortUrl }
    })
      .limit(5)
      .sort({ createdAt: -1 });

    await session.commitTransaction();
    await session.endSession();
    return res.json({
      statusCode: 200,
      data: {
        singlePost,
        postRelated,
      },
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
      creator: author._id,
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
    if (post.creator.toString() !== req.body.userAuth.id.toString())
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
    const post = await getPostById(postId);
    if (!post) return next(appError('The post not found', 404));
    if (post.creator.toString() !== req.body.userAuth.id.toString())
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
