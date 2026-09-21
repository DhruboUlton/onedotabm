"use client";

import React, { useState } from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  TrendingUp,
  Code2,
  Zap,
  ArrowRight,
  Sparkles,
  Gauge,
  Database,
  Layers,
  ArrowDown,
} from "lucide-react";

export function Hero() {
  const [activeNode, setActiveNode] = useState<string | null>(null);

  return (
    <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden border-b border-[#E5E5E2] bg-[#F7F7F5]">
      {/* Subtle Architectural Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#E5E5E2_1px,transparent_1px),linear-gradient(to_bottom,#E5E5E2_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35 pointer-events-none" />

      <Container className="relative z-10">
        {/* Header Block */}
        <div className="flex flex-col items-start max-w-4xl">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2.5 mb-5">
            <Badge variant="subtle" dot={false} className="border-[#D8D8D4] text-[#111111] font-mono text-[11px] tracking-wider uppercase">
              MARKETING + WEB DEVELOPMENT
            </Badge>
            <div className="flex items-center gap-1.5 text-xs text-[#555555] font-medium">
              <span className="inline-block h-2 w-2 rounded-full bg-[#1400FF] animate-pulse" />
              <span>Unified Growth Agency</span>
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-[#111111] leading-[1.08] mb-6">
            Marketing That Gets Attention.{" "}
            <span className="text-[#1400FF]">Websites That Convert.</span>
          </h1>

          {/* Exactly 1 Short Supporting Sentence */}
          <p className="text-lg sm:text-xl text-[#555555] leading-relaxed max-w-2xl mb-8">
            One accountable partner combining high-performance acquisition campaigns with custom web engineering to accelerate revenue.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-4 mb-14">
            <Button href="#contact" variant="primary" size="lg" arrow="horizontal">
              Start a Project
            </Button>
            <Button href="#portfolio" variant="secondary" size="lg" arrow="diagonal">
              View Our Work
            </Button>
          </div>
        </div>

        {/* ONEDOT ENGINE // MINIMALIST FUTURISTIC SYSTEM DIAGRAM */}
        <div className="rounded-3xl border border-[#D8D8D4] bg-[#FFFFFF] shadow-[0_20px_50px_rgba(0,0,0,0.03)] overflow-hidden">
          {/* Console Header Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E5E2] bg-[#FDFDFD]">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#E5E5E2]" />
                <span className="w-3 h-3 rounded-full bg-[#E5E5E2]" />
                <span className="w-3 h-3 rounded-full bg-[#E5E5E2]" />
              </div>
              <span className="text-xs font-mono text-[#858585] tracking-wider uppercase">
                ONEDOT ENGINE // INTEGRATED SYSTEM
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#1400FF] animate-ping" />
              <span className="text-[11px] font-mono text-[#1400FF] font-semibold uppercase tracking-wider hidden sm:inline-block">
                Attribution Bridge Active
              </span>
            </div>
          </div>

          {/* Core Visual System Diagram */}
          <div className="p-6 sm:p-8 lg:p-10 bg-[#FFFFFF]">
            {/* 4 Micro Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mb-8">
              <div className="p-3.5 rounded-xl border border-[#E5E5E2] bg-[#F7F7F5] flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-mono text-[#858585] uppercase tracking-wider">Blended ROAS</div>
                  <div className="text-2xl font-bold text-[#111111] mt-0.5">4.2x</div>
                </div>
                <div className="w-8 h-8 rounded-lg bg-white border border-[#E5E5E2] flex items-center justify-center text-[#1400FF]">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-[#E5E5E2] bg-[#F7F7F5] flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-mono text-[#858585] uppercase tracking-wider">Lighthouse Score</div>
                  <div className="text-2xl font-bold text-[#111111] mt-0.5">99/100</div>
                </div>
                <div className="w-8 h-8 rounded-lg bg-white border border-[#E5E5E2] flex items-center justify-center text-[#1400FF]">
                  <Gauge className="w-4 h-4" />
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-[#E5E5E2] bg-[#F7F7F5] flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-mono text-[#858585] uppercase tracking-wider">Acquisition Cost</div>
                  <div className="text-2xl font-bold text-[#111111] mt-0.5">-32%</div>
                </div>
                <div className="w-8 h-8 rounded-lg bg-white border border-[#E5E5E2] flex items-center justify-center text-[#1400FF]">
                  <Zap className="w-4 h-4" />
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-[#E5E5E2] bg-[#F7F7F5] flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-mono text-[#858585] uppercase tracking-wider">Web Applications</div>
                  <div className="text-2xl font-bold text-[#111111] mt-0.5">15+</div>
                </div>
                <div className="w-8 h-8 rounded-lg bg-white border border-[#E5E5E2] flex items-center justify-center text-[#1400FF]">
                  <Code2 className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Futuristic Pipeline Architecture Nodes */}
            <div className="relative rounded-2xl border border-[#E5E5E2] bg-[#F7F7F5] p-5 sm:p-7">
              {/* Connector line on desktop */}
              <div className="absolute top-1/2 left-10 right-10 h-0.5 bg-[#E5E5E2] -translate-y-1/2 hidden lg:block z-0" />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 relative z-10">
                {/* Node 1: Acquisition */}
                <div
                  onMouseEnter={() => setActiveNode("acquisition")}
                  onMouseLeave={() => setActiveNode(null)}
                  className={`p-4 rounded-xl border transition-all duration-200 bg-white cursor-pointer ${
                    activeNode === "acquisition" ? "border-[#1400FF] shadow-md -translate-y-1" : "border-[#E5E5E2]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-[#858585] font-semibold">01 // LAYER</span>
                    <TrendingUp className="w-3.5 h-3.5 text-[#1400FF]" />
                  </div>
                  <div className="text-sm font-bold text-[#111111]">ACQUISITION</div>
                  <div className="text-xs text-[#555555] mt-1 font-mono">Meta & Google Ads</div>
                </div>

                {/* Node 2: Traffic */}
                <div
                  onMouseEnter={() => setActiveNode("traffic")}
                  onMouseLeave={() => setActiveNode(null)}
                  className={`p-4 rounded-xl border transition-all duration-200 bg-white cursor-pointer ${
                    activeNode === "traffic" ? "border-[#1400FF] shadow-md -translate-y-1" : "border-[#E5E5E2]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-[#858585] font-semibold">02 // FLOW</span>
                    <Zap className="w-3.5 h-3.5 text-[#1400FF]" />
                  </div>
                  <div className="text-sm font-bold text-[#111111]">HIGH-INTENT TRAFFIC</div>
                  <div className="text-xs text-[#555555] mt-1 font-mono">Creative Funnels</div>
                </div>

                {/* Node 3: Web Systems */}
                <div
                  onMouseEnter={() => setActiveNode("web")}
                  onMouseLeave={() => setActiveNode(null)}
                  className={`p-4 rounded-xl border transition-all duration-200 bg-white cursor-pointer ${
                    activeNode === "web" ? "border-[#1400FF] shadow-md -translate-y-1" : "border-[#E5E5E2]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-[#858585] font-semibold">03 // CORE</span>
                    <Code2 className="w-3.5 h-3.5 text-[#1400FF]" />
                  </div>
                  <div className="text-sm font-bold text-[#111111]">WEB SYSTEMS</div>
                  <div className="text-xs text-[#555555] mt-1 font-mono">Next.js • Laravel • React</div>
                </div>

                {/* Node 4: Conversion */}
                <div
                  onMouseEnter={() => setActiveNode("conversion")}
                  onMouseLeave={() => setActiveNode(null)}
                  className={`p-4 rounded-xl border transition-all duration-200 bg-white cursor-pointer ${
                    activeNode === "conversion" ? "border-[#1400FF] shadow-md -translate-y-1" : "border-[#E5E5E2]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-[#858585] font-semibold">04 // OUTCOME</span>
                    <Layers className="w-3.5 h-3.5 text-[#1400FF]" />
                  </div>
                  <div className="text-sm font-bold text-[#111111]">CONVERSION</div>
                  <div className="text-xs text-[#555555] mt-1 font-mono">0-Friction Checkout</div>
                </div>

                {/* Node 5: Data & Loop */}
                <div
                  onMouseEnter={() => setActiveNode("optimization")}
                  onMouseLeave={() => setActiveNode(null)}
                  className={`p-4 rounded-xl border transition-all duration-200 bg-white cursor-pointer ${
                    activeNode === "optimization" ? "border-[#1400FF] shadow-md -translate-y-1" : "border-[#E5E5E2]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-[#858585] font-semibold">05 // FEEDBACK</span>
                    <Database className="w-3.5 h-3.5 text-[#1400FF]" />
                  </div>
                  <div className="text-sm font-bold text-[#111111]">OPTIMIZATION</div>
                  <div className="text-xs text-[#555555] mt-1 font-mono">Server-Side CAPI Loop</div>
                </div>
              </div>

              {/* Technology Badges Row */}
              <div className="mt-5 pt-4 border-t border-[#E5E5E2] flex flex-wrap items-center justify-between gap-2">
                <span className="text-[11px] font-mono text-[#858585] uppercase tracking-wider">Engineered Stack:</span>
                <div className="flex flex-wrap gap-1.5">
                  {["Server CAPI", "SSR + Edge Caching", "Next.js", "Laravel", "React", "PostgreSQL", "Prisma"].map((badge) => (
                    <span
                      key={badge}
                      className="px-2 py-0.5 text-[10px] font-mono bg-white border border-[#E5E5E2] rounded-md text-[#555555] font-medium"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Synergy Bar */}
          <div className="px-6 py-4 bg-[#F7F7F5] border-t border-[#E5E5E2] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#555555]">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#1400FF]" />
              <span className="font-semibold text-[#111111]">Single Point of Accountability:</span>
              <span>Marketing brings the audience. Web development converts the business.</span>
            </div>
            <a
              href="#pipeline"
              className="inline-flex items-center gap-1 font-semibold text-[#111111] hover:text-[#1400FF] transition-colors"
            >
              <span>Explore the closed loop</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
