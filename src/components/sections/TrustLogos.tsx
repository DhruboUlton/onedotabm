"use client";

import React, { useState } from "react";
import { Container } from "@/components/ui/Container";
import { TRUST_CLIENTS } from "@/data";
import { ShieldCheck } from "lucide-react";

export function TrustLogos() {
  const [hoveredClient, setHoveredClient] = useState<string | null>(null);

  return (
    <section className="py-12 bg-[#F7F7F5] border-b border-[#E5E5E2]">
      <Container>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Label */}
          <div className="flex items-center gap-2.5 shrink-0">
            <ShieldCheck className="w-4 h-4 text-[#1400FF]" />
            <span className="text-xs font-mono uppercase tracking-widest text-[#858585] font-semibold">
              TRUSTED COLLABORATIONS
            </span>
          </div>

          {/* Minimal Editorial Logos Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 flex-1">
            {TRUST_CLIENTS.map((client) => {
              const isHovered = hoveredClient === client.id;
              return (
                <div
                  key={client.id}
                  onMouseEnter={() => setHoveredClient(client.id)}
                  onMouseLeave={() => setHoveredClient(null)}
                  className={`relative p-4 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-center items-center text-center ${
                    isHovered
                      ? "border-[#111111] bg-[#FFFFFF] shadow-xs -translate-y-0.5"
                      : "border-[#E5E5E2] bg-[#FFFFFF]/60 hover:bg-[#FFFFFF]"
                  }`}
                >
                  <span
                    className={`font-mono text-xs tracking-wider font-bold transition-colors ${
                      isHovered ? "text-[#1400FF]" : "text-[#111111]"
                    }`}
                  >
                    {client.logoText || client.name}
                  </span>
                  <span className="text-[10px] text-[#858585] mt-1 line-clamp-1">
                    {client.category.split("&")[0]}
                  </span>

                  {/* Micro Tooltip on Hover */}
                  {isHovered && client.note && (
                    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 z-20 whitespace-nowrap rounded-md bg-[#111111] px-2.5 py-1 text-[10px] font-mono text-white shadow-md pointer-events-none animate-in fade-in zoom-in-95 duration-150">
                      {client.note}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
