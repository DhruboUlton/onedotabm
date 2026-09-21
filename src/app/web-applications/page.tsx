import React from "react";
import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { WEB_APP_SHOWCASE_DATA } from "@/data/projects";

export const metadata: Metadata = {
  title: "Web Applications & Custom Software Architecture",
  description:
    "Explore OneDot ABM's custom full-stack web applications, business operating systems, admin portals, and commerce platforms featuring Next.js, Prisma, and MySQL.",
};

const architectureLayers = [
  {
    layer: "01. Presentation & Client Experience",
    title: "Next.js App Router & React 19",
    description:
      "Server-Side Rendering (SSR) and React Server Components ensure sub-second first contentful paints, optimal Core Web Vitals, and smooth client transitions.",
    points: [
      "Zero template bloat: 100% custom lightweight component architecture",
      "Tailwind CSS styling system eliminating runtime stylesheet calculations",
      "Framer Motion micro-interactions enhancing perceived digital value",
      "Fully responsive touch layouts optimized across mobile and desktop",
    ],
  },
  {
    layer: "02. Logic & Security Gateway",
    title: "Role-Based Access Control (RBAC) & API Layer",
    description:
      "Stateless API endpoints and middleware verification protecting sensitive business records, financial transactions, and client databases.",
    points: [
      "Multi-role user authentication with secure session tokens",
      "Granular permission gates: Super Admin, Catalog Manager, Order Operator, and Client",
      "Automated operational activity audit trails logging staff modifications",
      "Input validation schemas rejecting malicious or malformed payloads",
    ],
  },
  {
    layer: "03. Data Modeling & Persistence",
    title: "Prisma ORM & MySQL Relational Core",
    description:
      "Type-safe relational database schemas providing ACID compliance for order processing, inventory synchronization, and user profiles.",
    points: [
      "Prisma schema migrations maintaining strict database consistency",
      "Normalized relational models for products, categories, variants, and orders",
      "Efficient indexed SQL queries preventing latency during traffic spikes",
      "Automated automated database backup pipelines",
    ],
  },
  {
    layer: "04. Commerce & Integrations",
    title: "Payment Gateways & Telemetry Bridge",
    description:
      "Direct connections to local and international financial rails, messaging systems, and server-side tracking pipelines.",
    points: [
      "bKash, Nagad, Stripe, and SSLCommerz transaction settlement",
      "Cryptographically signed webhook handlers ensuring zero dropped orders",
      "Server-to-server Meta CAPI telemetry for unblocked ad attribution",
      "WhatsApp Business API webhooks for instant order notifications",
    ],
  },
];

const customVsSaaS = [
  {
    feature: "Monthly Software Licensing",
    saas: "$200–$800/mo ongoing in third-party SaaS fees and plugin subscriptions.",
    custom: "Zero monthly software licensing fees. You own the codebase 100% outright.",
  },
  {
    feature: "Workflow Customization",
    saas: "Locked into generic templates; business must warp workflows around software limits.",
    custom: "Engineered 100% around your exact internal operational steps and requirements.",
  },
  {
    feature: "Security & Data Privacy",
    saas: "Your customer records and order data sit in third-party multi-tenant databases.",
    custom: "Self-hosted proprietary relational database with isolated access control.",
  },
  {
    feature: "Speed & Core Web Vitals",
    saas: "Weighed down by 30+ conflicting third-party plugins causing high bounce rates.",
    custom: "Sub-second LCP and 95+ Lighthouse performance scores on modern Next.js stack.",
  },
];

