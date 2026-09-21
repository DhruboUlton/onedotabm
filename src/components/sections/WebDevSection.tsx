"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import {
  Globe,
  ShoppingCart,
  Cpu,
  LayoutDashboard,
  ShieldCheck,
  CreditCard,
  ArrowRight,
  Code2,
} from "lucide-react";

interface WebCard {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  tech: string;
}

const WEB_DEV_CARDS: WebCard[] = [
  {
    id: "business-websites",
    icon: Globe,
    title: "Business Websites",
    description: "Fast, modern editorial sites tailored to brand authority and lead conversion.",
    tech: "Next.js • React",
  },
  {
    id: "e-commerce",
    icon: ShoppingCart,
    title: "E-Commerce Platforms",
    description: "Custom storefronts with frictionless checkout and back-office order workflows.",
    tech: "Next.js • Prisma",
  },
  {
    id: "web-applications",
    icon: Cpu,
    title: "Web Applications",
    description: "Bespoke full-stack platforms engineered around complex business operations.",
    tech: "Laravel • React",
  },
  {
    id: "admin-panels",
    icon: LayoutDashboard,
    title: "Admin Panels",
    description: "Operational back-office dashboards with granular role-based permissions.",
    tech: "Postgres • APIs",
  },
  {
    id: "client-portals",
    icon: ShieldCheck,
    title: "Client Portals",
    description: "Secure customer self-service workspaces with real-time status and telemetry.",
    tech: "TypeScript • Auth",
  },
  {
    id: "api-integrations",
    icon: CreditCard,
    title: "API & Payment Integrations",
    description: "Resilient bKash, Nagad, Stripe, and third-party webhook integrations.",
    tech: "CAPI • Node.js",
  },
];

const TECH_STACK = [
  { name: "Next.js", category: "Framework", line: "Server Components & Edge rendering" },
  { name: "React", category: "Frontend", line: "High-performance reactive interfaces" },
  { name: "TypeScript", category: "Language", line: "End-to-end type safety & reliability" },
  { name: "Laravel", category: "Backend", line: "Robust application architecture & auth" },
  { name: "Node.js", category: "Runtime", line: "High-throughput asynchronous APIs" },
  { name: "PostgreSQL", category: "Database", line: "Relational ACID data integrity" },
  { name: "Supabase", category: "Backend", line: "Real-time Postgres database & storage" },
  { name: "Tailwind", category: "Styling", line: "Utility-first design tokens" },
];

export function WebDevSection() {
  const [hoveredTech, setHoveredTech] = useState<string | null>(null);

  return (
    <section id="development" className="py-16 md:py-24 bg-[#F7F7F5] border-b border-[#E5E5E2]">
      <Container>
        {/* Section Heading */}
        <SectionHeading
          label="CAPABILITY 02 // WEB DEVELOPMENT"
          badge="CUSTOM ENGINEERING"
          badgeVariant="subtle"
          title="Websites & Web Systems."
          highlight="Built for Business."
          description="Custom websites, e-commerce engines, and full-stack web applications engineered for sub-second speeds and conversion."
          action={
            <Button href="/services/web-development" variant="primary" arrow="horizontal">
              View Architecture
            </Button>
          }
          className="mb-12"
        />

        {/* 6 Minimalist Visual Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
          {WEB_DEV_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                className="group p-6 rounded-2xl border border-[#E5E5E2] bg-[#FFFFFF] transition-all duration-200 hover:border-[#111111] hover:shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#F7F7F5] border border-[#E5E5E2] flex items-center justify-center text-[#111111] group-hover:text-[#1400FF] group-hover:scale-105 transition-all">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#F0F0ED] text-[#555555]">
                      {card.tech}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#111111] tracking-tight mb-2 group-hover:text-[#1400FF] transition-colors">
                    {card.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#555555] leading-relaxed">
                    {card.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-[#E5E5E2] flex items-center justify-between">
                  <span className="text-[11px] font-mono text-[#858585]">Full Stack</span>
                  <Link
                    href={`/services/web-development#${card.id}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#111111] group-hover:text-[#1400FF]"
                  >
                    <span>Details</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Visual Technology Stack Showcase (Section 8) */}
        <div className="rounded-3xl border border-[#D8D8D4] bg-[#FFFFFF] p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 mb-6 border-b border-[#E5E5E2] gap-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Code2 className="w-4 h-4 text-[#1400FF]" />
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#858585] font-semibold">
                  TECHNOLOGY SELECTION
                </span>
              </div>
              <h4 className="text-xl font-bold text-[#111111] tracking-tight">
                Built Around the Right Stack.
              </h4>
            </div>
            <p className="text-xs sm:text-sm text-[#555555] font-mono">
              We select technology around the business requirement.
            </p>
          </div>

          {/* Minimalist Technology Badges Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {TECH_STACK.map((tech) => {
              const isHovered = hoveredTech === tech.name;

              return (
                <div
                  key={tech.name}
                  onMouseEnter={() => setHoveredTech(tech.name)}
                  onMouseLeave={() => setHoveredTech(null)}
                  className={`p-3.5 rounded-xl border transition-all duration-200 cursor-default ${
                    isHovered
                      ? "border-[#1400FF] bg-[#F7F7F5] shadow-2xs -translate-y-0.5"
                      : "border-[#E5E5E2] bg-[#FDFDFD]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-sm text-[#111111] font-mono">{tech.name}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#E5E5E2]/60 text-[#555555]">
                      {tech.category}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#555555] line-clamp-1">
                    {tech.line}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
