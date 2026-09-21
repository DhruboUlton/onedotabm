"use client";

import React, { useState } from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { ChevronDown } from "lucide-react";

interface FaqItemSimple {
  id: string;
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItemSimple[] = [
  {
    id: "why-combine",
    question: "What makes OneDot ABM different from a typical digital agency?",
    answer:
      "Most agencies isolate marketing from development. We combine paid acquisition with custom web engineering under one roof, ensuring ads drive traffic to high-speed systems built specifically to convert it.",
  },
  {
    id: "standalone-services",
    question: "Can we hire OneDot ABM for only marketing or only web development?",
    answer:
      "Yes. While our combined model produces the strongest results, we frequently manage standalone paid advertising campaigns or engineer custom web applications independently.",
  },
  {
    id: "minimum-budget",
    question: "What is your recommended minimum advertising budget?",
    answer:
      "We recommend a minimum monthly ad spend of $1,000–$2,000 (or local equivalent) paid directly to ad platforms to ensure sufficient conversion data for algorithmic optimization and creative testing.",
  },
  {
    id: "timeline-results",
    question: "How quickly do we see results from advertising campaigns?",
    answer:
      "Initial conversion signals and lead flow typically start within the first 7–14 days. Compounding scale and profitable ROAS usually solidify between days 30 and 60 as creative testing matures.",
  },
  {
    id: "custom-vs-templates",
    question: "Why build custom web applications instead of using WordPress or Shopify?",
    answer:
      "Custom Next.js and Laravel applications achieve sub-second load times, bespoke operational workflows (RBAC, custom checkout, inventory alerts), and zero recurring plugin vulnerabilities or template bloat.",
  },
  {
    id: "conversion-tracking",
    question: "How do you handle iOS privacy restrictions and attribution loss?",
    answer:
      "We build direct server-to-server Meta Conversions API (CAPI) and GA4 telemetry into web endpoints, bypassing ad-blockers and browser privacy limits to feed clean conversion signals to ad algorithms.",
  },
  {
    id: "international-clients",
    question: "Do you work with international clients outside of Bangladesh?",
    answer:
      "Yes. We collaborate with brands and startups globally across North America, Europe, the Middle East, and Asia-Pacific through streamlined async updates, milestone reviews, and secure client access.",
  },
];

export function FaqSection() {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    "why-combine": true,
  });

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <section id="faq" className="py-16 md:py-24 bg-[#FFFFFF] border-b border-[#E5E5E2]">
      <Container size="narrow">
        {/* Section Heading */}
        <SectionHeading
          label="FREQUENTLY ASKED QUESTIONS // CLARITY"
          badge="TRANSPARENT OPERATIONS"
          badgeVariant="subtle"
          title="Clear Answers."
          highlight="No Jargon."
          description="Straightforward answers regarding capabilities, budgets, timelines, and integrated execution."
          align="center"
          className="mb-10"
        />

        {/* Clean Accordion List (Section 17: 6-8 Most Useful Questions, Concise Answers) */}
        <div className="divide-y divide-[#E5E5E2] border-t border-b border-[#E5E5E2]">
          {FAQ_ITEMS.map((faq) => {
            const isOpen = !!openItems[faq.id];

            return (
              <div key={faq.id} className="py-4 sm:py-5 transition-colors">
                <button
                  onClick={() => toggleItem(faq.id)}
                  className="w-full text-left flex items-start justify-between gap-4 cursor-pointer select-none group"
                >
                  <span className="text-sm sm:text-base font-bold text-[#111111] group-hover:text-[#1400FF] transition-colors leading-snug">
                    {faq.question}
                  </span>

                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center border border-[#E5E5E2] shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 bg-[#111111] text-white border-[#111111]" : "text-[#555555]"
                    }`}
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </div>
                </button>

                {isOpen && (
                  <div className="pr-6 pt-2.5 text-xs sm:text-sm text-[#555555] leading-relaxed animate-in fade-in-50 duration-150">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Helper */}
        <div className="mt-10 text-center p-5 rounded-2xl bg-[#F7F7F5] border border-[#E5E5E2]">
          <span className="text-xs font-bold text-[#111111] block mb-1">
            Have a specific technical or campaign question?
          </span>
          <p className="text-xs text-[#555555] mb-3">
            We are always happy to discuss unit economics, tech stacks, or custom scope.
          </p>
          <Button href="#contact" variant="outline" size="sm" arrow="horizontal">
            Ask a Question
          </Button>
        </div>
      </Container>
    </section>
  );
}
