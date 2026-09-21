"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { SELECTED_PROJECTS } from "@/data";
import { ProjectCategory } from "@/types";
import { ArrowUpRight } from "lucide-react";

type FilterTab = "All" | ProjectCategory;

const FILTER_TABS: FilterTab[] = [
  "All",
  "Websites",
  "E-commerce",
  "Web Applications",
  "Marketing",
];

export function SelectedWork() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>("All");

  const filteredProjects =
    activeFilter === "All"
      ? SELECTED_PROJECTS
      : SELECTED_PROJECTS.filter((p) => p.category === activeFilter);

  return (
    <section id="portfolio" className="py-20 md:py-28 bg-[#FFFFFF] border-b border-[#E5E5E2]">
      <Container>
        {/* Section Heading with Filters */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <SectionHeading
            label="PORTFOLIO // SELECTED WORK"
            badge="DIGITAL PRODUCTS & CAMPAIGNS"
            badgeVariant="subtle"
            title="Selected Work & Systems."
            highlight="Engineered for Impact."
            description="A curated selection of custom web applications, e-commerce architectures, and high-performance acquisition campaigns delivered for our clients."
          />

          {/* Interactive Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-full bg-[#F0F0ED] border border-[#E5E5E2] shrink-0 self-start lg:self-end">
            {FILTER_TABS.map((tab) => {
              const isActive = activeFilter === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveFilter(tab)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-[#111111] text-white shadow-xs font-semibold"
                      : "text-[#555555] hover:text-[#111111]"
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        {/* Editorial Asymmetrical Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, idx) => {
            const isFeaturedLarge = project.featured && (idx === 0 || idx === 1);

            return (
              <div
                key={project.id}
                className={`group rounded-3xl border border-[#E5E5E2] bg-[#F7F7F5] p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:border-[#111111] hover:bg-[#FFFFFF] hover:shadow-[0_12px_36px_rgba(0,0,0,0.04)] ${
                  isFeaturedLarge ? "md:col-span-2 lg:col-span-2" : "col-span-1"
                }`}
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-center justify-between gap-2 mb-6">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-[#1400FF] uppercase tracking-wider">
                        {project.category}
                      </span>
                      <span className="text-xs text-[#858585]">• {project.industry}</span>
                    </div>

                    {project.highlightMetric && (
                      <span className="text-[11px] font-mono font-semibold bg-[#FFFFFF] border border-[#E5E5E2] text-[#111111] px-2.5 py-1 rounded-full">
                        {project.highlightMetric}
                      </span>
                    )}
                  </div>

                  {/* Project Title */}
                  <h3 className="text-2xl font-bold tracking-tight text-[#111111] group-hover:text-[#1400FF] transition-colors mb-3">
                    {project.title}
                  </h3>

                  {/* Summary */}
                  <p className="text-sm text-[#555555] leading-relaxed mb-6">
                    {project.summary}
                  </p>

                  {/* Deliverables Pills */}
                  <div className="space-y-2 mb-6">
                    <div className="text-[11px] font-mono uppercase tracking-wider text-[#858585]">
                      Key Deliverables
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {(project.deliverables ?? project.features ?? []).map((item, dIdx) => (
                        <span
                          key={dIdx}
                          className="px-2 py-0.5 rounded-md bg-[#FFFFFF] border border-[#E5E5E2] text-[11px] text-[#555555]"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Tech Stack & Action Footer */}
                <div className="pt-6 border-t border-[#E5E5E2] flex items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-1">
                    {project.technologies.slice(0, 3).map((t) => (
                      <span
                        key={t}
                        className="text-[10px] font-mono text-[#858585] bg-[#F0F0ED] px-2 py-0.5 rounded"
                      >
                        {t}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="text-[10px] font-mono text-[#858585] px-1">
                        +{project.technologies.length - 3}
                      </span>
                    )}
                  </div>

                  <Link
                    href={`/case-studies/${project.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#111111] group-hover:text-[#1400FF] transition-colors"
                  >
                    <span>View Case</span>
                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Portfolio Banner */}
        <div className="mt-12 text-center">
          <p className="text-sm text-[#555555] mb-4">
            Have a unique operational workflow or custom application in mind?
          </p>
          <Button href="#contact" variant="primary" arrow="horizontal">
            Inquire About a Custom Project
          </Button>
        </div>
      </Container>
    </section>
  );
}
