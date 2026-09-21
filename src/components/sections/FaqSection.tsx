"use client";

import React, { useState } from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { FAQ_DATA } from "@/data";
import { FaqCategory } from "@/types";
import { ChevronDown } from "lucide-react";

type FaqFilter = "All" | FaqCategory;

export function FaqSection() {
  const [activeCategory, setActiveCategory] = useState<FaqFilter>("All");
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    "why-combine": true, // open first item by default
  });

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredFaqs =
    activeCategory === "All"
      ? FAQ_DATA
      : FAQ_DATA.filter((f) => f.category === activeCategory);

  const categories: FaqFilter[] = [
    "All",
    "General",
    "Marketing",
    "Web Development",
    "Process",
  ];

  return (
    <section id="faq" className="py-20 md:py-28 bg-[#FFFFFF] border-b border-[#E5E5E2]">
      <Container size="narrow">
        {/* Section Heading */}
        <SectionHeading
          label="FREQUENTLY ASKED QUESTIONS // CLARITY"
          badge="TRANSPARENT OPERATIONS"
          badgeVariant="subtle"
          title="Clear Answers."
          highlight="No Jargon."
          description="Straightforward answers about our capabilities, pricing models, technology choices, and how our integrated team collaborates with yours."
          align="center"
          className="mb-12"
        />

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-[#111111] text-white shadow-xs font-semibold"
                    : "bg-[#F0F0ED] text-[#555555] hover:text-[#111111] hover:bg-[#E5E5E2]"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Editorial Accordion List */}
        <div className="divide-y divide-[#E5E5E2] border-t border-b border-[#E5E5E2]">
          {filteredFaqs.map((faq) => {
            const isOpen = !!openItems[faq.id];

            return (
              <div key={faq.id} className="py-5 sm:py-6 transition-colors">
                <button
                  onClick={() => toggleItem(faq.id)}
                  className="w-full text-left flex items-start justify-between gap-4 cursor-pointer select-none group"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xs font-mono text-[#858585] mt-1 shrink-0">
                      Q:
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-[#111111] group-hover:text-[#1400FF] transition-colors leading-snug">
                      {faq.question}
                    </h3>
                  </div>

                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center border border-[#E5E5E2] shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 bg-[#111111] text-white border-[#111111]" : "text-[#555555]"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="pl-6 sm:pl-7 pr-8 pt-3 text-sm sm:text-base text-[#555555] leading-relaxed animate-in fade-in-50 duration-150">
                    <p>{faq.answer}</p>
                    <div className="mt-3">
                      <span className="text-[10px] font-mono text-[#858585] uppercase tracking-wider bg-[#F0F0ED] px-2 py-0.5 rounded">
                        Category: {faq.category}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Helper */}
        <div className="mt-12 text-center p-6 rounded-2xl bg-[#F7F7F5] border border-[#E5E5E2]">
          <h4 className="text-sm font-bold text-[#111111] mb-1">
            Have a question that isn&apos;t answered here?
          </h4>
          <p className="text-xs text-[#555555] mb-4">
            We are always happy to discuss specifics regarding your ad accounts, technology stack, or custom scope.
          </p>
          <Button href="#contact" variant="outline" size="sm" arrow="horizontal">
            Ask a Direct Question
          </Button>
        </div>
      </Container>
    </section>
  );
}
