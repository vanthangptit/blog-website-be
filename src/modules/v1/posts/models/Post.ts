import { model, Schema } from 'mongoose';
import { IPostModel } from '../../../../domain/interfaces';

const PostSchema = new Schema<IPostModel>({
  title: {
    type: String,
    required: [true, 'Post title is required'],
    trim: true,
  },
  writer: {
    type: String,
    required: [true, 'Post writer is required'],
  },
  excerpt: {
    type: String,
    required: [true, 'Post excerpt is required'],
  },
  shortUrl: {
    type: String,
    required: [true, 'Post short url is required'],
    unique: true
  },
  description: {
    type: String,
    required: [true, 'Post description is required'],
  },
  imageUrl: {
    type: String,
    required: [true, 'Post image is required'],
  },
  isPublished: {
    type: Boolean,
    required: false,
    default: false,
  },
  isPinned: {
    type: Boolean,
    required: false,
    default: false,
  },
  tags: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Tag',
    }
  ],
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
  hearts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    }
  ],
  stars: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    }
  ],
  saves: [
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
  creator: {
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
    return this?.numViews?.length || 0;
  });

  // Get likesCount
  PostSchema.virtual('likesCount').get(function() {
    return this?.likes?.length || 0;
  });

  // Get disLikesCount
  PostSchema.virtual('disLikesCount').get(function() {
    return this?.disLikes?.length || 0;
  });

  // Get commentsCount
  PostSchema.virtual('heartsCount').get(function() {
    return this?.hearts?.length || 0;
  });

  // Get likesCount
  PostSchema.virtual('starsCount').get(function() {
    return this?.stars?.length || 0;
  });

  // Get disLikesCount
  PostSchema.virtual('savesCount').get(function() {
    return this?.saves?.length || 0;
  });

  // Get commentsCount
  PostSchema.virtual('commentsCount').get(function() {
    return this?.comments?.length || 0;
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
export const Post = model<IPostModel>('Post', PostSchema);
