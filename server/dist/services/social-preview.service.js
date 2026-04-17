"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchSocialPreviewByUrl = fetchSocialPreviewByUrl;
const instagram_service_1 = require("./instagram.service");
const facebook_service_1 = require("./facebook.service");
const tiktok_service_1 = require("./tiktok.service");
function detectPlatformFromUrl(url) {
    const normalized = url.toLowerCase();
    if (/instagram\.com/.test(normalized)) {
        return "instagram";
    }
    if (/facebook\.com|fb\.com/.test(normalized)) {
        return "facebook";
    }
    if (/tiktok\.com/.test(normalized)) {
        return "tiktok";
    }
    if (/linkedin\.com/.test(normalized)) {
        return "linkedin";
    }
    if (/whatsapp\.com|wa\.me/.test(normalized)) {
        return "whatsapp";
    }
    return null;
}
function normalizeUrl(url) {
    try {
        return new URL(url).toString();
    }
    catch {
        return url.startsWith("http") ? url : `https://${url}`;
    }
}
function extractNameFromUrl(url) {
    try {
        const parsed = new URL(normalizeUrl(url));
        const segments = parsed.pathname
            .split("/")
            .filter((segment) => segment && segment !== "www");
        if (segments.length > 0) {
            return decodeURIComponent(segments[segments.length - 1]).replace(/[-_]/g, " ");
        }
    }
    catch {
        // ignored
    }
    return "Social Account";
}
function createLinkedInStats(profileUrl) {
    const posts = [
        {
            postId: "li-post-001",
            content: "Professional product update: launching a streamlined analytics workflow.",
            imageUrl: undefined,
            videoUrl: undefined,
            likes: 120,
            comments: 18,
            shares: 12,
            views: 1740,
            postedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            engagementRate: 3.1,
        },
        {
            postId: "li-post-002",
            content: "Driving meaningful growth with data-driven campaigns and team collaboration.",
            imageUrl: undefined,
            videoUrl: undefined,
            likes: 98,
            comments: 16,
            shares: 9,
            views: 1360,
            postedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            engagementRate: 2.8,
        },
        {
            postId: "li-post-003",
            content: "Sharing a leadership playbook for scaling digital marketing teams in 2026.",
            imageUrl: undefined,
            videoUrl: undefined,
            likes: 145,
            comments: 24,
            shares: 15,
            views: 2120,
            postedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
            engagementRate: 3.6,
        },
    ];
    const totalLikes = posts.reduce((sum, post) => sum + post.likes, 0);
    const totalComments = posts.reduce((sum, post) => sum + post.comments, 0);
    const totalShares = posts.reduce((sum, post) => sum + post.shares, 0);
    const totalViews = posts.reduce((sum, post) => sum + post.views, 0);
    return {
        platform: "linkedin",
        accountId: profileUrl,
        followers: 1200,
        engagement: 3.4,
        totalPosts: posts.length,
        totalLikes,
        totalComments,
        totalShares,
        totalViews,
        posts,
        lastFetched: new Date(),
    };
}
async function fetchSocialPreviewByUrl(url) {
    const detectedPlatform = detectPlatformFromUrl(url);
    if (!detectedPlatform || detectedPlatform === "whatsapp") {
        return null;
    }
    const profileUrl = normalizeUrl(url);
    let stats;
    if (detectedPlatform === "instagram") {
        stats = await (0, instagram_service_1.fetchInstagramData)(profileUrl, process.env.INSTAGRAM_ACCESS_TOKEN);
    }
    else if (detectedPlatform === "facebook") {
        stats = await (0, facebook_service_1.fetchFacebookData)(profileUrl, process.env.FACEBOOK_ACCESS_TOKEN);
    }
    else if (detectedPlatform === "tiktok") {
        stats = await (0, tiktok_service_1.fetchTikTokData)(profileUrl, process.env.TIKTOK_ACCESS_TOKEN);
    }
    else {
        stats = createLinkedInStats(profileUrl);
    }
    return {
        platform: detectedPlatform,
        name: extractNameFromUrl(profileUrl),
        stats,
    };
}
