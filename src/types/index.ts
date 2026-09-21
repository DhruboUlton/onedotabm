/**
 * OneDot ABM — Complete Type Definitions
 * Marketing Agency & Web Development
 */

// ==========================================
// SITE CONFIGURATION & NAVIGATION
// ==========================================

export interface NavLink {
  label: string;
  href: string;
  badge?: string;
  isExternal?: boolean;
  children?: NavLink[];
}

export interface SocialLink {
  platform: 'facebook' | 'instagram' | 'linkedin' | 'fiverr' | 'upwork' | 'github' | 'x' | 'whatsapp';
  label: string;
  url: string;
  username?: string;
}

export interface ContactInfo {
  email: string;
  phone?: string;
  whatsapp?: string;
  location: string;
  address?: string;
  responseTime: string;
  availabilityStatus: string;
}

export interface SiteMeta {
  title: string;
  defaultTitle: string;
  titleTemplate: string;
  description: string;
  siteUrl: string;
  ogImage: string;
  creator: string;
  keywords: string[];
  themeColor: string;
}

export interface SiteConfig {
  brandName: string;
  legalName: string;
  positioning: string;
  tagline: string;
  supportingStatement: string;
  founder: {
    name: string;
    title: string;
    bio: string;
    portfolioUrl: string;
  };
  contact: ContactInfo;
  socialLinks: SocialLink[];
  navigation: {
    main: NavLink[];
    actions: NavLink[];
    footerServices: NavLink[];
    footerCompany: NavLink[];
    footerLegal: NavLink[];
  };
  meta: SiteMeta;
  clientPortalUrl: string;
}

// ==========================================
// METRICS & PROOF
// ==========================================

export interface MetricItem {
  id: string;
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  description: string;
  category?: 'marketing' | 'development' | 'aggregate';
  verified?: boolean;
}

export type Metric = MetricItem;

export interface TrustClient {
  id: string;
  name: string;
  logoText?: string;
  category: string;
  note?: string;
}

// ==========================================
// SERVICES & CAPABILITIES
// ==========================================

export type ServicePillar = 'marketing' | 'web-development';

export interface ServiceDeliverable {
  title: string;
  description: string;
}

export interface MarketingService {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  tag: string;
  deliverables: string[];
}

export interface WebDevCapability {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  technologies: string[];
  deliverables: string[];
}

export interface TechnologyItem {
  name: string;
  category: string;
  role: string;
}

export interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  shortTitle?: string;
  pillar: ServicePillar;
  headline: string;
  shortDescription: string;
  fullDescription: string;
  iconName: string;
  deliverables: ServiceDeliverable[];
  technologies?: string[];
  outcomes: string[];
  featured: boolean;
  tags: string[];
}

// ==========================================
// PIPELINE & ADVANTAGE
// ==========================================

export interface PipelineStep {
  stepNumber: string;
  step?: string;
  phase: string;
  role: string;
  title: string;
  summary: string;
  details: string[];
  impact: string;
  label?: string;
  sublabel?: string;
  detail?: string;
}

export interface WhyOneDotPillar {
  index: string;
  title: string;
  subtitle: string;
  description: string;
  marketingAngle?: string;
  devAngle?: string;
  synergyResult?: string;
  points?: string[];
}

// ==========================================
// PROJECTS & PORTFOLIO
// ==========================================

export type ProjectCategory =
  | 'Websites'
  | 'E-commerce'
  | 'Web Applications'
  | 'Marketing'
  | 'custom-web-application'
  | 'e-commerce-platform'
  | 'business-website'
  | 'performance-marketing'
  | 'lead-generation';

export interface ProjectMedia {
  url: string;
  alt: string;
  caption?: string;
  heading?: string;
  isCover?: boolean;
}

export interface ProjectResult {
  metric?: string;
  label: string;
  value?: string;
  prefix?: string;
  suffix?: string;
  detail?: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  client?: string;
  category: ProjectCategory;
  categoryLabel?: string;
  industry: string;
  year?: string;
  highlightMetric?: string;
  summary?: string;
  description?: string;
  fullOverview?: string;
  liveUrl?: string;
  featured: boolean;
  showOnHome?: boolean;
  deliverables: string[];
  services?: string[];
  technologies: string[];
  features?: string[];
  results?: ProjectResult[];
  images?: ProjectMedia[];
  caseStudySlug?: string;
}

// ==========================================
// WEB APP SHOWCASE
// ==========================================

export interface WebAppSystemModule {
  title: string;
  description: string;
  highlights: string[];
}

