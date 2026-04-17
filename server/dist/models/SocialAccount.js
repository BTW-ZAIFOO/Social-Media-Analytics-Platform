"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const socialAccountSchema = new mongoose_1.default.Schema({
    platform: {
        type: String,
        enum: ["facebook", "instagram", "tiktok", "whatsapp", "linkedin"],
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    profileUrl: {
        type: String,
        required: function () {
            return this.platform !== "whatsapp";
        },
    },
    phoneNumber: {
        type: String,
        required: function () {
            return this.platform === "whatsapp";
        },
    },
    followers: {
        type: Number,
        default: 0,
    },
    engagement: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("SocialAccount", socialAccountSchema);
