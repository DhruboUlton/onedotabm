import React from "react";
import {
  Hero,
  MetricsBar,
  TrustLogos,
  MarketingSection,
  WebDevSection,
  PipelineSection,
  FeaturedCaseStudies,
  SelectedWork,
  WebAppShowcase,
  WhyOneDot,
  ProcessSection,
  IndustriesSection,
  TestimonialsSection,
  FaqSection,
  CtaSection,
} from "@/components/sections";

export default function HomePage() {
  return (
    <>
      {/* 01. Hero Section */}
      <Hero />

      {/* 02. Verified Proof Metrics */}
      <MetricsBar />

      {/* 03. Client Collaborations Trust Bar */}
      <TrustLogos />

      {/* 04. Marketing Services */}
      <MarketingSection />

      {/* 05. Web Development Capabilities */}
      <WebDevSection />

      {/* 06. Signature Acquisition-to-Web Pipeline */}
      <PipelineSection />

      {/* 07. Large Editorial Case Studies */}
      <FeaturedCaseStudies />

      {/* 08. Filterable Selected Work Portfolio */}
      <SelectedWork />

      {/* 09. Technical Web Application Showcase */}
      <WebAppShowcase />

      {/* 10. The Unified Partner Advantage */}
      <WhyOneDot />

      {/* 11. 5-Phase Execution Process */}
      <ProcessSection />

      {/* 12. Specialized Industry Domains */}
      <IndustriesSection />

      {/* 13. Authentic Client Testimonials */}
      <TestimonialsSection />

      {/* 14. Clarity Accordion FAQs */}
      <FaqSection />

      {/* 15. Final Conversion CTA */}
      <CtaSection />
    </>
  );
}
