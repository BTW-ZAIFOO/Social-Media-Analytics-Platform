import type { SocialPlatform } from '../types/index.ts';
import type { SocialMediaStats } from '../types/social-api.ts';
import SocialAccount from '../models/SocialAccount.ts';
import AccountMetrics from '../models/AccountMetrics.ts';
import Post from '../models/Post.ts';
import { fetchInstagramData } from './instagram.service.ts';
import { fetchFacebookData } from './facebook.service.ts';
import { fetchTikTokData } from './tiktok.service.ts';

export async function fetchAndStoreAccountData(accountId: string): Promise<SocialMediaStats | null> {
  try {
    const account = await SocialAccount.findById(accountId);
    if (!account) {
      console.error(`Account not found: ${accountId}`);
      return null;
    }

    console.log(`Fetching data for ${account.platform} account: ${account.name}`);

    let stats: SocialMediaStats | null = null;

    // Fetch data based on platform
    if (account.platform === 'instagram') {
      stats = await fetchInstagramData(account.profileUrl ?? '', process.env.INSTAGRAM_ACCESS_TOKEN);
    } else if (account.platform === 'facebook') {
      stats = await fetchFacebookData(account.profileUrl ?? '', process.env.FACEBOOK_ACCESS_TOKEN);
    } else if (account.platform === 'tiktok') {
      stats = await fetchTikTokData(account.profileUrl ?? '', process.env.TIKTOK_ACCESS_TOKEN);
    } else {
      console.warn(`Platform not implemented: ${account.platform}`);
      return null;
    }

    if (stats) {
      // Store account metrics
      await AccountMetrics.findOneAndUpdate(
        { accountId: accountId.toString() },
        {
          accountId: accountId.toString(),
          platform: stats.platform,
          followers: stats.followers,
          engagement: stats.engagement,
          totalPosts: stats.totalPosts,
          totalLikes: stats.totalLikes,
          totalComments: stats.totalComments,
          totalShares: stats.totalShares,
          totalViews: stats.totalViews,
          averageEngagementRate: stats.posts.reduce((sum, p) => sum + p.engagementRate, 0) / stats.posts.length,
          fetchedAt: new Date(),
        },
        { upsert: true, new: true }
      );

      // Store posts
      for (const post of stats.posts) {
        await Post.findOneAndUpdate(
          { accountId: accountId.toString(), postId: post.postId },
          {
            accountId: accountId.toString(),
            platform: stats.platform,
            postId: post.postId,
            content: post.content,
            imageUrl: post.imageUrl,
            videoUrl: post.videoUrl,
            likes: post.likes,
            comments: post.comments,
            shares: post.shares,
            views: post.views,
            postedAt: post.postedAt,
            engagementRate: post.engagementRate,
            fetchedAt: new Date(),
          },
          { upsert: true, new: true }
        );
      }

      console.log(`Successfully fetched and stored data for ${account.name}`);
      return stats;
    }

    return null;
  } catch (error) {
    console.error(`Error fetching account data for ${accountId}:`, error);
    throw error;
  }
}

export async function fetchAllAccountsData(): Promise<void> {
  try {
    const accounts = await SocialAccount.find();
    console.log(`Fetching data for ${accounts.length} accounts...`);

    for (const account of accounts) {
      try {
        await fetchAndStoreAccountData(account._id.toString());
      } catch (error) {
        console.error(`Failed to fetch data for account ${account.name}:`, error);
        // Continue with next account
      }
    }

    console.log('Completed fetching data for all accounts');
  } catch (error) {
    console.error('Error fetching all accounts data:', error);
  }
}

export async function getAccountPosts(accountId: string, limit: number = 10) {
  try {
    const posts = await Post.find({ accountId })
      .sort({ postedAt: -1 })
      .limit(limit);
    return posts;
  } catch (error) {
    console.error(`Error fetching posts for account ${accountId}:`, error);
    return [];
  }
}

export async function getAccountMetrics(accountId: string) {
  try {
    const metrics = await AccountMetrics.findOne({ accountId });
    return metrics;
  } catch (error) {
    console.error(`Error fetching metrics for account ${accountId}:`, error);
    return null;
  }
}

export async function getPlatformPosts(platform: SocialPlatform, limit: number = 10) {
  try {
    return await Post.find({ platform })
      .sort({ postedAt: -1 })
      .limit(limit);
  } catch (error) {
    console.error(`Error fetching posts for platform ${platform}:`, error);
    return [];
  }
}

export async function getPlatformMetrics(platform: SocialPlatform) {
  try {
    const posts = await Post.find({ platform });
    const metrics = await AccountMetrics.find({ platform });

    const totalFollowers = metrics.reduce((sum, metric) => sum + metric.followers, 0);
    const averageEngagement = metrics.length
      ? metrics.reduce((sum, metric) => sum + metric.engagement, 0) / metrics.length
      : 0;
    const totalLikes = posts.reduce((sum, post) => sum + post.likes, 0);
    const totalComments = posts.reduce((sum, post) => sum + post.comments, 0);
    const totalShares = posts.reduce((sum, post) => sum + post.shares, 0);
    const totalViews = posts.reduce((sum, post) => sum + post.views, 0);

    const trendMap = new Map<string, { date: string; likes: number; comments: number; shares: number }>();
    for (const post of posts) {
      const day = post.postedAt.toISOString().slice(0, 10);
      const existing = trendMap.get(day);
      if (existing) {
        existing.likes += post.likes;
        existing.comments += post.comments;
        existing.shares += post.shares;
      } else {
        trendMap.set(day, { date: day, likes: post.likes, comments: post.comments, shares: post.shares });
      }
    }

    const trend = Array.from(trendMap.values()).sort((a, b) => a.date.localeCompare(b.date));

    return {
      platform,
      totalFollowers,
      averageEngagement,
      totalPosts: posts.length,
      totalLikes,
      totalComments,
      totalShares,
      totalViews,
      trend,
    };
  } catch (error) {
    console.error(`Error fetching platform metrics for ${platform}:`, error);
    return {
      platform,
      totalFollowers: 0,
      averageEngagement: 0,
      totalPosts: 0,
      totalLikes: 0,
      totalComments: 0,
      totalShares: 0,
      totalViews: 0,
      trend: [],
    };
  }
}

export async function getPlatformDetail(platform: SocialPlatform, limit: number = 10) {
  const posts = await getPlatformPosts(platform, limit);
  const metrics = await getPlatformMetrics(platform);
  return { posts, metrics };
}
