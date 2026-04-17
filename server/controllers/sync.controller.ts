import type { Request, Response, NextFunction } from "express";
import Campaign from "../models/Campaign";
import { getMetaCampaigns } from "../services/meta.service";
import { getGoogleCampaigns } from "../services/google.service";
import { getTiktokCampaigns } from "../services/tiktok.service";
import { normalizeSyncDate } from "../utils/helpers";
import type { CampaignPayload } from "../types";

const normalizeCampaign = (campaign: CampaignPayload) => ({
  name: String(campaign.name).trim(),
  platform: campaign.platform,
  spend: Number(campaign.spend || 0),
  revenue: Number(campaign.revenue || 0),
  impressions: Number(campaign.impressions || 0),
  clicks: Number(campaign.clicks || 0),
  conversions: Number(campaign.conversions || 0),
  date: normalizeSyncDate(campaign.date),
});

export const syncData = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const [metaData, googleData, tiktokData] = await Promise.all([
      getMetaCampaigns(),
      getGoogleCampaigns(),
      getTiktokCampaigns(),
    ]);

    const allCampaigns = [...metaData, ...googleData, ...tiktokData].map(
      normalizeCampaign,
    );

    const operations = allCampaigns.map((campaign) => ({
      updateOne: {
        filter: { name: campaign.name, date: campaign.date },
        update: { $set: campaign },
        upsert: true,
      },
    }));

    await Campaign.bulkWrite(operations, { ordered: false });

    res.json({
      success: true,
      message: "Sync completed successfully.",
      syncedCount: allCampaigns.length,
    });
  } catch (error) {
    next(error);
  }
};
