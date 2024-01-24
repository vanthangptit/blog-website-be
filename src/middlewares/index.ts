import { NextFunction, Request, Response } from 'express';
import { rateLimit } from 'express-rate-limit';
import { validationResult } from 'express-validator';
import cors from 'cors';

import {
  appError,
  getTokenFromHeader,
  verifyToken
} from '../utils';
import conf from '../config';
import { IFPayloadToken } from '../domain/interfaces';
import { getUserById } from '../modules/v1/users/services/userServices';

const { accessDomain, accessTokenKey } = conf;

/**
 * Get user
 */
export const isGetUserAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = await getTokenFromHeader(req);
  if (!token)
    return next();

  const decodedUser: IFPayloadToken | undefined = await verifyToken(token, accessTokenKey);
  if (!decodedUser)
    return next();

  const user = await getUserById(decodedUser.id);
  if (!user)
    return next();

  req.body.userAuth = decodedUser;
  next();
};

/**
 * Validation user
 */
export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = await getTokenFromHeader(req);
  if (!token)
    return next(
      appError('Access Denied. No token provided.', 401)
    );

  const decodedUser: IFPayloadToken | undefined = await verifyToken(token, accessTokenKey);
  if (!decodedUser)
    return next(
      appError('Access Denied. The token is invalid.', 401)
    );

  const user = await getUserById(decodedUser.id);
  if (!user) {
    return next(appError('User not found', 400));
  }

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
  const token = await getTokenFromHeader(req);
  if (!token) {
    return next(
      appError(
        'Access Denied. No token provided.',
        401
      )
    );
  }

  const decodedUser: IFPayloadToken | undefined = await verifyToken(token, accessTokenKey);
  if (!decodedUser)
    return next(
      appError('Access Denied. The token is invalid.', 401)
    );

  const user = await getUserById(decodedUser.id);
  if (!user) {
    return next(
      appError('isAuthenticatedWithAdmin:: User not found', 400)
    );
  }

  if (user.isAdmin) {
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
  let message = err.message;
  const status = err.status ? err.status : 'failed';
  const statusCode = err.statusCode ? err.statusCode : 500;

  if (statusCode === 500) {
    message = 'Internal Server Error';
  }

  return res.status(statusCode).json({
    stack,
    message,
    status,
    statusCode
  });
};

/**
 * Rate limit middleware
 */
export const rateLimitMiddleware = rateLimit({
  windowMs: 15 * 60 * 1000,
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
    return next(appError(errors?.errors[0]?.msg, 400));
  }

  next();
}

/**
 * @middleware CORS
 */
export const middlewareCors = cors({
  origin: function (origin, callback) {
    if (accessDomain.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  methods: ['GET', 'PUT', 'POST', 'PATCH', 'OPTIONS', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token', 'Accept'],
  credentials: true,
  exposedHeaders: ['*', 'Authorization' ]
});
