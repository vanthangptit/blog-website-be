import { Request, Response, NextFunction } from 'express';

import { appError } from '../../services/helpers';
import { Post } from '../../models/post/Post';
import { User } from '../../models/user/User';
import { Comment } from '../../models/comment/Comment';

/**
 * Create comment
 */
export const commentCreateCtrl = async (req: Request, res: Response, next: NextFunction) => {
  const { description } = req.body;
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return next(appError('The post not found', 404));
    const user = await User.findById(req.body.userAuth.id);
    if (!user) return next(appError('The user not found', 404));

    const comment = await Comment.create({
      post: post._id,
      description,
      user: user._id
    });

    user.comments.push(comment._id);
    post.comments.push(comment._id);

    await user.save();
    await post.save();

    return res.json({
      status: 200,
      message: 'Comment successfully',
      data: comment,
    });
  } catch (e: any) {
    return next(appError(e.message));
  }
};

/**
 * Update comment
 */
export const commentUpdateCtrl = async (req: Request, res: Response, next: NextFunction) => {
  const { description } = req.body;
  try {
    const user = await User.findById(req.body.userAuth.id);
    if (!user)
      return next(appError('User not exists', 401));

    const comment = await Comment.findById(req.params.id);
    if (!comment)
      return next(appError('Comment not exists', 404));

    if (comment.user.toString() !== req.body.userAuth.id.toString())
      return next(appError('You are not allowed to update this comment.', 403));

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
      status: 200,
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
export const commentDeleteCtrl = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.body.userAuth.id);
    if (!user)
      return next(appError('User not exists', 401));

    const comment = await Comment.findById(req.params.id);
    if (!comment)
      return next(appError('The comment was not found.', 401));

    if (user._id.toString() !== comment.user.toString())
      return next(appError('Access denied. You can not delete this comment.', 403));

    await Comment.findByIdAndDelete(req.params.id);

    return res.json({
      status: 200,
      message: 'Comment deleted',
    });
  } catch (e: any) {
    return next(appError(e.message));
  }
};
