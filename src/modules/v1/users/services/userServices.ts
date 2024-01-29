import { IUserModel } from '../../../../domain/interfaces';
import { User } from '../models/User';

export const getUserById = async (id: string): Promise<IUserModel | undefined> => {
  const user = await User.findById(id);
  return user ?? undefined;
};

export const isCheckUserExists = async (alias: string): Promise<boolean> => {
  const user = await User.findOne({ alias });
  return !!user;
};

