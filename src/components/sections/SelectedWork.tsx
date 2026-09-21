"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { ArrowUpRight, ExternalLink } from "lucide-react";

type FilterTab = "All" | "Websites" | "E-Commerce" | "Web Apps" | "Marketing";

const FILTER_TABS: FilterTab[] = [
  "All",
  "Websites",
  "E-Commerce",
  "Web Apps",
  "Marketing",
];

interface ProjectItem {
  id: string;
  slug: string;
  name: string;
  category: "Websites" | "E-Commerce" | "Web Apps" | "Marketing";
  descriptor: string;
  metric: string;
  previewType: "kanzie" | "lumiflick" | "solution-point" | "autonex";
}

const PORTFOLIO_PROJECTS: ProjectItem[] = [
  {
    id: "kanzie",
    slug: "kanzie",
    name: "Kanzie",
    category: "Web Apps",
    descriptor: "Custom Next.js e-commerce storefront with centralized operational admin center and RBAC security.",
    metric: "Storefront + RBAC Admin",
    previewType: "kanzie",
  },
  {
    id: "lumiflick",
    slug: "lumiflick",
    name: "Lumiflick",
    category: "E-Commerce",
    descriptor: "Visual-first glass wall art storefront with curated lifestyle collections and sub-second rendering.",
    metric: "Sub-Second LCP Speed",
    previewType: "lumiflick",
  },
  {
    id: "solution-point",
    slug: "solution-point",
    name: "Solution Point",
    category: "Marketing",
    descriptor: "Performance marketing prospecting funnel delivering 788 paid course enrollments and ~৳800K revenue.",
    metric: "788 Orders • ~৳800K",
    previewType: "solution-point",
  },
  {
    id: "autonex",
    slug: "autonex",
    name: "Autonex",
    category: "Marketing",
    descriptor: "Automotive technology paid acquisition funnel with instant WhatsApp conversational triage.",
    metric: "৳343K+ Revenue Scaled",
    previewType: "autonex",
  },
];

