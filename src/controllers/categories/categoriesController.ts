import { Request, Response, NextFunction } from 'express';

import { appError } from '../../services/helpers';
import { Category } from '../../models/category/Category';
import { User } from '../../models/user/User';

/**
 * Fetch categories
 */
export const fetchCategoriesCtrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categories = await Category.find({});
    return res.json({
      status: 200,
      message: 'Get all the category successfully',
      data: categories,
    });
  } catch (e: any) {
    return next(appError(e.message));
  }
};

/**
 * Get single category
 */
export const categoryDetailCtrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return next(appError('The category was not found.'))
    }

    return res.json({
      status: 200,
      message: 'Category got successfully',
      data: category,
    });
  } catch (e: any) {
    return next(appError(e.message));
  }
};

/**
 * Create category
 */
export const categoryCreateCtrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title } = req.body;

  try {
    const user = await User.findById(req.body.userAuth.id);
    if (!user) {
      return next(appError('User not exists', 401));
    }

    const category = await Category.create({
      title,
      user: req.body.userAuth.id,
    });

    return res.json({
      status: 200,
      message: 'Category created',
      data: category,
    });
  } catch (e: any) {
    return next(appError(e.message));
  }
};

/**
 * Update category
 */
export const categoryUpdateCtrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title } = req.body;
  try {
    const user = await User.findById(req.body.userAuth.id);
    if (!user)
      return next(appError('User not exists', 404));

    const category = await Category.findById(req.params.id);
    if (!category)
      return next(appError('Category not exists', 404));

    if (category.user.toString() !== req.body.userAuth.id.toString())
      return next(appError('You are not allowed to update this category.', 403));

    const categoryNew = await Category.findByIdAndUpdate(
      req.params.id,
      {
        title,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    return res.json({
      status: 200,
      message: 'Category updated',
      data: categoryNew,
    });
  } catch (e: any) {
    return next(appError(e.message));
  }
};

/**
 * Delete category
 */
export const categoryDeleteCtrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.body.userAuth.id);
    if (!user) {
      return next(appError('User not exists', 401));
    }
    const category = await Category.findById(req.params.id);
    if (!category) {
      return next(appError('The category was not found.', 401));
    }
    if (user._id.toString() !== category.user.toString()) {
      return next(appError('Access denied. You can not delete this category.', 401))
    }

    await Category.findByIdAndDelete(req.params.id);

    return res.json({
      status: 200,
      message: 'Category deleted',
    });
  } catch (e: any) {
    return next(appError(e.message));
  }
};
