import { NextFunction, Request, Response } from 'express';
import moment from 'moment';

import conf from '../../../../config';
import { EmailVerification } from '../models/EmailVerification';
import {
  appError
} from '../../../../utils';
import { User } from '../../users/models/User';

/**
 * Verify email
 */
export const verifyEmailController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { token } = req.query;

  try {
    const emailVerification = await EmailVerification
      .findOne({ token })
      .populate({
        path: 'user',
      });

    if (!emailVerification)
      return next(appError(`Verify email called with invalid email token ${token}`, 400));

    const dateIsAfter  = moment(emailVerification.validUntil).isAfter(moment(new Date()));
    if (emailVerification && dateIsAfter) {
      await User.findByIdAndUpdate(emailVerification.user._id, {
        emailVerified: true,
      });

      res.redirect(conf.email.urlLogin)
    } else {
      return next(appError(`Verify email called with invalid email token ${token}`, 400));
    }
  } catch (e: any) {
    return next(appError(e.message));
  }
};
