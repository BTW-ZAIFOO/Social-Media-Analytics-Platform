export type SocialPlatform =
  | "facebook"
  | "instagram"
  | "tiktok"
  | "whatsapp"
  | "linkedin";

export interface SocialAccount {
  id?: string;
  _id?: string;
  platform: SocialPlatform;
  name: string;
  profileUrl?: string;
  phoneNumber?: string;
  followers: number;
  engagement: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface PlatformMetrics {
  platform: SocialPlatform;
  totalFollowers: number;
  totalEngagement: number;
  accounts: number;
  growth: number;
  trend?: Array<{ date: string; value: number }>;
}

export interface SocialPost {
  postId: string;
  content: string;
  imageUrl?: string;
  videoUrl?: string;
  likes: number;
  comments: number;
  shares: number;
  views: number;
  postedAt: string;
  engagementRate: number;
}

export interface SocialPreview {
  platform: SocialPlatform;
  name: string;
  profileUrl: string;
  followers: number;
  engagement: number;
  posts: SocialPost[];
  topPosts: SocialPost[];
  trend: Array<{
    date: string;
    likes: number;
    comments: number;
    shares: number;
  }>;
}

export interface PlatformDetail {
  posts: SocialPost[];
  metrics: {
    platform: SocialPlatform;
    totalFollowers: number;
    averageEngagement: number;
    totalPosts: number;
    totalLikes: number;
    totalComments: number;
    totalShares: number;
    totalViews: number;
    trend: Array<{
      date: string;
      likes: number;
      comments: number;
      shares: number;
    }>;
  };
}

export interface DashboardMetrics {
  totalFollowers: number;
  totalEngagement: number;
  totalAccounts: number;
  platformMetrics: PlatformMetrics[];
}
