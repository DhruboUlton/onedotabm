import React from "react";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = {
  title: "Privacy Policy | OneDot ABM",
  description:
    "Learn how OneDot ABM collects, protects, and handles commercial data, tracking telemetry, and client information.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col bg-[#F7F7F5]">
      <section className="pt-12 pb-16 md:pt-20 md:pb-20 border-b border-[#E5E5E2] bg-white">
        <Container size="narrow">
          <div className="space-y-4">
            <Badge variant="subtle" dot={false}>
              LEGAL DOCUMENTATION
            </Badge>
            <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-[#111111]">
              Privacy Policy
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
                1. Business Identity & Data Controller
              </h2>
              <p>
                This Privacy Policy outlines how <strong>OneDot ABM</strong> (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) collects, processes, and protects information gathered through our company website (onedotabm.com), marketing campaigns, and client portal access points.
              </p>
              <p className="mt-2">
                <strong>Business Name:</strong> OneDot ABM <br />
                <strong>Founder:</strong> Dhrubo Duti Biswas <br />
                <strong>Email:</strong> contact@onedotabm.com <br />
                <strong>Headquarters:</strong> Dhaka, Bangladesh (Serving Global Clients)
              </p>
            </div>

            <div className="border-t border-[#E5E5E2] pt-6">
              <h2 className="text-xl font-semibold text-[#111111] mb-3">
                2. Information We Collect
              </h2>
              <p>
                We collect information necessary to provide commercial marketing services and custom web application engineering:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>
                  <strong>Direct Inquiries:</strong> Name, business email address, phone/WhatsApp number, company name, existing website URL, and project specifications provided via our qualification forms.
                </li>
                <li>
                  <strong>Client Onboarding Data:</strong> Administrative credentials, ad account permissions, repository access, and payment verification details required for service delivery.
                </li>
                <li>
                  <strong>Technical Telemetry:</strong> IP addresses, browser user agents, and referral paths captured through analytics scripts to monitor website health and conversion performance.
                </li>
              </ul>
            </div>

            <div className="border-t border-[#E5E5E2] pt-6">
              <h2 className="text-xl font-semibold text-[#111111] mb-3">
                3. Use of Advertising & Telemetry Data
              </h2>
              <p>
                In our marketing operations, we implement client-side cookies and server-side tracking pipelines, including the Meta Conversions API (CAPI) and Google Analytics 4:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>
                  <strong>Conversion Optimization:</strong> Telemetry data is utilized strictly to measure campaign efficacy, attribute checkout orders, and optimize ad auction bidding algorithms.
                </li>
                <li>
                  <strong>No Data Brokering:</strong> We never sell, rent, or monetize client data, customer lists, or proprietary database records to any third-party brokers.
                </li>
              </ul>
            </div>

            <div className="border-t border-[#E5E5E2] pt-6">
              <h2 className="text-xl font-semibold text-[#111111] mb-3">
                4. Data Protection & Source Code Security
              </h2>
              <p>
                We employ rigorous physical and electronic safeguards to ensure all client data, software codebases, and financial documentation remain secure:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>All web sessions are protected by standard 256-bit SSL/TLS encryption.</li>
                <li>Database schemas adhere to strict role-based access control (RBAC) principles.</li>
                <li>Confidential client strategic plans and ad assets are kept under strict non-disclosure obligations.</li>
              </ul>
            </div>

            <div className="border-t border-[#E5E5E2] pt-6">
              <h2 className="text-xl font-semibold text-[#111111] mb-3">
                5. Third-Party Services & Payment Gateways
              </h2>
              <p>
                When you transact with OneDot ABM, payment processing may be handled by certified merchant processors (Stripe, SSLCommerz, bKash, or direct corporate bank wire). We do not store raw credit card numbers or private payment gateway passwords on our public servers.
              </p>
            </div>

            <div className="border-t border-[#E5E5E2] pt-6">
              <h2 className="text-xl font-semibold text-[#111111] mb-3">
                6. Your Data Rights
              </h2>
              <p>
                Regardless of your geographic location, you have the right to request access to the personal data we hold about you, request corrections to inaccurate records, or request complete erasure of your contact details from our active communication databases.
              </p>
              <p className="mt-2">
                To exercise any of these rights, email us at{" "}
                <a href="mailto:contact@onedotabm.com" className="text-[#1400FF] hover:underline font-mono">
                  contact@onedotabm.com
                </a>
                .
              </p>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
