"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncData = void 0;
const Campaign_1 = __importDefault(require("../models/Campaign"));
const meta_service_1 = require("../services/meta.service");
const google_service_1 = require("../services/google.service");
const tiktok_service_1 = require("../services/tiktok.service");
const helpers_1 = require("../utils/helpers");
const normalizeCampaign = (campaign) => ({
    name: String(campaign.name).trim(),
    platform: campaign.platform,
    spend: Number(campaign.spend || 0),
    revenue: Number(campaign.revenue || 0),
    impressions: Number(campaign.impressions || 0),
    clicks: Number(campaign.clicks || 0),
    conversions: Number(campaign.conversions || 0),
    date: (0, helpers_1.normalizeSyncDate)(campaign.date),
});
const syncData = async (_req, res, next) => {
    try {
        const [metaData, googleData, tiktokData] = await Promise.all([
            (0, meta_service_1.getMetaCampaigns)(),
            (0, google_service_1.getGoogleCampaigns)(),
            (0, tiktok_service_1.getTiktokCampaigns)(),
        ]);
        const allCampaigns = [...metaData, ...googleData, ...tiktokData].map(normalizeCampaign);
        const operations = allCampaigns.map((campaign) => ({
            updateOne: {
                filter: { name: campaign.name, date: campaign.date },
                update: { $set: campaign },
                upsert: true,
            },
        }));
        await Campaign_1.default.bulkWrite(operations, { ordered: false });
        res.json({
            success: true,
            message: "Sync completed successfully.",
            syncedCount: allCampaigns.length,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.syncData = syncData;
