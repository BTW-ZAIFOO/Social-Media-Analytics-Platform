import mongoose, { Document } from "mongoose";
import type { CampaignPayload } from "../types";

export interface CampaignDocument extends CampaignPayload, Document {
  roi: number;
}

const CampaignSchema = new mongoose.Schema<CampaignDocument>(
  {
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
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

CampaignSchema.virtual("roi").get(function (this: CampaignDocument) {
  if (!this.spend) {
    return 0;
  }

  return (this.revenue - this.spend) / this.spend;
});

const CampaignModel =
  mongoose.models.Campaign ||
  mongoose.model<CampaignDocument>("Campaign", CampaignSchema);
export default CampaignModel;
