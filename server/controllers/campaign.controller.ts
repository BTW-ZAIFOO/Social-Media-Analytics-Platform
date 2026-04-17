import type { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Campaign from '../models/Campaign.ts';
import { calculateROI } from '../utils/helpers.ts';
import type { CampaignPayload, CampaignDocument } from '../types';

const platformOptions = ['Meta', 'Google', 'TikTok'] as const;

type CampaignBody = Partial<CampaignPayload> & Record<string, unknown>;

const validateCampaignPayload = (payload: CampaignBody): string | null => {
  const requiredFields: Array<keyof CampaignPayload> = [
    'name',
    'platform',
    'spend',
    'revenue',
    'impressions',
    'clicks',
    'conversions',
    'date',
  ];

  for (const field of requiredFields) {
    const value = payload[field];
    if (value === undefined || value === null || value === '') {
      return `Missing required field: ${field}`;
    }
  }

  if (!platformOptions.includes(payload.platform as any)) {
    return `Platform must be one of: ${platformOptions.join(', ')}`;
  }

  if (
    isNaN(Number(payload.spend)) ||
    isNaN(Number(payload.revenue)) ||
    isNaN(Number(payload.impressions)) ||
    isNaN(Number(payload.clicks)) ||
    isNaN(Number(payload.conversions))
  ) {
    return 'Numeric fields must be valid numbers.';
  }

  const parsedDate = new Date(payload.date as string);
  if (Number.isNaN(parsedDate.getTime())) {
    return 'Invalid date format.';
  }

  return null;
};

const buildCampaignResponse = (campaign: CampaignDocument) => {
  const objectData =
    typeof (campaign as any).toObject === 'function'
      ? (campaign as any).toObject()
      : campaign;

  return {
    ...objectData,
    roi: calculateROI(objectData.revenue, objectData.spend),
  };
};

export const getCampaigns = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filter: Record<string, unknown> = {};
    const platform = req.query.platform as string | undefined;

    if (platform) {
      filter.platform = platform;
    }

    const campaigns = await Campaign.find(filter).sort({ date: -1 });
    res.json(campaigns.map(buildCampaignResponse));
  } catch (error) {
    next(error);
  }
};

export const createCampaign = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validationError = validateCampaignPayload(req.body as CampaignBody);
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    const campaign = new Campaign({
      ...(req.body as CampaignPayload),
      spend: Number((req.body as CampaignBody).spend),
      revenue: Number((req.body as CampaignBody).revenue),
      impressions: Number((req.body as CampaignBody).impressions),
      clicks: Number((req.body as CampaignBody).clicks),
      conversions: Number((req.body as CampaignBody).conversions),
      date: new Date((req.body as CampaignBody).date as string),
    });

    await campaign.save();
    res.status(201).json(buildCampaignResponse(campaign));
  } catch (error) {
    next(error);
  }
};

export const updateCampaign = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid campaign ID.' });
    }

    const validationError = validateCampaignPayload(req.body as CampaignBody);
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    const updatedCampaign = await Campaign.findByIdAndUpdate(
      id,
      {
        ...(req.body as CampaignPayload),
        spend: Number((req.body as CampaignBody).spend),
        revenue: Number((req.body as CampaignBody).revenue),
        impressions: Number((req.body as CampaignBody).impressions),
        clicks: Number((req.body as CampaignBody).clicks),
        conversions: Number((req.body as CampaignBody).conversions),
        date: new Date((req.body as CampaignBody).date as string),
      },
      { new: true, runValidators: true }
    );

    if (!updatedCampaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found.' });
    }

    res.json(buildCampaignResponse(updatedCampaign));
  } catch (error) {
    next(error);
  }
};

export const deleteCampaign = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid campaign ID.' });
    }

    const campaign = await Campaign.findByIdAndDelete(id);
    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found.' });
    }

    res.json({ success: true, message: 'Campaign deleted successfully.' });
  } catch (error) {
    next(error);
  }
};
