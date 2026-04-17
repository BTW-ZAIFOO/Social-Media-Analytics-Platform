"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const PostSchema = new mongoose_1.default.Schema({
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
    postId: {
        type: String,
        required: true,
        index: true,
    },
    content: {
        type: String,
        required: true,
    },
    imageUrl: String,
    videoUrl: String,
    likes: {
        type: Number,
        default: 0,
    },
    comments: {
        type: Number,
        default: 0,
    },
    shares: {
        type: Number,
        default: 0,
    },
    views: {
        type: Number,
        default: 0,
    },
    postedAt: {
        type: Date,
        required: true,
    },
    fetchedAt: {
        type: Date,
        default: Date.now,
    },
    engagementRate: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });
const PostModel = mongoose_1.default.models.Post || mongoose_1.default.model("Post", PostSchema);
exports.default = PostModel;
