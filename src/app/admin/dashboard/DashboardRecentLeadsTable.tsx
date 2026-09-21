"use client";

import React from "react";
import { LeadRecord } from "@/types/database";
import { AdminDataTable, AdminBadge, Column } from "@/components/admin/ui";

interface DashboardRecentLeadsTableProps {
  recentLeads: LeadRecord[];
}

export function DashboardRecentLeadsTable({
  recentLeads,
}: DashboardRecentLeadsTableProps) {
  const leadColumns: Column<LeadRecord>[] = [
    {
      key: "name",
      header: "Lead Contact",
      render: (row) => (
        <div>
          <div className="font-semibold text-[#111111]">{row.name}</div>
          <div className="text-xs text-[#858585]">{row.email}</div>
        </div>
      ),
    },
    {
      key: "company",
      header: "Company",
      render: (row) => (
        <span className="font-mono text-xs text-[#555555]">
          {row.company || "—"}
        </span>
      ),
    },
    {
      key: "service_interested",
      header: "Service",
      render: (row) => (
        <span className="text-xs text-[#555555] line-clamp-1">
          {row.service_interested || "General Inquiry"}
        </span>
      ),
    },
    {
      key: "budget",
      header: "Budget",
      render: (row) => (
        <span className="font-mono text-xs text-[#111111] font-medium">
          {row.budget || "TBD"}
        </span>
      ),
    },
    {
      key: "priority",
      header: "Priority",
      render: (row) => <AdminBadge status={row.priority} size="xs" />,
    },
    {
      key: "status",
      header: "Status",
      render: (row) => <AdminBadge status={row.status} size="xs" />,
    },
    {
      key: "created_at",
      header: "Date Added",
      align: "right",
      render: (row) => (
        <span className="font-mono text-[11px] text-[#858585]">
          {new Date(row.created_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </span>
      ),
    },
  ];

  return (
    <AdminDataTable
      columns={leadColumns}
      data={recentLeads}
      searchPlaceholder="Search leads by name, email, or company..."
      statusOptions={[
        { label: "All", value: "all" },
        { label: "New", value: "new" },
        { label: "Qualified", value: "qualified" },
        { label: "Contacted", value: "contacted" },
        { label: "Won", value: "won" },
      ]}
      paginated={false}
    />
  );
}
