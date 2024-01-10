import { Post } from '../models/Post';
import { IPostModel } from '../../../../domain/interfaces';

export const getPostByShortUrl = async (shortUrl: string): Promise<IPostModel | undefined> => {
  const post = await Post.findOne({ shortUrl });

  return post ?? undefined;
};

export const getPostById = async (id: string): Promise<IPostModel | undefined> => {
  const post = await Post.findById(id);

  return post ?? undefined;
};
