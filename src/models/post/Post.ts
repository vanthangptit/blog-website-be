import {
  model,
  Schema,
  Model,
  Types,
  Document,
  PopulatedDoc,
} from 'mongoose';
import { IUser } from '../user/User';

type PostType =
  'society' |
  'sports' |
  'technology' |
  'traveling' |
  'history' |
  'learn' |
  'lovely' |
  'poem' |
  'review' |
  'life' |
  'diary';

export interface IPost extends Document {
  title: string
  excerpt: string
  description: string
  imageUrl: string
  shortUrl: string
  postType: PostType
  writer: string
  isPublished: boolean
  category: Types.ObjectId
  comments: Types.ObjectId[]
  numViews: Types.ObjectId[]
  likes: Types.ObjectId[]
  disLikes: Types.ObjectId[]
  user: IUser,
  createdAt: number
  updatedAt: number
}

const PostSchema = new Schema<IPost>({
  title: {
    type: String,
    required: [true, 'Post title is required'],
    trim: true,
  },
  excerpt: {
    type: String,
    required: [true, 'Post excerpt is required'],
  },
  description: {
    type: String,
    required: [true, 'Post description is required'],
  },
  imageUrl: {
    type: String,
    required: [true, 'Post image is required'],
  },
  shortUrl: {
    type: String,
    required: [true, 'Post short url is required'],
    unique: true
  },
  postType: {
    type: String,
    enum: ['society', 'sports', 'technology', 'traveling', 'history', 'learn', 'lovely', 'poem', 'review', 'life', 'diary'],
    required:  [true, 'Post type is required'],
  },
  writer: {
    type: String,
    required: [true, 'Post writer is required'],
  },
  isPublished: {
    type: Boolean,
    required: false,
    default: false,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    // required: [true, 'Post category is required'],
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
    }
  ],
  numViews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    }
  ],
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    }
  ],
  disLikes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    }
  ],
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please author is required'],
  },
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
  },
});

/**
 * Hooks
 */
PostSchema.pre(/^find/, async function(next) {
  // Get viewsCount
  PostSchema.virtual('viewsCount').get(function() {
    return this.numViews.length;
  });

  // Get likesCount
  PostSchema.virtual('likesCount').get(function() {
    return this.likes.length;
  });

  // Get disLikesCount
  PostSchema.virtual('disLikesCount').get(function() {
    return this.disLikes.length;
  });

  PostSchema.virtual('daysAgo').get(function() {
    const post = this;
    const date: any = new Date(post.createdAt);
    const daysAgo = Math.floor((Date.now() - date) / 86400000);

    return daysAgo === 0 ? 'Today' : daysAgo === 1 ? 'Yesterday' : `${daysAgo} days ago`;
  });
  next();
});

// Compile the post model
export const Post = model<IPost>('Post', PostSchema);
