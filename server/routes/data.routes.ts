import { Router } from "express";
import {
  fetchAccountDataHandler,
  fetchAllAccountsDataHandler,
  getPlatformDetailHandler,
  getPostsHandler,
  getMetricsHandler,
} from "../controllers/data-fetcher.controller";

const router = Router();

// Manually trigger data fetch for all accounts
router.post("/fetch-all", fetchAllAccountsDataHandler);

// Manually trigger data fetch for a specific account
router.post("/:accountId/fetch", fetchAccountDataHandler);

// Get detail data for a platform
router.get("/platform/:platform/details", getPlatformDetailHandler);

// Get all posts for an account
router.get("/:accountId/posts", getPostsHandler);

// Get metrics for an account
router.get("/:accountId/metrics", getMetricsHandler);

export default router;
