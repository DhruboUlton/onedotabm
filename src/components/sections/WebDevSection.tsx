"use client";

import React, { useState } from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { WEB_DEV_CAPABILITIES, TECHNOLOGIES_LIST } from "@/data";
import { WebDevCapability } from "@/types";
import {
  Terminal,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export function WebDevSection() {
  const [activeCapability, setActiveCapability] = useState<WebDevCapability>(
    WEB_DEV_CAPABILITIES[0]
  );

  return (
    <section id="development" className="py-20 md:py-28 bg-[#F7F7F5] border-b border-[#E5E5E2]">
      <Container>
        {/* Section Heading */}
        <SectionHeading
          label="CAPABILITY 02 // WEB DEVELOPMENT"
          badge="CUSTOM ENGINEERING"
          badgeVariant="subtle"
          title="Websites & Web Systems."
          highlight="Built for Business."
          description="We engineer custom websites, e-commerce engines, and full-stack web applications. No slow generic templates. Every system is engineered for sub-second speeds, conversion, and operational control."
          action={
            <Button href="#contact" variant="primary" arrow="horizontal">
              Start a Web Project
            </Button>
          }
          className="mb-14"
        />

        {/* 6 Capabilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {WEB_DEV_CAPABILITIES.map((cap) => {
            const isSelected = activeCapability.id === cap.id;
            return (
              <Card
                key={cap.id}
                onClick={() => setActiveCapability(cap)}
                hoverEffect
                surface="white"
                className={`p-6 sm:p-8 cursor-pointer flex flex-col justify-between transition-all duration-300 ${
                  isSelected ? "border-[#111111] ring-1 ring-[#111111]" : ""
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono text-[#858585] uppercase tracking-wider">
                      DEV // 0{WEB_DEV_CAPABILITIES.indexOf(cap) + 1}
                    </span>
                    <div className="flex gap-1">
                      {cap.technologies.slice(0, 2).map((tech) => (
                        <span
                          key={tech}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F0F0ED] text-[#555555]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-[#111111] tracking-tight mb-2">
                    {cap.title}
                  </h3>

                  <p className="text-sm text-[#555555] leading-relaxed mb-6">
                    {cap.shortDescription}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E5E5E2] flex items-center justify-between text-xs">
                  <span className="text-[#858585] font-mono">
                    {cap.deliverables.length} Deliverables Included
                  </span>
                  <span className="inline-flex items-center gap-1 font-semibold text-[#111111] group-hover:text-[#1400FF]">
                    <span>View Scope</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Active Capability Deep Dive Banner */}
        <div className="rounded-3xl border border-[#D8D8D4] bg-[#FFFFFF] p-6 sm:p-8 lg:p-10 mb-16 shadow-xs">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-[#E5E5E2]">
            <div>
              <div className="inline-flex items-center gap-2 mb-2">
                <Badge variant="dark">DETAILED SPECIFICATION</Badge>
                <span className="text-xs font-mono text-[#858585]">
                  {activeCapability.title.toUpperCase()}
                </span>
              </div>
              <h4 className="text-2xl font-bold text-[#111111] tracking-tight">
                {activeCapability.title}
              </h4>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono text-[#555555] mr-2">Technologies Used:</span>
              {activeCapability.technologies.map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-1 text-xs font-mono bg-[#F7F7F5] border border-[#E5E5E2] rounded-md text-[#111111] font-medium"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
            <div className="lg:col-span-6 space-y-4">
              <h5 className="text-xs font-mono uppercase tracking-widest text-[#858585] font-semibold">
                Architecture & Commercial Intent
              </h5>
              <p className="text-sm sm:text-base text-[#555555] leading-relaxed">
                {activeCapability.fullDescription}
              </p>
              <div className="pt-2">
                <Button
                  href={`#contact?service=${activeCapability.slug}`}
                  variant="primary"
                  size="sm"
                  arrow="horizontal"
                >
                  Request Technical Proposal
                </Button>
              </div>
            </div>

            <div className="lg:col-span-6 bg-[#F7F7F5] rounded-2xl p-6 border border-[#E5E5E2]">
              <h5 className="text-xs font-mono uppercase tracking-widest text-[#111111] font-semibold mb-4 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#1400FF]" />
                <span>Scope Deliverables</span>
              </h5>
              <ul className="space-y-2.5">
                {activeCapability.deliverables.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-[#555555]">
                    <CheckCircle2 className="w-4 h-4 text-[#1400FF] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Technology Stack Showcase */}
        <div className="rounded-3xl border border-[#E5E5E2] bg-[#FFFFFF] p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E5E5E2]">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#858585] font-semibold">
                TECHNOLOGY SELECTION PHILOSOPHY
              </span>
              <h4 className="text-xl font-bold text-[#111111] tracking-tight mt-1">
                Right Technology for the Right Requirement
              </h4>
            </div>
            <p className="text-xs sm:text-sm text-[#555555] max-w-md">
              We never force your project into a rigid one-size-fits-all stack. We choose between Next.js, React, Laravel, PHP, Node.js, and Prisma based on your scalability and business model.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 pt-6">
            {TECHNOLOGIES_LIST.map((tech) => (
              <div
                key={tech.name}
                className="p-4 rounded-xl border border-[#E5E5E2] bg-[#F7F7F5] flex flex-col justify-between hover:border-[#111111] transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-[#111111]">{tech.name}</span>
                    <span className="text-[10px] font-mono text-[#1400FF] bg-[#1400FF]/10 px-2 py-0.5 rounded">
                      {tech.category}
                    </span>
                  </div>
                  <p className="text-xs text-[#555555] mt-1 line-clamp-2">{tech.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
