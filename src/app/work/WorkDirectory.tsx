"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  ExternalLink,
  Layers,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { projects } from "@/data/projects";

type FilterTab = "All" | "Websites" | "E-commerce" | "Web Applications" | "Marketing";

export function WorkDirectory() {
  const [activeTab, setActiveTab] = useState<FilterTab>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // Tab matching
      let matchesTab = true;
      if (activeTab === "Websites") {
        matchesTab =
          project.category === "Websites" ||
          project.category === "business-website" ||
          project.categoryLabel?.toLowerCase().includes("website") ||
          false;
      } else if (activeTab === "E-commerce") {
        matchesTab =
          project.category === "E-commerce" ||
          project.category === "e-commerce-platform" ||
          project.categoryLabel?.toLowerCase().includes("commerce") ||
          false;
      } else if (activeTab === "Web Applications") {
        matchesTab =
          project.category === "Web Applications" ||
          project.category === "custom-web-application" ||
          project.categoryLabel?.toLowerCase().includes("application") ||
          false;
      } else if (activeTab === "Marketing") {
        matchesTab =
          project.category === "Marketing" ||
          project.category === "performance-marketing" ||
          project.category === "lead-generation" ||
          project.categoryLabel?.toLowerCase().includes("marketing") ||
          false;
      }

      // Search matching
      const query = searchQuery.toLowerCase().trim();
      if (!query) return matchesTab;

      const matchesSearch =
        project.title.toLowerCase().includes(query) ||
        (project.client && project.client.toLowerCase().includes(query)) ||
        project.industry.toLowerCase().includes(query) ||
        project.technologies.some((tech) => tech.toLowerCase().includes(query)) ||
        (project.summary && project.summary.toLowerCase().includes(query));

      return matchesTab && matchesSearch;
    });
  }, [activeTab, searchQuery]);

  const tabs: FilterTab[] = ["All", "Websites", "E-commerce", "Web Applications", "Marketing"];

  return (
    <div className="py-12 sm:py-16">
      <Container>
        {/* Controls Bar: Filter Tabs & Search Input */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-[#E5E5E2] mb-12">
          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {tabs.map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-full text-xs font-mono transition-all cursor-pointer border ${
                    isActive
                      ? "bg-[#111111] text-white border-[#111111] shadow-xs"
                      : "bg-white text-[#555555] border-[#E5E5E2] hover:border-[#D8D8D4] hover:text-[#111111]"
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* Real-time Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-[#858585] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by client, tech, tag..."
              className="w-full pl-9 pr-4 py-2 text-xs font-mono bg-white border border-[#E5E5E2] rounded-full text-[#111111] placeholder:text-[#858585] focus:outline-none focus:ring-2 focus:ring-[#1400FF] focus:border-transparent transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-[#858585] hover:text-[#111111]"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs font-mono text-[#858585] mb-8">
          <span>
            Showing <strong className="text-[#111111]">{filteredProjects.length}</strong> {filteredProjects.length === 1 ? "project" : "projects"}
          </span>
          <span>Filtered by: {activeTab}</span>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-[#E5E5E2] p-8">
            <Layers className="w-8 h-8 text-[#858585] mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-[#111111] mb-1">No matching projects found</h3>
            <p className="text-xs text-[#555555] max-w-sm mx-auto mb-6">
              No portfolio projects match your search query &ldquo;{searchQuery}&rdquo; in category {activeTab}.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setActiveTab("All");
                setSearchQuery("");
              }}
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredProjects.map((project) => (
              <Card
                key={project.id}
                surface="white"
                hoverEffect
                className="p-8 sm:p-10 flex flex-col justify-between border-[#D8D8D4] group"
              >
                <div>
                  {/* Category & Status Bar */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <Badge variant="subtle" size="sm">
                      {project.categoryLabel || project.category}
                    </Badge>
                    <span className="font-mono text-xs text-[#858585]">
                      {project.industry}
                    </span>
                  </div>

                  {/* Project Title */}
                  <h3 className="text-2xl font-semibold text-[#111111] mb-3 group-hover:text-[#1400FF] transition-colors">
                    {project.title}
                  </h3>

                  {/* Highlight Metric */}
                  {project.highlightMetric && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[rgba(20,0,255,0.06)] border border-[rgba(20,0,255,0.18)] text-xs font-mono font-medium text-[#1400FF] mb-4">
                      <Sparkles className="w-3 h-3" />
                      <span>{project.highlightMetric}</span>
                    </div>
                  )}

                  {/* Summary */}
                  <p className="text-sm text-[#555555] leading-relaxed mb-6">
                    {project.summary || project.description}
                  </p>

                  {/* Deliverables Badges */}
                  {project.deliverables && project.deliverables.length > 0 && (
                    <div className="space-y-2 mb-6 pt-4 border-t border-[#E5E5E2]">
                      <span className="text-[11px] font-mono uppercase text-[#858585] block">
                        Core Deliverables:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {project.deliverables.slice(0, 4).map((deliv, idx) => (
                          <div key={idx} className="flex items-start gap-1.5 text-xs text-[#555555]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#1400FF] shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{deliv}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer of Card: Tech Tags & Links */}
                <div className="pt-6 border-t border-[#E5E5E2]">
                  {/* Tech stack */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {project.technologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 text-[11px] font-mono bg-[#F7F7F5] border border-[#E5E5E2] rounded-full text-[#555555]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-wrap items-center gap-3">
                    {project.caseStudySlug && (
                      <Button
                        href={`/case-studies/${project.caseStudySlug}`}
                        variant="primary"
                        size="sm"
                        withArrow
                        arrowType="diagonal"
                      >
                        Read Case Study
                      </Button>
                    )}

                    {project.liveUrl && (
                      <Button
                        href={project.liveUrl}
                        external
                        variant="secondary"
                        size="sm"
                        rightIcon={<ExternalLink className="w-3.5 h-3.5 ml-1" />}
                      >
                        Live System
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
