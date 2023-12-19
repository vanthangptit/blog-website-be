import { Token } from '../models/Token';

/**
 * createRefreshToken
 * */
export const createRefreshToken = async (
  userId: string,
  refreshToken: string[],
  userAgent: string,
  ip: string,
  session: any
): Promise<any> => {
  return await Token.create([
    {
      user: userId,
      refreshToken,
      userAgent,
      ip
    }
  ], { session });
};

/**
 * deleteRefreshToken
 **/
export const deleteRefreshToken = async (
  userId: string,
  session: any
): Promise<void> => {
  await Token.deleteMany({ user: userId }).session(session);
};

