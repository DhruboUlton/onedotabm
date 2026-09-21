import React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "./Badge";

interface SectionHeadingProps {
  label?: string;
  badge?: string;
  badgeVariant?: "default" | "accent" | "outline" | "subtle" | "dark";
  title: string;
  highlight?: string;
  description?: string;
  align?: "left" | "center";
  action?: React.ReactNode;
  className?: string;
  titleClassName?: string;
}

export function SectionHeading({
  label,
  badge,
  badgeVariant = "subtle",
  title,
  highlight,
  description,
  align = "left",
  action,
  className,
  titleClassName,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className
      )}
    >
      <div className="flex items-center gap-3 flex-wrap">
        {label && (
          <span className="text-[11px] font-mono tracking-widest uppercase text-[#858585] font-semibold">
            {label}
          </span>
        )}
        {badge && (
          <Badge variant={badgeVariant} dot={badgeVariant === "accent"}>
            {badge}
          </Badge>
        )}
      </div>

      <div
        className={cn(
          "w-full flex flex-col md:flex-row md:items-end justify-between gap-6",
          align === "center" && "md:flex-col md:items-center"
        )}
      >
        <h2
          className={cn(
            "text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-[#111111] leading-[1.12]",
            titleClassName
          )}
        >
          {title}{" "}
          {highlight && <span className="text-[#1400FF]">{highlight}</span>}
        </h2>

        {action && <div className="shrink-0">{action}</div>}
      </div>

      {description && (
        <p
          className={cn(
            "text-base sm:text-lg text-[#555555] leading-relaxed",
            align === "center" ? "max-w-3xl" : "max-w-2xl"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
