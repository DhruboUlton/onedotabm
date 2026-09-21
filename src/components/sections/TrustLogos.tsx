"use client";

import React from "react";
import { Container } from "@/components/ui/Container";
import { TRUST_CLIENTS } from "@/data";
import { ShieldCheck } from "lucide-react";

export function TrustLogos() {
  // Use specified core clients
  const coreClients = TRUST_CLIENTS.slice(0, 6);

  return (
    <section className="py-10 bg-[#F7F7F5] border-b border-[#E5E5E2]">
      <Container>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Label */}
          <div className="flex items-center gap-2.5 shrink-0">
            <ShieldCheck className="w-4 h-4 text-[#1400FF]" />
            <span className="text-xs font-mono uppercase tracking-widest text-[#858585] font-semibold">
              TRUSTED COLLABORATIONS
            </span>
          </div>

          {/* Clean Horizontal Logo Rail / Wall */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 flex-1">
            {coreClients.map((client) => (
              <div
                key={client.id}
                className="py-3.5 px-4 rounded-xl border border-[#E5E5E2] bg-[#FFFFFF] flex items-center justify-center text-center transition-all duration-200 hover:border-[#111111] hover:shadow-xs group cursor-default"
              >
                <span className="font-mono text-xs tracking-wider font-bold text-[#111111] group-hover:text-[#1400FF] transition-colors">
                  {client.logoText || client.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
