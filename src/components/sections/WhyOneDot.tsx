"use client";

import React from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Zap, Database, Clock, TrendingUp } from "lucide-react";

interface AdvantageCard {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  sentence: string;
  tag: string;
}

const ADVANTAGES: AdvantageCard[] = [
  {
    id: "marketing-engineering",
    icon: Zap,
    title: "Marketing + Engineering",
    sentence: "One accountable partner uniting customer acquisition with custom web software.",
    tag: "Single Partner",
  },
  {
    id: "shared-data",
    icon: Database,
    title: "Shared Data",
    sentence: "Direct server-side CAPI telemetry eliminating tracking loss and attribution gaps.",
    tag: "Zero Data Drop-off",
  },
  {
    id: "faster-iteration",
    icon: Clock,
    title: "Faster Iteration",
    sentence: "Ad creatives and landing page variants deployed simultaneously in hours, not weeks.",
    tag: "High Velocity",
  },
  {
    id: "built-for-growth",
    icon: TrendingUp,
    title: "Systems Built for Growth",
    sentence: "Web platforms engineered around commercial unit economics, high LTV, and conversion.",
    tag: "Bottom-Line Impact",
  },
];

export function WhyOneDot() {
  return (
    <section id="why-onedot" className="py-16 md:py-24 bg-[#FFFFFF] border-b border-[#E5E5E2]">
      <Container>
        {/* Section Heading */}
        <SectionHeading
          label="THE COMMERCIAL ADVANTAGE // WHY ONEDOT"
          badge="ONE ACCOUNTABLE PARTNER"
          badgeVariant="accent"
          title="Why Split Growth Into Two Agencies?"
          highlight="When You Can Have One."
          description="Hiring separate marketing and development teams creates broken attribution, finger-pointing, and lost revenue."
          className="mb-12"
        />

        {/* 4 Visual Advantages Cards Grid (Section 13) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {ADVANTAGES.map((adv, idx) => {
            const Icon = adv.icon;

            return (
              <div
                key={adv.id}
                className="p-6 rounded-2xl border border-[#E5E5E2] bg-[#F7F7F5] transition-all duration-200 hover:border-[#111111] hover:bg-[#FFFFFF] hover:shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#FFFFFF] border border-[#E5E5E2] flex items-center justify-center text-[#1400FF]">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono text-[#858585]">
                      0{idx + 1} // ADVANTAGE
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#111111] tracking-tight mb-2">
                    {adv.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#555555] leading-relaxed">
                    {adv.sentence}
                  </p>
                </div>

                <div className="pt-4 mt-5 border-t border-[#E5E5E2]">
                  <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#1400FF] bg-[#1400FF]/10 px-2 py-0.5 rounded">
                    {adv.tag}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
