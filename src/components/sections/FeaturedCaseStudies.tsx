"use client";

import React from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { FEATURED_CASE_STUDIES } from "@/data";
import { CheckCircle2, Award } from "lucide-react";

export function FeaturedCaseStudies() {
  return (
    <section id="case-studies" className="py-20 md:py-28 bg-[#F7F7F5] border-b border-[#E5E5E2]">
      <Container>
        {/* Section Heading */}
        <SectionHeading
          label="CASE STUDIES // VERIFIED PROOF"
          badge="MEASURABLE OUTCOMES"
          badgeVariant="accent"
          title="Documented Client Results."
          highlight="No Vanity Claims."
          description="Every case study is backed by documented ad spend, verified revenue attribution, and real commercial outcomes. Here is how we solved growth bottlenecks for our partners."
          action={
            <Button href="/case-studies" variant="outline" arrow="diagonal">
              Browse All Case Studies
            </Button>
          }
          className="mb-14"
        />

        {/* Editorial Case Study Showcases */}
        <div className="space-y-16">
          {FEATURED_CASE_STUDIES.map((study, index) => {
            const isReversed = index % 2 === 1;

            return (
              <div
                key={study.slug}
                className="rounded-3xl border border-[#D8D8D4] bg-[#FFFFFF] overflow-hidden shadow-xs transition-all hover:border-[#111111]"
              >
                <div
                  className={`grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-10 lg:p-12 items-center`}
                >
                  {/* Content Column */}
                  <div
                    className={`lg:col-span-7 space-y-6 ${
                      isReversed ? "lg:order-2" : "lg:order-1"
                    }`}
                  >
                    {/* Header Tags */}
                    <div className="flex flex-wrap items-center gap-2.5">
                      <Badge variant="accent" dot>
                        {study.client}
                      </Badge>
                      <span className="text-xs font-mono text-[#858585]">
                        {study.industry}
                      </span>
                      <span className="text-xs font-mono text-[#858585]">
                        • {study.period}
                      </span>
                    </div>

                    {/* Case Study Title */}
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#111111]">
                      {study.title}
                    </h3>

                    {/* Challenge & Strategy Split */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div className="p-4 rounded-xl bg-[#F7F7F5] border border-[#E5E5E2]">
                        <span className="text-[11px] font-mono uppercase tracking-widest text-[#858585] font-semibold block mb-1">
                          The Challenge
                        </span>
                        <p className="text-xs text-[#555555] leading-relaxed">
                          {study.challenge}
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-[#F7F7F5] border border-[#E5E5E2]">
                        <span className="text-[11px] font-mono uppercase tracking-widest text-[#1400FF] font-semibold block mb-1">
                          Strategic Solution
                        </span>
                        <p className="text-xs text-[#555555] leading-relaxed">
                          {study.strategy}
                        </p>
                      </div>
                    </div>

                    {/* Execution Deliverables */}
                    <div className="pt-2">
                      <div className="text-xs font-mono uppercase tracking-widest text-[#858585] font-semibold mb-3">
                        Execution by OneDot ABM:
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {study.execution.map((step, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-[#555555]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#1400FF] shrink-0 mt-0.5" />
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* CTA Link */}
                    <div className="pt-4 border-t border-[#E5E5E2] flex items-center gap-4">
                      <Button
                        href={`/case-studies/${study.slug}`}
                        variant="primary"
                        size="md"
                        arrow="diagonal"
                      >
                        Read Full Case Study
                      </Button>
                      <span className="text-xs font-mono text-[#858585]">
                        Verified metrics & attribution
                      </span>
                    </div>
                  </div>

                  {/* Visual & Results Metric Column */}
                  <div
                    className={`lg:col-span-5 ${
                      isReversed ? "lg:order-1" : "lg:order-2"
                    }`}
                  >
                    <div className="rounded-2xl border border-[#E5E5E2] bg-[#F7F7F5] p-6 sm:p-8 space-y-6">
                      <div className="flex items-center justify-between pb-4 border-b border-[#E5E5E2]">
                        <span className="text-xs font-mono uppercase tracking-wider font-bold text-[#111111] flex items-center gap-2">
                          <Award className="w-4 h-4 text-[#1400FF]" />
                          Verified Performance
                        </span>
                        <span className="text-[11px] font-mono text-[#1400FF] bg-[#1400FF]/10 px-2 py-0.5 rounded">
                          AUDITED
                        </span>
                      </div>

                      {/* Main Metric Cards */}
                      <div className="space-y-4">
                        {study.results.map((res, rIdx) => (
                          <div
                            key={rIdx}
                            className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E5E5E2] shadow-2xs"
                          >
                            <div className="flex items-baseline justify-between">
                              <span className="text-3xl sm:text-4xl font-bold tracking-tight text-[#111111]">
                                {res.metric}
                              </span>
                              <span className="text-xs font-mono font-semibold uppercase text-[#1400FF]">
                                {res.label}
                              </span>
                            </div>
                            {res.detail && (
                              <p className="text-xs text-[#555555] mt-1.5 leading-relaxed">
                                {res.detail}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Tags */}
                      <div className="pt-2 flex flex-wrap gap-1.5">
                        {study.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-[#FFFFFF] border border-[#E5E5E2] text-[#555555]"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
