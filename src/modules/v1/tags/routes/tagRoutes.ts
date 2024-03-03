import { isAuthenticated } from '../../../../middlewares';
import express from 'express';
import { getAllTagCtrl } from '../controllers/tagController';

const tagRouter = express.Router();

/**
 * @method GET::Get all tags
 */
tagRouter.get('/', isAuthenticated, getAllTagCtrl);

export default tagRouter;