import React from "react";
import { cn } from "@/lib/utils";

export type AdminBadgeVariant = "success" | "warning" | "error" | "info" | "neutral";
export type AdminBadgeSize = "xs" | "sm" | "md";

export interface AdminBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: AdminBadgeVariant;
  status?: string;
  size?: AdminBadgeSize;
  dot?: boolean;
  ping?: boolean;
  pill?: boolean;
  children?: React.ReactNode;
}

/**
 * Resolves standard database status strings to visual badge variants
 */
export function resolveBadgeVariant(status?: string): AdminBadgeVariant {
  if (!status) return "neutral";
  const s = status.toLowerCase().trim();

  switch (s) {
    // Success states
    case "won":
    case "completed":
    case "published":
    case "paid":
    case "connected":
    case "live":
    case "accepted":
    case "active":
    case "owner":
    case "success":
      return "success";

    // In Progress / Active / Info states
    case "in_progress":
    case "negotiation":
    case "development":
    case "staging":
    case "partially_paid":
    case "scheduled":
    case "admin":
    case "manager":
    case "info":
      return "info";

    // Attention / Warning states
    case "proposal":
    case "qualified":
    case "discovery":
    case "decision":
    case "review":
    case "revision":
    case "sent":
    case "viewed":
    case "warning":
      return "warning";

    // Error / High Priority / Negative states
    case "lost":
    case "cancelled":
    case "overdue":
    case "error":
    case "rejected":
    case "urgent":
    case "high":
      return "error";

    // Neutral / Low states
    case "draft":
    case "new":
    case "contacted":
    case "planning":
    case "todo":
    case "on_hold":
    case "archived":
    case "disconnected":
    case "low":
    case "medium":
    case "maintenance":
    default:
      return "neutral";
  }
}

/**
 * Formats status strings into human-readable labels (e.g., 'in_progress' -> 'In Progress')
 */
export function formatStatusLabel(status: string): string {
  return status
    .replace(/_/g, " ")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

const variantStyles: Record<AdminBadgeVariant, { container: string; dot: string; ping: string }> = {
  success: {
    container: "bg-emerald-50 text-emerald-700 border-emerald-200/90",
    dot: "bg-emerald-500",
    ping: "bg-emerald-400",
  },
  warning: {
    container: "bg-amber-50 text-amber-800 border-amber-200/90",
    dot: "bg-amber-500",
    ping: "bg-amber-400",
  },
  error: {
    container: "bg-rose-50 text-rose-700 border-rose-200/90",
    dot: "bg-rose-500",
    ping: "bg-rose-400",
  },
  info: {
    container: "bg-[rgba(20,0,255,0.06)] text-[#1400FF] border-[rgba(20,0,255,0.2)]",
    dot: "bg-[#1400FF]",
    ping: "bg-[#1400FF]/60",
  },
  neutral: {
    container: "bg-[#F0F0ED] text-[#555555] border-[#E5E5E2]",
    dot: "bg-[#858585]",
    ping: "bg-[#858585]/60",
  },
};

const sizeStyles: Record<AdminBadgeSize, { badge: string; dot: string }> = {
  xs: {
    badge: "text-[9px] px-1.5 py-0.5 tracking-wider gap-1",
    dot: "w-1 h-1",
  },
  sm: {
    badge: "text-[10px] px-2 py-0.5 tracking-wider gap-1.5",
    dot: "w-1.5 h-1.5",
  },
  md: {
    badge: "text-xs px-2.5 py-1 tracking-wide gap-2",
    dot: "w-2 h-2",
  },
};

export function AdminBadge({
  variant,
  status,
  size = "sm",
  dot = true,
  ping = false,
  pill = true,
  children,
  className,
  ...props
}: AdminBadgeProps) {
  const resolvedVariant = variant || resolveBadgeVariant(status);
  const styles = variantStyles[resolvedVariant];
  const sizeConfig = sizeStyles[size];
  const displayContent = children ?? (status ? formatStatusLabel(status) : null);

  return (
    <span
      className={cn(
        "inline-flex items-center font-mono uppercase font-semibold border shrink-0 transition-colors select-none",
        pill ? "rounded-full" : "rounded-md",
        styles.container,
        sizeConfig.badge,
        className
      )}
      {...props}
    >
      {dot && (
        <span className="relative flex shrink-0 items-center justify-center">
          {ping && (
            <span
              className={cn(
                "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
                styles.ping
              )}
            />
          )}
          <span className={cn("relative inline-flex rounded-full", sizeConfig.dot, styles.dot)} />
        </span>
      )}
      <span>{displayContent}</span>
    </span>
  );
}
