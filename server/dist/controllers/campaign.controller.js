"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCampaign = exports.updateCampaign = exports.createCampaign = exports.getCampaigns = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Campaign_1 = __importDefault(require("../models/Campaign"));
const helpers_1 = require("../utils/helpers");
const platformOptions = ["Meta", "Google", "TikTok"];
const validateCampaignPayload = (payload) => {
    const requiredFields = [
        "name",
        "platform",
        "spend",
        "revenue",
        "impressions",
        "clicks",
        "conversions",
        "date",
    ];
    for (const field of requiredFields) {
        const value = payload[field];
        if (value === undefined || value === null || value === "") {
            return `Missing required field: ${field}`;
        }
    }
    if (!platformOptions.includes(payload.platform)) {
        return `Platform must be one of: ${platformOptions.join(", ")}`;
    }
    if (isNaN(Number(payload.spend)) ||
        isNaN(Number(payload.revenue)) ||
        isNaN(Number(payload.impressions)) ||
        isNaN(Number(payload.clicks)) ||
        isNaN(Number(payload.conversions))) {
        return "Numeric fields must be valid numbers.";
    }
    const parsedDate = new Date(payload.date);
    if (Number.isNaN(parsedDate.getTime())) {
        return "Invalid date format.";
    }
    return null;
};
const buildCampaignResponse = (campaign) => {
    const objectData = typeof campaign.toObject === "function"
        ? campaign.toObject()
        : campaign;
    return {
        ...objectData,
        roi: (0, helpers_1.calculateROI)(objectData.revenue, objectData.spend),
    };
};
const getCampaigns = async (req, res, next) => {
    try {
        const filter = {};
        const platform = req.query.platform;
        if (platform) {
            filter.platform = platform;
        }
        const campaigns = await Campaign_1.default.find(filter).sort({ date: -1 });
        res.json(campaigns.map(buildCampaignResponse));
    }
    catch (error) {
        next(error);
    }
};
exports.getCampaigns = getCampaigns;
const createCampaign = async (req, res, next) => {
    try {
        const validationError = validateCampaignPayload(req.body);
        if (validationError) {
            return res.status(400).json({ success: false, message: validationError });
        }
        const campaign = new Campaign_1.default({
            ...req.body,
            spend: Number(req.body.spend),
            revenue: Number(req.body.revenue),
            impressions: Number(req.body.impressions),
            clicks: Number(req.body.clicks),
            conversions: Number(req.body.conversions),
            date: new Date(req.body.date),
        });
        await campaign.save();
        res.status(201).json(buildCampaignResponse(campaign));
    }
    catch (error) {
        next(error);
    }
};
exports.createCampaign = createCampaign;
const updateCampaign = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res
                .status(400)
                .json({ success: false, message: "Invalid campaign ID." });
        }
        const validationError = validateCampaignPayload(req.body);
        if (validationError) {
            return res.status(400).json({ success: false, message: validationError });
        }
        const updatedCampaign = await Campaign_1.default.findByIdAndUpdate(id, {
            ...req.body,
            spend: Number(req.body.spend),
            revenue: Number(req.body.revenue),
            impressions: Number(req.body.impressions),
            clicks: Number(req.body.clicks),
            conversions: Number(req.body.conversions),
            date: new Date(req.body.date),
        }, { new: true, runValidators: true });
        if (!updatedCampaign) {
            return res
                .status(404)
                .json({ success: false, message: "Campaign not found." });
        }
        res.json(buildCampaignResponse(updatedCampaign));
    }
    catch (error) {
        next(error);
    }
};
exports.updateCampaign = updateCampaign;
const deleteCampaign = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res
                .status(400)
                .json({ success: false, message: "Invalid campaign ID." });
        }
        const campaign = await Campaign_1.default.findByIdAndDelete(id);
        if (!campaign) {
            return res
                .status(404)
                .json({ success: false, message: "Campaign not found." });
        }
        res.json({ success: true, message: "Campaign deleted successfully." });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteCampaign = deleteCampaign;
