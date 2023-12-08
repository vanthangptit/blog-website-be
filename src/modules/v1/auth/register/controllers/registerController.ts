import { NextFunction, Request, Response } from 'express';

import { appError, passwordHash } from '../../../../../utils';
import { User } from '../../../users/models/User';
import { startSession } from 'mongoose';
import { nanoid } from 'nanoid';
import { EmailVerification } from '../../../emails/models/EmailVerification';
import moment from 'moment';

export const registerCtrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { firstName, lastName, email, password, passwordConfirm } = req.body;
  const session = await startSession();
  session.startTransaction();

  try {
    const userFound = await User.findOne({ email });
    if (userFound)
      return next(appError('Email already exists', 404));

    if (passwordConfirm !== password)
      return next(appError('Password not match', 400));

    const user = await User.create([{
      firstName,
      lastName,
      email,
      password: await passwordHash(password)
    }], { session  });

    const token = nanoid();
    await EmailVerification.create([{
      token,
      user: user[0]?._id,
      validUntil: moment(new Date()).add(1, 'day')
    }], { session });

    /** @todo google cloud (Oauth2 - blog-website)
     * https://console.cloud.google.com/apis/credentials?project=blog-website-404616&supportedpurview=project
     **/
    // await sendVerifyEmailMail(email, `${firstName + ' ' + lastName}`, token);

    await session.commitTransaction();
    await session.endSession();

    return res.json({
      statusCode: 200,
      message: 'User created successful',
    });
  } catch (e: any) {
    await session.abortTransaction();
    await session.endSession();
    return next(appError(e.message));
  }
};
