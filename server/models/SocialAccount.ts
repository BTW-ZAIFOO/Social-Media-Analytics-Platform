import mongoose from 'mongoose';
import type { SocialPlatform } from '../types/index.ts';

export interface SocialAccountDocument extends mongoose.Document {
  platform: SocialPlatform;
  name: string;
  profileUrl?: string;
  phoneNumber?: string;
  followers: number;
  engagement: number;
  createdAt: Date;
  updatedAt: Date;
}

const socialAccountSchema = new mongoose.Schema<SocialAccountDocument>(
  {
    platform: {
      type: String,
      enum: ['facebook', 'instagram', 'tiktok', 'whatsapp', 'linkedin'],
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    profileUrl: {
      type: String,
      required: function () {
        return this.platform !== 'whatsapp';
      },
    },
    phoneNumber: {
      type: String,
      required: function () {
        return this.platform === 'whatsapp';
      },
    },
    followers: {
      type: Number,
      default: 0,
    },
    engagement: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model<SocialAccountDocument>('SocialAccount', socialAccountSchema);
