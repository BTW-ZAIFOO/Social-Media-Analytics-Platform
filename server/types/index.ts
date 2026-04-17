export type PlatformType = 'Meta' | 'Google' | 'TikTok';
export type SocialPlatform = 'facebook' | 'instagram' | 'tiktok' | 'whatsapp' | 'linkedin';

export interface CampaignPayload {
  name: string;
  platform: PlatformType;
  spend: number;
  revenue: number;
  impressions: number;
  clicks: number;
  conversions: number;
  date: string | Date;
}

export interface CampaignDocument extends CampaignPayload {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OverviewData {
  spend: number;
  revenue: number;
  clicks: number;
  conversions: number;
  roi: number;
}

export interface PlatformStat {
  platform: PlatformType;
  spend: number;
  revenue: number;
  clicks: number;
  conversions: number;
}

export interface TimeSeriesItem {
  date: string;
  spend: number;
  revenue: number;
  clicks: number;
}
