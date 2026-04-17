import type { Request, Response, NextFunction } from 'express';
import type { SocialPlatform } from '../types/index.ts';
import {
  fetchAndStoreAccountData,
  fetchAllAccountsData,
  getAccountPosts,
  getAccountMetrics,
  getPlatformDetail,
} from '../services/data-fetcher.service.ts';

const supportedPlatforms: SocialPlatform[] = ['facebook', 'instagram', 'tiktok', 'whatsapp', 'linkedin'];

export async function fetchAllAccountsDataHandler(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await fetchAllAccountsData();
    res.json({
      success: true,
      message: 'Fetch completed for all accounts',
    });
  } catch (error) {
    next(error);
  }
}

export async function fetchAccountDataHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { accountId } = req.params;

    if (!accountId) {
      res.status(400).json({ error: 'Account ID is required' });
      return;
    }

    console.log(`Manually triggering fetch for account: ${accountId}`);
    const stats = await fetchAndStoreAccountData(accountId);

    if (!stats) {
      res.status(404).json({ error: 'Account not found or fetch failed' });
      return;
    }

    res.json({
      success: true,
      message: 'Data fetch completed successfully',
      data: stats,
    });
  } catch (error) {
    next(error);
  }
}

export async function getPlatformDetailHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { platform } = req.params as { platform: SocialPlatform };
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;

    if (!platform || !supportedPlatforms.includes(platform)) {
      res.status(400).json({ error: 'Invalid platform' });
      return;
    }

    const detail = await getPlatformDetail(platform, limit);
    res.json(detail);
  } catch (error) {
    next(error);
  }
}

export async function getPostsHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { accountId } = req.params;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

    if (!accountId) {
      res.status(400).json({ error: 'Account ID is required' });
      return;
    }

    const posts = await getAccountPosts(accountId, limit);
    res.json(posts);
  } catch (error) {
    next(error);
  }
}

export async function getMetricsHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { accountId } = req.params;

    if (!accountId) {
      res.status(400).json({ error: 'Account ID is required' });
      return;
    }

    const metrics = await getAccountMetrics(accountId);

    if (!metrics) {
      res.status(404).json({ error: 'No metrics found for this account' });
      return;
    }

    res.json(metrics);
  } catch (error) {
    next(error);
  }
}
