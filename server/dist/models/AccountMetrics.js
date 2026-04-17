"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const AccountMetricsSchema = new mongoose_1.default.Schema({
    accountId: {
        type: String,
        required: true,
        ref: "SocialAccount",
    },
    platform: {
        type: String,
        enum: ["facebook", "instagram", "tiktok", "whatsapp", "linkedin"],
        required: true,
    },
    followers: {
        type: Number,
        default: 0,
    },
    engagement: {
        type: Number,
        default: 0,
    },
    totalPosts: {
        type: Number,
        default: 0,
    },
    totalLikes: {
        type: Number,
        default: 0,
    },
    totalComments: {
        type: Number,
        default: 0,
    },
    totalShares: {
        type: Number,
        default: 0,
    },
    totalViews: {
        type: Number,
        default: 0,
    },
    averageEngagementRate: {
        type: Number,
        default: 0,
    },
    fetchedAt: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });
const AccountMetricsModel = mongoose_1.default.models.AccountMetrics ||
    mongoose_1.default.model("AccountMetrics", AccountMetricsSchema);
exports.default = AccountMetricsModel;
