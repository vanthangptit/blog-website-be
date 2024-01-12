import { Request, Response, NextFunction } from 'express';

import { appError } from '../../../../utils';
import { Post } from '../../posts/models/Post';
import { Comment } from '../models/Comment';
import { User } from '../../users/models/User';
import { startSession } from 'mongoose';

/**
 * Get comments by post id
 */
export const getCommentsByPostId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const postId = req.params.id;

  try {
    const commentFound = await Comment.find({
      post: postId
    })
      .populate({
        path: 'user',
        select: { firstName: true, lastName: true, profilePhoto: true }
      });
    return res.json({
      statusCode: 200,
      message: 'Get comments successfully',
      data: commentFound,
    });
  } catch (e: any) {
    return next(appError(e.message));
  }
};

/**
 * Create comment
 */
export const commentCreateCtrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { description } = req.body;
  const session = await startSession();
  session.startTransaction();

  try {
    const post = await Post.findById(req.params.id);
    if (!post) return next(appError('The post not found', 400));
    const user = await User.findById(req.body.userAuth.id);
    if (!user) return next(appError('The user not found', 400));

    const comment = await Comment.create({
      post: post._id,
      description,
      user: user._id
    });

    user.comments.push(comment._id);
    post.comments.push(comment._id);

    await user.save();
    await post.save();

    await session.commitTransaction();
    await session.endSession();
    return res.json({
      statusCode: 200,
      message: 'Comment successfully',
      data: comment,
    });
  } catch (e: any) {
    await session.abortTransaction();
    await session.endSession();
    return next(appError(e.message));
  }
};

/**
 * Update comment
 */
export const commentUpdateCtrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { description } = req.body;
  try {
    const user = await User.findById(req.body.userAuth.id);
    if (!user)
      return next(appError('User not exists', 400));

    const comment = await Comment.findById(req.params.id);
    if (!comment)
      return next(appError('Comment not exists', 400));

    if (comment.user.toString() !== req.body.userAuth.id.toString())
      return next(
        appError('You are not allowed to update this comment.', 403)
      );

    const commentNew = await Comment.findByIdAndUpdate(
      req.params.id,
      {
        description,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    return res.json({
      statusCode: 200,
      message: 'Comment updated',
      data: commentNew,
    });
  } catch (e: any) {
    return next(appError(e.message));
  }
};

/**
 * Delete comment
 */
export const commentDeleteCtrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.body.userAuth.id);
    if (!user)
      return next(appError('User not exists', 401));

    const comment = await Comment.findById(req.params.id);
    if (!comment)
      return next(appError('The comment was not found.', 401));

    if (user._id.toString() !== comment.user.toString())
      return next(
        appError('Access denied. You can not delete this comment.', 403)
      );

    await Comment.findByIdAndDelete(req.params.id);

    return res.json({
      statusCode: 200,
      message: 'Comment deleted',
    });
  } catch (e: any) {
    return next(appError(e.message));
  }
};
