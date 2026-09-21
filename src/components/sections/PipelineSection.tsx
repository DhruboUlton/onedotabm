"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import {
  Target,
  Sparkles,
  Zap,
  Globe,
  ShoppingCart,
  Database,
  RefreshCw,
  ArrowRight,
} from "lucide-react";

interface PipelineNode {
  number: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  discipline: "MARKETING" | "CROSS-DISCIPLINE" | "WEB ENGINEERING";
  summary: string;
  metric: string;
}

const LOOP_NODES: PipelineNode[] = [
  {
    number: "01",
    label: "Strategy",
    icon: Target,
    discipline: "CROSS-DISCIPLINE",
    summary: "Align ad economics with unit margins and conversion targets.",
    metric: "CAC & LTV Targets",
  },
  {
    number: "02",
    label: "Attention",
    icon: Sparkles,
    discipline: "MARKETING",
    summary: "Deploy direct response creative hooks across Meta and Google.",
    metric: "CTR & Hook Rate",
  },
  {
    number: "03",
    label: "Traffic",
    icon: Zap,
    discipline: "MARKETING",
    summary: "Funnel qualified, high-intent audiences directly to landing pages.",
    metric: "Low CPC & CPCV",
  },
  {
    number: "04",
    label: "Website",
    icon: Globe,
    discipline: "WEB ENGINEERING",
    summary: "Sub-second Next.js pages eliminate load drop-off.",
    metric: "99/100 Lighthouse",
  },
  {
    number: "05",
    label: "Conversion",
    icon: ShoppingCart,
    discipline: "WEB ENGINEERING",
    summary: "Frictionless checkout with instant payment gateways.",
    metric: "High Order Rate",
  },
  {
    number: "06",
    label: "Data",
    icon: Database,
    discipline: "CROSS-DISCIPLINE",
    summary: "Server-side CAPI transmits clean attribution data back to ad algorithms.",
    metric: "100% Attribution",
  },
  {
    number: "07",
    label: "Optimization",
    icon: RefreshCw,
    discipline: "CROSS-DISCIPLINE",
    summary: "Automated scaling of winning hooks and continuous CRO iteration.",
    metric: "Compounding ROAS",
  },
];

export function PipelineSection() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const activeStep = LOOP_NODES[selectedIdx];
  const ActiveIcon = activeStep.icon;

  return (
    <section id="pipeline" className="py-16 md:py-24 bg-[#FFFFFF] border-b border-[#E5E5E2]">
      <Container>
        {/* Section Header */}
        <SectionHeading
          label="SIGNATURE ARCHITECTURE // THE GROWTH LOOP"
          badge="CLOSED-LOOP SYSTEM"
          badgeVariant="accent"
          title="The Closed-Loop Acquisition Machine."
          highlight="From First Ad to Scaled Revenue."
          description="Connecting paid acquisition and custom web engineering into an unbroken commercial engine."
          action={
            <Button href="/about" variant="outline" arrow="diagonal">
              Learn Our Approach
            </Button>
          }
          className="mb-12"
        />

        {/* 7-Step Visual Growth Loop Rail */}
        <div className="relative mb-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {LOOP_NODES.map((node, idx) => {
              const isSelected = selectedIdx === idx;
              const Icon = node.icon;

              return (
                <button
                  key={node.number}
                  onClick={() => setSelectedIdx(idx)}
                  className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? "bg-[#111111] text-white border-[#111111] shadow-md -translate-y-1"
                      : "bg-[#F7F7F5] text-[#111111] border-[#E5E5E2] hover:border-[#111111] hover:bg-[#FFFFFF]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-xs font-mono font-bold ${
                        isSelected ? "text-[#1400FF]" : "text-[#858585]"
                      }`}
                    >
                      {node.number}
                    </span>
                    <Icon className={`w-4 h-4 ${isSelected ? "text-[#1400FF]" : "text-[#555555]"}`} />
                  </div>

                  <div>
                    <h4 className="text-sm font-bold tracking-tight">
                      {node.label}
                    </h4>
                    <span
                      className={`text-[10px] font-mono mt-1 block truncate ${
                        isSelected ? "text-neutral-400" : "text-[#858585]"
                      }`}
                    >
                      {node.discipline}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Focused Compact Node Preview Strip (No Long Essay) */}
        <div className="rounded-2xl border border-[#D8D8D4] bg-[#F7F7F5] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#FFFFFF] border border-[#E5E5E2] flex items-center justify-center text-[#1400FF] shrink-0">
              <ActiveIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-[#1400FF]">
                  PHASE {activeStep.number} // {activeStep.label.toUpperCase()}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FFFFFF] border border-[#E5E5E2] text-[#858585]">
                  {activeStep.discipline}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#555555] mt-1">
                {activeStep.summary}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto">
            <div className="px-3 py-1.5 rounded-lg bg-[#FFFFFF] border border-[#E5E5E2] text-xs font-mono">
              <span className="text-[#858585] mr-1.5">Output:</span>
              <span className="font-bold text-[#111111]">{activeStep.metric}</span>
            </div>
            <Link
              href="/about"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#111111] hover:text-[#1400FF] transition-colors"
            >
              <span>Full Methodology</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
