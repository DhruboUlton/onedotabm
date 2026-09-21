"use client";

import React, { useState } from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { CheckCircle2 } from "lucide-react";

export function CtaSection() {
  const [selectedServiceType, setSelectedServiceType] = useState<
    "both" | "marketing" | "webdev"
  >("both");

  return (
    <section id="contact" className="py-20 md:py-28 bg-[#F7F7F5] border-b border-[#E5E5E2] relative overflow-hidden">
      {/* Blueprint Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#E5E5E2_1px,transparent_1px),linear-gradient(to_bottom,#E5E5E2_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />

      <Container size="narrow" className="relative z-10 text-center">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 mb-5">
          <Badge variant="accent" dot>
            READY TO COLLABORATE
          </Badge>
          <span className="text-xs font-mono uppercase tracking-widest text-[#858585] font-semibold">
            START YOUR SPRINT
          </span>
        </div>

        {/* Big Editorial Headline */}
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#111111] leading-[1.1] mb-5">
          Have a business to build or grow?
        </h2>

        {/* Exactly One Short Supporting Sentence */}
        <p className="text-base sm:text-lg text-[#555555] leading-relaxed max-w-xl mx-auto mb-8">
          Tell us what you&apos;re working on. We&apos;ll determine whether you need paid marketing, custom web engineering, or both.
        </p>

        {/* Visually Compact Engagement Options (Section 18) */}
        <div className="inline-flex flex-wrap items-center justify-center p-1 rounded-full bg-[#FFFFFF] border border-[#D8D8D4] mb-8 shadow-xs">
          <button
            onClick={() => setSelectedServiceType("both")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-medium transition-all cursor-pointer ${
              selectedServiceType === "both"
                ? "bg-[#1400FF] text-white font-semibold shadow-xs"
                : "text-[#555555] hover:text-[#111111]"
            }`}
          >
            ★ Marketing + Web Development
          </button>
          <button
            onClick={() => setSelectedServiceType("marketing")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-medium transition-all cursor-pointer ${
              selectedServiceType === "marketing"
                ? "bg-[#111111] text-white font-semibold shadow-xs"
                : "text-[#555555] hover:text-[#111111]"
            }`}
          >
            Marketing
          </button>
          <button
            onClick={() => setSelectedServiceType("webdev")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-medium transition-all cursor-pointer ${
              selectedServiceType === "webdev"
                ? "bg-[#111111] text-white font-semibold shadow-xs"
                : "text-[#555555] hover:text-[#111111]"
            }`}
          >
            Web Development
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-10">
          <Button
            href={`/contact?interest=${selectedServiceType}`}
            variant="primary"
            size="lg"
            arrow="horizontal"
            className="w-full sm:w-auto"
          >
            Start a Project
          </Button>
          <Button
            href="/contact"
            variant="secondary"
            size="lg"
            arrow="diagonal"
            className="w-full sm:w-auto"
          >
            Book a Strategy Call
          </Button>
        </div>

        {/* Clean Confidence Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-[#E5E5E2] text-xs text-[#555555] font-mono">
          <div className="flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#1400FF]" />
            <span>Direct Founder Review</span>
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#1400FF]" />
            <span>Transparent Economics</span>
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#1400FF]" />
            <span>Zero Long-Term Lock-In</span>
          </div>
        </div>
      </Container>
    </section>
  );
}
