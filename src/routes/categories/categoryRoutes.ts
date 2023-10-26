import express from 'express';
import {
  categoryCreateCtrl,
  categoryDeleteCtrl,
  fetchCategoriesCtrl,
  categoryUpdateCtrl,
  categoryDetailCtrl,
} from '../../controllers/categories/categoriesController';
import { isAuthenticated } from '../../middlewares';
import { categoryValidation } from '../../domain/validations/categoryValidation';

const categoryRouter = express.Router();

/**
 * @method GET::Fetch categories
 */
categoryRouter.get('/', fetchCategoriesCtrl);

/**
 * @method GET::Get category detail
 */
categoryRouter.get('/:id', categoryDetailCtrl);

/**
 * @method POST::Create category
 */
categoryRouter.post(
  '/',
  categoryValidation,
  isAuthenticated,
  categoryCreateCtrl
);

/**
 * @method PUT::Update category
 */
categoryRouter.put(
  '/:id',
  categoryValidation,
  isAuthenticated,
  categoryUpdateCtrl
);

/**
 * @method DELETE::Delete category
 */
categoryRouter.delete(
  '/:id',
  isAuthenticated,
  categoryDeleteCtrl
);

export default categoryRouter;
