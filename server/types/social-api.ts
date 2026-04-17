import type { SocialPlatform } from "../types/index.ts";

export interface FacebookPostData {
  id: string;
  message: string;
  picture?: string;
  video?: string;
  likes: number;
  comments: number;
  shares: number;
  created_time: string;
}

export interface InstagramPostData {
  id: string;
  caption: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL";
  media_url?: string;
  video_url?: string;
  like_count: number;
  comments_count: number;
  timestamp: string;
}

export interface TikTokPostData {
  video_id: string;
  desc: string;
  cover_image_url?: string;
  video_url?: string;
  digg_count: number;
  comment_count: number;
  share_count: number;
  view_count: number;
  create_time: number;
}

export interface LinkedInPostData {
  id: string;
  text: string;
  image?: string;
  video?: string;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  created_time: string;
}

export interface SocialMediaStats {
  platform: SocialPlatform;
  accountId: string;
  followers: number;
  engagement: number;
  totalPosts: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  totalViews: number;
  posts: SocialMediaPost[];
  lastFetched: Date;
}

export interface SocialMediaPost {
  postId: string;
  content: string;
  imageUrl?: string;
  videoUrl?: string;
  likes: number;
  comments: number;
  shares: number;
  views: number;
  postedAt: Date;
  engagementRate: number;
}

export interface PlatformApiConfig {
  platform: SocialPlatform;
  accessToken?: string;
  businessAccountId?: string;
  userId?: string;
}
