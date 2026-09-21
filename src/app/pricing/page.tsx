import React from "react";
import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Accordion } from "@/components/ui/Accordion";
import { FAQ_DATA } from "@/data/faqs";

export const metadata: Metadata = {
  title: "Pricing & Transparent Engagement Scopes",
  description:
    "Explore OneDot ABM's transparent project pricing guide. Custom quotes based on actual scope with zero fake tiers or hidden retainer fees.",
};

const engagementScopes = [
  {
    id: "custom-websites",
    tag: "Corporate & Authority",
    title: "Custom Business Websites",
    pricingType: "Custom Project Quote",
    startingIndicator: "Tailored to Page Scope & Requirements",
    description:
      "Bespoke editorial websites built on Next.js, React, TypeScript, and Tailwind CSS. Engineered for instant load speeds, responsive elegance, and inquiry generation.",
    deliverables: [
      "Custom UI/UX layout design (zero generic templates)",
      "Next.js App Router with Server-Side Rendering (SSR)",
      "Complete mobile-first responsiveness across all screen sizes",
      "High-converting contact & qualification forms",
      "Technical SEO with 95+ Google Lighthouse scores",
      "100% source code repository and intellectual property ownership",
    ],
    timeline: "Typically 2–4 weeks",
    ctaLabel: "Request Website Quote",
    popular: false,
  },
  {
    id: "web-applications",
    tag: "Software & Portals",
    title: "Custom Web Applications & ERP",
    pricingType: "Milestone-Based Scope",
    startingIndicator: "Tailored to Database & Module Complexity",
    description:
      "Full-stack web applications featuring relational databases, custom admin dashboards, role-based access control (RBAC), and automated operational logic.",
    deliverables: [
      "Relational database modeling (Prisma ORM with MySQL/Postgres)",
      "Multi-role user authentication and session management",
      "Role-Based Access Control (RBAC) permission gating",
      "Custom executive admin dashboard with data tables & search",
      "Operational activity audit trail logging staff actions",
      "Third-party payment & API integrations (Stripe, bKash, Nagad)",
    ],
    timeline: "Typically 4–8 weeks",
    ctaLabel: "Request Application Scope",
    popular: true,
  },
  {
    id: "performance-marketing",
    tag: "Paid Acquisition",
    title: "Growth Marketing & Ad Management",
    pricingType: "Monthly Retainer + Performance",
    startingIndicator: "Tailored to Ad Spend & Channel Complexity",
    description:
      "Full-service customer acquisition across Meta and Google Ads. Includes campaign restructuring, direct-response creative production, and server-side CAPI telemetry.",
    deliverables: [
      "Meta Ads & Google Ads campaign setup, restructuring, and management",
      "Continuous creative testing: static banners, video hooks, carousels",
      "Meta Conversions API (CAPI) and GA4 server-side tracking setup",
      "Conversion Rate Optimization (CRO) on landing pages and checkouts",
      "72-hour bid pruning and budget scaling reviews",
      "Formal weekly KPI performance reporting and attribution",
    ],
    timeline: "Ongoing Monthly Partnership",
    ctaLabel: "Book Marketing Consultation",
    popular: false,
  },
  {
    id: "full-stack-partnership",
    tag: "Integrated Growth",
    title: "Full-Stack Growth Partnership",
    pricingType: "Coordinated Retainer / Sprints",
    startingIndicator: "All-in-One Commercial Coordination",
    description:
      "Our flagship unified model: we build and maintain your custom digital web infrastructure while simultaneously running your customer acquisition campaigns.",
    deliverables: [
      "Dedicated full-stack engineering sprints (features, bug fixes, speed)",
      "Comprehensive performance marketing across Meta and Google",
      "Unified attribution telemetry directly connecting ads to database orders",
      "Continuous CRO experiments on checkout flows and landing pages",
      "Direct strategic leadership from founder Dhrubo Duti Biswas",
      "Single point of commercial accountability across all growth levers",
    ],
    timeline: "Quarterly or Annual Growth Retainer",
    ctaLabel: "Apply for Full Partnership",
    popular: false,
  },
];

const pricingDrivers = [
  {
    title: "Technical Architecture & Database Complexity",
    desc: "A custom multi-role application with inventory, RBAC, and activity logs requires deeper architectural modeling than a 5-page corporate website.",
  },
  {
    title: "Volume of Custom Creative Production",
    desc: "For marketing engagements, ad spend volume and the cadence of weekly creative video/static variations determine media team allocation.",
  },
  {
    title: "Integrations & Payment Rails",
    desc: "Connecting custom merchant gateways (bKash/Nagad/Stripe), external ERP APIs, or specialized webhook workflows adds engineering scope.",
  },
  {
    title: "Delivery Timeline & Urgency",
    desc: "Expedited project delivery timelines requiring dedicated sprint capacity are priced accordingly to ensure quality standards.",
  },
];

