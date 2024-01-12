import { IUserModel } from '../../../../domain/interfaces';
import { User } from '../models/User';

export const getUserById = async (id: string): Promise<IUserModel | undefined> => {
  const user = await User.findById(id);
  return user ?? undefined;
};

