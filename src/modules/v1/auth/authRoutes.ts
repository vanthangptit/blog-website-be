import express from 'express';

import loginRouter from './login/routes/loginRoutes';
import logoutRouter from './logout/routes/logoutRoutes';
import registerRouter from './register/routes/registerRoutes';
import tokenRouter from './refreshToken/routes/tokenRoutes';

const authRouter = express.Router();

authRouter.use('/login', loginRouter);
authRouter.use('/logout', logoutRouter);
authRouter.use('/register', registerRouter);
authRouter.use('/refresh-token', tokenRouter);

export default authRouter;
