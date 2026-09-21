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
  title: "Web Development & Custom Software Engineering",
  description:
    "Bespoke websites, high-converting e-commerce platforms, and custom web applications built with Next.js, React, TypeScript, Laravel, and MySQL.",
};

const devCapabilities = [
  {
    category: "Corporate & Brand Authority",
    title: "Business & Corporate Websites",
    description:
      "Bespoke editorial websites designed around your commercial proposition. Engineered on Next.js and Tailwind CSS for instant load speeds, responsive elegance, and maximum inquiry conversion.",
    deliverables: [
      "Custom editorial UI/UX architecture (zero generic templates)",
      "Next.js App Router with Server-Side Rendering (SSR)",
      "Mobile-first responsive engineering across all devices",
      "High-converting inquiry forms with automated notifications",
      "Technical SEO with 95+ Google Lighthouse scores",
    ],
    tech: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
  },
  {
    category: "Full-Stack Commerce",
    title: "Custom E-Commerce Platforms",
    description:
      "High-performance online shopping storefronts backed by complete internal commerce management systems for products, inventory, orders, and customer accounts.",
    deliverables: [
      "Visual discovery storefront with catalog taxonomy",
      "Frictionless checkout journey optimized for mobile shoppers",
      "Custom administrative back-office for order lifecycle processing",
      "Real-time inventory control with automated low-stock warnings",
      "bKash, Nagad, Stripe, and Cash-on-Delivery payment flows",
    ],
    tech: ["Next.js", "Prisma", "MySQL", "Node.js"],
  },
  {
    category: "Proprietary Software Systems",
    title: "Custom Web Applications",
    description:
      "When off-the-shelf software tools cannot support your operational workflows, we build bespoke full-stack applications with relational databases, role-based access, and automated business logic.",
    deliverables: [
      "Relational database architecture (MySQL / PostgreSQL)",
      "Multi-role user authentication and session management",
      "Role-Based Access Control (RBAC) permission gating",
      "RESTful API endpoints with strict server-side validation",
      "Operational activity audit trails tracking staff actions",
    ],
    tech: ["Next.js", "Laravel", "PHP", "Prisma", "MySQL"],
  },
  {
    category: "Business Command Centers",
    title: "Admin Panels & Dashboards",
    description:
      "Clean, high-speed operational dashboards that give business owners single-pane visibility over daily transactions, active leads, inventory, and staff output.",
    deliverables: [
      "Real-time executive KPI dashboards (revenue, orders, leads)",
      "High-speed data management tables with instant search and filters",
      "Staff management interface with permission delegations",
      "Code-free promotional banner and content controls",
    ],
    tech: ["React", "TypeScript", "Tailwind CSS", "MySQL"],
  },
  {
    category: "Client Relationship Infrastructure",
    title: "Dedicated Client Portals",
    description:
      "Private authenticated workspaces where your clients can monitor live deliverable statuses, review timeline milestones, download assets, and inspect invoice histories.",
    deliverables: [
      "Isolated authenticated client workspaces",
      "Visual deliverable progress tracker (Pending → Delivered)",
      "Centralized project asset and file repository",
      "Transparent invoice and payment status history",
    ],
    tech: ["Next.js", "React", "Node.js", "Tailwind CSS"],
  },
  {
    category: "Ecosystem Connectivity",
    title: "Payment & API Integrations",
    description:
      "Connect your web platforms securely to local and global payment gateways, CRM databases, WhatsApp business messaging, and marketing telemetry systems.",
    deliverables: [
      "Payment gateway integration (Stripe, SSLCommerz, bKash, Nagad)",
      "Secure webhook handlers with cryptographic signature verification",
      "CRM and WhatsApp business messaging automations",
      "Third-party RESTful API connections and middleware logic",
    ],
    tech: ["REST APIs", "Webhooks", "Node.js", "bKash/Nagad API"],
  },
];

const techStack = [
  { name: "Next.js", category: "Frontend / Full-Stack", role: "SSR, React Server Components & Routing" },
  { name: "React", category: "Frontend Framework", role: "Dynamic interactive components & state" },
  { name: "TypeScript", category: "Language", role: "End-to-end type safety & contract validation" },
  { name: "Laravel", category: "Backend Framework", role: "Robust MVC backend & REST API engines" },
  { name: "PHP", category: "Backend Language", role: "Server-side computing & ecosystem compatibility" },
  { name: "Node.js", category: "Runtime", role: "High-concurrency API routes & background jobs" },
  { name: "Prisma", category: "ORM", role: "Type-safe database modeling & schema migrations" },
  { name: "MySQL", category: "Database", role: "ACID-compliant relational transactional data" },
  { name: "Tailwind CSS", category: "Styling", role: "Editorial design system with zero runtime CSS" },
];

