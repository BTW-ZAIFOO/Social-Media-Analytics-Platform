"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadReport = void 0;
const Campaign_1 = __importDefault(require("../models/Campaign"));
const helpers_1 = require("../utils/helpers");
const downloadReport = async (_req, res, next) => {
    try {
        const campaigns = await Campaign_1.default.find({}).sort({ date: -1 });
        const csvData = campaigns.map((campaign) => ({
            name: campaign.name,
            platform: campaign.platform,
            spend: campaign.spend,
            revenue: campaign.revenue,
            impressions: campaign.impressions,
            clicks: campaign.clicks,
            conversions: campaign.conversions,
            date: campaign.date.toISOString().slice(0, 10),
            roi: (0, helpers_1.calculateROI)(campaign.revenue, campaign.spend).toFixed(4),
        }));
        const totals = csvData.reduce((acc, item) => {
            acc.spend += Number(item.spend);
            acc.revenue += Number(item.revenue);
            acc.clicks += Number(item.clicks);
            acc.conversions += Number(item.conversions);
            return acc;
        }, { spend: 0, revenue: 0, clicks: 0, conversions: 0 });
        const totalRoi = (0, helpers_1.calculateROI)(totals.revenue, totals.spend);
        const headers = [
            "name",
            "platform",
            "spend",
            "revenue",
            "impressions",
            "clicks",
            "conversions",
            "date",
            "roi",
        ];
        const csvRows = (0, helpers_1.buildCsv)(csvData, headers);
        const totalsRow = [
            "TOTAL",
            "",
            totals.spend,
            totals.revenue,
            "",
            totals.clicks,
            totals.conversions,
            "",
            totalRoi.toFixed(4),
        ]
            .map((value) => `"${String(value).replace(/"/g, '""')}"`)
            .join(",");
        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", 'attachment; filename="campaign-report.csv"');
        res.send(`${csvRows}\n${totalsRow}`);
    }
    catch (error) {
        next(error);
    }
};
exports.downloadReport = downloadReport;
