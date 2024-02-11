import express from 'express';

import updateUserRouter from './update/UpdateUserRoutes';
import profileRouter from './profile/ProfileRoutes';
import followRouter from './follow/FollowRoutes';
import blockingRouter from './blocking/BlockingRoutes';

const userRouter = express.Router();

userRouter.use('/update', updateUserRouter);
userRouter.use('/profile', profileRouter);
userRouter.use('/follow', followRouter);
userRouter.use('/blocking', blockingRouter);

export default userRouter;
