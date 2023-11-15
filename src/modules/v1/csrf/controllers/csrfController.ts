import { NextFunction, Request, Response } from 'express';

import { appError } from '../../../../utils';

/**
 * Get users
 */
export const getCSRFTokenCtrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    return res.json({
      status: 200,
      message: 'Get all user successfully',
      csrfToken: req.csrfToken(),
    });
  } catch (e: any) {
    return next(appError(e.message));
  }
};
