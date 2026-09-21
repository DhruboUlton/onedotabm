"use client";

import React, { useState } from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { INDUSTRIES_DATA } from "@/data";
import { IndustryItem } from "@/types";
import { CheckCircle2, Building2 } from "lucide-react";

export function IndustriesSection() {
  const [activeIndustry, setActiveIndustry] = useState<IndustryItem>(
    INDUSTRIES_DATA[0]
  );

  return (
    <section id="industries" className="py-20 md:py-28 bg-[#FFFFFF] border-b border-[#E5E5E2]">
      <Container>
        {/* Section Heading */}
        <SectionHeading
          label="SECTORS // SPECIALIZED DOMAINS"
          badge="PROVEN PATTERNS"
          badgeVariant="subtle"
          title="Engineered for High-Growth Sectors."
          description="We do not claim to serve every generic niche. We focus on industries where our dual capability in customer acquisition and web systems drives immediate, measurable financial return."
          className="mb-14"
        />

        {/* Typographic List with Interactive Hover Reveal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Typographic Interactive List */}
          <div className="lg:col-span-6 divide-y divide-[#E5E5E2] border-t border-b border-[#E5E5E2]">
            {INDUSTRIES_DATA.map((ind, idx) => {
              const isSelected = activeIndustry.id === ind.id;

              return (
                <div
                  key={ind.id}
                  onClick={() => setActiveIndustry(ind)}
                  onMouseEnter={() => setActiveIndustry(ind)}
                  className={`group py-5 px-4 -mx-4 rounded-xl cursor-pointer transition-all duration-200 flex items-center justify-between gap-4 ${
                    isSelected
                      ? "bg-[#F7F7F5] pl-6 border-l-4 border-l-[#1400FF]"
                      : "hover:bg-[#FAF9F7]"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`text-xs font-mono font-medium ${
                        isSelected ? "text-[#1400FF]" : "text-[#858585]"
                      }`}
                    >
                      {(idx + 1).toString().padStart(2, "0")}
                    </span>

                    <div>
                      <h3
                        className={`text-xl sm:text-2xl font-bold tracking-tight transition-colors ${
                          isSelected
                            ? "text-[#111111]"
                            : "text-[#555555] group-hover:text-[#111111]"
                        }`}
                      >
                        {ind.name}
                      </h3>
                    </div>
                  </div>

                  <span
                    className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                      isSelected
                        ? "bg-[#1400FF] text-white"
                        : "bg-[#F0F0ED] text-[#858585] group-hover:text-[#111111]"
                    }`}
                  >
                    {ind.tag}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Right: Dynamic Industry Dossier & Proof */}
          <div className="lg:col-span-6 sticky top-24">
            <div className="rounded-3xl border border-[#D8D8D4] bg-[#F7F7F5] p-6 sm:p-8 lg:p-10 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#E5E5E2]">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#1400FF]" />
                  <span className="text-xs font-mono uppercase tracking-wider text-[#858585] font-semibold">
                    INDUSTRY BLUEPRINT
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-[#1400FF]">
                  {(activeIndustry.tag ?? activeIndustry.name).toUpperCase()}
                </span>
              </div>

              <h4 className="text-2xl sm:text-3xl font-bold text-[#111111] tracking-tight">
                {activeIndustry.name}
              </h4>

              <p className="text-sm sm:text-base text-[#555555] leading-relaxed">
                {activeIndustry.description}
              </p>

              {/* Verified Case Reference */}
              {activeIndustry.caseReference && (
                <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E5E5E2] flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#858585] block">
                      Verified Case Reference
                    </span>
                    <span className="text-xs font-bold text-[#111111]">
                      {activeIndustry.caseReference}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-[#1400FF] font-semibold">
                    Documented Proof
                  </span>
                </div>
              )}

              {/* Typical System Needs */}
              <div className="space-y-3">
                <span className="text-xs font-mono uppercase tracking-widest text-[#858585] font-semibold block">
                  Core Requirements Solved
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(activeIndustry.typicalNeeds ?? activeIndustry.challengesAddressed ?? []).map((need, nIdx) => (
                    <div
                      key={nIdx}
                      className="flex items-center gap-2 bg-[#FFFFFF] p-2.5 rounded-lg border border-[#E5E5E2] text-xs text-[#555555]"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#1400FF] shrink-0" />
                      <span>{need}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Relevant Services */}
              <div className="pt-2">
                <span className="text-xs font-mono uppercase tracking-widest text-[#858585] font-semibold block mb-2">
                  Integrated Delivery Stack
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(activeIndustry.relevantServices ?? activeIndustry.solutionsProvided ?? []).map((srv, sIdx) => (
                    <span
                      key={sIdx}
                      className="text-xs font-mono px-2.5 py-1 rounded bg-[#FFFFFF] border border-[#E5E5E2] text-[#111111] font-medium"
                    >
                      {srv}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="pt-4 border-t border-[#E5E5E2] flex items-center justify-between">
                <span className="text-xs text-[#555555]">
                  Operating in {activeIndustry.name}?
                </span>
                <Button href="#contact" variant="primary" size="sm" arrow="horizontal">
                  Discuss Strategy
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
