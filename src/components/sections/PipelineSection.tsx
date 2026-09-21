"use client";

import React, { useState } from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { PIPELINE_STEPS } from "@/data";
import {
  Zap,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";

export function PipelineSection() {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const activeStep = PIPELINE_STEPS[activeStepIndex];

  return (
    <section id="pipeline" className="py-20 md:py-28 bg-[#FFFFFF] border-b border-[#E5E5E2] overflow-hidden">
      <Container>
        {/* Section Header */}
        <SectionHeading
          label="SIGNATURE ARCHITECTURE // THE GROWTH LOOP"
          badge="CLOSED-LOOP SYSTEM"
          badgeVariant="accent"
          title="The Closed-Loop Acquisition Machine."
          highlight="From First Ad to Scaled Revenue."
          description="Most companies hire one agency for marketing and another for web development. The result is lost attribution, finger-pointing, and wasted budget. Here is how OneDot ABM connects both into an unbroken growth engine."
          action={
            <Button href="#contact" variant="outline" arrow="diagonal">
              Build Your Acquisition Loop
            </Button>
          }
          className="mb-14"
        />

        {/* The 7-Step Interactive Pipeline Flow Bar */}
        <div className="relative mb-12">
          {/* Horizontal Progress Connector Line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#E5E5E2] -translate-y-1/2 hidden lg:block z-0" />

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 relative z-10">
            {PIPELINE_STEPS.map((step, idx) => {
              const isActive = activeStepIndex === idx;
              const isPast = activeStepIndex > idx;

              return (
                <button
                  key={step.stepNumber}
                  onClick={() => setActiveStepIndex(idx)}
                  className={`group relative text-left p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-[#111111] text-white border-[#111111] shadow-lg scale-105 z-20"
                      : isPast
                      ? "bg-[#FFFFFF] text-[#111111] border-[#1400FF]/40 hover:border-[#1400FF]"
                      : "bg-[#FFFFFF] text-[#555555] border-[#E5E5E2] hover:border-[#111111]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[10px] font-mono font-bold ${
                        isActive
                          ? "text-[#1400FF]"
                          : isPast
                          ? "text-[#1400FF]"
                          : "text-[#858585]"
                      }`}
                    >
                      {step.stepNumber}
                    </span>
                    <span
                      className={`h-2 w-2 rounded-full ${
                        isActive
                          ? "bg-[#1400FF] animate-pulse"
                          : isPast
                          ? "bg-[#1400FF]"
                          : "bg-[#D8D8D4]"
                      }`}
                    />
                  </div>

                  <div
                    className={`text-xs font-mono uppercase tracking-wider font-bold truncate ${
                      isActive ? "text-white" : "text-[#111111]"
                    }`}
                  >
                    {step.phase}
                  </div>

                  <div
                    className={`text-[11px] mt-1 line-clamp-1 ${
                      isActive ? "text-neutral-300" : "text-[#858585]"
                    }`}
                  >
                    {step.title}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Detailed Inspection Showcase Card for Selected Step */}
        <div className="rounded-3xl border border-[#D8D8D4] bg-[#F7F7F5] p-6 sm:p-10 shadow-xs relative overflow-hidden">
          {/* Subtle Ambient Decorative Accent */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#1400FF]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Col: Step Header & Summary */}
            <div className="lg:col-span-7 space-y-5">
              <div className="flex items-center gap-3">
                <span className="text-sm font-mono font-bold text-[#1400FF] bg-[#1400FF]/10 px-3 py-1 rounded-full">
                  PHASE {activeStep.stepNumber} {"//"} {activeStep.phase}
                </span>
                <span className="text-xs font-mono uppercase text-[#858585]">
                  ROLE: {(activeStep.role ?? "marketing").toUpperCase()}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#111111] tracking-tight">
                {activeStep.title}
              </h3>

              <p className="text-base text-[#555555] leading-relaxed">
                {activeStep.summary}
              </p>

              {/* Detail Bullets */}
              <div className="pt-2">
                <div className="text-xs font-mono uppercase tracking-widest text-[#858585] font-semibold mb-3">
                  Key Operational Activities
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {(activeStep.details ?? []).map((detail, dIdx) => (
                    <div
                      key={dIdx}
                      className="flex items-center gap-2 bg-[#FFFFFF] px-3.5 py-2.5 rounded-xl border border-[#E5E5E2] text-xs font-medium text-[#111111]"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#1400FF] shrink-0" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Col: Business Impact Box */}
            <div className="lg:col-span-5 bg-[#FFFFFF] rounded-2xl border border-[#D8D8D4] p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-[#E5E5E2]">
                <Zap className="w-4 h-4 text-[#1400FF]" />
                <span className="text-xs font-mono uppercase tracking-wider font-bold text-[#111111]">
                  Measurable Commercial Impact
                </span>
              </div>

              <div className="text-lg font-semibold text-[#111111] leading-snug">
                &ldquo;{activeStep.impact}&rdquo;
              </div>

              <p className="text-xs text-[#555555] leading-relaxed">
                When this step is executed in direct synchronization with the rest of the pipeline, your business stops leaking ad spend and begins building permanent compounding digital equity.
              </p>

              {/* Quick Pipeline Navigation */}
              <div className="pt-4 border-t border-[#E5E5E2] flex items-center justify-between">
                <button
                  disabled={activeStepIndex === 0}
                  onClick={() => setActiveStepIndex((prev) => Math.max(0, prev - 1))}
                  className="text-xs font-mono text-[#555555] hover:text-[#111111] disabled:opacity-30 cursor-pointer"
                >
                  ← Previous
                </button>
                <span className="text-xs font-mono text-[#858585]">
                  {activeStepIndex + 1} of {PIPELINE_STEPS.length}
                </span>
                <button
                  disabled={activeStepIndex === PIPELINE_STEPS.length - 1}
                  onClick={() =>
                    setActiveStepIndex((prev) => Math.min(PIPELINE_STEPS.length - 1, prev + 1))
                  }
                  className="text-xs font-mono text-[#1400FF] font-semibold hover:underline disabled:opacity-30 cursor-pointer"
                >
                  Next Phase →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Loop Conclusion Banner */}
        <div className="mt-10 p-5 rounded-2xl bg-[#F0F0ED] border border-[#E5E5E2] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#555555]">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-[#1400FF] animate-spin" style={{ animationDuration: "12s" }} />
            <span className="font-semibold text-[#111111]">The OneDot Feedback Advantage:</span>
            <span>Web conversion data directly trains ad algorithms. Ads bring higher-converting traffic back to the web platform.</span>
          </div>
          <Button href="#case-studies" variant="ghost" size="sm" arrow="horizontal">
            See Real Results
          </Button>
        </div>
      </Container>
    </section>
  );
}
