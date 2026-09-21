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
  CheckCircle2,
} from "lucide-react";

export function Hero() {
  const [activeTab, setActiveTab] = useState<"synergy" | "marketing" | "engineering">("synergy");

  return (
    <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden border-b border-[#E5E5E2] bg-[#F7F7F5]">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#E5E5E2_1px,transparent_1px),linear-gradient(to_bottom,#E5E5E2_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

      <Container className="relative z-10">
        {/* Header Block */}
        <div className="flex flex-col items-start max-w-4xl">
          {/* Eyebrow / Positioning */}
          <div className="inline-flex items-center gap-2.5 mb-6">
            <Badge variant="subtle" dot={false} className="border-[#D8D8D4] text-[#111111] font-mono text-[11px]">
              ONE PARTNER • TWO CAPABILITIES
            </Badge>
            <div className="flex items-center gap-1.5 text-xs text-[#555555] font-medium">
              <span className="inline-block h-2 w-2 rounded-full bg-[#1400FF] animate-pulse" />
              <span>Marketing Agency & Web Development</span>
            </div>
          </div>

          {/* Editorial Display Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-[#111111] leading-[1.08] mb-6">
            Marketing That Gets Attention.{" "}
            <span className="text-[#1400FF]">Websites That Convert.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-[#555555] leading-relaxed max-w-2xl mb-8">
            OneDot ABM combines marketing and custom web development to help businesses attract
            customers and build digital experiences that support growth. We eliminate the gap between the ads that drive traffic and the systems that convert it.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 mb-16">
            <Button href="#contact" variant="primary" size="lg" arrow="horizontal">
              Start a Project
            </Button>
            <Button href="#portfolio" variant="secondary" size="lg" arrow="diagonal">
              View Our Work
            </Button>
          </div>
        </div>

        {/* Interactive Dual-Discipline Showcase Box */}
        <div className="rounded-3xl border border-[#D8D8D4] bg-[#FFFFFF] shadow-[0_20px_50px_rgba(0,0,0,0.03)] overflow-hidden">
          {/* Top Bar of the Interactive Console */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 border-b border-[#E5E5E2] bg-[#FDFDFD] gap-4">
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

            {/* Interactive View Selector */}
            <div className="flex items-center rounded-full bg-[#F0F0ED] p-1 border border-[#E5E5E2] text-xs font-medium">
              <button
                onClick={() => setActiveTab("synergy")}
                className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                  activeTab === "synergy"
                    ? "bg-[#111111] text-white shadow-xs"
                    : "text-[#555555] hover:text-[#111111]"
                }`}
              >
                Integrated Loop
              </button>
              <button
                onClick={() => setActiveTab("marketing")}
                className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                  activeTab === "marketing"
                    ? "bg-[#111111] text-white shadow-xs"
                    : "text-[#555555] hover:text-[#111111]"
                }`}
              >
                Marketing Telemetry
              </button>
              <button
                onClick={() => setActiveTab("engineering")}
                className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                  activeTab === "engineering"
                    ? "bg-[#111111] text-white shadow-xs"
                    : "text-[#555555] hover:text-[#111111]"
                }`}
              >
                Web Code & Stack
              </button>
            </div>
          </div>

          {/* Interactive Showcase Content */}
          <div className="p-6 sm:p-8 lg:p-10">
            {activeTab === "synergy" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Left: Paid Marketing Layer */}
                <div className="lg:col-span-5 rounded-2xl border border-[#E5E5E2] bg-[#F7F7F5] p-6 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E2]">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-[#1400FF]" />
                      <span className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                        Acquisition Layer
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-[#1400FF] bg-[#1400FF]/10 px-2 py-0.5 rounded-full font-semibold">
                      Meta & Google Active
                    </span>
                  </div>

                  {/* Metrics Cards */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#FFFFFF] p-3.5 rounded-xl border border-[#E5E5E2]">
                      <div className="text-[11px] text-[#858585] uppercase tracking-wider font-mono">Blended ROAS</div>
                      <div className="text-2xl font-bold text-[#111111] mt-0.5">4.2x</div>
                      <div className="text-[11px] text-[#1400FF] font-medium mt-1 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" /> +38% MoM
                      </div>
                    </div>
                    <div className="bg-[#FFFFFF] p-3.5 rounded-xl border border-[#E5E5E2]">
                      <div className="text-[11px] text-[#858585] uppercase tracking-wider font-mono">Cost Per Acq (CAC)</div>
                      <div className="text-2xl font-bold text-[#111111] mt-0.5">-32%</div>
                      <div className="text-[11px] text-[#555555] font-medium mt-1">
                        High-intent traffic
                      </div>
                    </div>
                  </div>

                  {/* Funnel Pipeline Indicator */}
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between text-xs text-[#555555]">
                      <span>Creative Testing Matrix</span>
                      <span className="font-mono font-medium text-[#111111]">12 Hooks Live</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#E5E5E2] rounded-full overflow-hidden">
                      <div className="h-full bg-[#1400FF] w-[78%] rounded-full" />
                    </div>
                    <p className="text-xs text-[#555555] pt-1">
                      Direct response video and carousel formats driving qualified click-through to custom landing page.
                    </p>
                  </div>
                </div>

                {/* Center: Live Data Bridge */}
                <div className="lg:col-span-2 flex flex-col items-center justify-center py-2 text-center">
                  <div className="h-8 w-px bg-[#D8D8D4] hidden lg:block" />
                  <div className="my-3 px-3 py-2 rounded-xl bg-[#111111] text-white shadow-md flex items-center gap-2">
                    <Zap className="w-4 h-4 text-[#1400FF] animate-bounce" />
                    <span className="text-xs font-mono font-medium">CAPI Real-Time Sync</span>
                  </div>
                  <div className="h-8 w-px bg-[#D8D8D4] hidden lg:block" />
                  <span className="text-[11px] font-mono text-[#858585] mt-1 max-w-[130px] leading-tight">
                    Zero attribution drop-off
                  </span>
                </div>

                {/* Right: Custom Web Architecture Layer */}
                <div className="lg:col-span-5 rounded-2xl border border-[#E5E5E2] bg-[#F7F7F5] p-6 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E2]">
                    <div className="flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-[#111111]" />
                      <span className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                        Web Conversion Layer
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-[#111111] bg-white border border-[#D8D8D4] px-2 py-0.5 rounded-full font-semibold">
                      Next.js & TypeScript
                    </span>
                  </div>

                  {/* Tech / Speed Metrics */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#FFFFFF] p-3.5 rounded-xl border border-[#E5E5E2]">
                      <div className="text-[11px] text-[#858585] uppercase tracking-wider font-mono">Performance Score</div>
                      <div className="text-2xl font-bold text-[#111111] mt-0.5">99/100</div>
                      <div className="text-[11px] text-[#1400FF] font-medium mt-1">
                        Sub-second LCP
                      </div>
                    </div>
                    <div className="bg-[#FFFFFF] p-3.5 rounded-xl border border-[#E5E5E2]">
                      <div className="text-[11px] text-[#858585] uppercase tracking-wider font-mono">Checkout Flow</div>
                      <div className="text-2xl font-bold text-[#111111] mt-0.5">0 Friction</div>
                      <div className="text-[11px] text-[#555555] font-medium mt-1">
                        bKash, Nagad, Stripe
                      </div>
                    </div>
                  </div>

                  {/* Architecture Badges */}
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between text-xs text-[#555555]">
                      <span>Engineered Infrastructure</span>
                      <span className="font-mono text-[#111111] font-semibold">SSR + Edge Caching</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {["Next.js", "Laravel", "React", "Prisma", "MySQL", "Tailwind"].map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 text-[11px] font-mono bg-white border border-[#E5E5E2] rounded text-[#555555]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "marketing" && (
              <div className="bg-[#F7F7F5] rounded-2xl border border-[#E5E5E2] p-6 sm:p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-[#111111]">
                      Real-Time Campaign Performance Telemetry
                    </h3>
                    <p className="text-sm text-[#555555]">
                      High-precision acquisition management backed by unit economics, not vanity likes.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-xs font-mono bg-[#1400FF]/10 text-[#1400FF] px-3 py-1 rounded-full font-semibold">
                      $70K+ Ad Spend Track Record
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="bg-white p-4 rounded-xl border border-[#E5E5E2]">
                    <div className="text-xs font-mono text-[#858585] uppercase">Target ROAS</div>
                    <div className="text-3xl font-bold text-[#111111] mt-1">4.2x – 6.8x</div>
                    <p className="text-xs text-[#555555] mt-1">Across e-commerce and course sales</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-[#E5E5E2]">
                    <div className="text-xs font-mono text-[#858585] uppercase">Verified Results</div>
                    <div className="text-3xl font-bold text-[#1400FF] mt-1">788 Orders</div>
                    <p className="text-xs text-[#555555] mt-1">Generated for Solution Point (~৳800K)</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-[#E5E5E2]">
                    <div className="text-xs font-mono text-[#858585] uppercase">Revenue Scaled</div>
                    <div className="text-3xl font-bold text-[#111111] mt-1">৳343K+</div>
                    <p className="text-xs text-[#555555] mt-1">Generated for Autonex campaigns</p>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-xl border border-[#E5E5E2] flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#1400FF] shrink-0 mt-0.5" />
                  <div className="text-xs text-[#555555] leading-relaxed">
                    <strong className="text-[#111111] font-semibold">The OneDot Acquisition Rule: </strong>
                    We align ad spend directly with gross margins. Ad creative testing runs in structured sprints to isolate winning hooks, thumbnails, and angles before increasing daily campaign budgets.
                  </div>
                </div>
              </div>
            )}

            {activeTab === "engineering" && (
              <div className="bg-[#111111] text-white rounded-2xl p-6 font-mono text-xs overflow-x-auto">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#333333]">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-[#1400FF]" />
                    <span className="text-[#858585]">telemetry/capi-bridge.ts</span>
                  </div>
                  <span className="text-[10px] text-[#1400FF] bg-[#1400FF]/20 px-2 py-0.5 rounded">
                    TYPE-SAFE FULL STACK
                  </span>
                </div>

                <pre className="text-neutral-300 leading-relaxed overflow-x-auto">
                  <code>{`// OneDot ABM Integrated Architecture: Event Telemetry + Conversion Engine
export async function handleVerifiedPurchase(order: CustomerOrder) {
  // 1. Process secure transactional database mutation
  const transaction = await db.orders.create({
    data: {
      userId: order.customerId,
      totalAmount: order.grossAmount,
      paymentGateway: order.gateway, // bKash, Nagad, Stripe
      status: "COMPLETED",
    },
  });

  // 2. Transmit pristine server-to-server CAPI signal (Bypasses ad-blockers)
  await metaConversionsApi.sendEvent({
    eventName: "Purchase",
    eventTime: Math.floor(Date.now() / 1000),
    userData: { clientIp: order.ip, userAgent: order.userAgent },
    customData: { value: order.grossAmount, currency: "BDT", contentIds: order.skus },
  });

  return { success: true, orderId: transaction.id };
}`}</code>
                </pre>

                <div className="mt-4 pt-4 border-t border-[#333333] flex flex-wrap items-center justify-between text-neutral-400 gap-2">
                  <span>Stack: Next.js 16 • React 19 • Laravel 11 • TypeScript • MySQL</span>
                  <span className="text-neutral-200">Zero template bloat • 100% bespoke engineering</span>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Bar Highlighting the Synergy */}
          <div className="px-6 py-4 bg-[#F7F7F5] border-t border-[#E5E5E2] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#555555]">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#1400FF]" />
              <span className="font-medium text-[#111111]">Single Point of Accountability:</span>
              <span>Marketing brings the audience. Web development converts the business.</span>
            </div>
            <a
              href="#pipeline"
              className="inline-flex items-center gap-1 font-semibold text-[#111111] hover:text-[#1400FF] transition-colors"
            >
              <span>Explore our 7-step pipeline</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