export default function PricingPage() {
  const pricingFaqs = FAQ_DATA.filter(
    (faq) => faq.category === "Process" || faq.category === "General"
  ).slice(0, 6);

  return (
    <div className="flex flex-col bg-[#F7F7F5]">
      {/* 01. Hero Header */}
      <section className="pt-12 pb-16 md:pt-20 md:pb-24 border-b border-[#E5E5E2]">
        <Container>
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 mb-6">
              <Badge variant="accent" dot>
                TRANSPARENT ENGAGEMENTS
              </Badge>
              <span className="text-xs font-mono text-[#858585] uppercase tracking-wider">
                No Fake Tiers • Real Commercial Scopes
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-[#111111] leading-[1.08] mb-6">
              Clear Scopes. <br />
              <span className="text-[#1400FF]">Honest Project Pricing.</span>
            </h1>

            <p className="text-lg sm:text-xl text-[#555555] leading-relaxed max-w-2xl mb-8">
              We do not sell cookie-cutter SaaS subscription tiers. Every business has unique unit economics, technical workflows, and scale requirements. We provide transparent line-item proposals based strictly on what your project demands.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Button href="/start-a-project" variant="primary" size="lg" withArrow arrowType="diagonal">
                Request a Custom Quote
              </Button>
              <Button href="/contact" variant="secondary" size="lg">
                Book a Discovery Call
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* 02. The 4 Engagement Scopes */}
      <section className="py-20 md:py-28 border-b border-[#E5E5E2] bg-white">
        <Container>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-[#E5E5E2]">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-[#858585] block mb-2">
                01 // ENGAGEMENT MODELS
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-[#111111]">
                Core Commercial Scopes
              </h2>
            </div>
            <p className="text-sm text-[#555555] max-w-md">
              Choose the service model that matches your immediate commercial bottleneck.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-12">
            {engagementScopes.map((scope) => (
              <Card
                key={scope.id}
                surface={scope.popular ? "soft" : "white"}
                className={`p-8 sm:p-10 flex flex-col justify-between border-[#D8D8D4] ${
                  scope.popular ? "ring-1 ring-[#1400FF]" : ""
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant={scope.popular ? "accent" : "subtle"} size="sm">
                      {scope.tag}
                    </Badge>
                    <span className="font-mono text-xs text-[#858585]">{scope.timeline}</span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-semibold text-[#111111] mb-2">
                    {scope.title}
                  </h3>

                  <div className="py-3 border-y border-[#E5E5E2] my-4">
                    <span className="text-lg font-bold font-mono text-[#1400FF] block">
                      {scope.pricingType}
                    </span>
                    <span className="text-xs text-[#555555] font-mono">
                      {scope.startingIndicator}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-[#555555] leading-relaxed mb-6">
                    {scope.description}
                  </p>

                  <div className="space-y-2.5 mb-8">
                    <span className="text-xs font-mono uppercase tracking-wider text-[#111111] font-semibold block">
                      Included in Scope:
                    </span>
                    {scope.deliverables.map((deliv, dIdx) => (
                      <div key={dIdx} className="flex items-start gap-2.5 text-xs text-[#555555]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#1400FF] shrink-0 mt-0.5" />
                        <span>{deliv}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  href={`/start-a-project?service=${scope.id}`}
                  variant={scope.popular ? "primary" : "secondary"}
                  size="md"
                  withArrow
                  arrowType="diagonal"
                  className="w-full"
                >
                  {scope.ctaLabel}
                </Button>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* 03. What Determines Project Pricing */}
      <section className="py-20 md:py-28 border-b border-[#E5E5E2] bg-[#F7F7F5]">
        <Container>
          <div className="max-w-3xl mb-16">
            <span className="font-mono text-xs uppercase tracking-widest text-[#858585] block mb-2">
              02 // SCOPE FACTORS
            </span>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#111111] mb-4">
              What Determines Project Investment
            </h2>
            <p className="text-base text-[#555555]">
              We calculate project fees strictly based on estimated engineering hours, architectural complexity, and advertising management scope.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {pricingDrivers.map((driver, idx) => (
              <div
                key={idx}
                className="p-8 rounded-2xl bg-white border border-[#E5E5E2] space-y-3"
              >
                <span className="font-mono text-xs font-bold text-[#1400FF] block">
                  FACTOR 0{idx + 1}
                </span>
                <h3 className="text-lg font-semibold text-[#111111]">{driver.title}</h3>
                <p className="text-xs sm:text-sm text-[#555555] leading-relaxed">
                  {driver.desc}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 04. Frequently Asked Questions */}
      <section className="py-20 md:py-28 border-b border-[#E5E5E2] bg-white">
        <Container size="narrow">
          <div className="text-center mb-12">
            <span className="font-mono text-xs uppercase tracking-widest text-[#858585] block mb-2">
              03 // QUESTIONS
            </span>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#111111]">
              Frequently Asked Pricing Questions
            </h2>
          </div>

          <Accordion
            items={pricingFaqs.map((faq, index) => ({
              id: faq.id,
              index: `0${index + 1}`,
              badge: faq.category,
              trigger: faq.question,
              content: faq.answer,
            }))}
          />
        </Container>
      </section>

      {/* 05. Conversion CTA */}
      <section className="py-20 md:py-28 bg-[#111111] text-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <span className="font-mono text-xs uppercase tracking-widest text-neutral-400">
              CUSTOM PROPOSAL
            </span>
            <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-white leading-tight">
              Ready for a detailed line-item proposal?
            </h2>
            <p className="text-base sm:text-lg text-neutral-300 max-w-xl mx-auto leading-relaxed">
              Tell us what you are looking to build or scale. We will respond within 24 hours with an initial scope assessment.
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
