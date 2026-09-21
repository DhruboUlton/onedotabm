import React from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant =
  | "default"
  | "subtle"
  | "outline"
  | "accent"
  | "dark"
  | "success"
  | "warning";

export type BadgeSize = "sm" | "md" | "lg";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  pulse?: boolean;
  uppercase?: boolean;
  icon?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-[#F0F0ED] text-[#555555] border-[#E5E5E2]",
  subtle: "bg-[#F0F0ED] text-[#555555] border-[#E5E5E2]",
  outline: "bg-transparent text-[#555555] border-[#E5E5E2]",
  accent: "bg-[rgba(20,0,255,0.06)] text-[#1400FF] border-[rgba(20,0,255,0.18)]",
  dark: "bg-[#111111] text-white border-[#111111]",
  success: "bg-emerald-50 text-emerald-700 border-emerald-200",
  warning: "bg-amber-50 text-amber-700 border-amber-200",
};

const dotColors: Record<BadgeVariant, string> = {
  default: "bg-[#858585]",
  subtle: "bg-[#858585]",
  outline: "bg-[#858585]",
  accent: "bg-[#1400FF]",
  dark: "bg-white",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "text-[10px] py-0.5 px-2 gap-1.5",
  md: "text-xs py-1 px-2.5 gap-1.5",
  lg: "text-sm py-1.5 px-3.5 gap-2",
};

export function Badge({
  className,
  variant = "default",
  size = "md",
  dot = false,
  pulse = false,
  uppercase = true,
  icon,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center font-mono font-medium rounded-full border transition-colors",
        uppercase && "uppercase tracking-wider",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span className="relative flex h-1.5 w-1.5 shrink-0">
          {pulse && (
            <span
              className={cn(
                "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
                dotColors[variant]
              )}
            />
          )}
          <span
            className={cn("relative inline-flex rounded-full h-1.5 w-1.5", dotColors[variant])}
          />
        </span>
      )}
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
}
