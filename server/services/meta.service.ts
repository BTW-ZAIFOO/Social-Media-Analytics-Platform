import type { CampaignPayload } from '../types';

export async function getMetaCampaigns(): Promise<CampaignPayload[]> {
  return [
    {
      name: 'Meta Awareness Push',
      platform: 'Meta',
      spend: 1200,
      revenue: 2600,
      impressions: 120000,
      clicks: 3400,
      conversions: 120,
      date: '2026-04-10',
    },
    {
      name: 'Meta Retargeting Sprint',
      platform: 'Meta',
      spend: 850,
      revenue: 1700,
      impressions: 86000,
      clicks: 2100,
      conversions: 80,
      date: '2026-04-12',
    },
  ];
}
