"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Lock,
  Mail,
  Key,
  Eye,
  EyeOff,
  ShieldCheck,
  FolderGit2,
  FileCheck2,
  Receipt,
  FileText,
  MessageSquare,
  HardDrive,
  ExternalLink,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

const portalModules = [
  {
    icon: <FolderGit2 className="w-5 h-5 text-[#1400FF]" />,
    name: "Active Projects",
    desc: "Live milestone timelines, sprint objectives, and delivery dates.",
  },
  {
    icon: <FileCheck2 className="w-5 h-5 text-[#1400FF]" />,
    name: "Deliverables Tracker",
    desc: "Review status and download completed marketing assets & code releases.",
  },
  {
    icon: <FileText className="w-5 h-5 text-[#1400FF]" />,
    name: "Quotations & Contracts",
    desc: "Review line-item scopes, milestone terms, and approve proposals.",
  },
  {
    icon: <Receipt className="w-5 h-5 text-[#1400FF]" />,
    name: "Billing & Invoices",
    desc: "Inspect payment histories, settled receipts, and pending invoices.",
  },
  {
    icon: <MessageSquare className="w-5 h-5 text-[#1400FF]" />,
    name: "Direct Communication",
    desc: "Dedicated communication channel with founder Dhrubo Duti Biswas.",
  },
  {
    icon: <HardDrive className="w-5 h-5 text-[#1400FF]" />,
    name: "Central File Hub",
    desc: "Secure cloud repository for raw creative files, guidelines, and exports.",
  },
];

export default function ClientLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "info" | "error"; text: string } | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setStatusMessage({
        type: "error",
        text: "Please enter your registered client email and password.",
      });
      return;
    }

    setIsLoading(true);
    setStatusMessage(null);

    // Simulate authentication check
    setTimeout(() => {
      setIsLoading(false);
      setStatusMessage({
        type: "info",
        text: "Redirecting to authenticated client portal environment...",
      });
      // Redirect to actual platform or access point
      window.location.href = "https://dhruboduti.com/project-access";
    }, 900);
  };

  return (
    <div className="flex flex-col bg-[#F7F7F5] min-h-[calc(100vh-140px)]">
      {/* 01. Login Hero / Section */}
      <section className="py-12 sm:py-20 border-b border-[#E5E5E2]">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Sign-In Form */}
            <div className="lg:col-span-5 max-w-md mx-auto w-full">
              <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#D8D8D4] shadow-[0_12px_40px_rgba(0,0,0,0.03)] space-y-6">
                {/* Brand Mark */}
                <div className="flex items-center justify-between pb-6 border-b border-[#E5E5E2]">
                  <div className="flex items-center gap-2.5">
                    <div className="relative w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-[#E5E5E2] bg-white flex items-center justify-center">
                      <Image
                        src="/logo.png"
                        alt="OneDot ABM Logo"
                        width={32}
                        height={32}
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <span className="font-sans font-bold text-base tracking-tight text-[#111111] leading-none block">
                        OneDot <span className="text-[#1400FF]">ABM</span>
                      </span>
                      <span className="font-mono text-[9px] uppercase tracking-widest text-[#858585]">
                        Client Gateway
                      </span>
                    </div>
                  </div>

                  <Badge variant="subtle" size="sm">
                    <Lock className="w-3 h-3 mr-1 text-[#858585]" />
                    SSL 256-BIT
                  </Badge>
                </div>

                <div>
                  <h1 className="text-2xl font-semibold text-[#111111]">
                    Client Portal Sign In
                  </h1>
                  <p className="text-xs text-[#555555] mt-1">
                    Access your active projects, deliverables, quotations, and invoice records.
                  </p>
                </div>

                {statusMessage && (
                  <div
                    className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
                      statusMessage.type === "error"
                        ? "bg-rose-50 border border-rose-200 text-rose-700"
                        : "bg-[rgba(20,0,255,0.06)] border border-[rgba(20,0,255,0.18)] text-[#1400FF]"
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    <span>{statusMessage.text}</span>
                  </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label
                      htmlFor="client-email"
                      className="block text-xs font-mono uppercase tracking-wider text-[#111111] font-semibold mb-1.5"
                    >
                      Client Work Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-[#858585] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        id="client-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="client@yourcompany.com"
                        className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#F7F7F5] border border-[#E5E5E2] rounded-xl text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#1400FF] focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label
                        htmlFor="client-password"
                        className="block text-xs font-mono uppercase tracking-wider text-[#111111] font-semibold"
                      >
                        Password
                      </label>
                      <a
                        href="mailto:contact@onedotabm.com?subject=Password%20Reset%20Request"
                        className="text-[11px] font-mono text-[#1400FF] hover:underline"
                      >
                        Forgot password?
                      </a>
                    </div>
                    <div className="relative">
                      <Key className="w-4 h-4 text-[#858585] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        id="client-password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full pl-10 pr-10 py-2.5 text-sm bg-[#F7F7F5] border border-[#E5E5E2] rounded-xl text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#1400FF] focus:border-transparent transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#858585] hover:text-[#111111]"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-[#E5E5E2] text-[#1400FF] focus:ring-[#1400FF]"
                      />
                      <span className="text-[#555555]">Remember this device</span>
                    </label>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={isLoading}
                    loading={isLoading}
                    className="w-full justify-center"
                  >
                    Sign In to Portal
                  </Button>
                </form>

                <div className="pt-4 border-t border-[#E5E5E2] text-center">
                  <a
                    href="https://dhruboduti.com/project-access"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-[#555555] hover:text-[#1400FF] transition-colors"
                  >
                    <span>Direct Access via Founder Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column: Portal Feature Preview */}
            <div className="lg:col-span-7 space-y-8">
              <div>
                <Badge variant="subtle" dot={false} className="mb-4">
                  AUTHENTICATED CLIENT WORKSPACE
                </Badge>
                <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#111111] mb-4">
                  Your Centralized Commercial Command Hub
                </h2>
                <p className="text-base text-[#555555] leading-relaxed max-w-xl">
                  OneDot ABM clients receive private, authenticated portal access to monitor projects without chaotic email threads or lost attachments.
                </p>
              </div>

              {/* Grid of 6 modules */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {portalModules.map((mod, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-white border border-[#E5E5E2] space-y-2 hover:border-[#D8D8D4] transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-[#F7F7F5] border border-[#E5E5E2]">
                        {mod.icon}
                      </div>
                      <h3 className="text-sm font-semibold text-[#111111]">{mod.name}</h3>
                    </div>
                    <p className="text-xs text-[#555555] leading-relaxed">{mod.desc}</p>
                  </div>
                ))}
              </div>

              <div className="p-6 rounded-2xl bg-white border border-[#E5E5E2] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-[#555555]">
                  <strong className="text-[#111111] block mb-0.5">Need client onboarding credentials?</strong>
                  <span>Credentials are issued during the project kickoff milestone.</span>
                </div>
                <Button href="/contact" variant="outline" size="sm">
                  Contact Support
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
