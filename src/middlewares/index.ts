import { NextFunction, Request, Response } from 'express';
import { rateLimit } from 'express-rate-limit';
import { validationResult } from 'express-validator';

import { User } from '../models';
import {
  appError,
  getTokenFromHeader,
  verifyToken
} from '../services/helpers';

/**
 * Validation login user
 */
export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // get token from header
  const token = await getTokenFromHeader(req);
  if (!token)
    return next(
      appError('There is no token attached to the header', 400)
    );

  // verify the token
  const decodedUser: any = await verifyToken(token);
  if (!decodedUser)
    return next(
      appError('Forbidden. Please login again!', 403)
    );

  // save the user into req object
  req.body.userAuth = decodedUser;
  next();
};

/**
 * Validation login user by role is admin
 */
export const isAuthenticatedWithAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Get token from header
  const token = await getTokenFromHeader(req);
  if (!token) {
    return next(
      appError('There is no token attached to the header', 400)
    );
  }

  // Verify the token
  const decodedUser: any = await verifyToken(token);
  if (!decodedUser)
    return next(
      appError('Forbidden. Please login again!', 403)
    );

  // Find the user in DB
  const user = await User.findById(decodedUser.id);
  if (!user) {
    return next(
      appError('isAuthenticatedWithAdmin:: User not found', 404)
    );
  }

  if (user.isAdmin) {
    // Save the user into req object
    req.body.userAuth = decodedUser;
    next();
  } else {
    return next(appError('User access denied', 403));
  }
};

export const globalErrHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const stack = err.stack;
  const message = err.message;
  const status = err.status ? err.status : 'failed';
  const statusCode = err.statusCode ? err.statusCode : 500;

  return res.status(statusCode).json({
    stack,
    message,
    status,
  });
};

/**
 * Rate limit middleware
 */
export const rateLimitMiddleware = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: 'You have exceeded your 5 requests per minute limit.',
  headers: true,
});

/**
 * @middleware isValidationResult
 *
 * This middleware function helps check if the request is valid based on the headers.
 */
export async function isValidationResult(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const errors: any = validationResult(req);
  if (!errors.isEmpty()) {
    // eslint-disable-next-line no-console
    console.log(errors);
    return res.status(400).send(errors?.errors[0]?.msg);
  }

  next();
}
