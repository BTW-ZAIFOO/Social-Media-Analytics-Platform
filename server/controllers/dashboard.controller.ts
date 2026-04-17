import type { Request, Response, NextFunction } from "express";
import Campaign from "../models/Campaign";
import { calculateROI } from "../utils/helpers";

export const getDashboard = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const [overviewResult, platformStats, timeSeries] = await Promise.all([
      Campaign.aggregate([
        {
          $group: {
            _id: null,
            spend: { $sum: "$spend" },
            revenue: { $sum: "$revenue" },
            clicks: { $sum: "$clicks" },
            conversions: { $sum: "$conversions" },
          },
        },
      ]),
      Campaign.aggregate([
        {
          $group: {
            _id: "$platform",
            spend: { $sum: "$spend" },
            revenue: { $sum: "$revenue" },
            clicks: { $sum: "$clicks" },
            conversions: { $sum: "$conversions" },
          },
        },
        {
          $project: {
            _id: 0,
            platform: "$_id",
            spend: 1,
            revenue: 1,
            clicks: 1,
            conversions: 1,
          },
        },
      ]),
      Campaign.aggregate([
        {
          $group: {
            _id: {
              date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
            },
            spend: { $sum: "$spend" },
            revenue: { $sum: "$revenue" },
            clicks: { $sum: "$clicks" },
          },
        },
        {
          $project: {
            _id: 0,
            date: "$_id.date",
            spend: 1,
            revenue: 1,
            clicks: 1,
          },
        },
        {
          $sort: { date: 1 },
        },
      ]),
    ]);

    const overviewData = overviewResult[0] ?? {
      spend: 0,
      revenue: 0,
      clicks: 0,
      conversions: 0,
    };

    const overview = {
      spend: overviewData.spend,
      revenue: overviewData.revenue,
      clicks: overviewData.clicks,
      conversions: overviewData.conversions,
      roi: calculateROI(overviewData.revenue, overviewData.spend),
    };

    res.json({ overview, platformStats, timeSeries });
  } catch (error) {
    next(error);
  }
};
