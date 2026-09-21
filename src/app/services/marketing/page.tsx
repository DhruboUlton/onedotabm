import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "Growth & Performance Marketing Services",
  description:
    "Predictable customer acquisition engines built on Meta Ads, Google Ads, server-side CAPI telemetry, and direct-response creative strategy.",
};

const marketingCapabilities = [
  {
    category: "Paid Social Advertising",
    title: "Meta & Facebook Ads Management",
    description:
      "Structured campaign architectures (prospecting, creative testing, and retargeting) designed around unit economics, margin headroom, and algorithmic scaling.",
    features: [
      "Campaign Budget Optimization (CBO) & Ad Set Budget (ABO) split architectures",
      "Audience stratification: broad targeting, high-affinity interest clusters, and lookalike pools",
      "Audience exclusion hygiene: preventing wasted spend on existing buyers or enrolled students",
      "Dynamic retargeting sequences re-engaging cart and checkout abandoners",
      "Systematic 72-hour review cycles to prune underperforming ad sets and scale winners",
    ],
    metric: "$70K+ Ad Spend Managed",
  },
  {
    category: "Data & Attribution",
    title: "Server-Side CAPI & GA4 Telemetry",
    description:
      "Bypass ad-blockers and iOS 14.5+ signal loss with direct server-to-server Conversions API and Google Analytics 4 event streams.",
    features: [
      "Meta Conversions API (CAPI) implementation with server-side event deduplication",
      "GA4 custom event instrumentation: ViewContent, AddToCart, InitiateCheckout, Lead, Purchase",
      "UTM taxonomy connecting specific ad creative IDs directly to recorded bank revenue",
      "Reliable attribution signals feeding machine-learning ad auctions for lower CPA",
    ],
    metric: "Zero Attribution Loss",
  },
  {
    category: "High-Intent Search",
    title: "Google Ads & PPC Search Campaigns",
    description:
      "Capture high-intent search queries at the exact moment prospects are evaluating solutions, filtering out wasted clicks with disciplined negative keyword hygiene.",
    features: [
      "High-intent keyword grouping: transactional, commercial, and comparative match types",
      "Performance Max campaigns with tight audience signals and multi-channel asset groups",
      "Aggressive negative keyword lists to prevent click-budget leakage on low-intent queries",
      "Google Tag Manager enhanced conversion tracking and value-based automated bidding",
    ],
    metric: "High Commercial Intent",
  },
  {
    category: "Direct-Response Production",
    title: "Creative Strategy & Ad Design",
    description:
      "In modern algorithmic advertising, creative is your primary targeting lever. We produce psychology-backed visual assets that stop the feed and drive action.",
    features: [
      "Objection-busting static comparison boards, curriculum breakdowns, and feature highlights",
      "Multi-slide educational carousels formatted for Instagram and Facebook feeds",
      "Direct-response UGC-style video scripts featuring 3-second visual hooks and problem proof",
      "Conversion copywriting addressing pricing hesitation, trust barriers, and perceived risk",
    ],
    metric: "3x+ Click-Through Rates",
  },
  {
    category: "Pipeline Acquisition",
    title: "Lead Generation & Conversational Triage",
    description:
      "Fill your sales calendar with qualified decision-makers using multi-step qualification forms and instant WhatsApp conversational routing.",
    features: [
      "Multi-step lead qualification forms that filter out tire-kickers before routing to sales",
      "Meta native Instant Forms combined with automated webhook CRM data synchronization",
      "Click-to-WhatsApp messaging campaigns with automated qualification prompt sequences",
      "Fast response lead alerts delivering prospect information directly to mobile devices",
    ],
    metric: "Pre-Qualified Inquiries",
  },
  {
    category: "Conversion Engineering",
    title: "Funnel Strategy & Landing Page CRO",
    description:
      "Align the entire customer journey from ad hook to checkout, removing friction and structuring irresistible value offers.",
    features: [
      "Full touchpoint journey mapping ensuring total message match between ad and landing page",
      "Offer stack formulation with risk-reversal guarantees, bonuses, and social proof placement",
      "Mobile checkout layout optimization to minimize form fields and prevent drop-offs",
      "A/B split testing roadmap testing headline framing, CTA placement, and pricing layouts",
    ],
    metric: "+35% Conversion Lift",
  },
];

