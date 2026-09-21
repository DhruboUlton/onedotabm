import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  TrendingUp,
  Code2,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Zap,
  Target,
  Globe,
  Users,
  Megaphone,
  Filter,
  Palette,
  Search,
  Activity,
  Laptop,
  ShoppingBag,
  LayoutDashboard,
  ShieldCheck,
  Cpu,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Accordion } from "@/components/ui/Accordion";
import { marketingServices, webDevelopmentServices } from "@/data/services";
import { FAQ_DATA } from "@/data/faqs";

export const metadata: Metadata = {
  title: "Services & Capabilities",
  description:
    "Explore OneDot ABM's dual capabilities: high-ROAS performance marketing and bespoke web application development designed to acquire and convert customers.",
};

const serviceIcons: Record<string, React.ReactNode> = {
  Target: <Target className="w-5 h-5 text-[#1400FF]" />,
  Globe: <Globe className="w-5 h-5 text-[#1400FF]" />,
  TrendingUp: <TrendingUp className="w-5 h-5 text-[#1400FF]" />,
  Users: <Users className="w-5 h-5 text-[#1400FF]" />,
  Megaphone: <Megaphone className="w-5 h-5 text-[#1400FF]" />,
  Filter: <Filter className="w-5 h-5 text-[#1400FF]" />,
  Palette: <Palette className="w-5 h-5 text-[#1400FF]" />,
  Search: <Search className="w-5 h-5 text-[#1400FF]" />,
  Activity: <Activity className="w-5 h-5 text-[#1400FF]" />,
  Laptop: <Laptop className="w-5 h-5 text-[#1400FF]" />,
  ShoppingBag: <ShoppingBag className="w-5 h-5 text-[#1400FF]" />,
  Code2: <Code2 className="w-5 h-5 text-[#1400FF]" />,
  LayoutDashboard: <LayoutDashboard className="w-5 h-5 text-[#1400FF]" />,
  ShieldCheck: <ShieldCheck className="w-5 h-5 text-[#1400FF]" />,
  Cpu: <Cpu className="w-5 h-5 text-[#1400FF]" />,
};

const comparisonPoints = [
  {
    criteria: "Responsibility & Accountability",
    disconnected: "Marketing blames the website for low conversion; developers blame ad traffic quality.",
    onedot: "Single point of commercial accountability across both the ads and the digital conversion infrastructure.",
  },
  {
    criteria: "Data Tracking & Attribution",
    disconnected: "Surface-level browser pixels that lose 30%+ of conversion events to iOS and ad-blockers.",
    onedot: "Server-side Meta CAPI and GA4 custom telemetry directly wired into backend database actions.",
  },
  {
    criteria: "Speed to Execution",
    disconnected: "Weeks of back-and-forth between external agencies to deploy a single landing page or checkout test.",
    onedot: "Rapid in-house synchronization: ad hooks, landing page layouts, and payment workflows built together.",
  },
  {
    criteria: "Technical Infrastructure",
    disconnected: "Bloated page builders and fragile WordPress plugins prone to slow load times and security flaws.",
    onedot: "Custom Next.js, React, and Laravel codebases with sub-second performance and full client code ownership.",
  },
];

