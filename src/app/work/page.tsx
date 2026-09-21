import React from "react";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { WorkDirectory } from "./WorkDirectory";

export const metadata: Metadata = {
  title: "Selected Work & Portfolio Directory",
  description:
    "Explore our complete portfolio of custom web applications, e-commerce systems, business websites, and performance marketing campaigns.",
};

export default function WorkPage() {
  return (
    <div className="flex flex-col bg-[#F7F7F5]">
      {/* 01. Hero Header */}
      <section className="pt-12 pb-16 md:pt-20 md:pb-24 border-b border-[#E5E5E2]">
        <Container>
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 mb-6">
              <Badge variant="subtle" dot={false}>
                PORTFOLIO DIRECTORY
              </Badge>
              <span className="text-xs font-mono text-[#858585] uppercase tracking-wider">
                Websites • Apps • Marketing
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-[#111111] leading-[1.08] mb-6">
              Work Built for Real Business <br />
              <span className="text-[#1400FF]">Performance.</span>
            </h1>

            <p className="text-lg sm:text-xl text-[#555555] leading-relaxed max-w-2xl">
              We present our projects as digital systems, customer funnels, and business operations—not just static screenshots. Filter by category or search our complete catalog below.
            </p>
          </div>
        </Container>
      </section>

      {/* 02. Filterable Portfolio Directory */}
      <WorkDirectory />
    </div>
  );
}
