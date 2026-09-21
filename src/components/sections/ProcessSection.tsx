"use client";

import React, { useState } from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { PROCESS_STEPS } from "@/data";
import { CheckCircle2, Clock, ChevronDown, UserCheck } from "lucide-react";

export function ProcessSection() {
  const [expandedStep, setExpandedStep] = useState<string>("01");

  const toggleStep = (step: string) => {
    setExpandedStep((prev) => (prev === step ? "" : step));
  };

  return (
    <section id="process" className="py-20 md:py-28 bg-[#F7F7F5] border-b border-[#E5E5E2]">
      <Container>
        {/* Section Heading */}
        <SectionHeading
          label="HOW WE WORK // EXECUTION TIMELINE"
          badge="STRUCTURED COLLABORATION"
          badgeVariant="subtle"
          title="From Business Discovery to Scaled Launch."
          highlight="Step by Step."
          description="We take clients through a predictable, milestone-driven framework. Every phase has clear deliverables, transparent timelines, and minimal client friction."
          action={
            <Button href="#contact" variant="primary" arrow="horizontal">
              Start Week 1 Discovery
            </Button>
          }
          className="mb-14"
        />

        {/* Editorial Accordion Timeline */}
        <div className="space-y-4 max-w-4xl mx-auto">
          {PROCESS_STEPS.map((step) => {
            const isExpanded = expandedStep === step.step;

            return (
              <div
                key={step.step}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isExpanded
                    ? "bg-[#FFFFFF] border-[#111111] shadow-xs"
                    : "bg-[#FFFFFF]/70 border-[#E5E5E2] hover:border-[#D8D8D4] hover:bg-[#FFFFFF]"
                }`}
              >
                {/* Header Row */}
                <button
                  onClick={() => toggleStep(step.step)}
                  className="w-full text-left p-6 sm:p-8 flex items-center justify-between gap-4 cursor-pointer select-none"
                >
                  <div className="flex items-center gap-4 sm:gap-6">
                    <span
                      className={`text-xl sm:text-2xl font-mono font-bold ${
                        isExpanded ? "text-[#1400FF]" : "text-[#858585]"
                      }`}
                    >
                      {step.step}
                    </span>

                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-mono uppercase tracking-widest text-[#858585] font-semibold">
                          {step.phase}
                        </span>
                        <span className="text-xs text-[#858585] flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {step.duration}
                        </span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-[#111111] tracking-tight">
                        {step.title}
                      </h3>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-3">
                    <span
                      className={`hidden sm:inline-block text-xs font-mono px-3 py-1 rounded-full ${
                        isExpanded
                          ? "bg-[#111111] text-white"
                          : "bg-[#F0F0ED] text-[#555555]"
                      }`}
                    >
                      {isExpanded ? "Active View" : "Details"}
                    </span>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center border transition-transform ${
                        isExpanded
                          ? "border-[#111111] bg-[#111111] text-white rotate-180"
                          : "border-[#E5E5E2] text-[#555555]"
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                </button>

                {/* Expanded Content Drawer */}
                {isExpanded && (
                  <div className="px-6 sm:px-8 pb-8 pt-2 border-t border-[#E5E5E2] space-y-6 animate-in fade-in-50 duration-200">
                    <p className="text-sm sm:text-base text-[#555555] leading-relaxed">
                      {step.description}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                      {/* Deliverables */}
                      <div className="p-4 rounded-xl bg-[#F7F7F5] border border-[#E5E5E2]">
                        <h4 className="text-xs font-mono uppercase tracking-widest text-[#111111] font-semibold mb-3">
                          Phase Deliverables
                        </h4>
                        <ul className="space-y-2">
                          {(step.keyDeliverables ?? step.deliverables ?? []).map((item, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-2 text-xs sm:text-sm text-[#555555]"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#1400FF] shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Client Involvement */}
                      <div className="p-4 rounded-xl bg-[#F7F7F5] border border-[#E5E5E2] flex flex-col justify-between">
                        <div>
                          <h4 className="text-xs font-mono uppercase tracking-widest text-[#111111] font-semibold mb-2 flex items-center gap-1.5">
                            <UserCheck className="w-3.5 h-3.5 text-[#1400FF]" />
                            <span>Client Involvement</span>
                          </h4>
                          <p className="text-xs sm:text-sm text-[#555555] leading-relaxed">
                            {step.clientInvolvement ?? "Review key milestones and approve strategic deliverables."}
                          </p>
                        </div>
                        <div className="pt-4 mt-4 border-t border-[#E5E5E2] text-[11px] font-mono text-[#858585]">
                          Zero wasted meetings. Async reviews & clear milestones.
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