export default function WebApplicationsPage() {
  const kanzie = WEB_APP_SHOWCASE_DATA.find((item) => item.id === "kanzie-system");
  const lumiflick = WEB_APP_SHOWCASE_DATA.find((item) => item.id === "lumiflick-system");

  return (
    <div className="flex flex-col bg-[#F7F7F5]">
      {/* 01. Hero Header */}
      <section className="pt-12 pb-16 md:pt-20 md:pb-24 border-b border-[#E5E5E2]">
        <Container>
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 mb-6">
              <Badge variant="dark" dot>
                TECHNICAL SHOWCASE
              </Badge>
              <span className="text-xs font-mono text-[#858585] uppercase tracking-wider">
                Full-Stack Systems • Portals • ERP
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-[#111111] leading-[1.08] mb-6">
              Custom Software Engineered for{" "}
              <span className="text-[#1400FF]">Real Business Operations.</span>
            </h1>

            <p className="text-lg sm:text-xl text-[#555555] leading-relaxed max-w-2xl mb-8">
              When standard website templates and generic SaaS subscriptions limit your business growth, we build bespoke web applications with relational databases, custom admin dashboards, role-based access control, and complete code ownership.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Button href="/start-a-project" variant="primary" size="lg" withArrow arrowType="diagonal">
                Build a Custom Web App
              </Button>
              <Button href="/contact" variant="secondary" size="lg">
                Book Technical Consultation
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* 02. Interactive Architecture Stack */}
      <section className="py-20 md:py-28 border-b border-[#E5E5E2] bg-white">
        <Container>
          <div className="max-w-3xl mb-16">
            <span className="font-mono text-xs uppercase tracking-widest text-[#858585] block mb-2">
              01 // SYSTEM ARCHITECTURE
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-[#111111] mb-4">
              The OneDot Technical Blueprint
            </h2>
            <p className="text-base sm:text-lg text-[#555555] leading-relaxed">
              Every custom application is structured with clear separation of concerns across four robust engineering layers:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {architectureLayers.map((layer, idx) => (
              <Card key={idx} surface="soft" className="p-8 sm:p-10 flex flex-col justify-between border-[#D8D8D4]">
                <div>
                  <span className="font-mono text-xs uppercase tracking-widest text-[#1400FF] font-semibold block mb-2">
                    {layer.layer}
                  </span>
                  <h3 className="text-2xl font-semibold text-[#111111] mb-3">
                    {layer.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#555555] leading-relaxed mb-6">
                    {layer.description}
                  </p>

                  <div className="space-y-2.5 pt-4 border-t border-[#E5E5E2]">
                    {layer.points.map((pt, pIdx) => (
                      <div key={pIdx} className="flex items-start gap-2.5 text-xs text-[#111111]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#1400FF] shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* 03. Flagship System Deep-Dive: KANZIE */}
      {kanzie && (
        <section className="py-20 md:py-28 border-b border-[#E5E5E2] bg-[#F7F7F5]">
          <Container>
            <div className="p-8 sm:p-12 rounded-3xl bg-white border border-[#D8D8D4] space-y-12">
              {/* Header */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-[#E5E5E2]">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="accent">Full-Stack Application</Badge>
                    <span className="font-mono text-xs text-[#858585]">E-Commerce & ERP</span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-semibold text-[#111111]">
                    KANZIE — Full-Stack Commerce & Admin Platform
                  </h2>
                  <p className="text-sm text-[#555555] max-w-2xl mt-2">
                    {kanzie.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button href="/case-studies/kanzie" variant="primary" size="md" withArrow arrowType="diagonal">
                    Read Case Study
                  </Button>
                  <Button href="https://kanzie.shop/" external variant="secondary" size="md">
                    Visit Live Storefront ↗
                  </Button>
                </div>
              </div>

              {/* System Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {kanzie.stats.map((st, sIdx) => (
                  <div key={sIdx} className="p-5 rounded-2xl bg-[#F7F7F5] border border-[#E5E5E2]">
                    <span className="text-[11px] font-mono text-[#858585] uppercase tracking-wider block">
                      {st.label}
                    </span>
                    <span className="text-xl font-bold font-mono text-[#111111] mt-1 block">
                      {st.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Key System Modules Breakdown */}
              {kanzie.keyModules && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-[#111111]">
                    Key System Modules & Internal Capabilities
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {kanzie.keyModules.map((mod, mIdx) => (
                      <div
                        key={mIdx}
                        className="p-6 rounded-2xl bg-[#F7F7F5] border border-[#E5E5E2] flex flex-col justify-between"
                      >
                        <div>
                          <h4 className="text-base font-semibold text-[#111111] mb-2">
                            {mod.title}
                          </h4>
                          <p className="text-xs text-[#555555] leading-relaxed mb-4">
                            {mod.description}
                          </p>
                        </div>
                        <div className="space-y-1 pt-3 border-t border-[#E5E5E2]">
                          {mod.highlights.map((h, hIdx) => (
                            <div key={hIdx} className="flex items-center gap-1.5 text-[11px] font-mono text-[#1400FF]">
                              <CheckCircle2 className="w-3 h-3 shrink-0" />
                              <span>{h}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Admin Capabilities List */}
              {kanzie.adminCapabilities && (
                <div className="p-6 rounded-2xl bg-[#111111] text-white">
                  <span className="font-mono text-xs uppercase tracking-wider text-[#1400FF] block mb-3 font-semibold">
                    Kanzie Admin Center Features:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs text-neutral-300 font-mono">
                    {kanzie.adminCapabilities.map((cap, cIdx) => (
                      <div key={cIdx} className="flex items-center gap-2">
                        <span className="text-[#1400FF] font-bold">›</span>
                        <span>{typeof cap === "string" ? cap : cap.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Container>
        </section>
      )}

      {/* 04. Flagship System Deep-Dive: LUMIFLICK */}
      {lumiflick && (
        <section className="py-20 md:py-28 border-b border-[#E5E5E2] bg-white">
          <Container>
            <div className="p-8 sm:p-12 rounded-3xl bg-[#F7F7F5] border border-[#D8D8D4] space-y-12">
              {/* Header */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-[#E5E5E2]">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="dark">Visual Commerce Platform</Badge>
                    <span className="font-mono text-xs text-[#858585]">Home Decor & Art</span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-semibold text-[#111111]">
                    LUMIFLICK — Next.js Visual Discovery Platform
                  </h2>
                  <p className="text-sm text-[#555555] max-w-2xl mt-2">
                    {lumiflick.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button href="/case-studies/lumiflick" variant="primary" size="md" withArrow arrowType="diagonal">
                    Read Case Study
                  </Button>
                  <Button href="https://www.lumiflick.shop" external variant="secondary" size="md">
                    Visit Live Storefront ↗
                  </Button>
                </div>
              </div>

              {/* System Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {lumiflick.stats.map((st, sIdx) => (
                  <div key={sIdx} className="p-5 rounded-2xl bg-white border border-[#E5E5E2]">
                    <span className="text-[11px] font-mono text-[#858585] uppercase tracking-wider block">
                      {st.label}
                    </span>
                    <span className="text-xl font-bold font-mono text-[#111111] mt-1 block">
                      {st.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Key System Modules Breakdown */}
              {lumiflick.keyModules && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-[#111111]">
                    Platform Architecture & Experience Highlights
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {lumiflick.keyModules.map((mod, mIdx) => (
                      <div
                        key={mIdx}
                        className="p-6 rounded-2xl bg-white border border-[#E5E5E2] flex flex-col justify-between"
                      >
                        <div>
                          <h4 className="text-base font-semibold text-[#111111] mb-2">
                            {mod.title}
                          </h4>
                          <p className="text-xs text-[#555555] leading-relaxed mb-4">
                            {mod.description}
                          </p>
                        </div>
                        <div className="space-y-1 pt-3 border-t border-[#E5E5E2]">
                          {mod.highlights.map((h, hIdx) => (
                            <div key={hIdx} className="flex items-center gap-1.5 text-[11px] font-mono text-[#111111]">
                              <CheckCircle2 className="w-3 h-3 text-[#1400FF] shrink-0" />
                              <span>{h}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Container>
        </section>
      )}

      {/* 05. Comparison: Custom Software vs SaaS / WordPress */}
      <section className="py-20 md:py-28 border-b border-[#E5E5E2] bg-[#F7F7F5]">
        <Container>
          <div className="max-w-3xl mb-12">
            <span className="font-mono text-xs uppercase tracking-widest text-[#858585] block mb-2">
              03 // STRATEGIC VALUE
            </span>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#111111] mb-4">
              Custom Software vs. SaaS & WordPress Plugins
            </h2>
            <p className="text-base text-[#555555]">
              Why growing brands choose bespoke full-stack applications instead of renting fragile software subscriptions.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[640px]">
              <thead>
                <tr className="border-b border-[#D8D8D4] text-xs font-mono uppercase tracking-wider text-[#858585]">
                  <th className="py-4 px-6 w-1/4">Commercial Feature</th>
                  <th className="py-4 px-6 w-3/8 text-neutral-600 bg-neutral-200/50 rounded-t-xl">
                    SaaS / Plugin Stacks
                  </th>
                  <th className="py-4 px-6 w-3/8 text-[#1400FF] bg-[rgba(20,0,255,0.03)] rounded-t-xl">
                    OneDot Custom Web Applications
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E5E2] text-sm">
                {customVsSaaS.map((item, index) => (
                  <tr key={index} className="hover:bg-white/50 transition-colors">
                    <td className="py-5 px-6 font-medium text-[#111111] align-top">
                      {item.feature}
                    </td>
                    <td className="py-5 px-6 text-[#555555] bg-neutral-100/40 align-top">
                      {item.saas}
                    </td>
                    <td className="py-5 px-6 text-[#111111] bg-[rgba(20,0,255,0.02)] align-top font-medium">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#1400FF] shrink-0 mt-0.5" />
                        <span>{item.custom}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </section>

      {/* 06. Conversion CTA */}
      <section className="py-20 md:py-28 bg-[#111111] text-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <span className="font-mono text-xs uppercase tracking-widest text-neutral-400">
              CUSTOM WEB APPLICATION ENGINEERING
            </span>
            <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-white leading-tight">
              Ready to build your bespoke software system?
            </h2>
            <p className="text-base sm:text-lg text-neutral-300 max-w-xl mx-auto leading-relaxed">
              We model your relational database, engineer the user storefront and admin portal, and deliver a production-ready application you own forever.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Button href="/start-a-project" variant="accent" size="lg" withArrow arrowType="diagonal">
                Start a Development Project
              </Button>
              <Button href="/contact" variant="outline" size="lg" className="border-neutral-700 text-white hover:bg-neutral-800">
                Book a Technical Consultation
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
