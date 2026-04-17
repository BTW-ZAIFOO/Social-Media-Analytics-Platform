"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchTikTokData = fetchTikTokData;
exports.fetchTikTokRealtime = fetchTikTokRealtime;
exports.getTiktokCampaigns = getTiktokCampaigns;
const mockTikTokPosts = [
    {
        video_id: "tiktok_video_001",
        desc: "POV: You just discovered the future of tech 🚀 #foryou #tech #innovation",
        cover_image_url: "https://via.placeholder.com/500x500?text=TikTok+Post+1",
        digg_count: 12400,
        comment_count: 2340,
        share_count: 5600,
        view_count: 234000,
        create_time: Math.floor((Date.now() - 2 * 24 * 60 * 60 * 1000) / 1000),
    },
    {
        video_id: "tiktok_video_002",
        desc: "This AI feature will BLOW YOUR MIND 🤯 #ai #tech #viral",
        cover_image_url: "https://via.placeholder.com/500x500?text=TikTok+Post+2",
        digg_count: 8900,
        comment_count: 1560,
        share_count: 3200,
        view_count: 156000,
        create_time: Math.floor((Date.now() - 5 * 24 * 60 * 60 * 1000) / 1000),
    },
    {
        video_id: "tiktok_video_003",
        desc: "Reached 100k followers! Thank you all 💜 #grateful #milestone #thankyou",
        cover_image_url: "https://via.placeholder.com/500x500?text=TikTok+Post+3",
        digg_count: 25600,
        comment_count: 4200,
        share_count: 8900,
        view_count: 456000,
        create_time: Math.floor((Date.now() - 10 * 24 * 60 * 60 * 1000) / 1000),
    },
];
async function fetchTikTokData(profileUrl, accessToken) {
    try {
        console.log(`Fetching TikTok data for: ${profileUrl}`);
        const rawPosts = accessToken
            ? await fetchTikTokRealtime(profileUrl, accessToken)
            : mockTikTokPosts;
        const posts = rawPosts.map((post) => {
            const totalEngagement = (post.digg_count ?? 0) +
                (post.comment_count ?? 0) +
                (post.share_count ?? 0);
            return {
                postId: post.video_id,
                content: post.desc || "TikTok post",
                imageUrl: post.cover_image_url,
                videoUrl: post.video_url,
                likes: post.digg_count ?? 0,
                comments: post.comment_count ?? 0,
                shares: post.share_count ?? 0,
                views: post.view_count ?? 0,
                postedAt: new Date((post.create_time ?? 0) * 1000),
                engagementRate: post.view_count
                    ? (totalEngagement / post.view_count) * 100
                    : 0,
            };
        });
        const totalLikes = posts.reduce((sum, p) => sum + p.likes, 0);
        const totalComments = posts.reduce((sum, p) => sum + p.comments, 0);
        const totalShares = posts.reduce((sum, p) => sum + p.shares, 0);
        const totalViews = posts.reduce((sum, p) => sum + p.views, 0);
        return {
            platform: "tiktok",
            accountId: profileUrl,
            followers: accessToken ? 100000 : 100000,
            engagement: totalViews
                ? ((totalLikes + totalComments + totalShares) / totalViews) * 100
                : 0,
            totalPosts: posts.length,
            totalLikes,
            totalComments,
            totalShares,
            totalViews,
            posts,
            lastFetched: new Date(),
        };
    }
    catch (error) {
        console.error("Error fetching TikTok data:", error);
        throw error;
    }
}
async function fetchTikTokRealtime(profileUrl, accessToken) {
    try {
        if (!accessToken) {
            console.warn("TikTok access token not provided, using mock data");
            return mockTikTokPosts;
        }
        const response = await fetch(`https://open.tiktokapis.com/v1/video/list?access_token=${encodeURIComponent(accessToken)}`, {
            cache: "no-store",
        });
        if (!response.ok) {
            throw new Error(`TikTok API error: ${response.statusText}`);
        }
        const data = await response.json();
        if (!Array.isArray(data.data?.videos)) {
            throw new Error("Invalid TikTok API response");
        }
        return data.data.videos.map((item) => ({
            video_id: item.id || item.video_id,
            desc: item.desc || item.title || "",
            cover_image_url: item.cover_image_url || item.thumbnail_url,
            video_url: item.video_url,
            digg_count: Number(item.digg_count ?? item.likes ?? 0),
            comment_count: Number(item.comment_count ?? item.comments ?? 0),
            share_count: Number(item.share_count ?? item.shares ?? 0),
            view_count: Number(item.view_count ?? item.views ?? 0),
            create_time: Number(item.create_time ?? item.created_time ?? Date.now() / 1000),
        }));
    }
    catch (error) {
        console.error("Error in fetchTikTokRealtime:", error);
        return mockTikTokPosts;
    }
}
async function getTiktokCampaigns() {
    return [
        {
            name: "TikTok Viral Series",
            platform: "TikTok",
            spend: 980,
            revenue: 2250,
            impressions: 102000,
            clicks: 2900,
            conversions: 95,
            date: "2026-04-09",
        },
        {
            name: "TikTok Engagement Blast",
            platform: "TikTok",
            spend: 770,
            revenue: 1650,
            impressions: 89000,
            clicks: 2400,
            conversions: 72,
            date: "2026-04-12",
        },
    ];
}
