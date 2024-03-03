import express from 'express';
import { getTokenCtrl } from '../controllers/tokenController';

const tokenRouter = express.Router();

/**
 * @method POST::Get new access token
 */
tokenRouter.get('/', getTokenCtrl);

export default tokenRouter;
