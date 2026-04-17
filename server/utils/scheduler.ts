import { fetchAllAccountsData } from "../services/data-fetcher.service";

let fetchInterval: NodeJS.Timeout | null = null;

export function startScheduler(): void {
  console.log("Starting data fetch scheduler...");

  if (fetchInterval) {
    console.log("Scheduler already running. Skipping restart.");
    return;
  }

  // Fetch all account data every 60 minutes
  fetchInterval = setInterval(
    async () => {
      console.log("[Scheduler] Starting scheduled data fetch...");
      try {
        await fetchAllAccountsData();
        console.log("[Scheduler] Scheduled data fetch completed successfully");
      } catch (error) {
        console.error("[Scheduler] Error during scheduled data fetch:", error);
      }
    },
    60 * 60 * 1000,
  );

  console.log("Scheduler started. Data will be fetched every hour.");
}

export function stopScheduler(): void {
  if (!fetchInterval) {
    console.log("Scheduler is not running.");
    return;
  }

  clearInterval(fetchInterval);
  fetchInterval = null;
  console.log("Scheduler stopped.");
}
