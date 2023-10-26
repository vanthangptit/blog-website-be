import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import userRouter from './routes/users/userRoutes';
import postRouter from './routes/posts/postRoutes';
import categoryRouter from './routes/categories/categoryRoutes';
import commentRouter from './routes/comments/commentRoutes';

import { globalErrHandler } from './middlewares';
import { connectDB } from './database/database';

import conf from './services/conf';

const app: Application = express();
const { port, accessDomain } = conf;
const PORT = port || 9700;

const init = async () => {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true,
  }));

  //Allow access HTTP
  app.use(cors({
    origin: function (origin, callback) {
      if (accessDomain.indexOf(origin) !== -1 || !origin) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    }
  }));

  // Routes
  app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to my website')
  });
  app.use('/api/v1/users', userRouter);
  app.use('/api/v1/posts', postRouter);
  app.use('/api/v1/categories', categoryRouter);
  app.use('/api/v1/comments', commentRouter);

  // Error handlers middleware
  app.use(globalErrHandler);

  // 404 error
  app.use('*', (req: Request, res: Response) => {
    return res.status(404).json({
      message: `${req.originalUrl} - Route not found`,
    });
  });

  await connectDB();

  app.listen(PORT, function () {
    console.log('Server listen port at ' + PORT);
  });
};

init();
