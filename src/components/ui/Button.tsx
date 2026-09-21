"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "accent";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  external?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  withArrow?: boolean;
  arrowType?: "diagonal" | "horizontal";
  arrow?: "diagonal" | "horizontal" | "none";
  magnetic?: boolean;
  loading?: boolean;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[#111111] text-[#FFFFFF] hover:bg-[#222222] active:scale-[0.98] border border-[#111111] shadow-xs",
  secondary:
    "bg-[#FFFFFF] text-[#111111] border border-[#E5E5E2] hover:bg-[#F0F0ED] hover:border-[#D8D8D4] active:scale-[0.98] shadow-xs",
  outline:
    "bg-transparent text-[#111111] border border-[#E5E5E2] hover:border-[#D8D8D4] hover:bg-[#F0F0ED] active:scale-[0.98]",
  ghost:
    "bg-transparent text-[#555555] hover:text-[#111111] hover:bg-[#F0F0ED] active:scale-[0.98]",
  accent:
    "bg-[#1400FF] text-[#FFFFFF] hover:bg-[#1000CC] active:scale-[0.98] shadow-[0_2px_12px_rgba(20,0,255,0.25)] border border-[#1400FF]",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "text-xs font-medium px-3.5 h-8 gap-1.5 rounded-full",
  md: "text-sm font-medium px-5 h-10 gap-2 rounded-full",
  lg: "text-base font-medium px-7 h-12 gap-2.5 rounded-full",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      href,
      external = false,
      leftIcon,
      rightIcon,
      withArrow = false,
      arrowType = "diagonal",
      arrow = "none",
      magnetic = false,
      loading = false,
      disabled = false,
      children,
      ...props
    },
    ref
  ) => {
    const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent) => {
      if (!magnetic || disabled || loading) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - (rect.left + rect.width / 2)) * 0.2;
      const y = (e.clientY - (rect.top + rect.height / 2)) * 0.2;
      setMouseOffset({ x, y });
    };

    const handleMouseLeave = () => {
      if (!magnetic) return;
      setMouseOffset({ x: 0, y: 0 });
    };

    const baseClasses = cn(
      "group relative inline-flex items-center justify-center select-none font-sans font-medium",
      "transition-all duration-200 ease-out cursor-pointer",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1400FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7F7F5]",
      "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
      variantStyles[variant],
      sizeStyles[size],
      className
    );

    const magneticStyle = magnetic
      ? {
          transform: `translate3d(${mouseOffset.x}px, ${mouseOffset.y}px, 0)`,
          transition: mouseOffset.x === 0 ? "transform 0.3s ease-out" : "transform 0.1s ease-out",
        }
      : undefined;

    const showArrow = withArrow || arrow === "diagonal" || arrow === "horizontal";
    const resolvedArrowType = withArrow ? arrowType : arrow === "none" ? arrowType : arrow;

    const arrowIcon =
      resolvedArrowType === "diagonal" ? (
        <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0" />
      ) : (
        <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1 shrink-0" />
      );

    const content = (
      <>
        {loading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0 mr-1" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!loading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
        {!loading && showArrow && !rightIcon && arrowIcon}
      </>
    );

    if (href && !disabled) {
      if (external) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={baseClasses}
            style={magneticStyle}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={props.onClick as unknown as React.MouseEventHandler<HTMLAnchorElement>}
          >
            {content}
          </a>
        );
      }
      return (
        <Link
          href={href}
          className={baseClasses}
          style={magneticStyle}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={props.onClick as unknown as React.MouseEventHandler<HTMLAnchorElement>}
        >
          {content}
        </Link>
      );
    }

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading}
        className={baseClasses}
        style={magneticStyle}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = "Button";
