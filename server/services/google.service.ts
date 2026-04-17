import type { CampaignPayload } from "../types";

export async function getGoogleCampaigns(): Promise<CampaignPayload[]> {
  return [
    {
      name: "Google Growth Campaign",
      platform: "Google",
      spend: 1400,
      revenue: 3100,
      impressions: 98000,
      clicks: 2600,
      conversions: 90,
      date: "2026-04-11",
    },
    {
      name: "Google Search Booster",
      platform: "Google",
      spend: 950,
      revenue: 2050,
      impressions: 76000,
      clicks: 1800,
      conversions: 65,
      date: "2026-04-13",
    },
  ];
}
