import express from 'express';

import loginRouter from './login/routes/loginRoutes';
import registerRouter from './register/routes/registerRoutes';

const authRouter = express.Router();

authRouter.use('/login', loginRouter);
authRouter.use('/register', registerRouter);

export default authRouter;
