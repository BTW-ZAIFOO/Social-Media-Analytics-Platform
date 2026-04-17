import type { SocialPlatform } from '../types/index.ts';

export type SocialPlatformType = SocialPlatform;

export interface SocialAccountPayload {
  platform: SocialPlatform;
  name: string;
  profileUrl?: string;
  phoneNumber?: string;
  followers: number;
  engagement: number;
}

export interface PlatformMetrics {
  platform: SocialPlatform;
  totalFollowers: number;
  totalEngagement: number;
  accounts: number;
  growth: number;
}

export interface DashboardMetrics {
  totalFollowers: number;
  totalEngagement: number;
  totalAccounts: number;
  platformMetrics: PlatformMetrics[];
}
