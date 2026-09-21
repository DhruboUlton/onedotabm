"use client";

import React, { useState } from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { WEB_APP_SHOWCASE_DATA } from "@/data";
import {
  Server,
  Shield,
  Layers,
  Terminal,
  Database,
  CheckCircle2,
  Boxes,
  Cpu,
} from "lucide-react";

export function WebAppShowcase() {
  const [selectedSystemIndex, setSelectedSystemIndex] = useState(0);
  const activeSystem = WEB_APP_SHOWCASE_DATA[selectedSystemIndex];

  return (
    <section id="web-apps" className="py-20 md:py-28 bg-[#F7F7F5] border-b border-[#E5E5E2]">
      <Container>
        {/* Section Heading */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <SectionHeading
            label="TECHNICAL BENCHMARK // WEB APPLICATIONS"
            badge="SYSTEM ARCHITECTURE"
            badgeVariant="dark"
            title="Complex Digital Products."
            highlight="Not Just Website Designs."
            description="When off-the-shelf software falls short, we design full-stack systems with custom relational schemas, granular role-based permissions, and mission-critical reliability."
          />

          {/* System Toggle */}
          <div className="flex rounded-full bg-[#E5E5E2] p-1.5 border border-[#D8D8D4] self-start lg:self-end">
            {WEB_APP_SHOWCASE_DATA.map((sys, idx) => (
              <button
                key={sys.id}
                onClick={() => setSelectedSystemIndex(idx)}
                className={`px-5 py-2 rounded-full text-xs font-mono font-bold tracking-wider transition-all duration-200 cursor-pointer ${
                  selectedSystemIndex === idx
                    ? "bg-[#111111] text-white shadow-xs"
                    : "text-[#555555] hover:text-[#111111]"
                }`}
              >
                {sys.name} SYSTEM
              </button>
            ))}
          </div>
        </div>

        {/* Deep Technical Blueprint Container */}
        <div className="rounded-3xl border border-[#D8D8D4] bg-[#FFFFFF] shadow-sm overflow-hidden">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 sm:px-8 py-5 border-b border-[#E5E5E2] bg-[#FAF9F7] gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="accent">{activeSystem.category}</Badge>
                <span className="text-xs font-mono text-[#858585]">
                  CORE ARCHITECTURE SPECIFICATION
                </span>
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-[#111111]">
                {activeSystem.name} — {activeSystem.subtitle ?? activeSystem.tagline}
              </h3>
            </div>

            {/* Quick Stats Badges */}
            <div className="flex flex-wrap gap-2">
              {(activeSystem.stats ?? activeSystem.metrics ?? []).map((stat: { label: string; value: string }, sIdx: number) => (
                <div
                  key={sIdx}
                  className="px-3 py-1.5 rounded-xl bg-[#FFFFFF] border border-[#E5E5E2] text-xs font-mono"
                >
                  <span className="text-[#858585] mr-1.5">{stat.label}:</span>
                  <span className="font-bold text-[#111111]">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 sm:p-8 lg:p-10 space-y-10">
            {/* System Overview */}
            <p className="text-base text-[#555555] leading-relaxed max-w-4xl">
              {activeSystem.description}
            </p>

            {/* Architecture Stack Matrix */}
            <div>
              <h4 className="text-xs font-mono uppercase tracking-widest text-[#858585] font-semibold mb-4 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#1400FF]" />
                <span>Multi-Tier System Architecture</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-[#F7F7F5] border border-[#E5E5E2]">
                  <div className="text-xs font-mono font-bold text-[#111111] mb-2 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-[#1400FF]" />
                    <span>Frontend Layer</span>
                  </div>
                  <ul className="space-y-1">
                    {(activeSystem.architecture?.frontend ?? []).map((item: string, i: number) => (
                      <li key={i} className="text-xs font-mono text-[#555555]">
                        • {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-[#F7F7F5] border border-[#E5E5E2]">
                  <div className="text-xs font-mono font-bold text-[#111111] mb-2 flex items-center gap-1.5">
                    <Server className="w-3.5 h-3.5 text-[#1400FF]" />
                    <span>Backend Logic</span>
                  </div>
                  <ul className="space-y-1">
                    {(activeSystem.architecture?.backend ?? []).map((item: string, i: number) => (
                      <li key={i} className="text-xs font-mono text-[#555555]">
                        • {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-[#F7F7F5] border border-[#E5E5E2]">
                  <div className="text-xs font-mono font-bold text-[#111111] mb-2 flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-[#1400FF]" />
                    <span>Database Engine</span>
                  </div>
                  <ul className="space-y-1">
                    {(activeSystem.architecture?.database ?? []).map((item: string, i: number) => (
                      <li key={i} className="text-xs font-mono text-[#555555]">
                        • {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-[#F7F7F5] border border-[#E5E5E2]">
                  <div className="text-xs font-mono font-bold text-[#111111] mb-2 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-[#1400FF]" />
                    <span>Infrastructure & APIs</span>
                  </div>
                  <ul className="space-y-1">
                    {(activeSystem.architecture?.infra ?? []).map((item: string, i: number) => (
                      <li key={i} className="text-xs font-mono text-[#555555]">
                        • {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Key Functional Modules (RBAC, Inventory, Orders, Audit Logs) */}
            <div>
              <h4 className="text-xs font-mono uppercase tracking-widest text-[#858585] font-semibold mb-4 flex items-center gap-2">
                <Boxes className="w-4 h-4 text-[#1400FF]" />
                <span>Enterprise Functional Modules</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(activeSystem.keyModules ?? []).map((module, mIdx: number) => (
                  <div
                    key={mIdx}
                    className="p-6 rounded-2xl border border-[#E5E5E2] bg-[#FDFDFD] space-y-3"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-[#1400FF] bg-[#1400FF]/10 px-2 py-0.5 rounded">
                        MOD 0{mIdx + 1}
                      </span>
                      <h5 className="font-bold text-base text-[#111111]">
                        {module.title}
                      </h5>
                    </div>
                    <p className="text-xs sm:text-sm text-[#555555] leading-relaxed">
                      {module.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {(module.highlights ?? []).map((hl: string, hIdx: number) => (
                        <span
                          key={hIdx}
                          className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#F0F0ED] text-[#111111]"
                        >
                          ✓ {hl}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Administrative Capabilities Suite */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[#111111] text-white">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#333333]">
                <div className="flex items-center gap-2 font-mono text-xs">
                  <Terminal className="w-4 h-4 text-[#1400FF]" />
                  <span className="uppercase tracking-widest text-neutral-300 font-bold">
                    Back-Office Admin Capabilities
                  </span>
                </div>
                <span className="text-[11px] font-mono text-neutral-400">
                  SECURE INTERNAL ACCESS
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
                {(activeSystem.adminCapabilities ?? []).map((cap, cIdx: number) => (
                  <div key={cIdx} className="flex items-start gap-2 text-xs text-neutral-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#1400FF] shrink-0 mt-0.5" />
                    <span>{typeof cap === "string" ? cap : cap.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="px-6 sm:px-8 py-5 bg-[#F7F7F5] border-t border-[#E5E5E2] flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-[#555555]">
              Need a custom web application or internal management platform?
            </span>
            <Button href="#contact" variant="primary" size="sm" arrow="horizontal">
              Schedule Technical Discovery Call
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
