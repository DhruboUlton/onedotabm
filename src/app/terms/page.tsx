import React from "react";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = {
  title: "Terms of Service | OneDot ABM",
  description:
    "Review the commercial terms, intellectual property agreements, and engagement standards of OneDot ABM.",
};

export default function TermsOfServicePage() {
  return (
    <div className="flex flex-col bg-[#F7F7F5]">
      <section className="pt-12 pb-16 md:pt-20 md:pb-20 border-b border-[#E5E5E2] bg-white">
        <Container size="narrow">
          <div className="space-y-4">
            <Badge variant="subtle" dot={false}>
              LEGAL TERMS
            </Badge>
            <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-[#111111]">
              Terms of Service
            </h1>
            <p className="text-xs font-mono text-[#858585]">
              Last updated: September 2026 • OneDot ABM
            </p>
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container size="narrow">
          <div className="prose prose-neutral max-w-none text-[#555555] text-sm leading-relaxed space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-[#111111] mb-3">
                1. Agreement & Acceptance
              </h2>
              <p>
                By accessing this website (onedotabm.com) or entering into a service agreement, quotation, or Statement of Work with <strong>OneDot ABM</strong>, you agree to be bound by these Terms of Service. If you do not agree with any portion of these terms, please do not utilize our platforms or services.
              </p>
            </div>

            <div className="border-t border-[#E5E5E2] pt-6">
              <h2 className="text-xl font-semibold text-[#111111] mb-3">
                2. Commercial Engagement & Quotations
              </h2>
              <p>
                All marketing campaigns, website builds, and custom software projects are executed pursuant to written proposals, quotations, or contracts specifying line-item deliverables, milestones, and fees.
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>
                  <strong>Fixed-Fee Milestones:</strong> Web development projects operate on agreed milestone schedules (typically 50% deposit upon kickoff and 50% upon final delivery/launch).
                </li>
                <li>
                  <strong>Marketing Retainers:</strong> Performance marketing and ad management retainers are billed monthly in advance. Ad spend is paid directly by the client to advertising platforms (Meta / Google).
                </li>
              </ul>
            </div>

            <div className="border-t border-[#E5E5E2] pt-6">
              <h2 className="text-xl font-semibold text-[#111111] mb-3">
                3. Intellectual Property & Code Ownership
              </h2>
              <p>
                OneDot ABM firmly upholds total client ownership:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>
                  <strong>100% Ownership Transfer:</strong> Upon full financial settlement of all agreed project milestones, complete ownership rights of custom source code repositories, databases, design assets, and marketing creatives are formally transferred to the client.
                </li>
                <li>
                  <strong>Zero Vendor Lock-In:</strong> Clients are free to self-host, modify, expand, or transfer their software applications to internal engineering teams at any point.
                </li>
              </ul>
            </div>

            <div className="border-t border-[#E5E5E2] pt-6">
              <h2 className="text-xl font-semibold text-[#111111] mb-3">
                4. Client Responsibilities & Materials
              </h2>
              <p>
                Clients agree to provide necessary access (such as Meta Business Manager permissions, repository access, domain DNS records) and feedback in a timely manner. Delays in client feedback or asset delivery may adjust projected launch timelines accordingly.
              </p>
            </div>

            <div className="border-t border-[#E5E5E2] pt-6">
              <h2 className="text-xl font-semibold text-[#111111] mb-3">
                5. Performance Advertising Disclaimers
              </h2>
              <p>
                While OneDot ABM executes with industry-standard performance protocols (evidenced by verified case studies like Solution Point and Autonex), advertising algorithms and market conditions are governed by third-party ad platforms (Meta, Google). We do not guarantee specific fixed sales revenues without accounting for product-market fit and inventory availability.
              </p>
            </div>

            <div className="border-t border-[#E5E5E2] pt-6">
              <h2 className="text-xl font-semibold text-[#111111] mb-3">
                6. Governing Law & Contact
              </h2>
              <p>
                These terms are governed by the laws of Bangladesh. For any inquiries regarding legal agreements or commercial terms, contact:
              </p>
              <p className="mt-2 font-mono text-xs">
                Email: contact@onedotabm.com <br />
                Business: OneDot ABM // Dhaka, Bangladesh
              </p>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
