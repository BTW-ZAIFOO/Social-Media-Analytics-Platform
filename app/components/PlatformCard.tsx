"use client";

import type { PlatformMetrics } from "@/app/types/social";
import {
  PlatformIcon,
  getPlatformColor,
  getPlatformGradient,
} from "./PlatformIcon";

interface PlatformCardProps {
  metrics: PlatformMetrics;
  onSelect?: () => void;
  onDelete?: () => void;
}

export default function PlatformCard({
  metrics,
  onSelect,
  onDelete,
}: PlatformCardProps) {
  const growthTrend = metrics.growth >= 0 ? "📈" : "📉";

  return (
    <div
      role={onSelect ? "button" : undefined}
      tabIndex={onSelect ? 0 : undefined}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (!onSelect) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect();
        }
      }}
      className={`group relative overflow-hidden rounded-3xl bg-linear-to-br ${getPlatformGradient(metrics.platform)} border border-slate-200 p-6 text-left transition hover:border-slate-300 hover:shadow-lg ${onSelect ? "cursor-pointer" : ""}`}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-br from-white/40 to-transparent opacity-0 transition group-hover:opacity-100" />

      <div className="relative z-10">
        {/* Header with platform icon and name */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className={`text-4xl ${getPlatformColor(metrics.platform)}`}>
              <PlatformIcon platform={metrics.platform} size={32} />
            </span>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {metrics.platform.charAt(0).toUpperCase() +
                  metrics.platform.slice(1)}
              </h3>
              <p className="text-xs text-slate-600">
                {metrics.accounts} account(s)
              </p>
            </div>
          </div>
          {onDelete && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onDelete();
              }}
              className="text-slate-400 transition hover:text-red-500"
              title="Remove account"
            >
              ✕
            </button>
          )}
        </div>

        {/* Metrics grid */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
              Followers
            </p>
            <p className="mt-1 text-2xl font-bold text-slate-900">
              {metrics.totalFollowers > 999999
                ? (metrics.totalFollowers / 1000000).toFixed(1) + "M"
                : metrics.totalFollowers > 999
                  ? (metrics.totalFollowers / 1000).toFixed(1) + "K"
                  : metrics.totalFollowers}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
              Engagement
            </p>
            <p className="mt-1 flex items-baseline gap-1">
              <span className="text-2xl font-bold text-slate-900">
                {metrics.totalEngagement.toFixed(1)}
              </span>
              <span className="text-xs text-slate-600">%</span>
            </p>
          </div>
        </div>

        {/* Growth indicator */}
        <div className="mt-4 flex items-center gap-2 rounded-2xl bg-white/50 px-3 py-2">
          <span className="text-lg">{growthTrend}</span>
          <span
            className={`text-sm font-semibold ${metrics.growth >= 0 ? "text-green-600" : "text-red-600"}`}
          >
            {metrics.growth >= 0 ? "+" : ""}
            {metrics.growth.toFixed(1)}% growth
          </span>
        </div>
      </div>
    </div>
  );
}
