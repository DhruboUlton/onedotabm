"use client";

import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import {
  Laptop,
  Layers,
  Server,
  Database,
  ArrowDown,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export function WebAppShowcase() {
  return (
    <section id="web-apps" className="py-16 md:py-24 bg-[#F7F7F5] border-b border-[#E5E5E2]">
      <Container>
        {/* Section Heading with exactly ONE short supporting sentence */}
        <SectionHeading
          label="TECHNICAL BENCHMARK // WEB APPLICATIONS"
          badge="SYSTEM ARCHITECTURE"
          badgeVariant="dark"
          title="Complex Digital Products."
          highlight="Not Just Website Designs."
          description="We engineer custom relational schemas, role-based workflows, and scalable web application architectures."
          action={
            <Button href="/web-applications" variant="primary" arrow="diagonal">
              Explore All Architectures
            </Button>
          }
          className="mb-12"
        />

        {/* Visual Architecture & Product Preview Box */}
        <div className="rounded-3xl border border-[#D8D8D4] bg-[#FFFFFF] p-6 sm:p-8 lg:p-10 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Visual System Architecture Diagram (Section 12) */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E2] mb-2">
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#858585] font-semibold">
                  MULTI-TIER ARCHITECTURE
                </span>
                <span className="text-[10px] font-mono text-[#1400FF] font-semibold bg-[#1400FF]/10 px-2 py-0.5 rounded">
                  END-TO-END
                </span>
              </div>

              {/* Step 1: Client */}
              <div className="p-3.5 rounded-xl border border-[#E5E5E2] bg-[#F7F7F5] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Laptop className="w-4 h-4 text-[#1400FF]" />
                  <span className="text-xs font-mono font-bold text-[#111111]">CLIENT TIER</span>
                </div>
                <span className="text-[11px] font-mono text-[#555555]">Desktop • Mobile Browsers</span>
              </div>

              <div className="flex justify-center py-0.5">
                <ArrowDown className="w-3.5 h-3.5 text-[#858585]" />
              </div>

              {/* Step 2: Frontend */}
              <div className="p-3.5 rounded-xl border border-[#E5E5E2] bg-[#F7F7F5] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Layers className="w-4 h-4 text-[#1400FF]" />
                  <span className="text-xs font-mono font-bold text-[#111111]">FRONTEND</span>
                </div>
                <div className="flex gap-1">
                  <span className="text-[10px] font-mono bg-white px-1.5 py-0.5 rounded border border-[#E5E5E2]">Next.js</span>
                  <span className="text-[10px] font-mono bg-white px-1.5 py-0.5 rounded border border-[#E5E5E2]">React</span>
                </div>
              </div>

              <div className="flex justify-center py-0.5">
                <ArrowDown className="w-3.5 h-3.5 text-[#858585]" />
              </div>

              {/* Step 3: API / Server */}
              <div className="p-3.5 rounded-xl border border-[#E5E5E2] bg-[#F7F7F5] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Server className="w-4 h-4 text-[#1400FF]" />
                  <span className="text-xs font-mono font-bold text-[#111111]">API / SERVER</span>
                </div>
                <div className="flex gap-1">
                  <span className="text-[10px] font-mono bg-white px-1.5 py-0.5 rounded border border-[#E5E5E2]">Laravel</span>
                  <span className="text-[10px] font-mono bg-white px-1.5 py-0.5 rounded border border-[#E5E5E2]">Node.js</span>
                </div>
              </div>

              <div className="flex justify-center py-0.5">
                <ArrowDown className="w-3.5 h-3.5 text-[#858585]" />
              </div>

              {/* Step 4: Database */}
              <div className="p-3.5 rounded-xl border border-[#E5E5E2] bg-[#F7F7F5] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Database className="w-4 h-4 text-[#1400FF]" />
                  <span className="text-xs font-mono font-bold text-[#111111]">DATABASE</span>
                </div>
                <div className="flex gap-1">
                  <span className="text-[10px] font-mono bg-white px-1.5 py-0.5 rounded border border-[#E5E5E2]">PostgreSQL</span>
                  <span className="text-[10px] font-mono bg-white px-1.5 py-0.5 rounded border border-[#E5E5E2]">Supabase</span>
                </div>
              </div>

              <div className="flex justify-center py-0.5">
                <ArrowDown className="w-3.5 h-3.5 text-[#858585]" />
              </div>

              {/* Step 5: Integrations */}
              <div className="p-3.5 rounded-xl border border-[#E5E5E2] bg-[#F7F7F5] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4 text-[#1400FF]" />
                  <span className="text-xs font-mono font-bold text-[#111111]">INTEGRATIONS</span>
                </div>
                <div className="flex gap-1">
                  <span className="text-[10px] font-mono bg-white px-1.5 py-0.5 rounded border border-[#E5E5E2]">bKash</span>
                  <span className="text-[10px] font-mono bg-white px-1.5 py-0.5 rounded border border-[#E5E5E2]">CAPI</span>
                  <span className="text-[10px] font-mono bg-white px-1.5 py-0.5 rounded border border-[#E5E5E2]">Stripe</span>
                </div>
              </div>
            </div>

            {/* Right: Real Application Visual Mockup (KANZIE Platform Preview) */}
            <div className="lg:col-span-7">
              <div className="rounded-2xl border border-[#111111] bg-[#111111] p-5 sm:p-7 text-white shadow-md">
                {/* Window Header */}
                <div className="flex items-center justify-between pb-4 mb-5 border-b border-neutral-800">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-neutral-700" />
                      <span className="w-2.5 h-2.5 rounded-full bg-neutral-700" />
                      <span className="w-2.5 h-2.5 rounded-full bg-neutral-700" />
                    </div>
                    <span className="text-xs font-mono text-neutral-400 ml-2">
                      kanzie.shop // verified delivery
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded">
                    PRODUCTION LIVE
                  </span>
                </div>

                {/* Main Product Showcase Preview */}
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                    <div>
                      <h4 className="text-xl font-bold tracking-tight text-white">
                        Kanzie E-Commerce & Back-Office
                      </h4>
                      <p className="text-xs text-neutral-400 font-mono mt-0.5">
                        Ahil Ahmed • Imported Toys & Retail
                      </p>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#1400FF] bg-[#1400FF]/20 px-2.5 py-1 rounded">
                      Full-Stack Next.js 16 + Prisma
                    </span>
                  </div>

                  {/* Operational Capabilities Visual Preview */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800">
                      <div className="text-[10px] font-mono text-neutral-400">PUBLIC STOREFRONT</div>
                      <div className="text-sm font-bold text-white mt-1">Modern UI & Cart Drawer</div>
                      <div className="text-[10px] text-neutral-400 mt-1">Sub-second LCP speed</div>
                    </div>
                    <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800">
                      <div className="text-[10px] font-mono text-neutral-400">ADMIN CENTER</div>
                      <div className="text-sm font-bold text-white mt-1">RBAC & Order Pipeline</div>
                      <div className="text-[10px] text-neutral-400 mt-1">Full staff audit trail</div>
                    </div>
                  </div>

                  {/* Feature Checkpoints */}
                  <div className="grid grid-cols-2 gap-2 pt-1 text-xs text-neutral-300 font-mono">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#1400FF]" />
                      <span>Code-free banner controls</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#1400FF]" />
                      <span>Low-stock alert triggers</span>
                    </div>
                  </div>

                  {/* Direct Link */}
                  <div className="pt-4 border-t border-neutral-800 flex items-center justify-between text-xs font-mono">
                    <span className="text-neutral-400">Explore complete engineering dossier:</span>
                    <Link
                      href="/web-applications#kanzie"
                      className="inline-flex items-center gap-1 font-bold text-white hover:text-[#1400FF] transition-colors"
                    >
                      <span>View Blueprint</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
