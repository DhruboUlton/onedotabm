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

          const duration = 1600; // ms
          const startTime = performance.now();
          const target = metric.value;

          const updateCounter = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
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
      className="p-6 sm:p-8 border-b md:border-b-0 md:border-r last:border-r-0 border-[#E5E5E2] bg-[#FFFFFF] transition-colors hover:bg-[#FAF9F7] flex flex-col justify-center"
    >
      <div className="flex items-baseline text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#111111] font-sans">
        {metric.prefix && (
          <span className="text-3xl sm:text-4xl text-[#555555] mr-1">
            {metric.prefix}
          </span>
        )}
        <span>{hasAnimated ? count : metric.value}</span>
        <span className="text-[#1400FF] font-semibold">{metric.suffix}</span>
      </div>

      <div className="mt-2.5 text-xs sm:text-sm font-semibold tracking-wider uppercase text-[#111111] font-mono">
        {metric.label}
      </div>
    </div>
  );
}

export function MetricsBar() {
  return (
    <section className="py-10 bg-[#F7F7F5] border-b border-[#E5E5E2]">
      <Container>
        {/* Section Context Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-[#E5E5E2] gap-2">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#858585] font-semibold">
            VERIFIED BUSINESS PROOF // TRACK RECORD
          </span>
          <span className="text-xs text-[#555555] font-mono">
            Documented client revenue & ad spend outcomes
          </span>
        </div>

        {/* Metrics Grid — Clean, Bold Proof Strip without Long Paragraphs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 rounded-3xl border border-[#D8D8D4] overflow-hidden shadow-xs">
          {METRICS_DATA.map((item) => (
            <MetricCard key={item.id} metric={item} />
          ))}
        </div>
      </Container>
    </section>
  );
}
