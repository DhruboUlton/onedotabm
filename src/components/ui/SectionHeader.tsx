import React from "react";
import { cn } from "@/lib/utils";

export interface SectionHeaderProps {
  tag?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  align?: "left" | "center" | "split";
  size?: "sm" | "md" | "lg";
  className?: string;
  tagClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}

const titleSizes = {
  sm: "text-2xl sm:text-3xl font-semibold tracking-tight",
  md: "text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight",
  lg: "text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight",
};

export function SectionHeader({
  tag,
  title,
  description,
  action,
  align = "left",
  size = "md",
  className,
  tagClassName,
  titleClassName,
  descriptionClassName,
}: SectionHeaderProps) {
  if (align === "split") {
    return (
      <div
        className={cn(
          "grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-end pb-8 sm:pb-12 border-b border-[#E5E5E2]",
          className
        )}
      >
        <div className="lg:col-span-7 flex flex-col space-y-4">
          {tag && (
            <div
              className={cn(
                "inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#858585]",
                tagClassName
              )}
            >
              <span className="w-2 h-2 rounded-full bg-[#1400FF]" />
              <span>{tag}</span>
            </div>
          )}
          <h2
            className={cn(
              "text-[#111111] leading-[1.08] font-sans",
              titleSizes[size],
              titleClassName
            )}
          >
            {title}
          </h2>
        </div>

        <div className="lg:col-span-5 flex flex-col justify-end space-y-5">
          {description && (
            <p
              className={cn(
                "text-base sm:text-lg text-[#555555] leading-relaxed",
                descriptionClassName
              )}
            >
              {description}
            </p>
          )}
          {action && <div className="pt-1">{action}</div>}
        </div>
      </div>
    );
  }

  if (align === "center") {
    return (
      <div
        className={cn(
          "flex flex-col items-center text-center max-w-3xl mx-auto space-y-4 pb-8 sm:pb-12",
          className
        )}
      >
        {tag && (
          <div
            className={cn(
              "inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#858585]",
              tagClassName
            )}
          >
            <span className="w-2 h-2 rounded-full bg-[#1400FF]" />
            <span>{tag}</span>
          </div>
        )}
        <h2
          className={cn(
            "text-[#111111] leading-[1.1] font-sans",
            titleSizes[size],
            titleClassName
          )}
        >
          {title}
        </h2>
        {description && (
          <p
            className={cn(
              "text-base sm:text-lg text-[#555555] leading-relaxed max-w-2xl",
              descriptionClassName
            )}
          >
            {description}
          </p>
        )}
        {action && <div className="pt-3">{action}</div>}
      </div>
    );
  }

  // Default: left-aligned
  return (
    <div className={cn("flex flex-col max-w-3xl space-y-4 pb-8 sm:pb-12", className)}>
      {tag && (
        <div
          className={cn(
            "inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#858585]",
            tagClassName
          )}
        >
          <span className="w-2 h-2 rounded-full bg-[#1400FF]" />
          <span>{tag}</span>
        </div>
      )}
      <h2
        className={cn(
          "text-[#111111] leading-[1.1] font-sans",
          titleSizes[size],
          titleClassName
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "text-base sm:text-lg text-[#555555] leading-relaxed",
            descriptionClassName
          )}
        >
          {description}
        </p>
      )}
      {action && <div className="pt-2">{action}</div>}
    </div>
  );
}
