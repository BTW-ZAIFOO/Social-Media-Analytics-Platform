import type {
  SocialAccount,
  DashboardMetrics,
  PlatformDetail,
  SocialPreview,
} from "@/app/types/social";

export async function getSocialAccounts(): Promise<SocialAccount[]> {
  try {
    const response = await fetch("/api/social/accounts", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("Failed to fetch accounts:", response.status);
      return [];
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching accounts:", error);
    return [];
  }
}

export async function addSocialAccount(
  account: Omit<SocialAccount, "id" | "_id">,
): Promise<SocialAccount> {
  const response = await fetch("/api/social/accounts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(account),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to add account");
  }

  return response.json();
}

export async function deleteSocialAccount(id: string): Promise<void> {
  const response = await fetch(`/api/social/accounts/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error("Failed to delete account");
  }
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  try {
    const response = await fetch("/api/social/metrics", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("Failed to fetch metrics:", response.status);
      return {
        totalFollowers: 0,
        totalEngagement: 0,
        totalAccounts: 0,
        platformMetrics: [],
      };
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching metrics:", error);
    return {
      totalFollowers: 0,
      totalEngagement: 0,
      totalAccounts: 0,
      platformMetrics: [],
    };
  }
}

export async function getPlatformDetail(
  platform: string,
): Promise<PlatformDetail> {
  try {
    const response = await fetch(`/api/data/platform/${platform}/details`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("Failed to fetch platform detail:", response.status);
      return {
        posts: [],
        metrics: {
          platform: platform as any,
          totalFollowers: 0,
          averageEngagement: 0,
          totalPosts: 0,
          totalLikes: 0,
          totalComments: 0,
          totalShares: 0,
          totalViews: 0,
          trend: [],
        },
      };
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching platform detail:", error);
    return {
      posts: [],
      metrics: {
        platform: platform as any,
        totalFollowers: 0,
        averageEngagement: 0,
        totalPosts: 0,
        totalLikes: 0,
        totalComments: 0,
        totalShares: 0,
        totalViews: 0,
        trend: [],
      },
    };
  }
}

export async function previewSocialAccount(
  url: string,
): Promise<SocialPreview> {
  const response = await fetch(
    `/api/social/preview?url=${encodeURIComponent(url)}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || "Failed to preview social account");
  }

  return response.json();
}
