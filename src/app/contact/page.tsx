import React from "react";
import type { Metadata } from "next";
import {
  Mail,
  MapPin,
  Clock,
  Lock,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProjectInquiryForm } from "@/components/forms/ProjectInquiryForm";
import { siteConfig } from "@/data/siteConfig";

export const metadata: Metadata = {
  title: "Contact & Project Qualification Inquiry",
  description:
    "Get in touch with OneDot ABM. Share your marketing or web development requirements to receive a direct scope evaluation within 24 hours.",
};

export default function ContactPage() {
  return (
    <div className="flex flex-col bg-[#F7F7F5]">
      {/* 01. Hero Header */}
      <section className="pt-12 pb-16 md:pt-20 md:pb-24 border-b border-[#E5E5E2]">
        <Container>
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 mb-6">
              <Badge variant="accent" dot>
                DIRECT COMMERCIAL ACCESS
              </Badge>
              <span className="text-xs font-mono text-[#858585] uppercase tracking-wider">
                Response SLA &lt; 24 Hours
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-[#111111] leading-[1.08] mb-6">
              Start a Conversation. <br />
              <span className="text-[#1400FF]">Scale Your Business.</span>
            </h1>

            <p className="text-lg sm:text-xl text-[#555555] leading-relaxed max-w-2xl">
              Tell us what you are working on. Whether you need an acquisition campaign, a bespoke Next.js platform, or an integrated full-stack growth partnership, we respond with clear answers.
            </p>
          </div>
        </Container>
      </section>

      {/* 02. Main Content: Contact Info + Form */}
      <section className="py-16 md:py-24">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Column: Direct Info & Trust Badges */}
            <div className="lg:col-span-5 space-y-8">
              <div className="p-8 rounded-3xl bg-white border border-[#D8D8D4] space-y-6">
                <h2 className="text-xl font-semibold text-[#111111]">
                  Direct Contact Details
                </h2>

                <div className="space-y-4 text-xs sm:text-sm text-[#555555]">
                  <div className="flex items-start gap-3">
                    <Mail className="w-4 h-4 text-[#1400FF] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-mono text-[11px] uppercase text-[#858585] block">Direct Email</span>
                      <a href={`mailto:${siteConfig.contact.email}`} className="text-[#111111] font-medium hover:text-[#1400FF] transition-colors">
                        {siteConfig.contact.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-[#1400FF] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-mono text-[11px] uppercase text-[#858585] block">Location</span>
                      <span className="text-[#111111] font-medium">{siteConfig.contact.location}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-[#1400FF] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-mono text-[11px] uppercase text-[#858585] block">Guaranteed SLA</span>
                      <span className="text-[#111111] font-medium">{siteConfig.contact.responseTime}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#F7F7F5] border border-[#E5E5E2] text-xs text-[#555555] space-y-1">
                  <div className="font-semibold text-[#111111]">Founder Direct Review:</div>
                  <div>All project inquiries are evaluated directly by founder Dhrubo Duti Biswas.</div>
                </div>
              </div>

              {/* Client Portal Link Card */}
              <div className="p-6 rounded-2xl bg-[#111111] text-white space-y-4">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#1400FF]" />
                  <span className="font-mono text-xs uppercase tracking-wider text-neutral-300 font-semibold">
                    Existing Client?
                  </span>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Active clients can access deliverables, invoice histories, and milestone updates through the authenticated portal.
                </p>
                <Button href="/client-login" variant="secondary" size="sm" className="w-full">
                  Go to Client Portal
                </Button>
              </div>

              {/* Social Channels */}
              <div className="p-6 rounded-2xl bg-white border border-[#E5E5E2] space-y-3">
                <span className="font-mono text-xs uppercase tracking-wider text-[#858585] block font-semibold">
                  Founder Profiles & Direct Messaging:
                </span>
                <div className="flex flex-wrap gap-2 text-xs font-mono">
                  {siteConfig.socialLinks.map((social) => (
                    <a
                      key={social.platform}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-full bg-[#F7F7F5] border border-[#E5E5E2] text-[#555555] hover:text-[#111111] hover:border-[#D8D8D4] transition-colors"
                    >
                      {social.label} ↗
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Qualification Form */}
            <div className="lg:col-span-7">
              <ProjectInquiryForm />
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
