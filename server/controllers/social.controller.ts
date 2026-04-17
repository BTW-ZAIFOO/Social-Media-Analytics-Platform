import type { Request, Response, NextFunction } from 'express';
import SocialAccount from '../models/SocialAccount.ts';
import type { SocialAccountPayload } from '../types/social.ts';
import { fetchSocialPreviewByUrl } from '../services/social-preview.service.ts';

export async function getSocialAccounts(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const accounts = await SocialAccount.find().sort({ createdAt: -1 });
    res.json(accounts);
  } catch (error) {
    next(error);
  }
}

export async function createSocialAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { platform, name, profileUrl, phoneNumber, followers, engagement } = req.body as SocialAccountPayload;

    if (!platform || !name || (platform !== 'whatsapp' && !profileUrl) || (platform === 'whatsapp' && !phoneNumber)) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const normalizedProfileUrl = platform === 'whatsapp'
      ? profileUrl || `https://wa.me/${String(phoneNumber).replace(/\D+/g, '')}`
      : profileUrl;

    const account = new SocialAccount({
      platform,
      name,
      profileUrl: normalizedProfileUrl,
      phoneNumber: phoneNumber || undefined,
      followers: followers || 0,
      engagement: engagement || 0,
    });

    const saved = await account.save();
    res.status(201).json(saved);
  } catch (error) {
    next(error);
  }
}

export async function previewSocialAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const url = Array.isArray(req.query.url) ? req.query.url[0] : req.query.url;
    if (!url || typeof url !== 'string') {
      res.status(400).json({ error: 'Query parameter url is required' });
      return;
    }

    const preview = await fetchSocialPreviewByUrl(url);
    if (!preview) {
      res.status(404).json({ error: 'Unable to preview this social account or platform is not supported' });
      return;
    }

    const topPosts = preview.stats.posts
      .slice()
      .sort((a, b) => (b.likes + b.comments + b.shares) - (a.likes + a.comments + a.shares))
      .slice(0, 5);

    res.json({
      platform: preview.platform,
      name: preview.name,
      profileUrl: preview.stats.accountId,
      followers: preview.stats.followers,
      engagement: preview.stats.engagement,
      posts: preview.stats.posts,
      topPosts,
      trend: preview.stats.posts.map((post) => ({
        date: post.postedAt.toISOString().slice(0, 10),
        likes: post.likes,
        comments: post.comments,
        shares: post.shares,
      })),
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteSocialAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;

    const result = await SocialAccount.findByIdAndDelete(id);
    if (!result) {
      res.status(404).json({ error: 'Account not found' });
      return;
    }

    res.json({ message: 'Account deleted' });
  } catch (error) {
    next(error);
  }
}

export async function getDashboardMetrics(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const accounts = await SocialAccount.find();

    const platformMetricsMap = new Map<string, { followers: number[]; engagement: number[]; count: number }>();

    accounts.forEach((account: any) => {
      if (!platformMetricsMap.has(account.platform)) {
        platformMetricsMap.set(account.platform, { followers: [], engagement: [], count: 0 });
      }

      const metrics = platformMetricsMap.get(account.platform)!;
      metrics.followers.push(account.followers);
      metrics.engagement.push(account.engagement);
      metrics.count += 1;
    });

    const platformMetrics = Array.from(platformMetricsMap.entries()).map(([platform, metrics]) => ({
      platform: platform as any,
      totalFollowers: metrics.followers.reduce((a, b) => a + b, 0),
      totalEngagement: metrics.engagement.reduce((a, b) => a + b, 0) / metrics.count,
      accounts: metrics.count,
      growth: Math.random() * 20 - 5, // Mock growth for demo
    }));

    const totalFollowers = accounts.reduce((sum: number, a: any) => sum + a.followers, 0);
    const totalEngagement = accounts.length > 0 ? accounts.reduce((sum: number, a: any) => sum + a.engagement, 0) / accounts.length : 0;

    res.json({
      totalFollowers,
      totalEngagement,
      totalAccounts: accounts.length,
      platformMetrics,
    });
  } catch (error) {
    next(error);
  }
}