export default function ServicesPage() {
  const serviceFaqs = FAQ_DATA.filter(
    (faq) => faq.category === "General" || faq.category === "Marketing" || faq.category === "Web Development"
  ).slice(0, 6);

  return (
    <div className="flex flex-col bg-[#F7F7F5]">
      {/* 01. Hero Header */}
      <section className="pt-12 pb-16 md:pt-20 md:pb-24 border-b border-[#E5E5E2]">
        <Container>
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 mb-6">
              <Badge variant="accent" dot pulse>
                DUAL CAPABILITY ARCHITECTURE
              </Badge>
              <span className="text-xs font-mono text-[#858585] uppercase tracking-wider">
                Marketing & Web Engineering
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-[#111111] leading-[1.08] mb-6">
              Two Disciplines. <br />
              <span className="text-[#1400FF]">One Unified Engine.</span>
            </h1>

            <p className="text-lg sm:text-xl text-[#555555] leading-relaxed max-w-2xl mb-8">
              Most businesses struggle because their marketing agency doesn&apos;t understand software architecture, and their web development shop doesn&apos;t know how to acquire paying customers. OneDot ABM bridges this divide.
            </p>

            {/* Quick Proof Metrics Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-[#E5E5E2]">
              <div>
                <div className="text-2xl sm:text-3xl font-bold font-mono text-[#111111]">30+</div>
                <div className="text-xs text-[#555555] mt-0.5">Brands Scaled</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold font-mono text-[#111111]">300+</div>
                <div className="text-xs text-[#555555] mt-0.5">Ad Campaigns Managed</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold font-mono text-[#1400FF]">$70K+</div>
                <div className="text-xs text-[#555555] mt-0.5">Meta Ad Spend Overseen</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold font-mono text-[#111111]">15+</div>
                <div className="text-xs text-[#555555] mt-0.5">Websites & Web Apps</div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 02. The Two Core Pillars */}
      <section className="py-20 md:py-28 border-b border-[#E5E5E2] bg-white">
        <Container>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-[#E5E5E2]">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-[#858585] block mb-2">
                01 // THE PILLARS
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-[#111111]">
                Our Main Business Pillars
              </h2>
            </div>
            <p className="text-sm text-[#555555] max-w-md">
              Whether you need scalable customer acquisition, custom digital products, or both working together, we execute with verified commercial standards.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-12">
            {/* Marketing Pillar Card */}
            <Card surface="soft" className="p-8 sm:p-10 flex flex-col justify-between border-[#D8D8D4]">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-[#E5E5E2] flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-[#1400FF]" />
                  </div>
                  <Badge variant="accent" uppercase>
                    Acquisition Engine
                  </Badge>
                </div>

                <span className="font-mono text-xs uppercase tracking-widest text-[#858585]">
                  Pillar 01
                </span>
                <h3 className="text-2xl sm:text-3xl font-semibold text-[#111111] mt-1 mb-4">
                  Growth & Performance Marketing
                </h3>

                <p className="text-sm sm:text-base text-[#555555] leading-relaxed mb-6">
                  Customer acquisition strategies built on unit economics, creative psychology, and algorithmic media buying across Meta and Google. We turn ad spend into predictable revenue.
                </p>

                <div className="space-y-3 mb-8">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#111111] font-semibold block">
                    Core Marketing Disciplines:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#555555]">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1400FF]" />
                      <span>Meta & Facebook Ads</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1400FF]" />
                      <span>Google Ads & Search PPC</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1400FF]" />
                      <span>Lead Generation Systems</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1400FF]" />
                      <span>Direct-Response Creatives</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1400FF]" />
                      <span>Funnel Strategy & CRO</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1400FF]" />
                      <span>Server-Side CAPI & GA4</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white border border-[#E5E5E2] mb-8 text-xs text-[#555555]">
                  <strong className="text-[#111111] font-semibold">Verified Proof: </strong>
                  788 paid course orders generated for Solution Point (~৳800K revenue) & ৳343K+ in documented revenue for Autonex.
                </div>
              </div>

              <Button
                href="/services/marketing"
                variant="primary"
                size="md"
                withArrow
                arrowType="diagonal"
                className="w-full sm:w-auto"
              >
                Deep-Dive Into Marketing Capabilities
              </Button>
            </Card>

            {/* Web Development Pillar Card */}
            <Card surface="soft" className="p-8 sm:p-10 flex flex-col justify-between border-[#D8D8D4]">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-[#E5E5E2] flex items-center justify-center">
                    <Code2 className="w-6 h-6 text-[#111111]" />
                  </div>
                  <Badge variant="dark" uppercase>
                    Digital Infrastructure
                  </Badge>
                </div>

                <span className="font-mono text-xs uppercase tracking-widest text-[#858585]">
                  Pillar 02
                </span>
                <h3 className="text-2xl sm:text-3xl font-semibold text-[#111111] mt-1 mb-4">
                  Web Development & Custom Systems
                </h3>

                <p className="text-sm sm:text-base text-[#555555] leading-relaxed mb-6">
                  Custom-coded web applications, e-commerce platforms, corporate websites, and administrative dashboards engineered for sub-second speeds, zero template bloat, and total client ownership.
                </p>

                <div className="space-y-3 mb-8">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#111111] font-semibold block">
                    Core Engineering Disciplines:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#555555]">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#111111]" />
                      <span>Business & Corporate Websites</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#111111]" />
                      <span>Custom E-Commerce Platforms</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#111111]" />
                      <span>Custom Web Applications & ERP</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#111111]" />
                      <span>Admin Dashboards & Portals</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#111111]" />
                      <span>Role-Based Access Control (RBAC)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#111111]" />
                      <span>bKash, Nagad & Stripe Integrations</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white border border-[#E5E5E2] mb-8 text-xs text-[#555555]">
                  <strong className="text-[#111111] font-semibold">Flagship Showcase: </strong>
                  Kanzie full-stack retail platform with custom inventory and staff audit logs, and Lumiflick visual glass-poster commerce platform.
                </div>
              </div>

              <Button
                href="/services/web-development"
                variant="secondary"
                size="md"
                withArrow
                arrowType="diagonal"
                className="w-full sm:w-auto"
              >
                Deep-Dive Into Web Development
              </Button>
            </Card>
          </div>
        </Container>
      </section>

      {/* 03. Model Comparison (The OneDot Synergy) */}
      <section className="py-20 md:py-28 border-b border-[#E5E5E2] bg-[#F7F7F5]">
        <Container>
          <div className="max-w-3xl mb-12">
            <span className="font-mono text-xs uppercase tracking-widest text-[#858585] block mb-2">
              02 // THE UNIFIED ADVANTAGE
            </span>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#111111] mb-4">
              Disconnected Agencies vs. OneDot ABM
            </h2>
            <p className="text-base text-[#555555] leading-relaxed">
              When marketing and technical development sit in separate silos, your growth machine leaks budget at every seam. Here is how our unified execution model changes outcomes:
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[640px]">
              <thead>
                <tr className="border-b border-[#D8D8D4] text-xs font-mono uppercase tracking-wider text-[#858585]">
                  <th className="py-4 px-6 w-1/4">Evaluation Point</th>
                  <th className="py-4 px-6 w-3/8 text-rose-600 bg-rose-50/50 rounded-t-xl">
                    Traditional Fragmented Agency
                  </th>
                  <th className="py-4 px-6 w-3/8 text-[#1400FF] bg-[rgba(20,0,255,0.03)] rounded-t-xl">
                    OneDot ABM Unified Model
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E5E2] text-sm">
                {comparisonPoints.map((item, index) => (
                  <tr key={index} className="hover:bg-white/50 transition-colors">
                    <td className="py-5 px-6 font-medium text-[#111111] align-top">
                      {item.criteria}
                    </td>
                    <td className="py-5 px-6 text-[#555555] bg-rose-50/20 align-top">
                      <div className="flex items-start gap-2.5">
                        <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                        <span>{item.disconnected}</span>
                      </div>
                    </td>
                    <td className="py-5 px-6 text-[#111111] bg-[rgba(20,0,255,0.02)] align-top font-medium">
                      <div className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-[#1400FF] shrink-0 mt-0.5" />
                        <span>{item.onedot}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </section>

      {/* 04. Detailed Service Breakdown Catalog */}
      <section className="py-20 md:py-28 border-b border-[#E5E5E2] bg-white">
        <Container>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-[#E5E5E2]">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-[#858585] block mb-2">
                03 // COMPLETE CATALOG
              </span>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#111111]">
                Granular Service Capabilities
              </h2>
            </div>
            <p className="text-sm text-[#555555] max-w-md">
              Every deliverable is defined by documented scope, measurable business outcomes, and transparent technical execution.
            </p>
          </div>

          {/* Marketing Sub-List */}
          <div className="pt-12">
            <div className="flex items-center gap-3 mb-8">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1400FF]" />
              <h3 className="text-xl sm:text-2xl font-semibold text-[#111111]">
                Marketing & Customer Acquisition Services
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {marketingServices.map((service) => (
                <Card
                  key={service.id}
                  surface="white"
                  hoverEffect
                  className="p-6 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-[#F7F7F5] border border-[#E5E5E2] flex items-center justify-center">
                        {serviceIcons[service.iconName] || <Zap className="w-5 h-5 text-[#1400FF]" />}
                      </div>
                      <Badge variant="subtle" size="sm">
                        {service.tags[0]}
                      </Badge>
                    </div>

                    <h4 className="text-lg font-semibold text-[#111111] mb-2">
                      {service.title}
                    </h4>

                    <p className="text-xs text-[#555555] leading-relaxed mb-4">
                      {service.shortDescription}
                    </p>

                    <div className="space-y-1.5 pt-3 border-t border-[#E5E5E2] mb-4">
                      <span className="text-[11px] font-mono uppercase text-[#858585] block mb-1">
                        Key Deliverables:
                      </span>
                      {service.deliverables.slice(0, 3).map((deliv, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-xs text-[#555555]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#1400FF] shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{deliv.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Link
                    href="/services/marketing"
                    className="inline-flex items-center gap-1 text-xs font-mono font-medium text-[#1400FF] hover:underline pt-2"
                  >
                    <span>View marketing details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </Card>
              ))}
            </div>
          </div>

          {/* Web Development Sub-List */}
          <div className="pt-16">
            <div className="flex items-center gap-3 mb-8">
              <span className="w-2.5 h-2.5 rounded-full bg-[#111111]" />
              <h3 className="text-xl sm:text-2xl font-semibold text-[#111111]">
                Web Development & Custom Software Services
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {webDevelopmentServices.map((service) => (
                <Card
                  key={service.id}
                  surface="white"
                  hoverEffect
                  className="p-6 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-[#F7F7F5] border border-[#E5E5E2] flex items-center justify-center">
                        {serviceIcons[service.iconName] || <Code2 className="w-5 h-5 text-[#111111]" />}
                      </div>
                      <Badge variant="subtle" size="sm">
                        {service.tags[0]}
                      </Badge>
                    </div>

                    <h4 className="text-lg font-semibold text-[#111111] mb-2">
                      {service.title}
                    </h4>

                    <p className="text-xs text-[#555555] leading-relaxed mb-4">
                      {service.shortDescription}
                    </p>

                    <div className="space-y-1.5 pt-3 border-t border-[#E5E5E2] mb-4">
                      <span className="text-[11px] font-mono uppercase text-[#858585] block mb-1">
                        Key Deliverables:
                      </span>
                      {service.deliverables.slice(0, 3).map((deliv, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-xs text-[#555555]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#111111] shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{deliv.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Link
                    href="/services/web-development"
                    className="inline-flex items-center gap-1 text-xs font-mono font-medium text-[#111111] hover:underline pt-2"
                  >
                    <span>View web dev details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* 05. Frequently Asked Questions */}
      <section className="py-20 md:py-28 border-b border-[#E5E5E2] bg-[#F7F7F5]">
        <Container size="narrow">
          <div className="text-center mb-12">
            <span className="font-mono text-xs uppercase tracking-widest text-[#858585] block mb-2">
              04 // FAQ
            </span>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#111111]">
              Questions About Our Services
            </h2>
          </div>

          <Accordion
            items={serviceFaqs.map((faq, index) => ({
              id: faq.id,
              index: `0${index + 1}`,
              badge: faq.category,
              trigger: faq.question,
              content: faq.answer,
            }))}
          />
        </Container>
      </section>

      {/* 06. Conversion CTA */}
      <section className="py-20 md:py-28 bg-[#111111] text-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <span className="font-mono text-xs uppercase tracking-widest text-neutral-400">
              COMMERCIAL EXECUTION // READY TO SCALE
            </span>
            <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-white leading-tight">
              Have a marketing or software project to build?
            </h2>
            <p className="text-base sm:text-lg text-neutral-300 max-w-xl mx-auto leading-relaxed">
              Tell us what you are working on. We will review your current situation, audit requirements, and propose the right strategic engagement.
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