function ProjectVisualFrame({ type }: { type: string }) {
  if (type === "kanzie") {
    return (
      <div className="w-full h-44 sm:h-52 rounded-2xl bg-[#111111] p-3 text-white flex flex-col justify-between overflow-hidden relative group-hover:scale-[1.01] transition-transform">
        {/* Browser Top */}
        <div className="flex items-center justify-between pb-2 border-b border-[#262626]">
          <div className="flex gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500/80" />
            <span className="w-2 h-2 rounded-full bg-yellow-500/80" />
            <span className="w-2 h-2 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-[9px] font-mono text-neutral-400">kanzie.shop // admin-center</span>
          <span className="text-[9px] font-mono text-[#1400FF] bg-[#1400FF]/20 px-1.5 py-0.5 rounded">
            RBAC ACTIVE
          </span>
        </div>

        {/* UI Mockup Body */}
        <div className="grid grid-cols-3 gap-2 py-2">
          <div className="p-2 rounded bg-neutral-900 border border-neutral-800">
            <div className="text-[8px] font-mono text-neutral-400">ORDERS TODAY</div>
            <div className="text-base font-bold text-white font-mono mt-0.5">42 Active</div>
          </div>
          <div className="p-2 rounded bg-neutral-900 border border-neutral-800">
            <div className="text-[8px] font-mono text-neutral-400">STOCK STATUS</div>
            <div className="text-base font-bold text-emerald-400 font-mono mt-0.5">Synced</div>
          </div>
          <div className="p-2 rounded bg-neutral-900 border border-neutral-800">
            <div className="text-[8px] font-mono text-neutral-400">PERMISSIONS</div>
            <div className="text-base font-bold text-white font-mono mt-0.5">Manager</div>
          </div>
        </div>

        {/* Action Row */}
        <div className="pt-2 border-t border-neutral-800 flex items-center justify-between text-[10px] font-mono text-neutral-400">
          <span>Next.js 16 • Prisma • MySQL</span>
          <span className="text-white">Storefront + Admin Center</span>
        </div>
      </div>
    );
  }

  if (type === "lumiflick") {
    return (
      <div className="w-full h-44 sm:h-52 rounded-2xl bg-[#FAF9F7] border border-[#E5E5E2] p-3 flex flex-col justify-between overflow-hidden group-hover:scale-[1.01] transition-transform">
        <div className="flex items-center justify-between pb-2 border-b border-[#E5E5E2]">
          <div className="flex gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#D8D8D4]" />
            <span className="w-2 h-2 rounded-full bg-[#D8D8D4]" />
            <span className="w-2 h-2 rounded-full bg-[#D8D8D4]" />
          </div>
          <span className="text-[9px] font-mono text-[#858585]">lumiflick.com // gallery</span>
          <span className="text-[9px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
            99 LIGHTHOUSE
          </span>
        </div>

        {/* Gallery Grid Mockup */}
        <div className="grid grid-cols-4 gap-1.5 py-2">
          {["Anime", "Cars", "Nature", "Islamic"].map((cat, i) => (
            <div key={i} className="rounded-lg bg-white border border-[#E5E5E2] p-1.5 text-center">
              <div className="h-10 rounded bg-[#F0F0ED] mb-1 flex items-center justify-center text-[10px] text-[#858585]">
                Glass
              </div>
              <span className="text-[9px] font-mono font-medium text-[#111111]">{cat}</span>
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-[#E5E5E2] flex items-center justify-between text-[10px] font-mono text-[#555555]">
          <span>Visual Storytelling E-Commerce</span>
          <span className="text-[#1400FF] font-semibold">Sub-Second Load</span>
        </div>
      </div>
    );
  }

  if (type === "solution-point") {
    return (
      <div className="w-full h-44 sm:h-52 rounded-2xl bg-[#FFFFFF] border border-[#E5E5E2] p-3 flex flex-col justify-between overflow-hidden group-hover:scale-[1.01] transition-transform">
        <div className="flex items-center justify-between pb-2 border-b border-[#E5E5E2]">
          <div className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full bg-[#1400FF]" />
            <span className="text-[9px] font-mono text-[#111111] font-semibold">META ADS MANAGER // TELEMETRY</span>
          </div>
          <span className="text-[9px] font-mono text-[#1400FF] bg-[#1400FF]/10 px-1.5 py-0.5 rounded font-semibold">
            CAPI VERIFIED
          </span>
        </div>

        {/* Campaign Metrics Display */}
        <div className="grid grid-cols-2 gap-2 py-2">
          <div className="p-2.5 rounded-xl bg-[#F7F7F5] border border-[#E5E5E2]">
            <div className="text-[9px] font-mono text-[#858585]">CONFIRMED ENROLLMENTS</div>
            <div className="text-xl font-bold text-[#111111] font-sans mt-0.5">788 Orders</div>
          </div>
          <div className="p-2.5 rounded-xl bg-[#F7F7F5] border border-[#E5E5E2]">
            <div className="text-[9px] font-mono text-[#858585]">GROSS COURSE REVENUE</div>
            <div className="text-xl font-bold text-[#1400FF] font-sans mt-0.5">~৳800K</div>
          </div>
        </div>

        <div className="pt-2 border-t border-[#E5E5E2] flex items-center justify-between text-[10px] font-mono text-[#555555]">
          <span>Full Funnel CRO + Meta Ads</span>
          <span className="font-semibold text-[#111111]">ROAS 4.2x</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-44 sm:h-52 rounded-2xl bg-[#FFFFFF] border border-[#E5E5E2] p-3 flex flex-col justify-between overflow-hidden group-hover:scale-[1.01] transition-transform">
      <div className="flex items-center justify-between pb-2 border-b border-[#E5E5E2]">
        <div className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
          <span className="text-[9px] font-mono text-[#111111] font-semibold">WHATSAPP INBOUND PIPELINE</span>
        </div>
        <span className="text-[9px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
          ACTIVE LEADS
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 py-2">
        <div className="p-2.5 rounded-xl bg-[#F7F7F5] border border-[#E5E5E2]">
          <div className="text-[9px] font-mono text-[#858585]">REVENUE GENERATED</div>
          <div className="text-xl font-bold text-[#111111] font-sans mt-0.5">৳343K+</div>
        </div>
        <div className="p-2.5 rounded-xl bg-[#F7F7F5] border border-[#E5E5E2]">
          <div className="text-[9px] font-mono text-[#858585]">QUALIFIED BUYERS</div>
          <div className="text-xl font-bold text-emerald-600 font-sans mt-0.5">Instant Triage</div>
        </div>
      </div>

      <div className="pt-2 border-t border-[#E5E5E2] flex items-center justify-between text-[10px] font-mono text-[#555555]">
        <span>Automotive Tech Acquisition</span>
        <span className="font-semibold text-[#111111]">Direct Inbound</span>
      </div>
    </div>
  );
}

export function SelectedWork() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>("All");

  const filteredProjects = PORTFOLIO_PROJECTS.filter((p) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Web Apps") return p.category === "Web Apps";
    if (activeFilter === "E-Commerce") return p.category === "E-Commerce";
    if (activeFilter === "Marketing") return p.category === "Marketing";
    if (activeFilter === "Websites") return p.category === "Websites" || p.category === "E-Commerce";
    return true;
  });

  return (
    <section id="portfolio" className="py-16 md:py-24 bg-[#FFFFFF] border-b border-[#E5E5E2]">
      <Container>
        {/* Section Header with Category Filters */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <SectionHeading
            label="PORTFOLIO // SELECTED WORK"
            badge="DIGITAL PRODUCTS & CAMPAIGNS"
            badgeVariant="subtle"
            title="Selected Work & Systems."
            highlight="Engineered for Impact."
            description="High-converting digital products, e-commerce architectures, and customer acquisition campaigns."
          />

          {/* Clean Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-full bg-[#F0F0ED] border border-[#E5E5E2] shrink-0 self-start lg:self-end">
            {FILTER_TABS.map((tab) => {
              const isActive = activeFilter === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveFilter(tab)}
                  className={`px-3.5 py-1 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-[#111111] text-white shadow-xs font-semibold"
                      : "text-[#555555] hover:text-[#111111]"
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        {/* Visual Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="rounded-3xl border border-[#E5E5E2] bg-[#F7F7F5] p-5 sm:p-7 flex flex-col justify-between transition-all duration-200 hover:border-[#111111] hover:bg-[#FFFFFF] hover:shadow-xs group"
            >
              <div>
                {/* Visual UI Preview Frame */}
                <div className="mb-5">
                  <ProjectVisualFrame type={project.previewType} />
                </div>

                {/* Project Header */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#1400FF] uppercase tracking-wider">
                      {project.category}
                    </span>
                    <span className="text-xs text-[#858585]">• Case Study</span>
                  </div>

                  <span className="text-[10px] font-mono font-semibold bg-[#FFFFFF] border border-[#E5E5E2] text-[#111111] px-2.5 py-1 rounded-full">
                    {project.metric}
                  </span>
                </div>

                {/* Project Title */}
                <h3 className="text-xl font-bold tracking-tight text-[#111111] group-hover:text-[#1400FF] transition-colors mb-2">
                  {project.name}
                </h3>

                {/* Exactly 1 Short Sentence (≤15 words) */}
                <p className="text-xs sm:text-sm text-[#555555] leading-relaxed mb-4">
                  {project.descriptor}
                </p>
              </div>

              {/* Action Footer */}
              <div className="pt-4 border-t border-[#E5E5E2] flex items-center justify-between">
                <span className="text-[11px] font-mono text-[#858585]">Documented Outcome</span>
                <Link
                  href={`/case-studies/${project.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#111111] group-hover:text-[#1400FF] transition-colors"
                >
                  <span>View Case</span>
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Inquire CTA */}
        <div className="text-center pt-4">
          <Button href="#contact" variant="primary" arrow="horizontal">
            Inquire About a Custom Project
          </Button>
        </div>
      </Container>
    </section>
  );
}
