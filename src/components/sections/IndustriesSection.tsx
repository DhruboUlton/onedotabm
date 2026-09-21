"use client";

import React from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  ShoppingCart,
  GraduationCap,
  Plane,
  Cpu,
  Briefcase,
  Building2,
  Store,
  Rocket,
} from "lucide-react";

interface IndustryCard {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  descriptor: string;
}

const INDUSTRIES: IndustryCard[] = [
  {
    id: "ecommerce",
    name: "E-Commerce",
    icon: ShoppingCart,
    descriptor: "Custom storefronts & high-converting checkout.",
  },
  {
    id: "education",
    name: "Education",
    icon: GraduationCap,
    descriptor: "Course sales funnels & student acquisition.",
  },
  {
    id: "travel",
    name: "Travel",
    icon: Plane,
    descriptor: "Direct booking engines & lead qualification.",
  },
  {
    id: "tech-saas",
    name: "Technology / SaaS",
    icon: Cpu,
    descriptor: "B2B lead generation & full-stack apps.",
  },
  {
    id: "prof-services",
    name: "Professional Services",
    icon: Briefcase,
    descriptor: "High-ticket client acquisition systems.",
  },
  {
    id: "real-estate",
    name: "Real Estate",
    icon: Building2,
    descriptor: "Qualified investor & property buyer triage.",
  },
  {
    id: "retail",
    name: "Retail",
    icon: Store,
    descriptor: "Omnichannel inventory & order platforms.",
  },
  {
    id: "startups",
    name: "Startups",
    icon: Rocket,
    descriptor: "Rapid full-stack MVPs & scaling funnels.",
  },
];

export function IndustriesSection() {
  return (
    <section id="industries" className="py-16 md:py-24 bg-[#FFFFFF] border-b border-[#E5E5E2]">
      <Container>
        {/* Section Heading */}
        <SectionHeading
          label="SECTORS // SPECIALIZED DOMAINS"
          badge="PROVEN PATTERNS"
          badgeVariant="subtle"
          title="Engineered for High-Growth Sectors."
          highlight="Focused Expertise."
          description="We focus where integrated acquisition and custom web systems drive direct financial return."
          className="mb-12"
        />

        {/* Clean 8-Item Visual Icon Grid (Section 15) */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {INDUSTRIES.map((ind) => {
            const Icon = ind.icon;

            return (
              <div
                key={ind.id}
                className="p-5 rounded-2xl border border-[#E5E5E2] bg-[#F7F7F5] transition-all duration-200 hover:border-[#111111] hover:bg-[#FFFFFF] hover:shadow-xs flex flex-col justify-between group"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#FFFFFF] border border-[#E5E5E2] flex items-center justify-center text-[#111111] group-hover:text-[#1400FF] group-hover:scale-105 transition-all mb-4">
                    <Icon className="w-5 h-5" />
                  </div>

                  <h3 className="text-base font-bold text-[#111111] tracking-tight mb-1 group-hover:text-[#1400FF] transition-colors">
                    {ind.name}
                  </h3>

                  <p className="text-xs text-[#555555] leading-relaxed">
                    {ind.descriptor}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-[#E5E5E2] flex items-center justify-between text-[10px] font-mono text-[#858585]">
                  <span>Proven Blueprint</span>
                  <span className="text-[#1400FF] font-semibold">Active</span>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
