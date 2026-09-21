"use client";

import React from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TESTIMONIALS_DATA } from "@/data";
import { Quote, CheckCircle2 } from "lucide-react";

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 md:py-28 bg-[#F7F7F5] border-b border-[#E5E5E2]">
      <Container>
        {/* Section Heading */}
        <SectionHeading
          label="CLIENT VOICES // AUTHENTIC IMPACT"
          badge="VERIFIED PARTNERSHIPS"
          badgeVariant="subtle"
          title="What Founders & Leaders Say."
          highlight="Direct Experience."
          description="We let our work and client relationships speak for themselves. Here is what business leaders say about working with OneDot ABM."
          className="mb-14"
        />

        {/* Editorial Minimal Grid of Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TESTIMONIALS_DATA.map((t) => (
            <div
              key={t.id}
              className="rounded-3xl border border-[#D8D8D4] bg-[#FFFFFF] p-6 sm:p-8 lg:p-10 flex flex-col justify-between hover:border-[#111111] transition-all duration-300 shadow-2xs"
            >
              <div>
                {/* Quote Icon & Project Tag */}
                <div className="flex items-center justify-between gap-2 mb-6">
                  <Quote className="w-8 h-8 text-[#1400FF]/30" />
                  <span className="text-[11px] font-mono text-[#858585] uppercase tracking-wider">
                    {t.projectType}
                  </span>
                </div>

                {/* Quotation Text */}
                <p className="text-base sm:text-lg text-[#111111] font-normal leading-relaxed mb-8">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              {/* Author & Verified Outcome Footer */}
              <div className="pt-6 border-t border-[#E5E5E2] space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-[#111111] text-base">
                      {t.clientName}
                    </div>
                    <div className="text-xs text-[#555555]">
                      {t.role}, <span className="font-semibold text-[#111111]">{t.company}</span>
                    </div>
                  </div>

                  <span className="text-xs font-mono font-bold text-[#1400FF] bg-[#1400FF]/10 px-2.5 py-1 rounded">
                    VERIFIED
                  </span>
                </div>

                {/* Outcome Pill */}
                <div className="p-3 rounded-xl bg-[#F7F7F5] border border-[#E5E5E2] flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#1400FF] shrink-0" />
                  <span className="text-xs font-mono text-[#111111] font-medium">
                    Outcome: {t.verifiedResult}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
