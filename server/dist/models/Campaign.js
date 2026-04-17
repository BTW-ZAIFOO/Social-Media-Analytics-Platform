"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const CampaignSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    platform: {
        type: String,
        required: true,
        enum: ["Meta", "Google", "TikTok"],
    },
    spend: {
        type: Number,
        required: true,
        min: 0,
    },
    revenue: {
        type: Number,
        required: true,
        min: 0,
    },
    impressions: {
        type: Number,
        required: true,
        min: 0,
    },
    clicks: {
        type: Number,
        required: true,
        min: 0,
    },
    conversions: {
        type: Number,
        required: true,
        min: 0,
    },
    date: {
        type: Date,
        required: true,
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
CampaignSchema.virtual("roi").get(function () {
    if (!this.spend) {
        return 0;
    }
    return (this.revenue - this.spend) / this.spend;
});
const CampaignModel = mongoose_1.default.models.Campaign ||
    mongoose_1.default.model("Campaign", CampaignSchema);
exports.default = CampaignModel;
