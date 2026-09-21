import React from "react";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { caseStudies } from "@/data/caseStudies";

export const metadata: Metadata = {
  title: "Case Studies & Measurable Impact",
  description:
    "Documented case studies with verified metrics: performance marketing campaigns and custom web application architectures delivered by OneDot ABM.",
};

export default function CaseStudiesIndexPage() {
  return (
    <div className="flex flex-col bg-[#F7F7F5]">
      {/* 01. Hero Header */}
      <section className="pt-12 pb-16 md:pt-20 md:pb-24 border-b border-[#E5E5E2]">
        <Container>
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 mb-6">
              <Badge variant="subtle" dot={false}>
                VERIFIED CASE STUDIES
              </Badge>
              <span className="text-xs font-mono text-[#858585] uppercase tracking-wider">
                Measurable Impact • Documented Data
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-[#111111] leading-[1.08] mb-6">
              Measurable Outcomes. <br />
              <span className="text-[#1400FF]">Verified Execution.</span>
            </h1>

            <p className="text-lg sm:text-xl text-[#555555] leading-relaxed max-w-2xl mb-8">
              We document our work through real business numbers: course enrollments, gross revenues, and custom digital software systems. Every study outlines the starting challenge, strategy, execution, and verified results.
            </p>

            {/* Quick Proof Metrics Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-[#E5E5E2]">
              <div>
                <div className="text-2xl sm:text-3xl font-bold font-mono text-[#1400FF]">788</div>
                <div className="text-xs text-[#555555] mt-0.5">Course Orders (Solution Point)</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold font-mono text-[#111111]">~৳800K</div>
                <div className="text-xs text-[#555555] mt-0.5">Revenue (Solution Point)</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold font-mono text-[#1400FF]">৳343K+</div>
                <div className="text-xs text-[#555555] mt-0.5">Revenue (Autonex)</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold font-mono text-[#111111]">Next.js</div>
                <div className="text-xs text-[#555555] mt-0.5">Full-Stack (Kanzie & Lumiflick)</div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 02. Editorial Case Studies Grid */}
      <section className="py-20 md:py-28">
        <Container>
          <div className="space-y-16">
            {caseStudies.map((study) => {
              const isMarketing = study.tags?.includes("Meta Ads") || study.service.includes("Marketing");

              return (
                <Card
                  key={study.id}
                  surface="white"
                  className="p-8 sm:p-12 border-[#D8D8D4] hover:shadow-[0_12px_40px_rgba(0,0,0,0.04)] transition-all"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    {/* Left Column: Client metadata and Hero Metric */}
                    <div className="lg:col-span-4 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#E5E5E2] pb-8 lg:pb-0 lg:pr-8">
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <Badge variant={isMarketing ? "accent" : "dark"} size="sm">
                            {isMarketing ? "Marketing" : "Web Development"}
                          </Badge>
                          <span className="font-mono text-xs text-[#858585]">
                            {study.industry}
                          </span>
                        </div>

                        <h2 className="text-2xl sm:text-3xl font-semibold text-[#111111] mb-2">
                          {study.client}
                        </h2>

                        <p className="text-xs font-mono text-[#555555] mb-6">
                          Service: {study.service}
                        </p>

                        {/* Hero Metric Box */}
                        <div className="p-5 rounded-2xl bg-[#F7F7F5] border border-[#E5E5E2] mb-6">
                          <span className="text-[11px] font-mono text-[#858585] uppercase tracking-wider block">
                            Key Verified Impact
                          </span>
                          <div className="text-2xl sm:text-3xl font-bold font-mono text-[#1400FF] mt-1">
                            {study.heroMetric.value}
                          </div>
                          <div className="text-xs text-[#555555] mt-1">
                            {study.heroMetric.label}
                          </div>
                        </div>
                      </div>

                      <Button
                        href={`/case-studies/${study.slug}`}
                        variant="primary"
                        size="md"
                        withArrow
                        arrowType="diagonal"
                        className="w-full sm:w-auto"
                      >
                        Read Full Case Study
                      </Button>
                    </div>

                    {/* Right Column: Narrative breakdown */}
                    <div className="lg:col-span-8 flex flex-col justify-between space-y-6">
                      <div>
                        <h3 className="text-xl sm:text-2xl font-semibold text-[#111111] mb-3">
                          {study.title}
                        </h3>

                        <p className="text-sm sm:text-base text-[#555555] leading-relaxed mb-6">
                          {study.summary}
                        </p>

                        {/* Challenge & Strategy Previews */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-[#E5E5E2]">
                          <div>
                            <span className="text-xs font-mono uppercase tracking-wider text-[#858585] block mb-2 font-semibold">
                              The Challenge
                            </span>
                            <p className="text-xs text-[#555555] leading-relaxed line-clamp-3">
                              {study.challenge.summary}
                            </p>
                          </div>

                          <div>
                            <span className="text-xs font-mono uppercase tracking-wider text-[#1400FF] block mb-2 font-semibold">
                              Our Strategy
                            </span>
                            <p className="text-xs text-[#555555] leading-relaxed line-clamp-3">
                              {study.strategy.summary}
                            </p>
                          </div>
                        </div>

                        {/* Key Results Badges */}
                        <div className="pt-6 border-t border-[#E5E5E2] mt-6">
                          <span className="text-xs font-mono uppercase tracking-wider text-[#111111] block mb-3 font-semibold">
                            Verified Result Metrics:
                          </span>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {study.results.metrics.map((m, mIdx) => (
                              <div
                                key={mIdx}
                                className="p-3 rounded-xl bg-[#F7F7F5] border border-[#E5E5E2]"
                              >
                                <div className="text-lg font-bold font-mono text-[#111111]">
                                  {m.prefix}
                                  {m.value}
                                  {m.suffix}
                                </div>
                                <div className="text-[11px] text-[#555555] leading-tight mt-0.5">
                                  {m.label}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 pt-4">
                        {study.tags?.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2.5 py-0.5 text-[11px] font-mono bg-white border border-[#E5E5E2] rounded-full text-[#555555]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 03. Conversion CTA */}
      <section className="py-20 md:py-28 bg-[#111111] text-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <span className="font-mono text-xs uppercase tracking-widest text-neutral-400">
              COMMERCIAL CASE STUDIES // START YOUR PROJECT
            </span>
            <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-white leading-tight">
              Want results like these for your business?
            </h2>
            <p className="text-base sm:text-lg text-neutral-300 max-w-xl mx-auto leading-relaxed">
              We build customer acquisition systems and bespoke web applications that deliver real, measurable commercial ROI.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Button href="/start-a-project" variant="accent" size="lg" withArrow arrowType="diagonal">
                Start a Project
              </Button>
              <Button href="/contact" variant="outline" size="lg" className="border-neutral-700 text-white hover:bg-neutral-800">
                Book a Strategy Call
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
