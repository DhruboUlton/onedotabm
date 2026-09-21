"use client";

import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import {
  Compass,
  Target,
  Code2,
  Rocket,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

interface ProcessStep {
  number: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  explanation: string;
}

const TIMELINE_STEPS: ProcessStep[] = [
  {
    number: "01",
    title: "Discover",
    icon: Compass,
    explanation: "Align on unit economics, commercial targets, and technical requirements.",
  },
  {
    number: "02",
    title: "Strategize",
    icon: Target,
    explanation: "Map acquisition funnels, conversion architecture, and sprint timelines.",
  },
  {
    number: "03",
    title: "Build",
    icon: Code2,
    explanation: "Engineer custom web systems and produce high-converting ad creative.",
  },
  {
    number: "04",
    title: "Launch",
    icon: Rocket,
    explanation: "Deploy infrastructure, configure CAPI telemetry, and activate paid campaigns.",
  },
  {
    number: "05",
    title: "Optimize",
    icon: TrendingUp,
    explanation: "Analyze attribution data, prune inefficient spend, and scale winning assets.",
  },
];

export function ProcessSection() {
  return (
    <section id="process" className="py-16 md:py-24 bg-[#F7F7F5] border-b border-[#E5E5E2]">
      <Container>
        {/* Section Heading */}
        <SectionHeading
          label="HOW WE WORK // EXECUTION TIMELINE"
          badge="STRUCTURED COLLABORATION"
          badgeVariant="subtle"
          title="From Business Discovery to Scaled Launch."
          highlight="Step by Step."
          description="A predictable, milestone-driven framework engineered for speed and transparent delivery."
          action={
            <Button href="/about" variant="outline" arrow="diagonal">
              Explore Complete Process
            </Button>
          }
          className="mb-12"
        />

        {/* Horizontal Visual Timeline (Section 14) */}
        <div className="relative">
          {/* Connecting line on desktop */}
          <div className="absolute top-1/2 left-8 right-8 h-0.5 bg-[#E5E5E2] -translate-y-1/2 hidden lg:block z-0" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 relative z-10">
            {TIMELINE_STEPS.map((step, idx) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.number}
                  className="p-5 rounded-2xl border border-[#E5E5E2] bg-[#FFFFFF] transition-all duration-200 hover:border-[#111111] hover:shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-mono font-bold text-[#1400FF]">
                        {step.number} // STAGE
                      </span>
                      <div className="w-8 h-8 rounded-lg bg-[#F7F7F5] border border-[#E5E5E2] flex items-center justify-center text-[#111111]">
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-[#111111] tracking-tight mb-2">
                      {step.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#555555] leading-relaxed">
                      {step.explanation}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#E5E5E2] flex items-center justify-between text-[11px] font-mono text-[#858585]">
                    <span>Step 0{idx + 1} of 05</span>
                    <span className="text-[#1400FF] font-semibold">Milestone</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
