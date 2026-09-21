"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface LoadingScreenProps {
  onComplete?: () => void;
  forceShow?: boolean;
  durationMs?: number;
}

export function LoadingScreen({
  onComplete,
  forceShow = false,
  durationMs = 1300,
}: LoadingScreenProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Check sessionStorage
    const hasSeenLoader = sessionStorage.getItem("onedot_loader_seen");

    if ((hasSeenLoader && !forceShow) || prefersReducedMotion) {
      onComplete?.();
      return;
    }

    const rafId = requestAnimationFrame(() => {
      setIsVisible(true);
    });

    const startTime = performance.now();
    const interval = 16; // ~60fps

    const timer = setInterval(() => {
      const elapsed = performance.now() - startTime;
      const calculated = Math.min(100, Math.round((elapsed / durationMs) * 100));
      setProgress(calculated);

      if (calculated >= 100) {
        clearInterval(timer);
        sessionStorage.setItem("onedot_loader_seen", "true");

        // Trigger exit animation
        setIsExiting(true);

        // Remove from DOM after exit transition
        const exitTimer = setTimeout(() => {
          setIsVisible(false);
          onComplete?.();
        }, 400);

        return () => clearTimeout(exitTimer);
      }
    }, interval);

    return () => {
      cancelAnimationFrame(rafId);
      clearInterval(timer);
    };
  }, [forceShow, durationMs, onComplete]);

  if (!isVisible) return null;

  return (
    <div
      role="status"
      aria-label="Loading OneDot ABM"
      className={cn(
        "fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#F7F7F5] select-none",
        "transition-all duration-400 ease-out",
        isExiting ? "opacity-0 scale-[1.02] pointer-events-none" : "opacity-100 scale-100"
      )}
    >
      <div className="flex flex-col items-center space-y-6">
        {/* Centered Brand Mark with Subtle Pulse */}
        <div className="relative">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border border-[#E5E5E2] bg-white p-2 shadow-xs flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="OneDot ABM Logo"
              width={64}
              height={64}
              className="object-contain"
              priority
            />
          </div>
          <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1400FF] opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#1400FF]" />
          </span>
        </div>

        {/* Wordmark */}
        <div className="flex flex-col items-center space-y-1 text-center">
          <span className="font-sans font-bold text-lg tracking-tight text-[#111111] flex items-center gap-1">
            OneDot <span className="text-[#1400FF]">ABM</span>
          </span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#858585]">
            Marketing & Web Development
          </span>
        </div>

        {/* Progress Bar & Counter */}
        <div className="w-48 flex flex-col items-center space-y-2 pt-2">
          <div className="w-full h-1 bg-[#E5E5E2] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#1400FF] rounded-full transition-all duration-75 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="w-full flex justify-between items-center font-mono text-[10px] text-[#858585]">
            <span>INITIALIZING</span>
            <span>{progress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
