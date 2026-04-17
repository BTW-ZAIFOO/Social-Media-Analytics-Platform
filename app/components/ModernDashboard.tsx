"use client";

import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import AddAccountModal from "./AddAccountModal";
import PlatformCard from "./PlatformCard";
import type {
  SocialAccount,
  DashboardMetrics,
  PlatformDetail,
  SocialPost,
  SocialPlatform,
} from "@/app/types/social";
import {
  getSocialAccounts,
  getDashboardMetrics,
  deleteSocialAccount,
  getPlatformDetail,
} from "@/app/services/social-api";

export default function ModernDashboard() {
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [selectedPlatform, setSelectedPlatform] =
    useState<SocialPlatform | null>(null);
  const [platformDetail, setPlatformDetail] = useState<PlatformDetail | null>(
    null,
  );
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadData() {
    try {
      setError(null);
      console.log("Loading accounts and metrics...");

      const [accountsData, metricsData] = await Promise.all([
        getSocialAccounts(),
        getDashboardMetrics(),
      ]);

      console.log("Accounts:", accountsData);
      console.log("Metrics:", metricsData);

      setAccounts(accountsData);
      setMetrics(metricsData);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load data";
      console.error("Error loading data:", err);
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleDeleteAccount(id: string) {
    try {
      await deleteSocialAccount(id);
      await loadData();
      if (selectedPlatform) {
        await handlePlatformSelect(selectedPlatform);
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete account";
      console.error("Failed to delete account:", error);
      setError(message);
    }
  }

  async function handlePlatformSelect(platform: SocialPlatform) {
    setSelectedPlatform(platform);
    setDetailLoading(true);
    setDetailError(null);

    try {
      const detailData = await getPlatformDetail(platform);
      setPlatformDetail(detailData);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to load platform data";
      setDetailError(message);
    } finally {
      setDetailLoading(false);
    }
  }

  const platformMetricsMap = metrics?.platformMetrics || [];
  const selectedAccounts = accounts.filter(
    (account) => account.platform === selectedPlatform,
  );
  const whatsappNumbers = selectedAccounts
    .map((account) => account.phoneNumber)
    .filter(
      (number): number is string =>
        typeof number === "string" && number.trim().length > 0,
    );

  const detailPosts: SocialPost[] = platformDetail?.posts || [];

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-900">
                Social Analytics
              </h1>
              <p className="mt-1 text-slate-600">
                Track performance, posts, growth and platform activity.
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="rounded-2xl bg-linear-to-r from-blue-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white transition hover:from-blue-700 hover:to-purple-700 hover:shadow-lg active:scale-95"
            >
              + Add Account
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="rounded-2xl bg-red-50 border border-red-200 p-4">
            <p className="text-sm text-red-700">{error}</p>
            <button
              onClick={() => setError(null)}
              className="mt-2 text-xs text-red-600 hover:text-red-700 underline"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-6 py-12 space-y-8">
        {/* Top summary */}
        <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                Total Followers
              </p>
              <p className="mt-2 text-4xl font-bold text-slate-900">
                {metrics?.totalFollowers ?? 0}
              </p>
              <p className="mt-1 text-xs text-slate-600">
                Across all platforms
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                Avg Engagement
              </p>
              <p className="mt-2 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-slate-900">
                  {metrics?.totalEngagement.toFixed(1) ?? "0.0"}
                </span>
                <span className="text-lg text-slate-600">%</span>
              </p>
              <p className="mt-1 text-xs text-slate-600">Average rate</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                Connected Accounts
              </p>
              <p className="mt-2 text-4xl font-bold text-slate-900">
                {metrics?.totalAccounts ?? 0}
              </p>
              <p className="mt-1 text-xs text-slate-600">Active profiles</p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
              Platform Growth
            </p>
            <div className="mt-6 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={
                    metrics?.platformMetrics.map((item) => ({
                      platform: item.platform,
                      followers: item.totalFollowers,
                      engagement: Number(item.totalEngagement.toFixed(1)),
                    })) ?? []
                  }
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="platform" tick={{ fill: "#475569" }} />
                  <YAxis tick={{ fill: "#475569" }} />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="followers"
                    fill="#4338ca"
                    radius={[12, 12, 0, 0]}
                  />
                  <Bar
                    dataKey="engagement"
                    fill="#0ea5e9"
                    radius={[12, 12, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Platform cards */}
        <div className="grid gap-6 lg:grid-cols-3">
          {platformMetricsMap.map((pm) => (
            <PlatformCard
              key={pm.platform}
              metrics={pm}
              onSelect={() => handlePlatformSelect(pm.platform)}
              onDelete={() => {
                const account = accounts.find(
                  (a) => a.platform === pm.platform,
                );
                if (account && (account.id || account._id)) {
                  handleDeleteAccount(account.id || account._id!);
                }
              }}
            />
          ))}
        </div>

        {/* Selected platform detail */}
        {selectedPlatform && (
          <div className="rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  {selectedPlatform.charAt(0).toUpperCase() +
                    selectedPlatform.slice(1)}{" "}
                  Details
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Tap a platform card to view recent posts, contact info, and
                  growth trends.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedPlatform(null);
                  setPlatformDetail(null);
                }}
                className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Clear Detail
              </button>
            </div>

            {detailError && (
              <div className="mt-6 rounded-3xl bg-red-50 p-4 text-sm text-red-700 ring-1 ring-red-200">
                {detailError}
              </div>
            )}

            {detailLoading ? (
              <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-600">
                <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600"></div>
                Fetching platform detail...
              </div>
            ) : platformDetail ? (
              <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
                <div className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                      <p className="text-xs uppercase tracking-wide text-slate-600">
                        Total Posts
                      </p>
                      <p className="mt-3 text-3xl font-bold text-slate-900">
                        {platformDetail.metrics.totalPosts}
                      </p>
                    </div>
                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                      <p className="text-xs uppercase tracking-wide text-slate-600">
                        Average Engagement
                      </p>
                      <p className="mt-3 text-3xl font-bold text-slate-900">
                        {platformDetail.metrics.averageEngagement.toFixed(1)}%
                      </p>
                    </div>
                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                      <p className="text-xs uppercase tracking-wide text-slate-600">
                        Total Likes
                      </p>
                      <p className="mt-3 text-3xl font-bold text-slate-900">
                        {platformDetail.metrics.totalLikes}
                      </p>
                    </div>
                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                      <p className="text-xs uppercase tracking-wide text-slate-600">
                        Total Views
                      </p>
                      <p className="mt-3 text-3xl font-bold text-slate-900">
                        {platformDetail.metrics.totalViews}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-slate-200 bg-white p-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-slate-900">
                        Growth Trend
                      </h3>
                      <span className="text-sm text-slate-500">
                        Last {platformDetail.metrics.trend.length} days
                      </span>
                    </div>
                    <div className="mt-5 h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={platformDetail.metrics.trend.map((point) => ({
                            date: point.date,
                            value: point.likes,
                          }))}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#e2e8f0"
                          />
                          <XAxis dataKey="date" tick={{ fill: "#475569" }} />
                          <YAxis tick={{ fill: "#475569" }} />
                          <Tooltip />
                          <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#2563eb"
                            strokeWidth={3}
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                    <h3 className="text-lg font-semibold text-slate-900">
                      Platform Contacts
                    </h3>
                    <p className="mt-2 text-sm text-slate-600">
                      WhatsApp numbers and account links.
                    </p>
                    <div className="mt-4 space-y-3">
                      {whatsappNumbers.length > 0 ? (
                        whatsappNumbers.map((number) => (
                          <div
                            key={number}
                            className="rounded-2xl bg-white p-3 shadow-sm"
                          >
                            <p className="text-sm text-slate-900">{number}</p>
                            <a
                              href={`https://wa.me/${number.replace(/\D+/g, "")}`}
                              target="_blank"
                              rel="noreferrer"
                              className="mt-1 inline-block text-xs font-semibold text-blue-600 hover:underline"
                            >
                              Open WhatsApp
                            </a>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-slate-500">
                          No WhatsApp contact saved for this platform.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="rounded-3xl border border-slate-200 bg-white p-6">
                    <h3 className="text-lg font-semibold text-slate-900">
                      Recent Posts
                    </h3>
                    <div className="mt-4 space-y-4">
                      {detailPosts.length === 0 ? (
                        <p className="text-sm text-slate-500">
                          No post tracking data available yet.
                        </p>
                      ) : (
                        detailPosts.map((post) => (
                          <div
                            key={post.postId}
                            className="rounded-3xl border border-slate-200 bg-slate-50 p-4"
                          >
                            <div className="flex items-center justify-between gap-4">
                              <p className="text-sm font-semibold text-slate-900">
                                {post.content.slice(0, 60)}
                                {post.content.length > 60 ? "..." : ""}
                              </p>
                              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                                {new Date(post.postedAt).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="mt-3 grid grid-cols-2 gap-3 text-sm text-slate-600">
                              <span>Likes: {post.likes}</span>
                              <span>Comments: {post.comments}</span>
                              <span>Shares: {post.shares}</span>
                              <span>Views: {post.views}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-8 text-slate-600">
                Select a platform card to view posts and growth charts.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      <AddAccountModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          setIsModalOpen(false);
          loadData();
        }}
      />
    </div>
  );
}
