import { ICategoryModel } from '../../../../domain/interfaces';
import { Category } from '../models/Category';

export const getCategoryById = async (id: string): Promise<ICategoryModel | undefined> => {
  const categories = await Category.findById(id);

  return categories ?? undefined;
};
