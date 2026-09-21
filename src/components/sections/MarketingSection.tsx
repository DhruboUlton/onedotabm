"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import {
  TrendingUp,
  Search,
  Users,
  Sparkles,
  Layers,
  BarChart3,
  Target,
  Zap,
  Layout,
  UserCheck,
  Database,
  RefreshCw,
  ArrowRight,
} from "lucide-react";

interface ServiceCard {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  tag: string;
}

const MARKETING_CARDS: ServiceCard[] = [
  {
    id: "meta-ads",
    icon: TrendingUp,
    title: "Meta & Facebook Ads",
    description: "High-ROAS paid social with algorithmic audience scaling and server CAPI attribution.",
    tag: "Paid Social",
  },
  {
    id: "google-ads",
    icon: Search,
    title: "Google Ads & PPC",
    description: "High-intent search, Performance Max, and conversion capture aligned with customer economics.",
    tag: "Search PPC",
  },
  {
    id: "lead-generation",
    icon: Users,
    title: "Lead Generation",
    description: "Frictionless qualifying funnels and automated CRM routing for immediate sales triage.",
    tag: "Pipeline",
  },
  {
    id: "creative-strategy",
    icon: Sparkles,
    title: "Creative Strategy",
    description: "Direct response static, carousel, and video concepts built on consumer psychology.",
    tag: "Creative",
  },
  {
    id: "funnel-cro",
    icon: Layers,
    title: "Funnel & CRO",
    description: "End-to-end customer journey optimization engineered from first impression to checkout.",
    tag: "Conversion",
  },
  {
    id: "analytics-tracking",
    icon: BarChart3,
    title: "Analytics & Tracking",
    description: "Server-side CAPI, GA4, and attribution resilience preventing browser tracking loss.",
    tag: "Telemetry",
  },
];

const SYSTEM_NODES = [
  { id: "strategy", label: "STRATEGY", icon: Target, detail: "Unit economics & positioning" },
  { id: "creative", label: "CREATIVE", icon: Sparkles, detail: "High-converting visual hooks" },
  { id: "traffic", label: "TRAFFIC", icon: Zap, detail: "Meta & Google acquisition" },
  { id: "landing", label: "LANDING PAGE", icon: Layout, detail: "Sub-second custom checkout" },
  { id: "lead", label: "LEAD / ORDER", icon: UserCheck, detail: "Captured qualified buyers" },
  { id: "data", label: "DATA", icon: Database, detail: "Server-side CAPI telemetry" },
  { id: "optimize", label: "OPTIMIZE", icon: RefreshCw, detail: "Scale winners, prune spend" },
];

export function MarketingSection() {
  const [activeNode, setActiveNode] = useState<string | null>(null);

  return (
    <section id="marketing" className="py-16 md:py-24 bg-[#FFFFFF] border-b border-[#E5E5E2]">
      <Container>
        {/* Section Header */}
        <SectionHeading
          label="CAPABILITY 01 // CUSTOMER ACQUISITION"
          badge="DATA-DRIVEN PERFORMANCE"
          badgeVariant="accent"
          title="Marketing That Creates Demand."
          highlight="Measured in Revenue."
          description="Paid acquisition, creative strategy, and conversion funnels engineered for predictable return on ad spend."
          action={
            <Button href="/services/marketing" variant="outline" arrow="diagonal">
              View Detailed Scope
            </Button>
          }
          className="mb-12"
        />

        {/* 6 Minimalist Visual Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
          {MARKETING_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                className="group p-6 rounded-2xl border border-[#E5E5E2] bg-[#F7F7F5] transition-all duration-200 hover:border-[#111111] hover:bg-[#FFFFFF] hover:shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#FFFFFF] border border-[#E5E5E2] flex items-center justify-center text-[#1400FF] group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FFFFFF] border border-[#E5E5E2] text-[#858585]">
                      {card.tag}
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
                  <span className="text-[11px] font-mono text-[#858585]">OneDot Suite</span>
                  <Link
                    href={`/services/marketing#${card.id}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#111111] group-hover:text-[#1400FF]"
                  >
                    <span>Scope</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Visual Marketing System Flow Diagram */}
        <div className="rounded-3xl border border-[#D8D8D4] bg-[#F7F7F5] p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 mb-6 border-b border-[#E5E5E2] gap-2">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#858585] font-semibold">
                PERFORMANCE ENGINE // SYSTEM ARCHITECTURE
              </span>
              <h4 className="text-lg font-bold text-[#111111] tracking-tight mt-0.5">
                The Integrated Marketing Flow
              </h4>
            </div>
            <span className="text-xs font-mono text-[#1400FF] font-semibold">
              CLOSED-LOOP ATTRIBUTION
            </span>
          </div>

          {/* Connected Process Nodes */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
            {SYSTEM_NODES.map((node, index) => {
              const Icon = node.icon;
              const isHovered = activeNode === node.id;

              return (
                <div
                  key={node.id}
                  onMouseEnter={() => setActiveNode(node.id)}
                  onMouseLeave={() => setActiveNode(null)}
                  className={`p-3.5 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                    isHovered
                      ? "bg-[#111111] text-white border-[#111111] shadow-md -translate-y-0.5"
                      : "bg-[#FFFFFF] text-[#111111] border-[#E5E5E2] hover:border-[#111111]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-mono ${isHovered ? "text-[#1400FF]" : "text-[#858585]"}`}>
                      0{index + 1}
                    </span>
                    <Icon className={`w-3.5 h-3.5 ${isHovered ? "text-[#1400FF]" : "text-[#555555]"}`} />
                  </div>

                  <div className="text-xs font-mono font-bold tracking-tight mb-1">
                    {node.label}
                  </div>

                  <div className={`text-[10px] line-clamp-1 ${isHovered ? "text-neutral-300" : "text-[#858585]"}`}>
                    {node.detail}
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
