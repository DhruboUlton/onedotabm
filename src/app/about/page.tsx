import React from "react";
import type { Metadata } from "next";
import {
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "About OneDot ABM & Leadership",
  description:
    "Learn about OneDot ABM's mission to bridge marketing acquisition and custom web software under one unified commercial partner.",
};

const companyValues = [
  {
    number: "01",
    title: "Integrated Single Accountability",
    description:
      "Marketing and web development must share commercial responsibility. When your ads team and dev team work under one roof, attribution blind spots and finger-pointing disappear.",
  },
  {
    number: "02",
    title: "Factual Commercial Proof",
    description:
      "We measure success in gross revenue, verified course orders, and sub-second page performance. We do not report vanity impressions or surface-level marketing fluff.",
  },
  {
    number: "03",
    title: "100% Code & Asset Ownership",
    description:
      "We believe you should own your business infrastructure. When we build your web application or corporate platform, full intellectual property and source code repositories belong to you.",
  },
  {
    number: "04",
    title: "Disciplined Unit Economics",
    description:
      "Every ad dollar spent on Meta or Google is measured against profit margins, customer lifetime value, and sustainable cost per acquisition before scaling.",
  },
];

const clientJourney = [
  { step: "01", phase: "Inquiry", desc: "You share your project scope, targets, and timeline." },
  { step: "02", phase: "Discovery", desc: "We audit your existing ad accounts, unit economics, or codebase." },
  { step: "03", phase: "Quotation", desc: "Transparent, milestone-based line-item proposal." },
  { step: "04", phase: "Agreement", desc: "Formal terms and kickoff milestone confirmation." },
  { step: "05", phase: "Onboarding", desc: "Dedicated access setup and tracking credentials exchange." },
  { step: "06", phase: "Execution", desc: "Sprint-based delivery of campaigns, creatives, or web code." },
  { step: "07", phase: "Review", desc: "Iterative testing checkpoints and milestone approval." },
  { step: "08", phase: "Launch", desc: "Public campaign launch or web system deployment." },
  { step: "09", phase: "Reporting", desc: "Formal weekly KPI performance and financial attribution." },
  { step: "10", phase: "Optimization", desc: "Continuous compounding through 72-hour review cycles." },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col bg-[#F7F7F5]">
      {/* 01. Hero Header */}
      <section className="pt-12 pb-16 md:pt-20 md:pb-24 border-b border-[#E5E5E2]">
        <Container>
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 mb-6">
              <Badge variant="accent" dot>
                THE ONEDOT STORY
              </Badge>
              <span className="text-xs font-mono text-[#858585] uppercase tracking-wider">
                Marketing Agency + Web Development
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-[#111111] leading-[1.08] mb-6">
              We Build Digital Systems for{" "}
              <span className="text-[#1400FF]">Real Businesses.</span>
            </h1>

            <p className="text-lg sm:text-xl text-[#555555] leading-relaxed max-w-2xl mb-8">
              OneDot ABM was founded on a simple realization: companies were wasting fortunes paying separate agencies for advertising and web development that never communicated. We united both disciplines under one roof.
            </p>

            {/* Verified Proof Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-[#E5E5E2]">
              <div>
                <div className="text-2xl sm:text-3xl font-bold font-mono text-[#111111]">30+</div>
                <div className="text-xs text-[#555555] mt-0.5">Brands Scaled</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold font-mono text-[#111111]">300+</div>
                <div className="text-xs text-[#555555] mt-0.5">Campaigns Executed</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold font-mono text-[#1400FF]">$70K+</div>
                <div className="text-xs text-[#555555] mt-0.5">Meta Ad Spend Managed</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold font-mono text-[#111111]">15+</div>
                <div className="text-xs text-[#555555] mt-0.5">Websites & Web Systems</div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 02. The Core Commercial Philosophy */}
      <section className="py-20 md:py-28 border-b border-[#E5E5E2] bg-white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="font-mono text-xs uppercase tracking-widest text-[#858585] block">
                01 // POSITIONING & PHILOSOPHY
              </span>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#111111] leading-tight">
                &ldquo;Marketing brings the audience. Web development builds the digital experience that converts.&rdquo;
              </h2>
              <p className="text-base text-[#555555] leading-relaxed">
                We are not a generic &ldquo;digital agency,&rdquo; and we are not a freelance design shop. OneDot ABM is a practical, execution-focused marketing and technology company.
              </p>
              <p className="text-sm text-[#555555] leading-relaxed">
                When you run paid acquisition without a high-converting website, you burn marketing budget. When you build a modern web application without customer acquisition, you own an empty showroom. We ensure both sides operate in total harmony.
              </p>
            </div>

            <div className="lg:col-span-6 p-8 sm:p-10 rounded-3xl bg-[#F7F7F5] border border-[#D8D8D4] space-y-6">
              <span className="font-mono text-xs uppercase tracking-wider text-[#1400FF] font-semibold block">
                The OneDot Standards:
              </span>
              <div className="space-y-4 text-xs sm:text-sm text-[#111111]">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#1400FF] shrink-0 mt-0.5" />
                  <span>
                    <strong>Zero Bloat:</strong> Custom Next.js, React, and Laravel applications instead of slow, brittle WordPress plugins.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#1400FF] shrink-0 mt-0.5" />
                  <span>
                    <strong>Direct Telemetry:</strong> Server-side Conversions API (CAPI) and GA4 event tracking resilient against ad-blockers.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#1400FF] shrink-0 mt-0.5" />
                  <span>
                    <strong>Transparent Attribution:</strong> Weekly financial reporting linking ad set IDs directly to closed customer revenue.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#1400FF] shrink-0 mt-0.5" />
                  <span>
                    <strong>Total Client Ownership:</strong> Full code repositories, design assets, and database credentials delivered to you.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 03. Founder Profile: Dhrubo Duti Biswas */}
      <section className="py-20 md:py-28 border-b border-[#E5E5E2] bg-[#F7F7F5]">
        <Container>
          <div className="p-8 sm:p-12 rounded-3xl bg-white border border-[#D8D8D4] grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-4 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#E5E5E2] pb-8 lg:pb-0 lg:pr-8">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-[#858585] block mb-2">
                  FOUNDER & STRATEGIST
                </span>
                <h3 className="text-2xl sm:text-3xl font-semibold text-[#111111] mb-1">
                  Dhrubo Duti Biswas
                </h3>
                <span className="text-xs font-mono text-[#1400FF] font-medium block mb-4">
                  Founder & Lead Performance Strategist
                </span>
                <p className="text-xs text-[#555555] leading-relaxed mb-6">
                  Performance marketer and full-stack web developer specializing in high-ROAS advertising architectures, server-side telemetry, and custom Next.js web applications.
                </p>
              </div>

              <div className="space-y-3 pt-4 border-t border-[#E5E5E2]">
                <a
                  href="https://dhruboduti.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-[#111111] hover:text-[#1400FF]"
                >
                  <span>Founder Personal Portfolio</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#858585]" />
                </a>
                <div className="text-[11px] font-mono text-[#858585]">
                  Location: Dhaka, Bangladesh • Global Remote
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-6">
              <h4 className="text-xl sm:text-2xl font-semibold text-[#111111]">
                Direct Founder Leadership on Every Engagement
              </h4>
              <p className="text-sm text-[#555555] leading-relaxed">
                Unlike oversized agencies where client accounts are handed off to junior interns, every OneDot ABM client project is directly architected, strategized, and audited by Dhrubo Duti Biswas.
              </p>
              <p className="text-sm text-[#555555] leading-relaxed">
                With a track record managing over $70,000 in Meta advertising spend, delivering 788 course enrollments (~৳800K revenue) for Solution Point, and engineering full-stack production platforms like Kanzie and Lumiflick, you get battle-tested expertise from day one.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#E5E5E2]">
                <div className="p-4 rounded-xl bg-[#F7F7F5] border border-[#E5E5E2]">
                  <span className="font-mono text-xs text-[#1400FF] font-semibold block mb-1">
                    Marketing Credentials
                  </span>
                  <p className="text-xs text-[#555555]">
                    Meta Ads Manager CBO, Lookalikes, server-side CAPI telemetry, and Google Ads intent biddings.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-[#F7F7F5] border border-[#E5E5E2]">
                  <span className="font-mono text-xs text-[#111111] font-semibold block mb-1">
                    Engineering Credentials
                  </span>
                  <p className="text-xs text-[#555555]">
                    Next.js App Router, React 19, TypeScript, Laravel, Node.js, Prisma ORM, and MySQL schemas.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 04. Execution Values */}
      <section className="py-20 md:py-28 border-b border-[#E5E5E2] bg-white">
        <Container>
          <div className="max-w-3xl mb-16">
            <span className="font-mono text-xs uppercase tracking-widest text-[#858585] block mb-2">
              02 // CORE VALUES
            </span>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#111111] mb-4">
              How We Operate
            </h2>
            <p className="text-base text-[#555555]">
              Our execution rules dictate every client interaction, campaign sprint, and git commit.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {companyValues.map((val, idx) => (
              <Card key={idx} surface="soft" className="p-8 border-[#D8D8D4]">
                <span className="font-mono text-xs font-bold text-[#1400FF] block mb-2">
                  STANDARD {val.number}
                </span>
                <h3 className="text-xl font-semibold text-[#111111] mb-3">
                  {val.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#555555] leading-relaxed">
                  {val.description}
                </p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* 05. 10-Step Client Experience Journey */}
      <section className="py-20 md:py-28 border-b border-[#E5E5E2] bg-[#F7F7F5]">
        <Container>
          <div className="max-w-3xl mb-16">
            <span className="font-mono text-xs uppercase tracking-widest text-[#858585] block mb-2">
              03 // THE CLIENT JOURNEY
            </span>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#111111] mb-4">
              The 10-Step Execution Process
            </h2>
            <p className="text-base text-[#555555]">
              A transparent, predictable process ensuring milestones are met on schedule.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {clientJourney.map((step, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-white border border-[#E5E5E2] flex flex-col justify-between">
                <div>
                  <span className="font-mono text-xs font-bold text-[#1400FF] block mb-2">
                    {step.step}
                  </span>
                  <h4 className="text-sm font-semibold text-[#111111] mb-1">{step.phase}</h4>
                  <p className="text-[11px] text-[#555555] leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 06. Conversion CTA */}
      <section className="py-20 md:py-28 bg-[#111111] text-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <span className="font-mono text-xs uppercase tracking-widest text-neutral-400">
              WORK WITH ONEDOT ABM
            </span>
            <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-white leading-tight">
              Ready to work with a partner who executes?
            </h2>
            <p className="text-base sm:text-lg text-neutral-300 max-w-xl mx-auto leading-relaxed">
              Let&apos;s evaluate your current growth bottlenecks and determine the right marketing or web development solution.
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
