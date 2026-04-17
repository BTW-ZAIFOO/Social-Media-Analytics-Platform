import mongoose from "mongoose";

export interface PostDocument extends mongoose.Document {
  accountId: string;
  platform: "facebook" | "instagram" | "tiktok" | "whatsapp" | "linkedin";
  postId: string;
  content: string;
  imageUrl?: string;
  videoUrl?: string;
  likes: number;
  comments: number;
  shares: number;
  views: number;
  postedAt: Date;
  fetchedAt: Date;
  engagementRate: number;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new mongoose.Schema<PostDocument>(
  {
    accountId: {
      type: String,
      required: true,
      ref: "SocialAccount",
    },
    platform: {
      type: String,
      enum: ["facebook", "instagram", "tiktok", "whatsapp", "linkedin"],
      required: true,
    },
    postId: {
      type: String,
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
    },
    imageUrl: String,
    videoUrl: String,
    likes: {
      type: Number,
      default: 0,
    },
    comments: {
      type: Number,
      default: 0,
    },
    shares: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    postedAt: {
      type: Date,
      required: true,
    },
    fetchedAt: {
      type: Date,
      default: Date.now,
    },
    engagementRate: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

const PostModel =
  mongoose.models.Post || mongoose.model<PostDocument>("Post", PostSchema);
export default PostModel;
