import { Post } from '../models/Post';
import { IPostModel } from '../../../../domain/interfaces';

export const getPostByIdOrShortUrl = async (idOrShortUrl: string): Promise<IPostModel | undefined> => {
  const posts = await Post.find( {
    $or:[ { id: idOrShortUrl }, { shortUrl: idOrShortUrl } ]
  });

  return posts.length ? posts[0] : undefined;
};
