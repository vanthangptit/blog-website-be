import express from 'express';
import { getCSRFTokenCtrl } from '../controllers/csrfController';
import { csrfProtection } from '../../../../middlewares';

const csrfRouter = express.Router();

/**
 * @method Get::CSRF token
 */
csrfRouter.get('/', csrfProtection, getCSRFTokenCtrl);

export default csrfRouter;
