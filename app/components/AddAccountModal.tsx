"use client";

import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import type { FormEvent } from "react";
import type { SocialPlatform, SocialPreview } from "@/app/types/social";
import {
  addSocialAccount,
  previewSocialAccount,
} from "@/app/services/social-api";

interface AddAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const platforms: { value: SocialPlatform; label: string }[] = [
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "tiktok", label: "TikTok" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "linkedin", label: "LinkedIn" },
];

export default function AddAccountModal({
  isOpen,
  onClose,
  onSuccess,
}: AddAccountModalProps) {
  const [platform, setPlatform] = useState<SocialPlatform>("facebook");
  const [name, setName] = useState("");
  const [profileUrl, setProfileUrl] = useState("");
  const [followers, setFollowers] = useState("");
  const [engagement, setEngagement] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [previewResult, setPreviewResult] = useState<SocialPreview | null>(
    null,
  );
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [lastPreviewedUrl, setLastPreviewedUrl] = useState("");

  const totalLikes = previewResult?.posts.reduce((sum, post) => sum + post.likes, 0) ?? 0;
  const totalComments =
    previewResult?.posts.reduce((sum, post) => sum + post.comments, 0) ?? 0;
  const totalShares =
    previewResult?.posts.reduce((sum, post) => sum + post.shares, 0) ?? 0;
  const totalViews =
    previewResult?.posts.reduce((sum, post) => sum + post.views, 0) ?? 0;
  const averageEngagement =
    previewResult && previewResult.posts.length > 0
      ? previewResult.posts.reduce((sum, post) => sum + post.engagementRate, 0) /
        previewResult.posts.length
      : 0;

  const topPostContent = previewResult?.topPosts[0]?.content ?? "";
  const topPostTopic =
    topPostContent
      .split(" ")
      .slice(0, 5)
      .join(" ")
      .replace(/[^a-zA-Z0-9 ]/g, "")
      .trim() || "your latest topic";

  const postingIdeas = previewResult
    ? [
        `Create one more post like your top performing content by focusing on ${
          topPostContent.toLowerCase().includes("video")
            ? "short video storytelling"
            : "strong visuals and a clear call-to-action"
        }.`,
        `Repurpose your highest engagement post into a quick update or carousel that highlights the same idea in a fresh format.`,
        `Ask your audience a simple question around ${topPostTopic} to drive comments and shares.`,
      ]
    : [];

  useEffect(() => {
    const trimmedUrl = profileUrl.trim();

    if (platform === "whatsapp" || !trimmedUrl) {
      setPreviewError(null);
      setPreviewResult(null);
      setPreviewLoading(false);
      setLastPreviewedUrl("");
      return;
    }

    if (trimmedUrl === lastPreviewedUrl) {
      return;
    }

    const timeoutId = window.setTimeout(async () => {
      setPreviewError(null);
      setPreviewLoading(true);

      try {
        const preview = await previewSocialAccount(trimmedUrl);
        setPreviewResult(preview);
        setLastPreviewedUrl(preview.profileUrl || trimmedUrl);
        setPlatform(preview.platform);
        setName(preview.name || "");
        setFollowers(String(preview.followers ?? ""));
        setEngagement(String(preview.engagement ?? ""));
        setProfileUrl(preview.profileUrl || trimmedUrl);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Unable to preview this account";
        setPreviewError(message);
        setPreviewResult(null);
      } finally {
        setPreviewLoading(false);
      }
    }, 850);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [profileUrl, platform, lastPreviewedUrl]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Validate inputs
    if (!name.trim()) {
      setError("Account name is required");
      return;
    }
    if (platform !== "whatsapp" && !profileUrl.trim()) {
      setError("Profile URL is required");
      return;
    }
    if (platform === "whatsapp" && !phoneNumber.trim()) {
      setError("WhatsApp number is required");
      return;
    }
    if (!followers || Number(followers) < 0) {
      setError("Valid follower count is required");
      return;
    }
    if (!engagement || Number(engagement) < 0 || Number(engagement) > 100) {
      setError("Engagement must be between 0 and 100");
      return;
    }

    setLoading(true);

    try {
      console.log("Submitting account:", {
        platform,
        name,
        profileUrl,
        followers,
        engagement,
      });

      await addSocialAccount({
        platform,
        name,
        profileUrl: profileUrl.trim() || undefined,
        phoneNumber: phoneNumber.trim() || undefined,
        followers: Number(followers),
        engagement: Number(engagement),
      });

      setSuccess(true);
      setTimeout(() => {
        reset();
        onSuccess();
      }, 1000);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to add account";
      console.error("Error adding account:", err);
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setName("");
    setProfileUrl("");
    setPhoneNumber("");
    setFollowers("");
    setEngagement("");
    setError(null);
    setSuccess(false);
    setPreviewResult(null);
    setPreviewError(null);
    setPreviewLoading(false);
    setLastPreviewedUrl("");
    setPlatform("facebook");
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-8 shadow-2xl">
        <h2 className="text-2xl font-bold text-slate-900">Connect Account</h2>
        <p className="mt-2 text-sm text-slate-600">
          Add your social media account to track analytics
        </p>

        {error && (
          <div className="mt-4 rounded-2xl bg-red-50 p-4 text-sm text-red-700 border border-red-200">
            <p className="font-semibold">Error</p>
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="mt-4 rounded-2xl bg-green-50 p-4 text-sm text-green-700 border border-green-200">
            <p className="font-semibold">Success!</p>
            <p>Account added successfully. Refreshing data...</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-900">
              Platform
            </label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value as SocialPlatform)}
              disabled={loading}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100 disabled:opacity-60"
            >
              {platforms.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900">
              Account Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., My Business Account"
              disabled={loading}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100 disabled:opacity-60"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900">
              {platform === "whatsapp" ? "WhatsApp Number" : "Profile URL"}
            </label>
            <input
              type={platform === "whatsapp" ? "tel" : "url"}
              value={platform === "whatsapp" ? phoneNumber : profileUrl}
              onChange={(e) => {
                if (platform === "whatsapp") {
                  setPhoneNumber(e.target.value);
                } else {
                  setProfileUrl(e.target.value);
                }
              }}
              placeholder={
                platform === "whatsapp" ? "+1234567890" : "https://..."
              }
              disabled={loading}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100 disabled:opacity-60"
              required
            />
          </div>

          {platform !== "whatsapp" && (
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              {previewLoading ? (
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
                  <span>Fetching preview for the URL...</span>
                </div>
              ) : previewError ? (
                <div className="text-sm text-amber-700">{previewError}</div>
              ) : previewResult ? (
                <div className="space-y-4">
                  <div className="rounded-3xl bg-white p-4 shadow-sm">
                    <p className="text-xs uppercase tracking-wide text-slate-600">
                      Auto preview
                    </p>
                    <p className="mt-2 text-lg font-semibold text-slate-900">
                      {previewResult.name}
                    </p>
                    <p className="text-sm text-slate-500">
                      {previewResult.platform.toUpperCase()} profile detected
                    </p>
                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-700">
                      <div className="rounded-2xl bg-slate-50 p-3">
                        <p className="text-xs text-slate-500">Followers</p>
                        <p className="mt-1 font-semibold">
                          {previewResult.followers}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-slate-50 p-3">
                        <p className="text-xs text-slate-500">Engagement</p>
                        <p className="mt-1 font-semibold">
                          {previewResult.engagement}%
                        </p>
                      </div>
                      <div className="rounded-2xl bg-slate-50 p-3">
                        <p className="text-xs text-slate-500">Total posts</p>
                        <p className="mt-1 font-semibold">
                          {previewResult.posts.length}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-slate-50 p-3">
                        <p className="text-xs text-slate-500">Average post engagement</p>
                        <p className="mt-1 font-semibold">
                          {averageEngagement.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-3xl bg-white p-4 shadow-sm">
                    <h3 className="text-sm font-semibold text-slate-900">
                      Performance summary
                    </h3>
                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-700">
                      <div className="rounded-2xl bg-slate-50 p-3">
                        <p className="text-xs text-slate-500">Likes</p>
                        <p className="mt-1 font-semibold">{totalLikes}</p>
                      </div>
                      <div className="rounded-2xl bg-slate-50 p-3">
                        <p className="text-xs text-slate-500">Comments</p>
                        <p className="mt-1 font-semibold">{totalComments}</p>
                      </div>
                      <div className="rounded-2xl bg-slate-50 p-3">
                        <p className="text-xs text-slate-500">Shares</p>
                        <p className="mt-1 font-semibold">{totalShares}</p>
                      </div>
                      <div className="rounded-2xl bg-slate-50 p-3">
                        <p className="text-xs text-slate-500">Views</p>
                        <p className="mt-1 font-semibold">{totalViews}</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-3xl bg-white p-4 shadow-sm">
                    <h3 className="text-sm font-semibold text-slate-900">
                      Trending posts
                    </h3>
                    <div className="mt-3 space-y-3">
                      {previewResult.topPosts.length > 0 ? (
                        previewResult.topPosts.map((post) => (
                          <div
                            key={post.postId}
                            className="rounded-2xl border border-slate-200 bg-slate-50 p-3"
                          >
                            <p className="text-sm font-semibold text-slate-900">
                              {post.content.slice(0, 80)}
                              {post.content.length > 80 ? "..." : ""}
                            </p>
                            <p className="mt-2 text-xs text-slate-500">
                              Likes {post.likes} · Comments {post.comments} ·
                              Shares {post.shares}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-slate-500">
                          No trending posts found for this profile.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="rounded-3xl bg-white p-4 shadow-sm">
                    <h3 className="text-sm font-semibold text-slate-900">
                      Real posts from this profile
                    </h3>
                    <p className="mt-2 text-sm text-slate-500">
                      Showing recent posts and engagement metrics fetched from the profile URL.
                    </p>
                    <div className="mt-3 space-y-3">
                      {previewResult.posts.length > 0 ? (
                        previewResult.posts.slice(0, 6).map((post) => (
                          <div
                            key={post.postId}
                            className="rounded-2xl border border-slate-200 bg-slate-50 p-3"
                          >
                            <p className="text-sm font-semibold text-slate-900">
                              {post.content.slice(0, 100)}
                              {post.content.length > 100 ? "..." : ""}
                            </p>
                            <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500">
                              <span>Posted {new Date(post.postedAt).toLocaleDateString()}</span>
                              <span>Likes {post.likes}</span>
                              <span>Comments {post.comments}</span>
                              <span>Shares {post.shares}</span>
                              <span>Views {post.views}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-slate-500">
                          No posts were returned for this profile.
                        </p>
                      )}
                    </div>
                    {previewResult.posts.length > 6 && (
                      <p className="mt-3 text-xs text-slate-500">
                        Showing latest 6 posts. Add the account to track more history.
                      </p>
                    )}
                  </div>

                  <div className="rounded-3xl bg-white p-4 shadow-sm">
                    <h3 className="text-sm font-semibold text-slate-900">
                      Next posting ideas
                    </h3>
                    <div className="mt-3 space-y-2 text-sm text-slate-700">
                      {postingIdeas.map((idea, index) => (
                        <div key={index} className="rounded-2xl bg-slate-50 p-3">
                          <p className="font-semibold text-slate-900">Idea {index + 1}</p>
                          <p className="mt-1 text-slate-600">{idea}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-3xl bg-white p-4 shadow-sm">
                    <h3 className="text-sm font-semibold text-slate-900">
                      Engagement trend
                    </h3>
                    <div className="mt-3 h-44">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={previewResult.trend}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#e2e8f0"
                          />
                          <XAxis dataKey="date" tick={{ fill: "#475569" }} />
                          <YAxis tick={{ fill: "#475569" }} />
                          <Tooltip />
                          <Line
                            type="monotone"
                            dataKey="likes"
                            stroke="#2563eb"
                            strokeWidth={2}
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-500">
                  Paste a social link to auto-fetch profile details and trending
                  post data.
                </p>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-900">
                Followers
              </label>
              <input
                type="number"
                value={followers}
                onChange={(e) => setFollowers(e.target.value)}
                placeholder="0"
                disabled={loading}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100 disabled:opacity-60"
                required
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-900">
                Engagement %
              </label>
              <input
                type="number"
                value={engagement}
                onChange={(e) => setEngagement(e.target.value)}
                placeholder="0"
                step="0.1"
                disabled={loading}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100 disabled:opacity-60"
                required
                min="0"
                max="100"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                reset();
                onClose();
              }}
              disabled={loading}
              className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || success}
              className="flex-1 rounded-2xl bg-linear-to-r from-blue-600 to-purple-600 px-4 py-3 text-sm font-semibold text-white transition hover:from-blue-700 hover:to-purple-700 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Adding...
                </>
              ) : success ? (
                "✓ Added"
              ) : (
                "Add Account"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
