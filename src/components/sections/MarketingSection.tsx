"use client";

import React, { useState } from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { MARKETING_SERVICES } from "@/data";
import { MarketingService } from "@/types";
import { CheckCircle2, TrendingUp } from "lucide-react";

export function MarketingSection() {
  const [selectedService, setSelectedService] = useState<MarketingService>(
    MARKETING_SERVICES[0]
  );

  return (
    <section id="marketing" className="py-20 md:py-28 bg-[#FFFFFF] border-b border-[#E5E5E2]">
      <Container>
        {/* Section Header */}
        <SectionHeading
          label="CAPABILITY 01 // CUSTOMER ACQUISITION"
          badge="DATA-DRIVEN PERFORMANCE"
          badgeVariant="accent"
          title="Marketing That Creates Demand."
          highlight="Measured in Revenue."
          description="We do not run vanity social media campaigns. We manage paid acquisition, direct response creative strategy, and conversion funnels designed to deliver predictable return on ad spend."
          action={
            <Button href="#contact" variant="outline" arrow="diagonal">
              Discuss Marketing Strategy
            </Button>
          }
          className="mb-14"
        />

        {/* Editorial Two-Column Interactive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Interactive Editorial List of Services */}
          <div className="lg:col-span-5 flex flex-col divide-y divide-[#E5E5E2] border-t border-b border-[#E5E5E2]">
            {MARKETING_SERVICES.map((service, index) => {
              const isSelected = selectedService.id === service.id;
              const formattedIndex = (index + 1).toString().padStart(2, "0");

              return (
                <div
                  key={service.id}
                  onClick={() => setSelectedService(service)}
                  onMouseEnter={() => setSelectedService(service)}
                  className={`group py-5 px-4 -mx-4 rounded-xl cursor-pointer transition-all duration-200 flex items-center justify-between gap-4 ${
                    isSelected
                      ? "bg-[#F7F7F5] pl-6 border-l-4 border-l-[#1400FF]"
                      : "hover:bg-[#FAF9F7]"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`text-xs font-mono font-medium ${
                        isSelected ? "text-[#1400FF]" : "text-[#858585]"
                      }`}
                    >
                      {formattedIndex}
                    </span>
                    <div>
                      <h3
                        className={`text-base sm:text-lg font-medium transition-colors ${
                          isSelected ? "text-[#111111] font-semibold" : "text-[#555555] group-hover:text-[#111111]"
                        }`}
                      >
                        {service.title}
                      </h3>
                      <p className="text-xs text-[#858585] mt-0.5 line-clamp-1">
                        {service.shortDescription}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        isSelected
                          ? "bg-[#1400FF] text-white"
                          : "bg-[#F0F0ED] text-[#858585] group-hover:text-[#111111]"
                      }`}
                    >
                      {service.tag}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Focused Active Service Dossier */}
          <div className="lg:col-span-7 sticky top-24">
            <div className="rounded-3xl border border-[#D8D8D4] bg-[#F7F7F5] p-6 sm:p-8 lg:p-10 shadow-xs">
              {/* Category & Index */}
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#E5E5E2]">
                <div className="flex items-center gap-2">
                  <Badge variant="accent" dot>
                    {selectedService.tag}
                  </Badge>
                  <span className="text-xs font-mono text-[#858585]">
                    ONE-DOT ACQUISITION SUITE
                  </span>
                </div>
                <span className="text-xs font-mono text-[#1400FF] font-semibold">
                  ACTIVE SPECIFICATION
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="text-2xl sm:text-3xl font-bold text-[#111111] tracking-tight mb-4">
                {selectedService.title}
              </h3>
              <p className="text-base text-[#555555] leading-relaxed mb-8">
                {selectedService.fullDescription}
              </p>

              {/* Deliverables Checklist */}
              <div className="bg-[#FFFFFF] rounded-2xl border border-[#E5E5E2] p-6 mb-8">
                <h4 className="text-xs font-mono uppercase tracking-widest text-[#111111] font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#1400FF]" />
                  <span>Key Deliverables & Execution Scope</span>
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedService.deliverables.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#555555]">
                      <CheckCircle2 className="w-4 h-4 text-[#1400FF] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Box */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#E5E5E2]">
                <div className="text-xs text-[#555555]">
                  Need dedicated management for this service?
                </div>
                <Button
                  href={`#contact?service=${selectedService.slug}`}
                  variant="primary"
                  size="md"
                  arrow="horizontal"
                >
                  Inquire for {selectedService.title.split("(")[0].trim()}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
