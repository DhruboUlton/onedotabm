import React from "react";
import Link from "next/link";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MetricChange {
  value: string | number;
  isPositive?: boolean;
  label?: string;
}

export interface AdminMetricCardProps {
  title: string;
  value: string | number;
  change?: MetricChange;
  icon?: React.ReactNode;
  subtitle?: string;
  badge?: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  loading?: boolean;
  className?: string;
  onClick?: () => void;
  href?: string;
}

export function AdminMetricCard({
  title,
  value,
  change,
  icon,
  subtitle,
  badge,
  trend,
  loading = false,
  className,
  onClick,
  href,
}: AdminMetricCardProps) {
  // Determine trend direction
  const resolvedTrend =
    trend ||
    (change !== undefined
      ? change.isPositive === true
        ? "up"
        : change.isPositive === false
        ? "down"
        : "neutral"
      : undefined);

  const cardContent = (
    <div
      className={cn(
        "group relative p-5 sm:p-6 rounded-2xl bg-white border border-[#E5E5E2] hover:border-[#D8D8D4] transition-all duration-200 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between h-full",
        onClick || href ? "cursor-pointer hover:shadow-md" : "",
        className
      )}
      onClick={onClick}
    >
      {/* Top row: Title + Icon / Badge */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex flex-col">
          <span className="font-mono text-[11px] uppercase tracking-wider text-[#858585] font-medium leading-none">
            {title}
          </span>
          {subtitle && (
            <span className="text-xs text-[#555555] mt-1 line-clamp-1">{subtitle}</span>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {badge}
          {icon && (
            <div className="w-10 h-10 rounded-xl bg-[#F7F7F5] border border-[#E5E5E2] flex items-center justify-center text-[#555555] group-hover:text-[#1400FF] group-hover:border-[#1400FF]/30 group-hover:bg-[rgba(20,0,255,0.04)] transition-all">
              {icon}
            </div>
          )}
        </div>
      </div>

      {/* Main value */}
      <div className="my-1">
        {loading ? (
          <div className="h-9 w-28 bg-[#F0F0ED] rounded-lg animate-pulse" />
        ) : (
          <div className="font-mono text-2xl sm:text-3xl font-bold tracking-tight text-[#111111] leading-none">
            {value}
          </div>
        )}
      </div>

      {/* Bottom row: Change indicator / Trend */}
      {change && !loading && (
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#E5E5E2]/60 text-xs">
          <div
            className={cn(
              "inline-flex items-center gap-1 font-mono font-semibold px-2 py-0.5 rounded-md text-[11px]",
              resolvedTrend === "up"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200/80"
                : resolvedTrend === "down"
                ? "bg-rose-50 text-rose-700 border border-rose-200/80"
                : "bg-[#F0F0ED] text-[#555555] border border-[#E5E5E2]"
            )}
          >
            {resolvedTrend === "up" && <TrendingUp className="w-3 h-3 text-emerald-600" />}
            {resolvedTrend === "down" && <TrendingDown className="w-3 h-3 text-rose-600" />}
            {resolvedTrend === "neutral" && <Minus className="w-3 h-3 text-[#858585]" />}
            <span>{change.value}</span>
          </div>

          {change.label && (
            <span className="text-[#858585] text-[11px] truncate">{change.label}</span>
          )}
        </div>
      )}

      {loading && (
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#E5E5E2]/60">
          <div className="h-4 w-16 bg-[#F0F0ED] rounded animate-pulse" />
          <div className="h-4 w-24 bg-[#F0F0ED] rounded animate-pulse" />
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block h-full">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}
