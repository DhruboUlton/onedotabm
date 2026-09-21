import React from "react";
import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { ProjectInquiryForm } from "@/components/forms/ProjectInquiryForm";

export const metadata: Metadata = {
  title: "Start a Project | Project Qualification & Quote Request",
  description:
    "Submit your project requirements to OneDot ABM for a detailed line-item proposal across performance marketing, custom websites, or web applications.",
};

export default function StartAProjectPage() {
  return (
    <div className="flex flex-col bg-[#F7F7F5]">
      {/* 01. Hero Header */}
      <section className="pt-12 pb-16 md:pt-20 md:pb-24 border-b border-[#E5E5E2]">
        <Container>
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 mb-6">
              <Badge variant="accent" dot pulse>
                COMMERCIAL ONBOARDING
              </Badge>
              <span className="text-xs font-mono text-[#858585] uppercase tracking-wider">
                Step 01 // Project Scope Submission
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-[#111111] leading-[1.08] mb-6">
              Start Your Project with <br />
              <span className="text-[#1400FF]">OneDot ABM.</span>
            </h1>

            <p className="text-lg sm:text-xl text-[#555555] leading-relaxed max-w-2xl">
              Fill out our structured qualification form below. We will review your targets, evaluate technical and marketing requirements, and provide a clear milestone proposal within 24 hours.
            </p>
          </div>
        </Container>
      </section>

      {/* 02. Form & What Happens Next */}
      <section className="py-16 md:py-24">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Form */}
            <div className="lg:col-span-8">
              <ProjectInquiryForm />
            </div>

            {/* Right: What happens next sidebar */}
            <div className="lg:col-span-4 space-y-6">
              <div className="p-8 rounded-3xl bg-white border border-[#D8D8D4] space-y-6">
                <h3 className="text-lg font-semibold text-[#111111]">
                  What Happens Next?
                </h3>

                <div className="space-y-4 text-xs sm:text-sm text-[#555555]">
                  <div className="flex items-start gap-3">
                    <span className="font-mono text-xs font-bold text-[#1400FF] shrink-0 mt-0.5">
                      01
                    </span>
                    <div>
                      <strong className="text-[#111111] block mb-0.5">Scope Audit & Review</strong>
                      <span>We evaluate your unit economics, ad history, or application requirements.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="font-mono text-xs font-bold text-[#1400FF] shrink-0 mt-0.5">
                      02
                    </span>
                    <div>
                      <strong className="text-[#111111] block mb-0.5">Strategy Alignment Call</strong>
                      <span>A 30-minute discovery session with founder Dhrubo Duti Biswas.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="font-mono text-xs font-bold text-[#1400FF] shrink-0 mt-0.5">
                      03
                    </span>
                    <div>
                      <strong className="text-[#111111] block mb-0.5">Line-Item Proposal</strong>
                      <span>A formal milestone plan with transparent deliverables and timelines.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Guarantees Box */}
              <div className="p-6 rounded-2xl bg-[#F7F7F5] border border-[#E5E5E2] space-y-3 text-xs text-[#555555]">
                <span className="font-mono text-xs uppercase tracking-wider text-[#111111] font-semibold block">
                  The OneDot Commitment:
                </span>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#1400FF] shrink-0" />
                  <span>Strict NDA and data privacy on all shared materials</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#1400FF] shrink-0" />
                  <span>No pushy sales reps — direct technical evaluation</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#1400FF] shrink-0" />
                  <span>100% intellectual property ownership upon completion</span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