export default function WebDevServicesPage() {
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
              <Badge variant="dark" dot>
                PILLAR 02 // WEB DEVELOPMENT
              </Badge>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-[#111111] leading-[1.08] mb-6">
              Engineering Digital Systems That{" "}
              <span className="text-[#1400FF]">Convert & Support Scale.</span>
            </h1>

            <p className="text-lg sm:text-xl text-[#555555] leading-relaxed max-w-2xl mb-8">
              We architect custom websites, e-commerce platforms, and web applications built around your business logic. Zero slow templates, zero third-party plugin bloat—just clean, type-safe software that you own completely.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Button href="/start-a-project" variant="primary" size="lg" withArrow arrowType="diagonal">
                Start a Development Project
              </Button>
              <Button href="/web-applications" variant="secondary" size="lg" withArrow arrowType="diagonal">
                Explore Web App Showcase
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* 02. Engineering Principles Strip */}
      <section className="py-8 bg-white border-b border-[#E5E5E2]">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 border-r border-[#E5E5E2] last:border-0">
              <div className="text-2xl sm:text-3xl font-bold font-mono text-[#111111]">Sub-Second</div>
              <div className="text-xs font-medium text-[#555555] mt-1">Page Load Speeds</div>
            </div>
            <div className="p-4 border-r border-[#E5E5E2] last:border-0">
              <div className="text-2xl sm:text-3xl font-bold font-mono text-[#1400FF]">100%</div>
              <div className="text-xs font-medium text-[#555555] mt-1">Codebase Ownership</div>
            </div>
            <div className="p-4 border-r border-[#E5E5E2] last:border-0">
              <div className="text-2xl sm:text-3xl font-bold font-mono text-[#111111]">0 Bloat</div>
              <div className="text-xs font-medium text-[#555555] mt-1">No Brittle Plugins</div>
            </div>
            <div className="p-4">
              <div className="text-2xl sm:text-3xl font-bold font-mono text-[#1400FF]">RBAC</div>
              <div className="text-xs font-medium text-[#555555] mt-1">Granular Role Security</div>
            </div>
          </div>
        </Container>
      </section>

      {/* 03. Granular Capabilities */}
      <section className="py-20 md:py-28 border-b border-[#E5E5E2] bg-[#F7F7F5]">
        <Container>
          <div className="max-w-3xl mb-16">
            <span className="font-mono text-xs uppercase tracking-widest text-[#858585] block mb-2">
              01 // DEVELOPMENT SCOPE
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-[#111111] mb-4">
              Web Capabilities Engineered for Business
            </h2>
            <p className="text-base sm:text-lg text-[#555555] leading-relaxed">
              We select technical stacks based on what your commercial operations demand. Every project is built as a permanent digital asset with clean documentation and modular architecture.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {devCapabilities.map((item, index) => (
              <Card key={index} surface="white" hoverEffect className="p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs uppercase tracking-wider text-[#858585]">
                      {item.category}
                    </span>
                    <Badge variant="subtle" size="sm">
                      {item.tech[0]}
                    </Badge>
                  </div>

                  <h3 className="text-xl font-semibold text-[#111111] mb-3">
                    {item.title}
                  </h3>

                  <p className="text-xs text-[#555555] leading-relaxed mb-6">
                    {item.description}
                  </p>

                  <div className="space-y-2 pt-4 border-t border-[#E5E5E2] mb-6">
                    {item.deliverables.map((deliv, dIndex) => (
                      <div key={dIndex} className="flex items-start gap-2 text-xs text-[#555555]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#111111] shrink-0 mt-0.5" />
                        <span className="leading-tight">{deliv}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E5E5E2]/60">
                  <div className="flex flex-wrap gap-1 mb-4">
                    {item.tech.map((t, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2 py-0.5 text-[10px] font-mono bg-[#F7F7F5] border border-[#E5E5E2] rounded text-[#555555]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-[#111111] hover:text-[#1400FF] hover:underline"
                  >
                    <span>Discuss project scope</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* 04. Technology Layer Breakdown */}
      <section className="py-20 md:py-28 border-b border-[#E5E5E2] bg-white">
        <Container>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-[#E5E5E2]">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-[#858585] block mb-2">
                02 // TECH STACK
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-[#111111]">
                Our Technology Standards
              </h2>
            </div>
            <p className="text-sm text-[#555555] max-w-md">
              We build with battle-tested modern tools chosen for speed, developer ecosystem longevity, and operational resilience.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-12">
            {techStack.map((tech, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl border border-[#E5E5E2] bg-[#F7F7F5] hover:border-[#D8D8D4] transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-lg font-bold text-[#111111]">{tech.name}</span>
                  <Badge variant="subtle" size="sm">
                    {tech.category}
                  </Badge>
                </div>
                <p className="text-xs text-[#555555] leading-relaxed">{tech.role}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 05. Flagship Production Showcases (Kanzie & Lumiflick) */}
      <section className="py-20 md:py-28 border-b border-[#E5E5E2] bg-[#F7F7F5]">
        <Container>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-[#E5E5E2]">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-[#858585] block mb-2">
                03 // DIGITAL PRODUCTS
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-[#111111]">
                Flagship Web System Projects
              </h2>
            </div>
            <p className="text-sm text-[#555555] max-w-md">
              We present our projects as complete digital systems with deep administrative logic, not just decorative surface templates.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-12">
            {/* Kanzie Card */}
            <Card surface="white" className="p-8 sm:p-10 flex flex-col justify-between border-[#D8D8D4]">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="accent">Full-Stack E-Commerce & ERP</Badge>
                  <span className="font-mono text-xs text-[#858585]">Live System</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-semibold text-[#111111] mb-2">
                  KANZIE
                </h3>

                <p className="text-sm text-[#555555] leading-relaxed mb-6">
                  A custom full-stack web application built for an imported toy brand. Features customer-facing catalog storefront and a centralized Kanzie Admin Center with inventory control, multi-state order pipelines, RBAC staff permissions, and automated activity logging.
                </p>

                <div className="p-4 rounded-xl bg-[#F7F7F5] border border-[#E5E5E2] mb-6 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[#858585] font-mono">Architecture:</span>
                    <span className="text-[#111111] font-semibold font-mono">Next.js + Prisma + MySQL</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#858585] font-mono">Security:</span>
                    <span className="text-[#111111] font-semibold font-mono">Role-Based Access (RBAC)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#858585] font-mono">Auditability:</span>
                    <span className="text-[#111111] font-semibold font-mono">Automated Staff Action Logs</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button href="/case-studies/kanzie" variant="primary" size="sm" withArrow arrowType="diagonal">
                  Read Case Study
                </Button>
                <Button href="/web-applications" variant="secondary" size="sm">
                  View Web App Specs
                </Button>
              </div>
            </Card>

            {/* Lumiflick Card */}
            <Card surface="white" className="p-8 sm:p-10 flex flex-col justify-between border-[#D8D8D4]">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="dark">Visual E-Commerce Platform</Badge>
                  <span className="font-mono text-xs text-[#858585]">Live Store</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-semibold text-[#111111] mb-2">
                  LUMIFLICK
                </h3>

                <p className="text-sm text-[#555555] leading-relaxed mb-6">
                  A modern e-commerce platform built for a premium glass wall-art brand. Designed around high-definition visual storytelling, curated category exploration (Anime, Cars, Islamic, Nature), smooth checkout flow, and a Prisma-backed relational database.
                </p>

                <div className="p-4 rounded-xl bg-[#F7F7F5] border border-[#E5E5E2] mb-6 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[#858585] font-mono">Architecture:</span>
                    <span className="text-[#111111] font-semibold font-mono">Next.js + React + Prisma</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#858585] font-mono">Collections:</span>
                    <span className="text-[#111111] font-semibold font-mono">7+ Curated Lifestyle Themes</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#858585] font-mono">Performance:</span>
                    <span className="text-[#111111] font-semibold font-mono">Sub-Second First Render</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button href="/case-studies/lumiflick" variant="primary" size="sm" withArrow arrowType="diagonal">
                  Read Case Study
                </Button>
                <Button href="https://www.lumiflick.shop" external variant="secondary" size="sm">
                  Visit Live Store ↗
                </Button>
              </div>
            </Card>
          </div>
        </Container>
      </section>

      {/* 06. Conversion CTA */}
      <section className="py-20 md:py-28 bg-[#111111] text-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <span className="font-mono text-xs uppercase tracking-widest text-neutral-400">
              CUSTOM SOFTWARE & DIGITAL SYSTEMS
            </span>
            <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-white leading-tight">
              Ready to build your bespoke web application?
            </h2>
            <p className="text-base sm:text-lg text-neutral-300 max-w-xl mx-auto leading-relaxed">
              Tell us what features and workflows you require. We will evaluate technical scope, model the database schema, and provide a fixed-milestone roadmap.
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
