import React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  surface?: "white" | "soft" | "transparent";
}

export function Card({
  children,
  className,
  hoverEffect = false,
  surface = "white",
  ...props
}: CardProps) {
  const surfaceClasses = {
    white: "bg-[#FFFFFF] border border-[#E5E5E2]",
    soft: "bg-[#F0F0ED] border border-[#E5E5E2]",
    transparent: "bg-transparent border border-[#E5E5E2]",
  };

  return (
    <div
      className={cn(
        "rounded-2xl transition-all duration-300",
        surfaceClasses[surface],
        hoverEffect &&
          "hover:border-[#D8D8D4] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-0.5",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
