"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const data_fetcher_controller_1 = require("../controllers/data-fetcher.controller");
const router = (0, express_1.Router)();
// Manually trigger data fetch for all accounts
router.post("/fetch-all", data_fetcher_controller_1.fetchAllAccountsDataHandler);
// Manually trigger data fetch for a specific account
router.post("/:accountId/fetch", data_fetcher_controller_1.fetchAccountDataHandler);
// Get detail data for a platform
router.get("/platform/:platform/details", data_fetcher_controller_1.getPlatformDetailHandler);
// Get all posts for an account
router.get("/:accountId/posts", data_fetcher_controller_1.getPostsHandler);
// Get metrics for an account
router.get("/:accountId/metrics", data_fetcher_controller_1.getMetricsHandler);
exports.default = router;