export interface WebAppSystem {
  id: string;
  slug?: string;
  name: string;
  subtitle?: string;
  tagline?: string;
  category: string;
  description: string;
  stats: { label: string; value: string }[];
  metrics?: { label: string; value: string }[];
  features?: string[];
  techStack?: string[];
  architecture?: {
    frontend?: string[];
    backend?: string[];
    database?: string[];
    infra?: string[];
    integrations?: string[];
    [key: string]: unknown;
  };
  keyModules?: WebAppSystemModule[];
  adminCapabilities?: string[] | { title: string; description: string; [key: string]: unknown }[];
}

// ==========================================
// CASE STUDIES
// ==========================================

export interface CaseStudyOverview {
  client: string;
  industry: string;
  service: string;
  projectPeriod?: string;
  objective: string;
}

export interface CaseStudyChallenge {
  summary: string;
  points: string[];
}

export interface CaseStudyStrategy {
  summary: string;
  points: string[];
}

export interface CaseStudyExecution {
  summary: string;
  deliverables: string[];
  technicalDetails?: string[];
}

export interface CaseStudyResultMetric {
  metric?: string;
  label: string;
  value?: string;
  prefix?: string;
  suffix?: string;
  detail?: string;
  note?: string;
}

export interface CaseStudyResults {
  summary: string;
  metrics: CaseStudyResultMetric[];
}

export interface CaseStudyEvidence {
  type: 'metric' | 'analytics' | 'architecture' | 'feature' | 'deliverable';
  title: string;
  description: string;
  items: string[];
}

export interface CaseStudyConclusion {
  summary: string;
  businessImpact: string[];
  keyTakeaways: string[];
}

export interface FeaturedCaseStudy {
  slug: string;
  client: string;
  industry: string;
  period: string;
  title: string;
  challenge: string;
  strategy: string;
  execution: string[];
  results: {
    metric: string;
    label: string;
    detail?: string;
  }[];
  tags: string[];
}

export interface CaseStudy {
  id: string;
  slug: string;
  title: string;
  client: string;
  industry: string;
  service: string;
  period?: string;
  summary: string;
  featured: boolean;
  heroMetric: {
    value: string;
    label: string;
  };
  overview: CaseStudyOverview;
  challenge: CaseStudyChallenge;
  strategy: CaseStudyStrategy;
  execution: CaseStudyExecution;
  results: CaseStudyResults;
  evidence: CaseStudyEvidence[];
  conclusion: CaseStudyConclusion;
  projectSlug?: string;
  testimonialId?: string;
  tags?: string[];
}

// ==========================================
// TESTIMONIALS
// ==========================================

export interface TestimonialItem {
  id: string;
  projectType: string;
  quote: string;
  clientName: string;
  role: string;
  company: string;
  verifiedResult: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  service?: string;
  rating?: number;
  verified?: boolean;
  featured?: boolean;
  projectSlug?: string;
  clientName?: string;
  projectType?: string;
  verifiedResult?: string;
}

// ==========================================
// FAQS
// ==========================================

export type FaqCategory = 'General' | 'Marketing' | 'Web Development' | 'Process' | 'general' | 'marketing' | 'web-development' | 'process-pricing';
export type FAQCategory = FaqCategory;

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: FaqCategory;
  categoryLabel?: string;
  featured?: boolean;
}

export type FAQItem = FaqItem;

// ==========================================
// INDUSTRIES
// ==========================================

export interface IndustryItem {
  id: string;
  name: string;
  tag: string;
  description: string;
  caseReference?: string;
  typicalNeeds: string[];
  relevantServices: string[];
  slug?: string;
  headline?: string;
  challengesAddressed?: string[];
  solutionsProvided?: string[];
  relatedProjectSlugs?: string[];
  relatedCaseStudySlugs?: string[];
  tags?: string[];
}

// ==========================================
// PROCESS
// ==========================================

export interface ProcessStep {
  step: string;
  phase: string;
  duration: string;
  title: string;
  description: string;
  keyDeliverables: string[];
  clientInvolvement: string;
  tagline?: string;
  activities?: string[];
  deliverables?: string[];
}

// ==========================================
// BLOG
// ==========================================

/**
 * A blog post as the public site renders it. Rows from `public.blog_posts`
 * (authored in /admin/blog) are mapped onto this shape; the seed posts in
 * src/data/blog.ts use it directly.
 */
export interface PublicBlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  /** Markdown, as written in the admin editor. */
  content: string;
  /** ISO date string. */
  publishedAt: string;
  author: string;
  featuredImage?: string | null;
}
