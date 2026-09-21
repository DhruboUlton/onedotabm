import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Building,
  Terminal,
  ShieldCheck,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { caseStudies, getCaseStudyBySlug } from "@/data/caseStudies";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return caseStudies.map((study) => ({
    slug: study.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudyBySlug(slug);

  if (!study) {
    return {
      title: "Case Study Not Found",
    };
  }

  return {
    title: `${study.title} | OneDot ABM Case Study`,
    description: study.summary,
    openGraph: {
      title: `${study.client} Case Study — OneDot ABM`,
      description: study.summary,
    },
  };
}

export default async function CaseStudyDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const study = getCaseStudyBySlug(slug);

  if (!study) {
    notFound();
  }

  // Calculate Next Case Study
  const currentIndex = caseStudies.findIndex((s) => s.slug === slug);
  const nextStudy = caseStudies[(currentIndex + 1) % caseStudies.length];
  const isMarketing = study.tags?.includes("Meta Ads") || study.service.includes("Marketing");

  return (
    <article className="flex flex-col bg-[#F7F7F5]">
      {/* 01. Case Study Top Header */}
      <section className="pt-12 pb-16 md:pt-20 md:pb-24 border-b border-[#E5E5E2] bg-white">
        <Container>
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 mb-8 text-xs font-mono">
            <Link
              href="/case-studies"
              className="text-[#858585] hover:text-[#111111] transition-colors inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>All Case Studies</span>
            </Link>
            <span className="text-[#D8D8D4]">/</span>
            <span className="text-[#1400FF] font-medium">{study.client}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Header info */}
            <div className="lg:col-span-8">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge variant={isMarketing ? "accent" : "dark"}>
                  {isMarketing ? "Performance Marketing" : "Custom Web Application"}
                </Badge>
                <span className="font-mono text-xs text-[#858585] flex items-center gap-1">
                  <Building className="w-3 h-3" />
                  {study.industry}
                </span>
                {study.period && (
                  <span className="font-mono text-xs text-[#858585] flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {study.period}
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-[#111111] leading-[1.08] mb-6">
                {study.title}
              </h1>

              <p className="text-base sm:text-xl text-[#555555] leading-relaxed">
                {study.summary}
              </p>
            </div>

            {/* Right: Big Hero Metric Box */}
            <div className="lg:col-span-4 p-8 rounded-3xl bg-[#F7F7F5] border border-[#D8D8D4] flex flex-col justify-between">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-[#858585] block mb-2">
                  Verified Hero Metric
                </span>
                <div className="text-3xl sm:text-4xl font-bold font-mono text-[#1400FF] leading-tight mb-2">
                  {study.heroMetric.value}
                </div>
                <p className="text-xs text-[#555555] leading-relaxed">
                  {study.heroMetric.label}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-[#E5E5E2] text-[11px] font-mono text-[#858585]">
                Attribution: Verified Backend Data
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 02. Project Overview Matrix */}
      <section className="py-12 border-b border-[#E5E5E2] bg-[#F7F7F5]">
        <Container>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 p-6 sm:p-8 rounded-2xl bg-white border border-[#E5E5E2]">
            <div>
              <span className="text-[11px] font-mono uppercase text-[#858585] block">Client</span>
              <span className="text-sm font-semibold text-[#111111] mt-1 block">{study.overview.client}</span>
            </div>
            <div>
              <span className="text-[11px] font-mono uppercase text-[#858585] block">Industry</span>
              <span className="text-sm font-semibold text-[#111111] mt-1 block">{study.overview.industry}</span>
            </div>
            <div>
              <span className="text-[11px] font-mono uppercase text-[#858585] block">Project Period</span>
              <span className="text-sm font-semibold text-[#111111] mt-1 block">
                {study.overview.projectPeriod || "Completed Cycle"}
              </span>
            </div>
            <div>
              <span className="text-[11px] font-mono uppercase text-[#858585] block">Core Objective</span>
              <span className="text-xs text-[#555555] mt-1 block line-clamp-2">
                {study.overview.objective}
              </span>
            </div>
          </div>
        </Container>
      </section>

      {/* 03. Challenge & Strategy (Two Column Editorial) */}
      <section className="py-16 md:py-24 border-b border-[#E5E5E2]">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* The Challenge */}
            <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#E5E5E2] flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span className="font-mono text-xs uppercase tracking-widest text-[#858585]">
                    01 // THE STARTING CONDITION
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-semibold text-[#111111] mb-4">
                  The Challenge
                </h2>

                <p className="text-sm sm:text-base text-[#555555] leading-relaxed mb-6">
                  {study.challenge.summary}
                </p>

                <div className="space-y-3 pt-6 border-t border-[#E5E5E2]">
                  {study.challenge.points.map((pt, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#555555]">
                      <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* The Strategy */}
            <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#E5E5E2] flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#1400FF]" />
                  <span className="font-mono text-xs uppercase tracking-widest text-[#858585]">
                    02 // OUR APPROACH
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-semibold text-[#111111] mb-4">
                  Strategic Solution
                </h2>

                <p className="text-sm sm:text-base text-[#555555] leading-relaxed mb-6">
                  {study.strategy.summary}
                </p>

                <div className="space-y-3 pt-6 border-t border-[#E5E5E2]">
                  {study.strategy.points.map((pt, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#111111]">
                      <CheckCircle2 className="w-4 h-4 text-[#1400FF] shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 04. Execution & Deliverables */}
      <section className="py-16 md:py-24 border-b border-[#E5E5E2] bg-white">
        <Container>
          <div className="max-w-3xl mb-12">
            <span className="font-mono text-xs uppercase tracking-widest text-[#858585] block mb-2">
              03 // DELIVERABLES
            </span>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#111111] mb-4">
              Execution Scope & Technical Rigor
            </h2>
            <p className="text-base text-[#555555]">
              {study.execution.summary}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Deliverables List */}
            <div className="lg:col-span-7 space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-[#111111] font-semibold block mb-2">
                Work Delivered by OneDot ABM:
              </span>
              {study.execution.deliverables.map((deliv, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-[#F7F7F5] border border-[#E5E5E2] flex items-start gap-3"
                >
                  <span className="font-mono text-xs text-[#1400FF] font-semibold mt-0.5">
                    0{idx + 1}
                  </span>
                  <span className="text-xs sm:text-sm text-[#111111] font-medium">{deliv}</span>
                </div>
              ))}
            </div>

            {/* Technical Specifications */}
            {study.execution.technicalDetails && (
              <div className="lg:col-span-5 p-6 sm:p-8 rounded-2xl bg-[#111111] text-white space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-[#333333]">
                  <Terminal className="w-4 h-4 text-[#1400FF]" />
                  <span className="font-mono text-xs uppercase tracking-wider text-neutral-400">
                    Technical Specifications
                  </span>
                </div>
                <div className="space-y-3">
                  {study.execution.technicalDetails.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-neutral-300 font-mono">
                      <span className="text-[#1400FF] font-bold">›</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* 05. Verified Results Grid */}
      <section className="py-16 md:py-24 border-b border-[#E5E5E2] bg-[#F7F7F5]">
        <Container>
          <div className="max-w-3xl mb-12">
            <span className="font-mono text-xs uppercase tracking-widest text-[#858585] block mb-2">
              04 // RESULTS & DATA
            </span>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#111111] mb-4">
              Verified Commercial Results
            </h2>
            <p className="text-base text-[#555555]">
              {study.results.summary}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
            {study.results.metrics.map((res, rIdx) => (
              <div
                key={rIdx}
                className="p-8 rounded-2xl bg-white border border-[#E5E5E2] flex flex-col justify-between"
              >
                <div>
                  <span className="font-mono text-xs uppercase tracking-wider text-[#858585]">
                    {res.label}
                  </span>
                  <div className="text-3xl sm:text-4xl font-bold font-mono text-[#1400FF] mt-2 mb-1">
                    {res.prefix}
                    {res.value}
                    {res.suffix}
                  </div>
                </div>
                {res.note && (
                  <p className="text-xs text-[#555555] pt-4 border-t border-[#E5E5E2] mt-4">
                    {res.note}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Evidence Blocks */}
          {study.evidence && study.evidence.length > 0 && (
            <div className="space-y-4">
              <span className="font-mono text-xs uppercase tracking-wider text-[#858585] block mb-2">
                Documented Evidence & Architecture Verification:
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {study.evidence.map((ev, evIdx) => (
                  <div
                    key={evIdx}
                    className="p-6 rounded-2xl bg-white border border-[#E5E5E2] space-y-3"
                  >
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#1400FF]" />
                      <h4 className="text-sm font-semibold text-[#111111]">{ev.title}</h4>
                    </div>
                    <p className="text-xs text-[#555555]">{ev.description}</p>
                    <div className="space-y-1 pt-2 border-t border-[#E5E5E2]">
                      {ev.items.map((it, itIdx) => (
                        <div key={itIdx} className="text-xs text-[#555555] flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#1400FF]" />
                          <span>{it}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Container>
      </section>

      {/* 06. Conclusion & Business Impact */}
      <section className="py-16 md:py-24 border-b border-[#E5E5E2] bg-white">
        <Container size="narrow">
          <div className="space-y-8">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-[#858585] block mb-2">
                05 // CONCLUSION
              </span>
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#111111] mb-4">
                Business Impact & Key Takeaways
              </h2>
              <p className="text-base text-[#555555] leading-relaxed">
                {study.conclusion.summary}
              </p>
            </div>

            <div className="space-y-3 pt-6 border-t border-[#E5E5E2]">
              <span className="font-mono text-xs uppercase tracking-wider text-[#111111] font-semibold block mb-2">
                Commercial Impact:
              </span>
              {study.conclusion.businessImpact.map((impact, impIdx) => (
                <div key={impIdx} className="flex items-start gap-3 text-sm text-[#111111]">
                  <CheckCircle2 className="w-4 h-4 text-[#1400FF] shrink-0 mt-1" />
                  <span>{impact}</span>
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-6 border-t border-[#E5E5E2]">
              <span className="font-mono text-xs uppercase tracking-wider text-[#858585] font-semibold block mb-2">
                Key Strategic Takeaways:
              </span>
              {study.conclusion.keyTakeaways.map((takeaway, tkIdx) => (
                <div key={tkIdx} className="p-4 rounded-xl bg-[#F7F7F5] border border-[#E5E5E2] text-xs text-[#555555] leading-relaxed">
                  {takeaway}
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* 07. Next Case Study Teaser & CTA */}
      <section className="py-16 md:py-24 bg-[#F7F7F5] border-b border-[#E5E5E2]">
        <Container>
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 p-8 sm:p-12 rounded-3xl bg-white border border-[#D8D8D4]">
            <div className="space-y-2">
              <span className="font-mono text-xs uppercase tracking-widest text-[#858585]">
                Next Case Study
              </span>
              <h3 className="text-2xl sm:text-3xl font-semibold text-[#111111]">
                {nextStudy.client}
              </h3>
              <p className="text-xs sm:text-sm text-[#555555] max-w-lg">
                {nextStudy.summary}
              </p>
            </div>

            <Button
              href={`/case-studies/${nextStudy.slug}`}
              variant="primary"
              size="lg"
              withArrow
              arrowType="diagonal"
            >
              Explore Next Case Study
            </Button>
          </div>
        </Container>
      </section>

      {/* 08. Bottom Conversion Callout */}
      <section className="py-20 md:py-28 bg-[#111111] text-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <span className="font-mono text-xs uppercase tracking-widest text-neutral-400">
              COMMERCIAL INQUIRY
            </span>
            <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-white leading-tight">
              Ready to start a similar project?
            </h2>
            <p className="text-base sm:text-lg text-neutral-300 max-w-xl mx-auto leading-relaxed">
              We coordinate strategic marketing and custom web systems to generate measurable business results for your company.
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
    </article>
  );
}
