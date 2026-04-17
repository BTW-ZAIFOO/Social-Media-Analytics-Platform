"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchAllAccountsDataHandler = fetchAllAccountsDataHandler;
exports.fetchAccountDataHandler = fetchAccountDataHandler;
exports.getPlatformDetailHandler = getPlatformDetailHandler;
exports.getPostsHandler = getPostsHandler;
exports.getMetricsHandler = getMetricsHandler;
const data_fetcher_service_1 = require("../services/data-fetcher.service");
const supportedPlatforms = [
    "facebook",
    "instagram",
    "tiktok",
    "whatsapp",
    "linkedin",
];
async function fetchAllAccountsDataHandler(_req, res, next) {
    try {
        await (0, data_fetcher_service_1.fetchAllAccountsData)();
        res.json({
            success: true,
            message: "Fetch completed for all accounts",
        });
    }
    catch (error) {
        next(error);
    }
}
async function fetchAccountDataHandler(req, res, next) {
    try {
        const { accountId } = req.params;
        if (!accountId) {
            res.status(400).json({ error: "Account ID is required" });
            return;
        }
        console.log(`Manually triggering fetch for account: ${accountId}`);
        const stats = await (0, data_fetcher_service_1.fetchAndStoreAccountData)(accountId);
        if (!stats) {
            res.status(404).json({ error: "Account not found or fetch failed" });
            return;
        }
        res.json({
            success: true,
            message: "Data fetch completed successfully",
            data: stats,
        });
    }
    catch (error) {
        next(error);
    }
}
async function getPlatformDetailHandler(req, res, next) {
    try {
        const { platform } = req.params;
        const limit = req.query.limit
            ? parseInt(req.query.limit, 10)
            : 10;
        if (!platform || !supportedPlatforms.includes(platform)) {
            res.status(400).json({ error: "Invalid platform" });
            return;
        }
        const detail = await (0, data_fetcher_service_1.getPlatformDetail)(platform, limit);
        res.json(detail);
    }
    catch (error) {
        next(error);
    }
}
async function getPostsHandler(req, res, next) {
    try {
        const { accountId } = req.params;
        const limit = req.query.limit ? parseInt(req.query.limit) : 10;
        if (!accountId) {
            res.status(400).json({ error: "Account ID is required" });
            return;
        }
        const posts = await (0, data_fetcher_service_1.getAccountPosts)(accountId, limit);
        res.json(posts);
    }
    catch (error) {
        next(error);
    }
}
async function getMetricsHandler(req, res, next) {
    try {
        const { accountId } = req.params;
        if (!accountId) {
            res.status(400).json({ error: "Account ID is required" });
            return;
        }
        const metrics = await (0, data_fetcher_service_1.getAccountMetrics)(accountId);
        if (!metrics) {
            res.status(404).json({ error: "No metrics found for this account" });
            return;
        }
        res.json(metrics);
    }
    catch (error) {
        next(error);
    }
}
