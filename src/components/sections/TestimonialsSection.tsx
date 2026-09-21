"use client";

import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Quote, CheckCircle2, ArrowRight } from "lucide-react";

interface TestimonialItem {
  id: string;
  clientName: string;
  role: string;
  company: string;
  projectType: string;
  quote: string;
  verifiedResult: string;
}

const TOP_THREE_TESTIMONIALS: TestimonialItem[] = [
  {
    id: "testimonial-1",
    clientName: "Rafi Ahmed",
    role: "CEO",
    company: "TechStart BD",
    projectType: "Paid Media & Acquisition",
    quote: "Dhrubo transformed our customer acquisition into a 7.2x ROAS system that consistently generates 150+ qualified leads per month.",
    verifiedResult: "7.2x ROAS acquisition system",
  },
  {
    id: "testimonial-2",
    clientName: "Arif Rahman",
    role: "CEO",
    company: "TechStart BD",
    projectType: "E-Commerce Growth",
    quote: "The new acquisition architecture gave us predictable commercial growth and made our Meta ad spend significantly easier to scale.",
    verifiedResult: "Predictable scaling & unit economics",
  },
  {
    id: "testimonial-3",
    clientName: "Nadia Karim",
    role: "Marketing Lead",
    company: "UrbanNest Living",
    projectType: "Paid Ads & CRO",
    quote: "We stopped guessing which products and creatives were working. The rigorous testing process completely changed our commercial return.",
    verifiedResult: "Actionable creative testing pipeline",
  },
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-16 md:py-24 bg-[#F7F7F5] border-b border-[#E5E5E2]">
      <Container>
        {/* Section Heading */}
        <SectionHeading
          label="CLIENT VOICES // AUTHENTIC IMPACT"
          badge="VERIFIED PARTNERSHIPS"
          badgeVariant="subtle"
          title="What Founders & Leaders Say."
          highlight="Direct Experience."
          description="Verified feedback from business leaders scaling customer acquisition and digital infrastructure with OneDot ABM."
          className="mb-12"
        />

        {/* Top 3 High-Impact Testimonial Cards (Section 16) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {TOP_THREE_TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="rounded-3xl border border-[#E5E5E2] bg-[#FFFFFF] p-6 sm:p-7 flex flex-col justify-between transition-all duration-200 hover:border-[#111111] hover:shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <Quote className="w-6 h-6 text-[#1400FF]" />
                  <span className="text-[10px] font-mono text-[#858585] uppercase tracking-wider">
                    {t.projectType}
                  </span>
                </div>

                {/* Concise, readable quote */}
                <p className="text-sm sm:text-base text-[#111111] leading-relaxed mb-6 font-normal">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              {/* Author Info & Verified Outcome */}
              <div className="pt-4 border-t border-[#E5E5E2] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-[#111111] text-sm">
                      {t.clientName}
                    </div>
                    <div className="text-xs text-[#555555]">
                      {t.role}, <span className="font-semibold text-[#111111]">{t.company}</span>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono font-bold text-[#1400FF] bg-[#1400FF]/10 px-2 py-0.5 rounded">
                    VERIFIED
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-[#F7F7F5] border border-[#E5E5E2] flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#1400FF] shrink-0" />
                  <span className="text-[11px] font-mono text-[#111111] font-medium truncate">
                    {t.verifiedResult}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Link to All Testimonials on About Page */}
        <div className="text-center pt-2">
          <Link
            href="/about"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#111111] hover:text-[#1400FF] transition-colors"
          >
            <span>View More Client Feedback on About Page</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