export default function MarketingServicesPage() {
  return (
    <div className="flex flex-col bg-[#F7F7F5]">
      {/* 01. Hero Header */}
      <section className="pt-12 pb-16 md:pt-20 md:pb-24 border-b border-[#E5E5E2]">
        <Container>
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 mb-6">
              <Link
                href="/services"
                className="text-xs font-mono text-[#858585] hover:text-[#111111] transition-colors"
              >
                Services
              </Link>
              <span className="text-xs font-mono text-[#858585]">/</span>
              <Badge variant="accent" dot pulse>
                PILLAR 01 // MARKETING
              </Badge>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-[#111111] leading-[1.08] mb-6">
              Performance Marketing That{" "}
              <span className="text-[#1400FF]">Compounds Revenue.</span>
            </h1>

            <p className="text-lg sm:text-xl text-[#555555] leading-relaxed max-w-2xl mb-8">
              We design, manage, and scale customer acquisition engines across Meta and Google. No vanity likes, no bloated retainer fees without accountability—just disciplined media buying backed by real unit economics and verified sales data.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Button href="/start-a-project" variant="primary" size="lg" withArrow arrowType="diagonal">
                Start a Marketing Campaign
              </Button>
              <Button href="/case-studies" variant="secondary" size="lg" withArrow arrowType="diagonal">
                View Marketing Case Studies
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* 02. Verified Performance Metrics Banner */}
      <section className="py-8 bg-white border-b border-[#E5E5E2]">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 border-r border-[#E5E5E2] last:border-0">
              <div className="text-3xl sm:text-4xl font-bold font-mono text-[#1400FF]">$70K+</div>
              <div className="text-xs font-medium text-[#555555] mt-1">Meta Ad Spend Managed</div>
            </div>
            <div className="p-4 border-r border-[#E5E5E2] last:border-0">
              <div className="text-3xl sm:text-4xl font-bold font-mono text-[#111111]">300+</div>
              <div className="text-xs font-medium text-[#555555] mt-1">Campaigns Managed</div>
            </div>
            <div className="p-4 border-r border-[#E5E5E2] last:border-0">
              <div className="text-3xl sm:text-4xl font-bold font-mono text-[#111111]">788</div>
              <div className="text-xs font-medium text-[#555555] mt-1">Course Orders (Solution Point)</div>
            </div>
            <div className="p-4">
              <div className="text-3xl sm:text-4xl font-bold font-mono text-[#1400FF]">৳343K+</div>
              <div className="text-xs font-medium text-[#555555] mt-1">Verified Revenue (Autonex)</div>
            </div>
          </div>
        </Container>
      </section>

      {/* 03. Strategic Pillars Breakdown */}
      <section className="py-20 md:py-28 border-b border-[#E5E5E2] bg-[#F7F7F5]">
        <Container>
          <div className="max-w-3xl mb-16">
            <span className="font-mono text-xs uppercase tracking-widest text-[#858585] block mb-2">
              01 // CAPABILITIES
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-[#111111] mb-4">
              The OneDot Marketing Operating System
            </h2>
            <p className="text-base sm:text-lg text-[#555555] leading-relaxed">
              We do not believe in fragmented ad tactics. Our campaigns run on an integrated 6-part framework that coordinates targeting, creative psychology, conversion funnels, and data attribution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {marketingCapabilities.map((item, index) => (
              <Card key={index} surface="white" hoverEffect className="p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs uppercase tracking-wider text-[#858585]">
                      {item.category}
                    </span>
                    <Badge variant="accent" size="sm">
                      {item.metric}
                    </Badge>
                  </div>

                  <h3 className="text-xl font-semibold text-[#111111] mb-3">
                    {item.title}
                  </h3>

                  <p className="text-xs text-[#555555] leading-relaxed mb-6">
                    {item.description}
                  </p>

                  <div className="space-y-2 pt-4 border-t border-[#E5E5E2]">
                    {item.features.map((feat, fIndex) => (
                      <div key={fIndex} className="flex items-start gap-2 text-xs text-[#555555]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#1400FF] shrink-0 mt-0.5" />
                        <span className="leading-tight">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-[#E5E5E2]/60">
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-[#1400FF] hover:underline"
                  >
                    <span>Inquire about this capability</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* 04. Verified Case Study Spotlights */}
      <section className="py-20 md:py-28 border-b border-[#E5E5E2] bg-white">
        <Container>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-[#E5E5E2]">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-[#858585] block mb-2">
                02 // VERIFIED PROOF
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-[#111111]">
                Documented Client Proof
              </h2>
            </div>
            <p className="text-sm text-[#555555] max-w-md">
              Real results substantiated by backend order logs, merchant payment gateway receipts, and verified ad account data.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-12">
            {/* Case Study 1: Solution Point */}
            <Card surface="soft" className="p-8 sm:p-10 flex flex-col justify-between border-[#D8D8D4]">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="accent">Education & Course Sales</Badge>
                  <span className="font-mono text-xs text-[#858585]">Performance Cycle</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-semibold text-[#111111] mb-2">
                  Solution Point
                </h3>
                <p className="text-sm text-[#555555] leading-relaxed mb-6">
                  Online education platform scaling direct course enrollments. Rebuilt the acquisition engine from ad creative hooks to mobile landing page checkout.
                </p>

                {/* Key Result Badges */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="p-4 rounded-xl bg-white border border-[#E5E5E2]">
                    <div className="font-mono text-xs text-[#858585] uppercase">Course Enrollments</div>
                    <div className="text-3xl font-bold font-mono text-[#1400FF] mt-1">788</div>
                    <div className="text-[11px] text-[#555555] mt-0.5">Verified checkout orders</div>
                  </div>
                  <div className="p-4 rounded-xl bg-white border border-[#E5E5E2]">
                    <div className="font-mono text-xs text-[#858585] uppercase">Generated Revenue</div>
                    <div className="text-3xl font-bold font-mono text-[#111111] mt-1">~৳800K</div>
                    <div className="text-[11px] text-[#555555] mt-0.5">Direct sales volume</div>
                  </div>
                </div>

                <div className="space-y-2 mb-8 text-xs text-[#555555]">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1400FF]" />
                    <span>Multi-tiered Meta prospecting targeting career starters and test candidates</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1400FF]" />
                    <span>Objection-busting syllabus creatives emphasizing job outcomes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1400FF]" />
                    <span>Server-side CAPI event deduplication for clean attribution</span>
                  </div>
                </div>
              </div>

              <Button
                href="/case-studies/solution-point"
                variant="primary"
                size="md"
                withArrow
                arrowType="diagonal"
              >
                Read Solution Point Case Study
              </Button>
            </Card>

            {/* Case Study 2: Autonex */}
            <Card surface="soft" className="p-8 sm:p-10 flex flex-col justify-between border-[#D8D8D4]">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="dark">Technology & Automotive</Badge>
                  <span className="font-mono text-xs text-[#858585]">Growth Campaign</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-semibold text-[#111111] mb-2">
                  Autonex Technology
                </h3>
                <p className="text-sm text-[#555555] leading-relaxed mb-6">
                  Automotive technology and hardware specialist generating high-value customer leads and installation revenue through rapid conversational triage.
                </p>

                {/* Key Result Badges */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="p-4 rounded-xl bg-white border border-[#E5E5E2]">
                    <div className="font-mono text-xs text-[#858585] uppercase">Generated Revenue</div>
                    <div className="text-3xl font-bold font-mono text-[#1400FF] mt-1">৳343K+</div>
                    <div className="text-[11px] text-[#555555] mt-0.5">Documented closed sales</div>
                  </div>
                  <div className="p-4 rounded-xl bg-white border border-[#E5E5E2]">
                    <div className="font-mono text-xs text-[#858585] uppercase">Inquiry Pipeline</div>
                    <div className="text-3xl font-bold font-mono text-[#111111] mt-1">WhatsApp</div>
                    <div className="text-[11px] text-[#555555] mt-0.5">Direct conversational qualification</div>
                  </div>
                </div>

                <div className="space-y-2 mb-8 text-xs text-[#555555]">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#111111]" />
                    <span>Demographic and commercial vehicle owner interest targeting</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#111111]" />
                    <span>Demonstration video hooks highlighting technical peace of mind</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#111111]" />
                    <span>Instant WhatsApp auto-responder qualifying technical requirements</span>
                  </div>
                </div>
              </div>

              <Button
                href="/case-studies/autonex"
                variant="secondary"
                size="md"
                withArrow
                arrowType="diagonal"
              >
                Read Autonex Case Study
              </Button>
            </Card>
          </div>
        </Container>
      </section>

      {/* 05. The 5-Phase Campaign Workflow */}
      <section className="py-20 md:py-28 border-b border-[#E5E5E2] bg-[#F7F7F5]">
        <Container>
          <div className="max-w-3xl mb-16">
            <span className="font-mono text-xs uppercase tracking-widest text-[#858585] block mb-2">
              03 // EXECUTION
            </span>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#111111] mb-4">
              How We Run Your Campaigns
            </h2>
            <p className="text-base text-[#555555]">
              A disciplined, milestone-driven protocol from onboarding discovery to weekly budget scaling.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {[
              {
                step: "01",
                title: "Economics Audit",
                desc: "We analyze your margins, target CAC, offer positioning, and customer lifetime value.",
              },
              {
                step: "02",
                title: "Tracking Setup",
                desc: "Implementation of Meta CAPI, Pixel, GA4 events, and UTM tracking links.",
              },
              {
                step: "03",
                title: "Creative Sprints",
                desc: "Design of objection-busting statics, video concept hooks, and copy angles.",
              },
              {
                step: "04",
                title: "Controlled Launch",
                desc: "Campaign deployment with budget caps and rigorous daily ad auction monitoring.",
              },
              {
                step: "05",
                title: "72-Hour Scaling",
                desc: "Pruning underperforming ad sets and scaling proven winner creatives profitably.",
              },
            ].map((phase, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-white border border-[#E5E5E2] flex flex-col justify-between">
                <div>
                  <span className="font-mono text-xs font-bold text-[#1400FF] block mb-3">
                    STAGE {phase.step}
                  </span>
                  <h4 className="text-base font-semibold text-[#111111] mb-2">{phase.title}</h4>
                  <p className="text-xs text-[#555555] leading-relaxed">{phase.desc}</p>
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
              COMMERCIAL GROWTH PARTNERSHIP
            </span>
            <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-white leading-tight">
              Ready to scale your customer acquisition?
            </h2>
            <p className="text-base sm:text-lg text-neutral-300 max-w-xl mx-auto leading-relaxed">
              We review your current ad accounts, assess your offer economics, and provide a realistic acquisition model before you spend budget.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Button href="/start-a-project" variant="accent" size="lg" withArrow arrowType="diagonal">
                Start a Marketing Campaign
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
