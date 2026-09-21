/**
 * OneDot ABM — Database TypeScript Definitions
 * Directly aligned with remote Supabase PostgreSQL Schema
 */

export type UserRole = 'owner' | 'admin' | 'manager' | 'marketing' | 'developer' | 'finance' | 'editor';
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost' | 'archived';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type ProspectStage = 'qualified' | 'discovery' | 'proposal' | 'negotiation' | 'decision' | 'won' | 'lost';
export type ProjectStatus = 'planning' | 'in_progress' | 'review' | 'revision' | 'completed' | 'on_hold' | 'cancelled';
export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'completed';
export type WebsiteStatus = 'planning' | 'development' | 'staging' | 'live' | 'maintenance' | 'archived';
export type QuotationStatus = 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected' | 'expired' | 'cancelled';
export type InvoiceStatus = 'draft' | 'sent' | 'partially_paid' | 'paid' | 'overdue' | 'cancelled';
export type ContentStatus = 'draft' | 'scheduled' | 'published' | 'archived';

export interface ProfileRecord {
  id: string;
  auth_user_id?: string | null;
  full_name: string;
  email: string;
  password_hash?: string | null;
  role: UserRole;
  avatar_url?: string | null;
  phone?: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LeadRecord {
  id: string;
  name: string;
  company?: string | null;
  email: string;
  phone?: string | null;
  country: string;
  city?: string | null;
  website?: string | null;
  service_interested?: string | null;
  lead_source: string;
  budget?: string | null;
  message?: string | null;
  assigned_to?: string | null;
  status: LeadStatus;
  priority: Priority;
  tags: string[];
  notes?: string | null;
  next_follow_up?: string | null;
  last_contact?: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  assigned_to_name?: string | null;
}

export interface ProspectRecord {
  id: string;
  lead_id?: string | null;
  company: string;
  contact_person: string;
  email: string;
  phone?: string | null;
  services: string[];
  estimated_deal_value: number;
  currency: string;
  probability: number;
  stage: ProspectStage;
  expected_close_date?: string | null;
  assigned_to?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  assigned_to_name?: string | null;
}

export interface ClientRecord {
  id: string;
  company_name: string;
  contact_person: string;
  email: string;
  phone?: string | null;
  website?: string | null;
  address?: string | null;
  industry?: string | null;
  services: string[];
  status: string;
  account_manager?: string | null;
  start_date: string;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  // Joined aggregates
  project_count?: number;
  total_revenue?: number;
}

export interface ProjectRecord {
  id: string;
  project_name: string;
  client_id: string;
  service_type: string;
  description?: string | null;
  start_date: string;
  deadline?: string | null;
  budget: number;
  currency: string;
  assigned_team: string[];
  project_manager?: string | null;
  status: ProjectStatus;
  priority: Priority;
  progress: number;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  client_name?: string;
  project_manager_name?: string | null;
  tasks_count?: number;
  completed_tasks_count?: number;
  tasks?: ProjectTaskRecord[];
  milestones?: ProjectMilestoneRecord[];
}

export interface ProjectMilestoneRecord {
  id: string;
  project_id: string;
  title: string;
  description?: string | null;
  due_date?: string | null;
  status: 'pending' | 'achieved' | 'delayed' | string;
  created_at: string;
  updated_at: string;
}

export interface ProjectTaskRecord {
  id: string;
  project_id: string;
  title: string;
  description?: string | null;
  assigned_to?: string | null;
  status: TaskStatus;
  priority: Priority;
  due_date?: string | null;
  created_at: string;
  updated_at: string;
}

export interface WebsiteRecord {
  id: string;
  website_name: string;
  client_id: string;
  project_id?: string | null;
  domain: string;
  technology: string;
  website_type: string;
  status: WebsiteStatus;
  launch_date?: string | null;
  hosting?: string | null;
  maintenance_plan?: string | null;
  renewal_date?: string | null;
  repository_url?: string | null;
  deployment_url?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  client_name?: string;
  project_name?: string;
}

export interface PortfolioItemRecord {
  id: string;
  title: string;
  slug: string;
  client_id?: string | null;
  category: string;
  description?: string | null;
  featured_image?: string | null;
  gallery: string[];
  services: string[];
  technologies: string[];
  project_url?: string | null;
  completion_date?: string | null;
  featured: boolean;
  published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface CaseStudyRecord {
  id: string;
  title: string;
  slug: string;
  client_id?: string | null;
  client_name: string;
  industry: string;
  challenge: string;
  strategy: string;
  execution: string;
  result: string;
  services: string[];
  hero_metric_value?: string | null;
  hero_metric_label?: string | null;
  metrics: Array<{ metric: string; label: string; detail?: string }>;
  images: string[];
  testimonial?: string | null;
  status: ContentStatus;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface BlogPostRecord {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  featured_image?: string | null;
  author_id?: string | null;
  category: string;
  tags: string[];
  seo_title?: string | null;
  seo_description?: string | null;
  canonical_url?: string | null;
  published_at?: string | null;
  status: ContentStatus;
  created_at: string;
  updated_at: string;
}

export interface LogoRecord {
  id: string;
  company_name: string;
  logo_url: string;
  website?: string | null;
  category: string;
  featured: boolean;
  display_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface SiteBannerRecord {
  id: string;
  message: string;
  link_text?: string | null;
  link_url?: string | null;
  enabled: boolean;
  start_date?: string | null;
  end_date?: string | null;
  priority: number;
  created_at: string;
  updated_at: string;
}

export interface QuotationItemRecord {
  id: string;
  quotation_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  discount: number;
  total: number;
}

export interface QuotationRecord {
  id: string;
  quotation_number: string;
  client_id: string;
  project_id?: string | null;
  issue_date: string;
  expiry_date: string;
  currency: string;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  notes?: string | null;
  terms?: string | null;
  status: QuotationStatus;
  created_at: string;
  updated_at: string;
  client_name?: string;
  client_email?: string;
  items?: QuotationItemRecord[];
}

export interface InvoiceItemRecord {
  id: string;
  invoice_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  discount: number;
  total: number;
}

export interface PaymentRecord {
  id: string;
  invoice_id: string;
  amount: number;
  currency: string;
  payment_method: string;
  payment_date: string;
  reference?: string | null;
  notes?: string | null;
  created_at: string;
}

export interface InvoiceRecord {
  id: string;
  invoice_number: string;
  client_id: string;
  project_id?: string | null;
  quotation_id?: string | null;
  issue_date: string;
  due_date: string;
  currency: string;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  amount_paid: number;
  amount_due: number;
  status: InvoiceStatus;
  payment_method?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  client_name?: string;
  client_email?: string;
  items?: InvoiceItemRecord[];
  payments?: PaymentRecord[];
}

export interface IntegrationRecord {
  id: string;
  name: string;
  provider: string;
  status: 'connected' | 'disconnected' | 'error';
  config: Record<string, unknown>;
  last_synced_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface NotificationRecord {
  id: string;
  user_id?: string | null;
  title: string;
  message: string;
  type: string;
  read: boolean;
  link_url?: string | null;
  created_at: string;
}

export interface ActivityRecord {
  id: string;
  actor_id?: string | null;
  actor_name: string;
  action: string;
  entity_type: string;
  entity_id?: string | null;
  entity_title?: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface CompanySettingsRecord {
  id?: string;
  company_name: string;
  tagline?: string | null;
  email: string;
  phone?: string | null;
  address?: string | null;
  website?: string | null;
  default_currency: string;
  tax_rate: number;
  invoice_prefix: string;
  quotation_prefix: string;
  notify_email?: string | null;
  notify_on_lead: boolean;
  notify_on_invoice: boolean;
  notify_on_payment: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface AnalyticsOverview {
  totalRevenue: number;
  totalReceivables: number;
  totalPaidInvoices: number;
  totalUnpaidInvoices: number;
  totalLeads: number;
  qualifiedLeads: number;
  pipelineValue: number;
  activeProjects: number;
  completedProjects: number;
  averageProjectProgress: number;
  conversionRate: number;
  monthlyRevenue: Array<{ month: string; revenue: number; invoicesCount: number }>;
  leadSources: Array<{ source: string; count: number; percentage: number }>;
  projectStatusDistribution: Array<{ status: string; count: number }>;
  recentActivities: ActivityRecord[];
  topClients: Array<{ id: string; name: string; revenue: number; projectsCount: number }>;
}

