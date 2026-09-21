import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Lock, Mail, MapPin } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#F7F7F5] border-t border-[#E5E5E2] pt-16 sm:pt-24 pb-12">
      <div className="editorial-container">
        {/* Large Closing Typographic Statement (Design.md Section 21) */}
        <div className="pb-16 sm:pb-20 border-b border-[#E5E5E2]">
          <div className="flex flex-col space-y-4">
            <span className="font-mono text-xs uppercase tracking-widest text-[#858585] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#1400FF]" />
              OneDot ABM // Strategy & Infrastructure
            </span>
            <p className="font-sans text-3xl sm:text-5xl lg:text-6xl font-semibold text-[#111111] tracking-tight max-w-4xl leading-[1.08]">
              Marketing that gets attention.
              <br />
              <span className="text-[#858585]">Websites that convert.</span>
            </p>
          </div>
        </div>

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 py-16 border-b border-[#E5E5E2]">
          {/* Brand Info & Statement */}
          <div className="lg:col-span-4 flex flex-col space-y-6">
            <Link href="/" className="flex items-center gap-3 inline-block group">
              <div className="relative w-9 h-9 rounded-xl overflow-hidden shrink-0 border border-[#E5E5E2] bg-white flex items-center justify-center transition-transform group-hover:scale-105">
                <Image
                  src="/logo.png"
                  alt="OneDot ABM Logo"
                  width={36}
                  height={36}
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-sans font-bold text-lg tracking-tight text-[#111111] leading-none">
                  OneDot <span className="text-[#1400FF]">ABM</span>
                </span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#858585] mt-0.5">
                  Marketing & Web Development
                </span>
              </div>
            </Link>

            <p className="text-sm text-[#555555] leading-relaxed max-w-sm">
              OneDot ABM combines strategic marketing and custom web development to help businesses
              attract customers, build stronger digital experiences, and achieve measurable growth.
            </p>

            <div className="flex flex-col space-y-2 pt-2 text-sm text-[#555555]">
              <a
                href="mailto:hello@onedotabm.com"
                className="inline-flex items-center gap-2 hover:text-[#1400FF] transition-colors font-mono text-xs"
              >
                <Mail className="w-3.5 h-3.5 text-[#858585]" />
                <span>hello@onedotabm.com</span>
              </a>
              <div className="inline-flex items-center gap-2 text-[#858585] font-mono text-xs">
                <MapPin className="w-3.5 h-3.5" />
                <span>Dhaka, Bangladesh // Available Worldwide</span>
              </div>
            </div>
          </div>

          {/* Navigation Column */}
          <div className="lg:col-span-2 flex flex-col space-y-4">
            <h4 className="font-mono text-xs uppercase tracking-wider text-[#111111] font-semibold">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm text-[#555555]">
              <li>
                <Link href="/services" className="hover:text-[#111111] transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/work" className="hover:text-[#111111] transition-colors">
                  Work / Portfolio
                </Link>
              </li>
              <li>
                <Link href="/case-studies" className="hover:text-[#111111] transition-colors">
                  Case Studies
                </Link>
              </li>
              <li>
                <Link href="/web-applications" className="hover:text-[#111111] transition-colors">
                  Web Applications
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#111111] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-[#111111] transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#111111] transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services Column */}
          <div className="lg:col-span-3 flex flex-col space-y-4">
            <h4 className="font-mono text-xs uppercase tracking-wider text-[#111111] font-semibold">
              Core Capabilities
            </h4>
            <ul className="space-y-2.5 text-sm text-[#555555]">
              <li className="font-mono text-[11px] uppercase tracking-wider text-[#858585] pt-1">
                {"// Marketing"}
              </li>
              <li>
                <Link href="/services/marketing" className="hover:text-[#111111] transition-colors">
                  Meta & Google Ads
                </Link>
              </li>
              <li>
                <Link href="/services/marketing" className="hover:text-[#111111] transition-colors">
                  Performance & Funnel Strategy
                </Link>
              </li>
              <li>
                <Link href="/services/marketing" className="hover:text-[#111111] transition-colors">
                  Lead Generation & Tracking
                </Link>
              </li>
              <li className="font-mono text-[11px] uppercase tracking-wider text-[#858585] pt-2">
                {"// Web Development"}
              </li>
              <li>
                <Link href="/services/web-development" className="hover:text-[#111111] transition-colors">
                  Business & Corporate Websites
                </Link>
              </li>
              <li>
                <Link href="/services/web-development" className="hover:text-[#111111] transition-colors">
                  E-commerce Platforms
                </Link>
              </li>
              <li>
                <Link href="/services/web-development" className="hover:text-[#111111] transition-colors">
                  Custom Web Apps & Admin Portals
                </Link>
              </li>
            </ul>
          </div>

          {/* Case Studies & Client Portal */}
          <div className="lg:col-span-3 flex flex-col space-y-4">
            <h4 className="font-mono text-xs uppercase tracking-wider text-[#111111] font-semibold">
              Featured Work
            </h4>
            <ul className="space-y-2.5 text-sm text-[#555555]">
              <li>
                <Link
                  href="/case-studies/solution-point"
                  className="hover:text-[#111111] transition-colors inline-flex items-center gap-1 group"
                >
                  <span>Solution Point (৳800K Rev)</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link
                  href="/case-studies/autonex"
                  className="hover:text-[#111111] transition-colors inline-flex items-center gap-1 group"
                >
                  <span>Autonex (৳343K Rev)</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link
                  href="/case-studies/kanzie"
                  className="hover:text-[#111111] transition-colors inline-flex items-center gap-1 group"
                >
                  <span>KANZIE E-Commerce & ERP</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link
                  href="/case-studies/lumiflick"
                  className="hover:text-[#111111] transition-colors inline-flex items-center gap-1 group"
                >
                  <span>LUMIFLICK Digital Platform</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
            </ul>

            <div className="pt-4">
              <h4 className="font-mono text-xs uppercase tracking-wider text-[#111111] font-semibold mb-3">
                Client Access
              </h4>
              <Link
                href="/client-login"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#E5E5E2] bg-white hover:border-[#D8D8D4] hover:bg-[#F0F0ED] text-xs font-mono uppercase tracking-wider text-[#111111] transition-all"
              >
                <Lock className="w-3 h-3 text-[#1400FF]" />
                <span>Client Portal / Login</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright, Legal & Socials */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-xs text-[#858585]">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="font-mono">
              &copy; {currentYear} OneDot ABM. All rights reserved.
            </span>
            <span className="hidden sm:inline text-[#D8D8D4]">•</span>
            <Link href="/privacy" className="hover:text-[#111111] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-[#111111] transition-colors">
              Terms of Service
            </Link>
          </div>

          <div className="flex items-center gap-5">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#111111] transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#111111] transition-colors"
            >
              Facebook
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#111111] transition-colors"
            >
              Instagram
            </a>
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#111111] transition-colors"
            >
              X (Twitter)
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
