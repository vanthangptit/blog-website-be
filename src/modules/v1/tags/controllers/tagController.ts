import { NextFunction, Request, Response } from 'express';
import { appError } from '../../../../utils';
import { Tag } from '../models/Tag';

/**
 * Get tags
 */
export const getAllTagCtrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tags = await Tag.find({});

    return res.json({
      statusCode: 200,
      message: 'Get all tag successfully',
      data: tags,
    });
  } catch (e: any) {
    return next(appError(e.message));
  }
};
