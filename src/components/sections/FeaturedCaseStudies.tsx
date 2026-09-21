"use client";

import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { FEATURED_CASE_STUDIES } from "@/data";
import { ArrowUpRight, TrendingUp, Award, Layers, ShoppingBag } from "lucide-react";

// Micro visual preview component for each case study
function CaseVisualPreview({ slug }: { slug: string }) {
  if (slug === "solution-point") {
    return (
      <div className="h-32 rounded-xl bg-[#FFFFFF] border border-[#E5E5E2] p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono text-[#858585] uppercase">Meta Ads CAPI Attributed</span>
          <span className="text-[10px] font-mono text-[#1400FF] bg-[#1400FF]/10 px-2 py-0.5 rounded font-semibold">
            ROAS 4.2x
          </span>
        </div>
        <div className="flex items-baseline justify-between pt-2">
          <div>
            <div className="text-2xl font-bold text-[#111111] font-sans">788</div>
            <div className="text-[10px] font-mono text-[#858585]">Verified Enrollments</div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-[#1400FF] font-sans">~৳800K</div>
            <div className="text-[10px] font-mono text-[#858585]">Gross Course Sales</div>
          </div>
        </div>
      </div>
    );
  }

  if (slug === "autonex") {
    return (
      <div className="h-32 rounded-xl bg-[#FFFFFF] border border-[#E5E5E2] p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono text-[#858585] uppercase">WhatsApp Qualification Funnel</span>
          <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-semibold">
            Profitable ROI
          </span>
        </div>
        <div className="flex items-baseline justify-between pt-2">
          <div>
            <div className="text-2xl font-bold text-[#111111] font-sans">৳343K+</div>
            <div className="text-[10px] font-mono text-[#858585]">Closed Campaign Revenue</div>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-[#111111] font-sans">Direct</div>
            <div className="text-[10px] font-mono text-[#858585]">Inbound WhatsApp Triage</div>
          </div>
        </div>
      </div>
    );
  }

  if (slug === "kanzie") {
    return (
      <div className="h-32 rounded-xl bg-[#FFFFFF] border border-[#E5E5E2] p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono text-[#858585] uppercase">Custom Storefront + RBAC Admin</span>
          <span className="text-[10px] font-mono text-[#111111] bg-[#F0F0ED] px-2 py-0.5 rounded font-semibold">
            Next.js • Prisma
          </span>
        </div>
        <div className="flex items-baseline justify-between pt-2">
          <div>
            <div className="text-2xl font-bold text-[#111111] font-sans">Full Stack</div>
            <div className="text-[10px] font-mono text-[#858585]">Storefront + Ops Center</div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-[#1400FF] font-sans">100%</div>
            <div className="text-[10px] font-mono text-[#858585]">Code-Free Agility</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-32 rounded-xl bg-[#FFFFFF] border border-[#E5E5E2] p-4 flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono text-[#858585] uppercase">Visual E-Commerce Experience</span>
        <span className="text-[10px] font-mono text-[#1400FF] bg-[#1400FF]/10 px-2 py-0.5 rounded font-semibold">
          99/100 Speed
        </span>
      </div>
      <div className="flex items-baseline justify-between pt-2">
        <div>
          <div className="text-2xl font-bold text-[#111111] font-sans">Bespoke</div>
          <div className="text-[10px] font-mono text-[#858585]">Visual Brand Architecture</div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-[#111111] font-sans">7+</div>
          <div className="text-[10px] font-mono text-[#858585]">Curated Collections</div>
        </div>
      </div>
    </div>
  );
}

export function FeaturedCaseStudies() {
  return (
    <section id="case-studies" className="py-16 md:py-24 bg-[#F7F7F5] border-b border-[#E5E5E2]">
      <Container>
        {/* Section Heading */}
        <SectionHeading
          label="CASE STUDIES // VERIFIED PROOF"
          badge="MEASURABLE OUTCOMES"
          badgeVariant="accent"
          title="Documented Client Results."
          highlight="No Vanity Claims."
          description="Direct revenue attribution and verified commercial outcomes delivered for our partners."
          action={
            <Button href="/case-studies" variant="outline" arrow="diagonal">
              Browse All Case Studies
            </Button>
          }
          className="mb-12"
        />

        {/* 4 Visual Teaser Case Cards (Section 10) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {FEATURED_CASE_STUDIES.map((study) => {
            const mainResult = study.results[0];
            const secondResult = study.results[1];

            return (
              <div
                key={study.slug}
                className="rounded-3xl border border-[#E5E5E2] bg-[#FFFFFF] p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:border-[#111111] hover:shadow-xs group"
              >
                <div>
                  {/* Top Bar: Client + Category */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold tracking-wider text-[#111111] uppercase">
                        {study.client}
                      </span>
                      <span className="text-xs text-[#858585]">• {study.industry.split("&")[0]}</span>
                    </div>

                    <span className="text-[10px] font-mono font-semibold text-[#1400FF] bg-[#1400FF]/10 px-2.5 py-1 rounded-full uppercase tracking-wider">
                      Audited
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold tracking-tight text-[#111111] group-hover:text-[#1400FF] transition-colors mb-3">
                    {study.title}
                  </h3>

                  {/* Visual Preview Box */}
                  <div className="mb-4">
                    <CaseVisualPreview slug={study.slug} />
                  </div>

                  {/* Exactly 1 Short Sentence Descriptor */}
                  <p className="text-xs sm:text-sm text-[#555555] leading-relaxed mb-6">
                    {study.slug === "solution-point" && "Engineered a Meta Ads funnel generating 788 paid course registrations and ~৳800K revenue."}
                    {study.slug === "autonex" && "Launched targeted video campaigns and instant WhatsApp qualification generating ৳343K+ revenue."}
                    {study.slug === "kanzie" && "Architected custom storefront and back-office operations platform with granular RBAC security."}
                    {slugMatch(study.slug) && "Delivered high-performance custom e-commerce architecture highlighting physical craftsmanship."}
                  </p>
                </div>

                {/* Footer Link */}
                <div className="pt-4 border-t border-[#E5E5E2] flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#111111]">
                    <span>{mainResult.metric} {mainResult.label}</span>
                    {secondResult && (
                      <span className="text-[#1400FF] hidden sm:inline-block">• {secondResult.metric}</span>
                    )}
                  </div>

                  <Link
                    href={`/case-studies/${study.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#111111] group-hover:text-[#1400FF] transition-colors"
                  >
                    <span>View Case Study</span>
                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

function slugMatch(slug: string) {
  return slug !== "solution-point" && slug !== "autonex" && slug !== "kanzie";
}
