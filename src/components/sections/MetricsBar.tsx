"use client";

import React, { useEffect, useRef, useState } from "react";
import { Container } from "@/components/ui/Container";
import { METRICS_DATA } from "@/data";
import { MetricItem } from "@/types";

function MetricCard({ metric }: { metric: MetricItem }) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);

          const duration = 1800; // ms
          const startTime = performance.now();
          const target = metric.value;

          const updateCounter = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(easeProgress * target));

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              setCount(target);
            }
          };

          requestAnimationFrame(updateCounter);
        }
      },
      { threshold: 0.2 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated, metric.value]);

  return (
    <div
      ref={elementRef}
      className="flex flex-col justify-between p-6 sm:p-8 border-b md:border-b-0 md:border-r last:border-r-0 border-[#E5E5E2] bg-[#FFFFFF] transition-colors hover:bg-[#FAF9F7]"
    >
      <div>
        <div className="flex items-baseline text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#111111] font-sans">
          {metric.prefix && (
            <span className="text-3xl sm:text-4xl text-[#555555] mr-1">
              {metric.prefix}
            </span>
          )}
          <span>{hasAnimated ? count : metric.value}</span>
          <span className="text-[#1400FF] font-semibold">{metric.suffix}</span>
        </div>

        <div className="mt-3 text-sm font-semibold tracking-wide uppercase text-[#111111]">
          {metric.label}
        </div>
      </div>

      <p className="mt-4 text-xs sm:text-sm text-[#555555] leading-relaxed">
        {metric.description}
      </p>
    </div>
  );
}

export function MetricsBar() {
  return (
    <section className="py-12 bg-[#F7F7F5] border-b border-[#E5E5E2]">
      <Container>
        {/* Section Context Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-[#E5E5E2] gap-2">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#858585] font-semibold">
            VERIFIED BUSINESS PROOF // TRACK RECORD
          </span>
          <span className="text-xs text-[#555555]">
            Documented client outcomes & performance history
          </span>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 rounded-3xl border border-[#D8D8D4] overflow-hidden shadow-xs">
          {METRICS_DATA.map((item) => (
            <MetricCard key={item.id} metric={item} />
          ))}
        </div>
      </Container>
    </section>
  );
}
