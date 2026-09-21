import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Home, ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "404 // Page Not Found",
  description: "The page you are looking for does not exist or has been relocated.",
};

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] py-16 sm:py-24 bg-[#F7F7F5]">
      <Container size="narrow">
        <div className="p-8 sm:p-14 rounded-3xl bg-white border border-[#D8D8D4] text-center space-y-6 max-w-2xl mx-auto shadow-[0_12px_40px_rgba(0,0,0,0.03)]">
          <div className="inline-flex items-center gap-2">
            <Badge variant="accent" dot>
              ERROR 404
            </Badge>
            <span className="text-xs font-mono text-[#858585] uppercase tracking-wider">
              Route Not Found
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight text-[#111111] leading-tight">
            Lost in the <br />
            <span className="text-[#1400FF]">Architecture.</span>
          </h1>

          <p className="text-sm sm:text-base text-[#555555] max-w-md mx-auto leading-relaxed">
            The page or resource you requested does not exist, has been moved, or the URL was entered incorrectly.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <Button href="/" variant="primary" size="md" leftIcon={<Home className="w-4 h-4 mr-1" />}>
              Return to Homepage
            </Button>
            <Button href="/work" variant="secondary" size="md">
              View Portfolio Work
            </Button>
          </div>

          {/* Quick links directory */}
          <div className="pt-8 border-t border-[#E5E5E2] text-left">
            <span className="text-xs font-mono uppercase tracking-wider text-[#858585] block mb-3 font-semibold">
              Popular Destinations:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono">
              <Link
                href="/services"
                className="p-2.5 rounded-xl bg-[#F7F7F5] hover:bg-[#F0F0ED] text-[#111111] flex items-center justify-between transition-colors"
              >
                <span>Services</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#858585]" />
              </Link>
              <Link
                href="/case-studies"
                className="p-2.5 rounded-xl bg-[#F7F7F5] hover:bg-[#F0F0ED] text-[#111111] flex items-center justify-between transition-colors"
              >
                <span>Case Studies</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#858585]" />
              </Link>
              <Link
                href="/web-applications"
                className="p-2.5 rounded-xl bg-[#F7F7F5] hover:bg-[#F0F0ED] text-[#111111] flex items-center justify-between transition-colors"
              >
                <span>Web Apps</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#858585]" />
              </Link>
              <Link
                href="/about"
                className="p-2.5 rounded-xl bg-[#F7F7F5] hover:bg-[#F0F0ED] text-[#111111] flex items-center justify-between transition-colors"
              >
                <span>About Us</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#858585]" />
              </Link>
              <Link
                href="/pricing"
                className="p-2.5 rounded-xl bg-[#F7F7F5] hover:bg-[#F0F0ED] text-[#111111] flex items-center justify-between transition-colors"
              >
                <span>Pricing</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#858585]" />
              </Link>
              <Link
                href="/contact"
                className="p-2.5 rounded-xl bg-[#F7F7F5] hover:bg-[#F0F0ED] text-[#111111] flex items-center justify-between transition-colors"
              >
                <span>Contact</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#858585]" />
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
