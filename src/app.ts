import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser';

import userRouter from './modules/v1/users/routes/userRoutes';
import postRouter from './modules/v1/posts/routes/postRoutes';
import categoryRouter from './modules/v1/categories/routes/categoryRoutes';
import commentRouter from './modules/v1/comments/routes/commentRoutes';
import adminRouter from './modules/v1/admin/routes/adminRoutes';
import authRouter from './modules/v1/auth/authRoutes';

import { globalErrHandler, middlewareCors } from './middlewares';
import { connectDB } from './database/database';

import conf from './config';
import { client } from './config/caching';

const app: Application = express();
const { port } = conf;
const PORT = port || 9700;

const init = async () => {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  //Allow access HTTP
  app.use(middlewareCors);

  /** @todo
   * Use caching data (suggestion: Redis)
   * Reference: https://blog.logrocket.com/caching-node-js-optimize-app-performance/
   **/

  // Routes
  app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to my website')
  });

  app.use('/api/v1/users', userRouter);
  app.use('/api/v1/posts', postRouter);
  app.use('/api/v1/categories', categoryRouter);
  app.use('/api/v1/comments', commentRouter);
  app.use('/api/v1/admin', adminRouter);
  app.use('/api/v1/auth', authRouter);

  // Error handlers middleware
  app.use(globalErrHandler);

  // 404 error
  app.use('*', (req: Request, res: Response) => {
    return res.status(404).json({
      message: `${req.originalUrl} - Route not found`,
    });
  });

  await connectDB();
  await client.on('connect', () => console.log('Connected to Redis'));

  app.listen(PORT, function () {
    console.log('Server listen port at ' + PORT);
  });
};

init();
