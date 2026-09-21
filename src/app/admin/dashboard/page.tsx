import React from "react";
import Link from "next/link";
import {
  Users,
  Inbox,
  Briefcase,
  TrendingUp,
  Receipt,
  ArrowUpRight,
  Plus,
} from "lucide-react";
import { dbQuery } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth/adminAuth";
import { LeadRecord } from "@/types/database";
import { AdminMetricCard } from "@/components/admin/ui";
import { DashboardRecentLeadsTable } from "./DashboardRecentLeadsTable";

export const revalidate = 0; // Dynamic server component

export default async function AdminDashboardPage() {
  const admin = await getCurrentAdmin();

  // Query metric aggregates
  let leadsCount = 0;
  let activeProjectsCount = 0;
  let clientsCount = 0;
  let totalRevenue = 0;
  let recentLeads: LeadRecord[] = [];

  try {
    const [leadsRes, projectsRes, clientsRes, invoicesRes, recentLeadsRes] =
      await Promise.all([
        dbQuery<{ count: string }>("SELECT COUNT(*) FROM public.leads"),
        dbQuery<{ count: string }>(
          "SELECT COUNT(*) FROM public.projects WHERE status IN ('planning', 'in_progress', 'review', 'revision')"
        ),
        dbQuery<{ count: string }>("SELECT COUNT(*) FROM public.clients"),
        dbQuery<{ sum: string | null }>(
          "SELECT SUM(amount_paid) FROM public.invoices WHERE status = 'paid'"
        ),
        dbQuery<LeadRecord>(
          `SELECT id, name, company, email, phone, service_interested, status, priority, budget, created_at
           FROM public.leads
           ORDER BY created_at DESC
           LIMIT 10`
        ),
      ]);

    leadsCount = parseInt(leadsRes.rows[0]?.count || "0", 10);
    activeProjectsCount = parseInt(projectsRes.rows[0]?.count || "0", 10);
    clientsCount = parseInt(clientsRes.rows[0]?.count || "0", 10);
    totalRevenue = parseFloat(invoicesRes.rows[0]?.sum || "0");
    recentLeads = recentLeadsRes.rows;
  } catch (err) {
    console.error("Dashboard data load error:", err);
  }

  const formattedRevenue = `৳${totalRevenue.toLocaleString("en-BD", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;

  return (
    <div className="space-y-8">
      {/* Top Banner: Greeting & Quick Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#E5E5E2]">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-wider text-[#858585]">
              Executive Overview
            </span>
            <span className="text-[#D8D8D4]">•</span>
            <span className="font-mono text-xs text-[#1400FF]">
              {new Date().toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111111] mt-1">
            Welcome back, {admin?.full_name?.split(" ")[0] || "Admin"}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/leads"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono uppercase tracking-wider font-semibold bg-white border border-[#E5E5E2] text-[#111111] hover:bg-[#F7F7F5] transition-all shadow-xs"
          >
            <span>View All Leads</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>

          <Link
            href="/admin/leads"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono uppercase tracking-wider font-semibold bg-[#1400FF] hover:bg-[#1000CC] text-white transition-all shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Lead</span>
          </Link>
        </div>
      </div>

      {/* KPI Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <AdminMetricCard
          title="Qualified Leads"
          value={leadsCount}
          change={{ value: "+3 this week", isPositive: true }}
          icon={<Inbox className="w-5 h-5 text-[#1400FF]" />}
          subtitle="New inbound client inquiries"
          href="/admin/leads"
        />

        <AdminMetricCard
          title="Active Projects"
          value={activeProjectsCount}
          change={{ value: "4 in development", isPositive: true }}
          icon={<Briefcase className="w-5 h-5 text-emerald-600" />}
          subtitle="Client milestones in progress"
          href="/admin/projects"
        />

        <AdminMetricCard
          title="Retained Clients"
          value={clientsCount}
          change={{ value: "100% active", isPositive: true }}
          icon={<Users className="w-5 h-5 text-indigo-600" />}
          subtitle="Managed brand accounts"
          href="/admin/clients"
        />

        <AdminMetricCard
          title="Settled Revenue"
          value={formattedRevenue}
          change={{ value: "YTD Confirmed", isPositive: true }}
          icon={<Receipt className="w-5 h-5 text-amber-600" />}
          subtitle="Cleared bank invoices"
          href="/admin/billing"
        />
      </div>

      {/* Main Section: Recent Leads Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#111111] tracking-tight">
              Recent Inbound Leads
            </h2>
            <p className="text-xs text-[#555555]">
              Latest inquiries submitted across OneDot ABM website and direct channels.
            </p>
          </div>

          <Link
            href="/admin/leads"
            className="text-xs font-mono text-[#1400FF] hover:underline"
          >
            Manage Pipeline &rarr;
          </Link>
        </div>

        <DashboardRecentLeadsTable recentLeads={recentLeads} />
      </div>
    </div>
  );
}
