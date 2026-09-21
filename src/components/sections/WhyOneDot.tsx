"use client";

import React, { useState } from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WHY_ONEDOT_PILLARS } from "@/data";
import { Check, X, Zap, ShieldCheck } from "lucide-react";

export function WhyOneDot() {
  const [activePillarIndex, setActivePillarIndex] = useState(0);
  const activePillar = WHY_ONEDOT_PILLARS[activePillarIndex];

  return (
    <section id="why-onedot" className="py-20 md:py-28 bg-[#FFFFFF] border-b border-[#E5E5E2]">
      <Container>
        {/* Section Heading */}
        <SectionHeading
          label="THE COMMERCIAL ADVANTAGE // WHY ONEDOT"
          badge="ONE ACCOUNTABLE PARTNER"
          badgeVariant="accent"
          title="Why Split Growth Into Two Agencies?"
          highlight="When You Can Have One."
          description="Hiring an ad agency that doesn't understand code, and a web development agency that doesn't understand acquisition, creates broken tracking, slower iterations, and lost revenue."
          className="mb-14"
        />

        {/* 4 Pillars Interactive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          {/* Left Column: Pillar Navigation */}
          <div className="lg:col-span-5 space-y-3">
            {WHY_ONEDOT_PILLARS.map((pillar, idx) => {
              const isSelected = activePillarIndex === idx;

              return (
                <div
                  key={pillar.index}
                  onClick={() => setActivePillarIndex(idx)}
                  className={`p-6 rounded-2xl border transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "bg-[#111111] text-white border-[#111111] shadow-md -translate-y-0.5"
                      : "bg-[#F7F7F5] text-[#111111] border-[#E5E5E2] hover:border-[#111111]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-xs font-mono font-bold ${
                        isSelected ? "text-[#1400FF]" : "text-[#858585]"
                      }`}
                    >
                      PILLAR {pillar.index}
                    </span>
                    <span
                      className={`text-xs font-mono ${
                        isSelected ? "text-neutral-400" : "text-[#858585]"
                      }`}
                    >
                      ADVANTAGE
                    </span>
                  </div>

                  <h3
                    className={`text-lg font-bold tracking-tight mb-1 ${
                      isSelected ? "text-white" : "text-[#111111]"
                    }`}
                  >
                    {pillar.title}
                  </h3>

                  <p
                    className={`text-xs leading-relaxed line-clamp-2 ${
                      isSelected ? "text-neutral-300" : "text-[#555555]"
                    }`}
                  >
                    {pillar.subtitle}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Right Column: Detailed Synergy Matrix for Active Pillar */}
          <div className="lg:col-span-7 sticky top-24">
            <div className="rounded-3xl border border-[#D8D8D4] bg-[#F7F7F5] p-6 sm:p-8 lg:p-10 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#E5E5E2]">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-[#1400FF] bg-[#1400FF]/10 px-2.5 py-1 rounded">
                    PILLAR {activePillar.index}
                  </span>
                  <span className="text-xs font-mono text-[#858585]">
                    THE DISCIPLINE INTERSECTION
                  </span>
                </div>
                <span className="text-xs font-mono text-[#111111] font-semibold">
                  SYNERGY PROOF
                </span>
              </div>

              <h4 className="text-2xl sm:text-3xl font-bold text-[#111111] tracking-tight">
                {activePillar.title}
              </h4>

              <p className="text-base text-[#555555] leading-relaxed">
                {activePillar.description}
              </p>

              {/* Angle Breakdown: Marketing vs Development */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E5E5E2]">
                  <div className="text-xs font-mono font-bold uppercase text-[#1400FF] mb-2 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" />
                    <span>Marketing Perspective</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#555555] leading-relaxed">
                    {activePillar.marketingAngle}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E5E5E2]">
                  <div className="text-xs font-mono font-bold uppercase text-[#111111] mb-2 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Engineering Perspective</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#555555] leading-relaxed">
                    {activePillar.devAngle}
                  </p>
                </div>
              </div>

              {/* Combined Synergy Result Box */}
              <div className="p-5 rounded-2xl bg-[#111111] text-white">
                <div className="text-[11px] font-mono text-[#1400FF] uppercase tracking-wider font-semibold mb-1">
                  The Compound Business Outcome
                </div>
                <div className="text-sm sm:text-base font-semibold text-neutral-100">
                  {activePillar.synergyResult}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comparison Table: The Disconnected Agency Model vs. OneDot ABM */}
        <div className="rounded-3xl border border-[#D8D8D4] bg-[#F7F7F5] overflow-hidden">
          <div className="p-6 sm:p-8 border-b border-[#E5E5E2] bg-[#FAF9F7]">
            <span className="text-xs font-mono uppercase tracking-widest text-[#858585] font-semibold">
              REALITY AUDIT // COMPARATIVE ANALYSIS
            </span>
            <h4 className="text-xl sm:text-2xl font-bold text-[#111111] tracking-tight mt-1">
              Traditional Disconnected Agencies vs. OneDot ABM
            </h4>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-[#E5E5E2] bg-[#FFFFFF] text-[#858585] font-mono uppercase text-[11px]">
                  <th className="py-4 px-6">Growth Dimension</th>
                  <th className="py-4 px-6 text-[#555555]">Disconnected Agencies (Old Way)</th>
                  <th className="py-4 px-6 text-[#1400FF] font-bold">OneDot ABM (Integrated)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E5E2] bg-[#FFFFFF]">
                <tr>
                  <td className="py-4 px-6 font-semibold text-[#111111]">
                    Accountability
                  </td>
                  <td className="py-4 px-6 text-[#555555]">
                    <div className="flex items-center gap-2">
                      <X className="w-4 h-4 text-red-500 shrink-0" />
                      <span>Ad agency blames website; web dev blames ad quality</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-[#111111] font-medium bg-[#1400FF]/5">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#1400FF] shrink-0" />
                      <span>Single partner owns traffic, UX, conversion, and revenue</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-semibold text-[#111111]">
                    Tracking & Attribution
                  </td>
                  <td className="py-4 px-6 text-[#555555]">
                    <div className="flex items-center gap-2">
                      <X className="w-4 h-4 text-red-500 shrink-0" />
                      <span>Fragile client-side scripts easily blocked by browser privacy</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-[#111111] font-medium bg-[#1400FF]/5">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#1400FF] shrink-0" />
                      <span>Direct server-to-server CAPI built natively into web routes</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-semibold text-[#111111]">
                    Iteration Velocity
                  </td>
                  <td className="py-4 px-6 text-[#555555]">
                    <div className="flex items-center gap-2">
                      <X className="w-4 h-4 text-red-500 shrink-0" />
                      <span>Weeks of back-and-forth email chains for simple page updates</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-[#111111] font-medium bg-[#1400FF]/5">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#1400FF] shrink-0" />
                      <span>Ad creative and landing page variants updated in hours</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-semibold text-[#111111]">
                    Focus on Economics
                  </td>
                  <td className="py-4 px-6 text-[#555555]">
                    <div className="flex items-center gap-2">
                      <X className="w-4 h-4 text-red-500 shrink-0" />
                      <span>Vanity likes, impressions, and pretty UI templates</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-[#111111] font-medium bg-[#1400FF]/5">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#1400FF] shrink-0" />
                      <span>Contribution margins, customer acquisition cost (CAC), ROAS</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Container>
    </section>
  );
}
