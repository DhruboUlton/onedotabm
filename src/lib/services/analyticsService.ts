import { dbQuery } from '@/lib/db';
import { ActivityRecord, AnalyticsOverview, LeadRecord, InvoiceRecord } from '@/types/database';

export interface FinancialMetrics {
  totalRevenue: number;
  totalReceivables: number;
  totalInvoiced: number;
  collectionRate: number;
  paidInvoicesCount: number;
  unpaidInvoicesCount: number;
  monthlyRevenue: Array<{ month: string; revenue: number; invoicesCount: number }>;
  topClients: Array<{ id: string; name: string; revenue: number; projectsCount: number }>;
}

export interface LeadMetrics {
  totalLeads: number;
  qualifiedLeads: number;
  pipelineValue: number;
  leadSources: Array<{ source: string; count: number; percentage: number }>;
  conversionFunnel: Array<{ stage: string; count: number; percentage: number }>;
}

export interface DeliveryMetrics {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  averageProgress: number;
  projectStatusDistribution: Array<{ status: string; count: number; percentage: number }>;
}

export async function getAnalyticsOverview(): Promise<AnalyticsOverview> {
  // None of these 6 queries depend on another's result — sourcesRes/statusRes/
  // monthlyRes/clientsRes only use totalLeads (computed after, in JS) for
  // percentage math below, not as a query param. They were awaited one after
  // another, paying a full round trip each (this page measured at ~1.9s — 6
  // sequential round trips on a cross-region DB). Promise.all turns that into 1.
  const [kpiRes, sourcesRes, statusRes, monthlyRes, clientsRes, activitiesRes] = await Promise.all([
    // 1. KPI Aggregates
    dbQuery<{
      total_revenue: string;
      total_receivables: string;
      total_invoiced: string;
      paid_count: string;
      unpaid_count: string;
      total_leads: string;
      qualified_leads: string;
      pipeline_value: string;
      active_projects: string;
      completed_projects: string;
      total_projects: string;
      avg_progress: string;
    }>(`
      SELECT
        (SELECT COALESCE(SUM(amount), 0) FROM public.payments) AS total_revenue,
        (SELECT COALESCE(SUM(amount_due), 0) FROM public.invoices WHERE status NOT IN ('paid', 'cancelled')) AS total_receivables,
        (SELECT COALESCE(SUM(total), 0) FROM public.invoices) AS total_invoiced,
        (SELECT count(*) FROM public.invoices WHERE status = 'paid') AS paid_count,
        (SELECT count(*) FROM public.invoices WHERE status NOT IN ('paid', 'cancelled')) AS unpaid_count,
        (SELECT count(*) FROM public.leads) AS total_leads,
        (SELECT count(*) FROM public.leads WHERE status = 'qualified') AS qualified_leads,
        (SELECT COALESCE(SUM(estimated_deal_value), 0) FROM public.prospects WHERE stage != 'lost') AS pipeline_value,
        (SELECT count(*) FROM public.projects WHERE status IN ('planning', 'in_progress', 'review', 'revision')) AS active_projects,
        (SELECT count(*) FROM public.projects WHERE status = 'completed') AS completed_projects,
        (SELECT count(*) FROM public.projects) AS total_projects,
        (SELECT COALESCE(AVG(progress), 0) FROM public.projects) AS avg_progress
    `),

    // 2. Lead Sources Breakdown
    dbQuery<{ source: string; count: string }>(`
      SELECT COALESCE(NULLIF(lead_source, ''), 'website') AS source, count(*) AS count
      FROM public.leads
      GROUP BY lead_source
      ORDER BY count DESC
    `),

    // 3. Project Status Distribution
    dbQuery<{ status: string; count: string }>(`
      SELECT status, count(*) AS count
      FROM public.projects
      GROUP BY status
      ORDER BY count DESC
    `),

    // 4. Monthly Revenue (Payments Timeline)
    dbQuery<{ month: string; revenue: string; count: string }>(`
      SELECT
        to_char(payment_date, 'Mon YYYY') AS month,
        date_trunc('month', payment_date) AS sort_date,
        COALESCE(SUM(amount), 0) AS revenue,
        count(*) AS count
      FROM public.payments
      GROUP BY to_char(payment_date, 'Mon YYYY'), date_trunc('month', payment_date)
      ORDER BY sort_date ASC
      LIMIT 12
    `),

    // 5. Top Clients
    dbQuery<{
      id: string;
      name: string;
      revenue: string;
      projects_count: string;
    }>(`
      SELECT
        c.id,
        c.company_name AS name,
        COALESCE(SUM(p.amount), 0) AS revenue,
        count(DISTINCT pr.id) AS projects_count
      FROM public.clients c
      LEFT JOIN public.invoices i ON c.id = i.client_id
      LEFT JOIN public.payments p ON i.id = p.invoice_id
      LEFT JOIN public.projects pr ON c.id = pr.client_id
      GROUP BY c.id, c.company_name
      ORDER BY revenue DESC
      LIMIT 5
    `),

    // 6. Recent Activities
    dbQuery<ActivityRecord>(`
      SELECT * FROM public.activities
      ORDER BY created_at DESC
      LIMIT 15
    `),
  ]);

  const kpi = kpiRes.rows[0];
  const totalLeads = Number(kpi?.total_leads) || 0;
  const qualifiedLeads = Number(kpi?.qualified_leads) || 0;
  const totalRevenue = Number(kpi?.total_revenue) || 0;
  const totalReceivables = Number(kpi?.total_receivables) || 0;
  const totalInvoiced = Number(kpi?.total_invoiced) || 0;
  const pipelineValue = Number(kpi?.pipeline_value) || 0;
  const activeProjects = Number(kpi?.active_projects) || 0;
  const completedProjects = Number(kpi?.completed_projects) || 0;
  const avgProgress = Math.round(Number(kpi?.avg_progress) || 0);

  // Conversion rate: qualified / total leads
  const conversionRate = totalLeads > 0 ? Math.round((qualifiedLeads / totalLeads) * 100) : 0;

  // 2. Lead Sources Breakdown
  const leadSources = sourcesRes.rows.map((row) => {
    const count = Number(row.count) || 0;
    const percentage = totalLeads > 0 ? Math.round((count / totalLeads) * 100) : 0;
    return {
      source: row.source,
      count,
      percentage,
    };
  });

  // 3. Project Status Distribution
  const projectStatusDistribution = statusRes.rows.map((row) => ({
    status: row.status,
    count: Number(row.count) || 0,
  }));

  // 4. Monthly Revenue (Payments Timeline)
  let monthlyRevenue = monthlyRes.rows.map((r) => ({
    month: r.month,
    revenue: Number(r.revenue),
    invoicesCount: Number(r.count),
  }));

  // Fallback if no payment months yet
  if (monthlyRevenue.length === 0) {
    monthlyRevenue = [
      { month: 'Jul 2026', revenue: 0, invoicesCount: 0 },
      { month: 'Aug 2026', revenue: 0, invoicesCount: 0 },
      { month: 'Sep 2026', revenue: totalRevenue, invoicesCount: 1 },
    ];
  }

  // 5. Top Clients
  const topClients = clientsRes.rows.map((r) => ({
    id: r.id,
    name: r.name,
    revenue: Number(r.revenue),
    projectsCount: Number(r.projects_count),
  }));

  // 6. Recent Activities — activitiesRes.rows used directly below

  return {
    totalRevenue,
    totalReceivables,
    totalPaidInvoices: Number(kpi?.paid_count) || 0,
    totalUnpaidInvoices: Number(kpi?.unpaid_count) || 0,
    totalLeads,
    qualifiedLeads,
    pipelineValue,
    activeProjects,
    completedProjects,
    averageProjectProgress: avgProgress,
    conversionRate,
    monthlyRevenue,
    leadSources,
    projectStatusDistribution,
    recentActivities: activitiesRes.rows,
    topClients,
  };
}

export async function getRecentLeads(limit = 5): Promise<LeadRecord[]> {
  const res = await dbQuery<LeadRecord>(
    `SELECT * FROM public.leads ORDER BY created_at DESC LIMIT $1`,
    [limit]
  );
  return res.rows;
}

export async function getRecentInvoices(limit = 5): Promise<InvoiceRecord[]> {
  const res = await dbQuery<InvoiceRecord>(
    `
    SELECT i.*, c.company_name AS client_name
    FROM public.invoices i
    LEFT JOIN public.clients c ON i.client_id = c.id
    ORDER BY i.created_at DESC
    LIMIT $1
    `,
    [limit]
  );
  return res.rows.map((row) => ({
    ...row,
    subtotal: Number(row.subtotal),
    discount: Number(row.discount),
    tax: Number(row.tax),
    total: Number(row.total),
    amount_paid: Number(row.amount_paid),
    amount_due: Number(row.amount_due),
  }));
}
