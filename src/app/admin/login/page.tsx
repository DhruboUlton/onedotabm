"use client";

import React, { useState, useActionState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
  Loader2,
  ArrowRight,
  Globe,
} from "lucide-react";
import { loginAdminAction, LoginActionState } from "@/lib/auth/actions";

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [state, formAction, isPending] = useActionState<LoginActionState, FormData>(
    loginAdminAction,
    {}
  );

  return (
    <div className="min-h-screen bg-[#F7F7F5] flex flex-col justify-between p-4 sm:p-6 lg:p-8 select-none">
      {/* Top Bar: Brand mark + Security status */}
      <div className="flex items-center justify-between max-w-6xl w-full mx-auto py-2">
        <Link
          href="/"
          className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1400FF] rounded-md"
        >
          <div className="relative w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-[#E5E5E2] bg-white flex items-center justify-center transition-transform group-hover:scale-105">
            <Image
              src="/logo.png"
              alt="OneDot ABM Logo"
              width={32}
              height={32}
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="font-sans font-bold text-sm tracking-tight text-[#111111] leading-none flex items-center gap-1">
              OneDot <span className="text-[#1400FF]">ABM</span>
            </span>
            <span className="font-mono text-[9px] uppercase tracking-widest text-[#858585] mt-0.5">
              Command Infrastructure
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-2 text-xs font-mono text-[#555555]">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-[#E5E5E2]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">SECURITY LAYER //</span>
            <span className="font-semibold text-[#111111]">ACTIVE</span>
          </span>
        </div>
      </div>

      {/* Center: Editorial Login Card */}
      <div className="max-w-md w-full mx-auto my-auto py-8">
        <div className="bg-white rounded-3xl border border-[#D8D8D4] p-8 sm:p-10 shadow-[0_12px_40px_rgba(0,0,0,0.04)] space-y-6">
          {/* Card Header */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[rgba(20,0,255,0.08)] text-[#1400FF] border border-[rgba(20,0,255,0.2)]">
                Admin Console
              </span>
              <span className="font-mono text-[10px] text-[#858585] uppercase tracking-wider">
                v2.6 Secure
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111111]">
              Sign in to Console
            </h1>
            <p className="text-xs text-[#555555] leading-relaxed">
              Enter your authorized administrator credentials to manage clients, operations, leads, and financials.
            </p>
          </div>

          {/* Error Alert Box */}
          {state?.error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2.5 animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <span className="leading-snug">{state.error}</span>
            </div>
          )}

          {/* Login Form */}
          <form action={formAction} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="admin-email"
                className="block text-xs font-mono uppercase tracking-wider text-[#111111] font-semibold"
              >
                Administrator Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#858585] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="admin-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="username"
                  defaultValue="dhrubo@onedotabm.com"
                  placeholder="admin@onedotabm.com"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#F7F7F5] border border-[#E5E5E2] rounded-xl text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#1400FF]/40 focus:border-[#1400FF] transition-all font-sans"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="admin-password"
                  className="block text-xs font-mono uppercase tracking-wider text-[#111111] font-semibold"
                >
                  Password
                </label>
                <span className="text-[11px] font-mono text-[#858585]">
                  256-bit SHA hashed
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#858585] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="admin-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 text-sm bg-[#F7F7F5] border border-[#E5E5E2] rounded-xl text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#1400FF]/40 focus:border-[#1400FF] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#858585] hover:text-[#111111] p-1 rounded-md transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me checkbox */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-[#D8D8D4] text-[#1400FF] focus:ring-[#1400FF]"
                />
                <span className="text-[#555555]">Remember this workstation</span>
              </label>

              <span className="font-mono text-[10px] text-[#858585]">7-Day Session</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full h-11 rounded-xl bg-[#1400FF] hover:bg-[#1000CC] text-white font-medium text-sm flex items-center justify-center gap-2 transition-all shadow-[0_2px_8px_rgba(20,0,255,0.25)] hover:shadow-[0_4px_14px_rgba(20,0,255,0.35)] disabled:opacity-60 disabled:pointer-events-none mt-2 cursor-pointer"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Admin Console</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Card Footer Info */}
          <div className="pt-4 border-t border-[#E5E5E2] text-center">
            <p className="text-[11px] text-[#858585] leading-relaxed">
              Authorized OneDot ABM staff only. All sign-in attempts and session tokens are cryptographically signed and logged.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Return to Website + Copyright */}
      <div className="max-w-6xl w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#858585] py-2 border-t border-[#E5E5E2]/80">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 hover:text-[#111111] transition-colors font-mono"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Return to Public Website</span>
        </Link>

        <div className="font-mono text-[11px]">
          &copy; 2026 OneDot ABM. All rights reserved.
        </div>
      </div>
    </div>
  );
}
