import { model, Schema, Types, Document } from 'mongoose';
import { IPost, Post } from '../post/Post';

export interface IUser extends Document {
  firstName: string
  lastName: string
  email: string
  password?: string
  isLoginGoogle?: boolean
  isBlocked?: boolean
  isAdmin: boolean
  role: string
  profilePhoto?: string
  gender?: string
  birthDay?: Date
  viewers: Types.ObjectId[]
  followers: Types.ObjectId[]
  following: Types.ObjectId[]
  posts: IPost[]
  comments: Types.ObjectId[]
  blocked: Types.ObjectId[]
  plan: string
  userAward: string
  fullName?: string
}

const UserSchema = new Schema<IUser>({
  firstName: {
    type: String,
    required: [true, 'First Name is required'],
  },
  lastName: {
    type: String,
    required: [true, 'Last Name is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true
  },
  password: {
    type: String,
    required: false,
  },
  isLoginGoogle: {
    type: Boolean,
    default: false,
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    enum: ['admin', 'creator', 'editor', 'normal'],
    default: 'normal',
  },
  profilePhoto: {
    type: String,
    required: false,
  },
  gender: {
    type: String,
    required: false,
  },
  birthDay: {
    type: Date,
    required: false,
  },
  viewers: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    }
  ],
  followers: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    }
  ],
  following: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    }
  ],
  posts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Post',
    }
  ],
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
    }
  ],
  blocked: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    }
  ],
  plan: {
    type: String,
    enum: ['free', 'premium', 'pro'],
    default: 'free',
  },
  userAward: {
    type: String,
    enum: ['bronze', 'silver', 'gold'],
    default: 'bronze',
  },
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
  },
});

/**
 * Hooks
 * Middleware (also called pre and post hooks) are functions which are
 * passed control during execution of asynchronous functions.
 * Middleware is specified on the schema level and is useful for writing plugins.
*/
UserSchema.pre('findOne', async function(next) {
  // eslint-disable-next-line no-console
  console.log('this', this);

  // const userId = this._conditions?._id;
  // const lastPost = await Post.findOne({ user: userId })
  //   .sort({ createdAt: -1 })
  //   .limit(1);
  // if (lastPost) {
  //   const lastPostDate = new Date(lastPost?.createdAt);
  //   UserSchema.virtual('lastPostDate').get(function() {
  //     return `${lastPostDate}`;
  //   });
  //
  //   //---------If check the user is inactive for 30days-----------------
  //   const currentDate = new Date();
  //   const diff = currentDate - lastPostDate;
  //   const diffInDays = diff / (1000 * 3600 * 24);
  //   UserSchema.virtual('isInactive').get(function() {
  //     return diffInDays > 30;
  //   });
  //   await User.findByIdAndUpdate(
  //     userId,
  //     {
  //       isBlocked: diffInDays > 30,
  //     },
  //     {
  //       new: true,
  //     }
  //   );
  //
  //   //--------- Last active date -----------------
  //   const daysAgo = Math.floor(diffInDays);
  //   UserSchema.virtual('lastActive').get(function() {
  //     if (daysAgo <= 0) {
  //       return 'Today';
  //     } else if (daysAgo === 1) {
  //       return 'Yesterday';
  //     } else {
  //       return `${daysAgo} days ago`;
  //     }
  //   });
  // }
  //
  // //--------- Update userAward based on the number of posts -----------------
  // const numberOfPosts = await Post.count({ user: userId });
  // let userAward = 'bronze';
  // if (numberOfPosts > 10 && numberOfPosts <= 20) {
  //   userAward = 'silver';
  // } else if (numberOfPosts > 20) {
  //   userAward = 'gold';
  // }
  //
  // await User.findByIdAndUpdate(userId, { userAward }, { new: true });
  //
  // next();
});

/**
 * Virtual is a property that is not stored in MongoDB.
 * Virtuals are typically used for computed properties on documents.
*/
// Get fullName
UserSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Get viewers count
UserSchema.virtual('viewerCounts').get(function() {
  return this.viewers.length;
});

// Get followers count
UserSchema.virtual('followerCounts').get(function() {
  return this.followers.length;
});

// Get following count
UserSchema.virtual('followingCounts').get(function() {
  return this.following.length;
});

// Get post count
UserSchema.virtual('postCounts').get(function() {
  return this.posts.length;
});

// Get blocked count
UserSchema.virtual('blockedCounts').get(function() {
  return this.blocked.length;
});

// Compile the user model
export const User = model<IUser>('User', UserSchema);
