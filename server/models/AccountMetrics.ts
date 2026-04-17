import mongoose from 'mongoose';

export interface AccountMetricsDocument extends mongoose.Document {
  accountId: string;
  platform: 'facebook' | 'instagram' | 'tiktok' | 'whatsapp' | 'linkedin';
  followers: number;
  engagement: number;
  totalPosts: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  totalViews: number;
  averageEngagementRate: number;
  fetchedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AccountMetricsSchema = new mongoose.Schema<AccountMetricsDocument>(
  {
    accountId: {
      type: String,
      required: true,
      ref: 'SocialAccount',
    },
    platform: {
      type: String,
      enum: ['facebook', 'instagram', 'tiktok', 'whatsapp', 'linkedin'],
      required: true,
    },
    followers: {
      type: Number,
      default: 0,
    },
    engagement: {
      type: Number,
      default: 0,
    },
    totalPosts: {
      type: Number,
      default: 0,
    },
    totalLikes: {
      type: Number,
      default: 0,
    },
    totalComments: {
      type: Number,
      default: 0,
    },
    totalShares: {
      type: Number,
      default: 0,
    },
    totalViews: {
      type: Number,
      default: 0,
    },
    averageEngagementRate: {
      type: Number,
      default: 0,
    },
    fetchedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const AccountMetricsModel =
  mongoose.models.AccountMetrics ||
  mongoose.model<AccountMetricsDocument>('AccountMetrics', AccountMetricsSchema);
export default AccountMetricsModel;
