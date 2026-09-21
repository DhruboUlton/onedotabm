import {
  ServiceItem,
  MarketingService,
  WebDevCapability,
  TechnologyItem,
} from '@/types';

// =================================================================
// COMPREHENSIVE SERVICE CATALOG
// =================================================================

export const services: ServiceItem[] = [
  // Marketing Pillar
  {
    id: 'meta-ads',
    slug: 'meta-ads',
    title: 'Meta & Facebook Ads',
    shortTitle: 'Meta Ads',
    pillar: 'marketing',
    headline: 'High-ROAS customer acquisition across Facebook and Instagram.',
    shortDescription:
      'Structured paid social campaigns built on granular audience research, iterative creative testing, and algorithmic scaling.',
    fullDescription:
      'We build Meta Ads campaigns that operate as reliable customer acquisition engines rather than sporadic ad boosts. From initial cold audience prospecting to retargeting and lookalike scaling, every campaign structure is aligned with real unit economics and bottom-line revenue.',
    iconName: 'Target',
    deliverables: [
      {
        title: 'Campaign Structure & Architecture',
        description: 'Prospecting, testing, and retargeting setup optimized for Meta machine learning algorithms.',
      },
      {
        title: 'Audience Strategy & Segmentation',
        description: 'Cold targeting, custom audience pools, high-value lookalikes, and exclusion mapping.',
      },
      {
        title: 'Creative Testing System',
        description: 'Systematic testing of video hooks, visual formats, ad copies, and calls to action.',
      },
      {
        title: 'CAPI & Pixel Conversion Tracking',
        description: 'Accurate server-side Conversion API and browser pixel configuration for clean data attribution.',
      },
      {
        title: 'Budget Optimization & Scaling',
        description: '72-hour review cycles to prune underperforming ad sets and scale proven winners.',
      },
    ],
    technologies: ['Meta Ads Manager', 'Meta Pixel', 'Conversions API (CAPI)', 'Meta Business Suite'],
    outcomes: [
      'Lower Customer Acquisition Cost (CAC)',
      'Higher Return on Ad Spend (ROAS)',
      'Predictable monthly lead and order volume',
      'Clear attribution transparently reported',
    ],
    featured: true,
    tags: ['Facebook Ads', 'Instagram Ads', 'Performance Marketing', 'Retargeting', 'Scaling'],
  },
  {
    id: 'google-ads',
    slug: 'google-ads',
    title: 'Google Ads & PPC',
    shortTitle: 'Google Ads',
    pillar: 'marketing',
    headline: 'Capture high-intent search demand and convert active buyers.',
    shortDescription:
      'Targeted Search, Performance Max, Display, and YouTube campaigns engineered for maximum search intent and CPA efficiency.',
    fullDescription:
      'Google Ads captures customers at the exact moment they are looking for your solution. We design tightly targeted search campaigns with high-intent keyword strategies, negative keyword filtering, compelling responsive ad copies, and conversion-focused landing page alignment.',
    iconName: 'Globe',
    deliverables: [
      {
        title: 'Intent-Driven Keyword Architecture',
        description: 'Granular grouping of transactional, commercial, and high-intent keyword match types.',
      },
      {
        title: 'Performance Max & Search Campaigns',
        description: 'Multi-channel asset groups and tight search queries built to capture ready-to-buy prospects.',
      },
      {
        title: 'Negative Keyword Filtering',
        description: 'Aggressive ongoing negative keyword hygiene to eliminate wasted ad spend.',
      },
      {
        title: 'Google Analytics 4 & Conversion Setup',
        description: 'Full GA4 conversion tracking, enhanced conversions, and value-based bidding.',
      },
      {
        title: 'Ad Copy & Extension Optimization',
        description: 'Continuous A/B testing of headlines, descriptions, callouts, and structured snippets.',
      },
    ],
    technologies: ['Google Ads', 'Google Analytics 4', 'Google Tag Manager', 'Search Console'],
    outcomes: [
      'High-intent qualified leads and direct sales',
      'Reduced cost per acquisition through wasted-click elimination',
      'Higher ad relevance and quality scores',
    ],
    featured: true,
    tags: ['Search Ads', 'Performance Max', 'YouTube Ads', 'Display', 'PPC'],
  },
  {
    id: 'performance-marketing',
    slug: 'performance-marketing',
    title: 'Performance Marketing',
    shortTitle: 'Performance Marketing',
    pillar: 'marketing',
    headline: 'Full-funnel customer acquisition tied directly to commercial revenue.',
    shortDescription:
      'A holistic, data-backed growth methodology connecting paid media, conversion pathways, and customer lifetime value.',
    fullDescription:
      'Performance marketing at OneDot ABM is about quantifiable business impact, not vanity metrics. We orchestrate paid traffic across channels, optimize the transition from click to purchase, and constantly refine unit economics to scale profitably.',
    iconName: 'TrendingUp',
    deliverables: [
      {
        title: 'Growth Model & Unit Economics Audit',
        description: 'Assessment of CAC, LTV, conversion rates, and profit margin headroom.',
      },
      {
        title: 'Omnichannel Media Orchestration',
        description: 'Coordinated acquisition across Meta, Google, and retargeting ecosystems.',
      },
      {
        title: 'Full-Funnel Measurement Framework',
        description: 'Cross-platform attribution models that show where actual revenue originates.',
      },
      {
        title: 'Iterative Growth Experiments',
        description: 'Hypothesis-driven testing of offers, positioning angles, and conversion mechanics.',
      },
    ],
    technologies: ['Meta Ads', 'Google Ads', 'GA4', 'Looker Studio', 'UTM Tracking'],
    outcomes: [
      'Positive unit economics and profitable scaling',
      'Clear visibility into blended CAC and channel ROI',
      'Resilient customer acquisition that compounds over time',
    ],
    featured: false,
    tags: ['Full Funnel', 'Paid Media', 'Unit Economics', 'Growth Architecture'],
  },
  {
    id: 'lead-generation',
    slug: 'lead-generation',
    title: 'Lead Generation Systems',
    shortTitle: 'Lead Generation',
    pillar: 'marketing',
    headline: 'Fill your sales pipeline with high-intent, qualified business leads.',
    shortDescription:
      'End-to-end lead acquisition combining targeted ads, high-converting qualification forms, and automated CRM routing.',
    fullDescription:
      'We build lead acquisition systems for service businesses, B2B companies, education institutions, and high-ticket offers. By qualifying prospects before they reach your team, you spend time closing deals rather than chasing cold inquiries.',
    iconName: 'Users',
    deliverables: [
      {
        title: 'Lead Qualification Funnel Design',
        description: 'Multi-step qualification forms that filter out tire-kickers and capture key intent data.',
      },
      {
        title: 'Instant Forms & Messenger Campaigns',
        description: 'Low-friction Meta native lead generation paired with instant WhatsApp or Messenger triage.',
      },
      {
        title: 'Automated CRM & Notification Routing',
        description: 'Instant lead delivery into CRM, email alerts, or WhatsApp notifications for fast follow-up.',
      },
      {
        title: 'Lead Quality Monitoring',
        description: 'Feedback loop between sales team lead feedback and ad account targeting optimization.',
      },
    ],
    technologies: ['Meta Lead Ads', 'Instant Forms', 'WhatsApp API', 'CRM Webhooks', 'Google Sheets Integration'],
    outcomes: [
      'Steady, predictable volume of qualified business inquiries',
      'Faster sales response times through automated routing',
      'Lower cost per qualified lead (CPQL)',
    ],
    featured: true,
    tags: ['B2B Leads', 'Lead Qualification', 'WhatsApp Lead Gen', 'Pipeline Growth'],
  },
  {
    id: 'creative-strategy',
    slug: 'creative-strategy',
    title: 'Creative Strategy & Ad Development',
    shortTitle: 'Creative Strategy',
    pillar: 'marketing',
    headline: 'Performance creatives built on consumer psychology and conversion hooks.',
    shortDescription:
      'Static ads, carousels, video concepts, and UGC-style advertising engineered to stop the scroll and drive action.',
    fullDescription:
      'In modern algorithmic advertising, creative is your primary targeting lever. We produce advertising assets designed around buyer psychology, addressing customer objections, demonstrating value clearly, and driving immediate action.',
    iconName: 'Megaphone',
    deliverables: [
      {
        title: 'Hook & Angle Research',
        description: 'Analysis of customer pain points, competitor ads, customer reviews, and market objections.',
      },
      {
        title: 'High-Converting Ad Creatives',
        description: 'Design of static graphics, comparison boards, product spotlights, and multi-slide carousels.',
      },
      {
        title: 'Video & UGC Concept Scripts',
        description: 'Structured video scripts featuring 3-second visual hooks, problem proof, and clear CTA.',
      },
      {
        title: 'Persuasive Direct-Response Copywriting',
        description: 'Headlines, body copy, and primary text written to educate, qualify, and convert.',
      },
    ],
    technologies: ['Adobe Creative Suite', 'Figma', 'Direct-Response Copywriting', 'Video Editing Frameworks'],
    outcomes: [
      'Higher click-through rates (CTR)',
      'Lower cost per click (CPC)',
      'Creative longevity that fights ad fatigue',
    ],
    featured: false,
    tags: ['Ad Design', 'UGC Style', 'Video Hooks', 'Direct Response Copy', 'Carousels'],
  },
  {
    id: 'funnel-strategy',
    slug: 'funnel-strategy',
    title: 'Funnel Strategy & Conversion Optimization',
    shortTitle: 'Funnel Strategy',
    pillar: 'marketing',
    headline: 'Eliminate drop-offs and maximize revenue per visitor.',
    shortDescription:
      'Architecting the full path from cold traffic to checkout or lead submission with structured landing page CRO.',
    fullDescription:
      'Traffic without a conversion system is wasted capital. We design and optimize the full customer journey—ad hook to landing page, checkout, order bumps, and follow-ups—to maximize the percentage of visitors who become paying clients.',
    iconName: 'Filter',
    deliverables: [
      {
        title: 'Conversion Funnel Mapping',
        description: 'Step-by-step diagramming of user touchpoints, entry angles, and conversion steps.',
      },
      {
        title: 'Landing Page CRO & Wireframing',
        description: 'Structuring information hierarchy, social proof placement, and frictionless CTAs.',
      },
      {
        title: 'Offer Positioning & Stacking',
        description: 'Packaging offers with risk reversals, bonuses, and clear value proposition framing.',
      },
      {
        title: 'A/B Split Testing Roadmap',
        description: 'Prioritized experimentation backlog testing headlines, layouts, and checkout flows.',
      },
    ],
    technologies: ['Figma', 'Landing Page Frameworks', 'Heatmaps', 'A/B Testing'],
    outcomes: [
      'Higher visitor-to-lead and visitor-to-sale conversion rates',
      'Increased Average Order Value (AOV)',
      'Maximum return on existing traffic investments',
    ],
    featured: false,
    tags: ['CRO', 'Funnel Architecture', 'Landing Pages', 'Offer Design', 'A/B Testing'],
  },
  {
    id: 'branding-identity',
    slug: 'branding',
    title: 'Branding & Visual Identity',
    shortTitle: 'Branding',
    pillar: 'marketing',
    headline: 'Establish distinct brand authority that commands premium pricing.',
    shortDescription:
      'Strategic brand positioning, logo systems, typography, color palettes, and digital design guidelines for growing businesses.',
    fullDescription:
      'Strong branding separates your company from commodity competitors. We create coherent brand identities that signal trustworthiness, technical quality, and professional distinction across all digital touchpoints.',
    iconName: 'Palette',
    deliverables: [
      {
        title: 'Brand Positioning & Tone of Voice',
        description: 'Core value propositions, market positioning, and brand communication guidelines.',
      },
      {
        title: 'Visual Identity System',
        description: 'Primary logo, wordmark, sub-marks, color palette, and typography hierarchy.',
      },
      {
        title: 'Digital Brand Assets',
        description: 'Social media kit, ad templates, banner formats, and presentation graphics.',
      },
      {
        title: 'Brand Style Guide',
        description: 'Complete specification documentation ensuring consistency across teams and campaigns.',
      },
    ],
    technologies: ['Figma', 'Adobe Illustrator', 'Vector Graphics', 'Design Systems'],
    outcomes: [
      'Cohesive, premium look and feel across all channels',
      'Higher perceived business value and trust',
      'Faster creative turnaround with unified design rules',
    ],
    featured: false,
    tags: ['Brand Identity', 'Logo Design', 'Design Systems', 'Style Guides'],
  },
  {
    id: 'seo',
    slug: 'seo',
    title: 'SEO & Search Optimization',
    shortTitle: 'SEO Setup',
    pillar: 'marketing',
    headline: 'Build sustainable organic search visibility and domain authority.',
    shortDescription:
      'Technical SEO foundations, structured content architecture, on-page optimization, and local search visibility.',
    fullDescription:
      'We lay robust search engine optimization foundations built into your web architecture. Through clean semantic HTML, fast loading performance, metadata strategy, and structured schema markup, we ensure search engines index and rank your pages effectively.',
    iconName: 'Search',
    deliverables: [
      {
        title: 'Technical SEO Audit & Setup',
        description: 'Robots.txt, XML sitemaps, canonical tags, OpenGraph tags, and JSON-LD schema.',
      },
      {
        title: 'Site Speed & Core Web Vitals',
        description: 'Performance optimization for LCP, FID/INP, and CLS benchmarks.',
      },
      {
        title: 'On-Page Content Architecture',
        description: 'Heading hierarchy (H1-H4), keyword placement, meta titles, and descriptions.',
      },
      {
        title: 'Search Console & Indexation Tracking',
        description: 'Google Search Console verification, URL indexing, and crawl error mitigation.',
      },
    ],
    technologies: ['Google Search Console', 'Schema.org', 'Lighthouse', 'Next.js Metadata API'],
    outcomes: [
      'Higher organic ranking for target service keywords',
      'Fast, error-free Google indexation',
      'Long-term inbound organic discovery without recurring ad spend',
    ],
    featured: false,
    tags: ['Technical SEO', 'Schema Markup', 'Core Web Vitals', 'Search Console'],
  },
  {
    id: 'analytics-tracking',
    slug: 'analytics-tracking',
    title: 'Analytics & Conversion Tracking',
    shortTitle: 'Analytics & Tracking',
    pillar: 'marketing',
    headline: 'Accurate, end-to-end data tracking for reliable decision-making.',
    shortDescription:
      'Server-side CAPI, Meta Pixel, Google Analytics 4, Tag Manager, and custom event tracking implementation.',
    fullDescription:
      'Without precise tracking, marketing optimization is just guesswork. We implement ironclad tracking setups combining client-side pixels and server-side conversion APIs so every lead, purchase, and micro-conversion is accurately captured.',
    iconName: 'Activity',
    deliverables: [
      {
        title: 'Meta Conversions API (CAPI)',
        description: 'Server-side tracking resilient against ad blockers and iOS privacy restrictions.',
      },
      {
        title: 'Google Analytics 4 Setup',
        description: 'Custom events, user properties, cross-domain tracking, and conversion triggers.',
      },
      {
        title: 'Google Tag Manager Architecture',
        description: 'Clean tag management structure without hardcoding tracking scripts in application code.',
      },
      {
        title: 'Funnel Event Instrumentation',
        description: 'Tracking custom events: ViewContent, AddToCart, InitiateCheckout, Lead, Purchase.',
      },
    ],
    technologies: ['Meta CAPI', 'GA4', 'Google Tag Manager', 'Node.js Tracking Endpoints'],
    outcomes: [
      'Data accuracy for paid ad algorithm optimization',
      'Zero blind spots in customer checkout or lead progression',
      'Audit-ready marketing attribution',
    ],
    featured: false,
    tags: ['CAPI', 'Meta Pixel', 'GA4', 'GTM', 'Event Tracking', 'Attribution'],
  },

  // Web Development Pillar
  {
    id: 'business-websites',
    slug: 'business-websites',
    title: 'Business & Corporate Websites',
    shortTitle: 'Business Websites',
    pillar: 'web-development',
    headline: 'Fast, modern, conversion-focused websites engineered for business authority.',
    shortDescription:
      'Custom-coded websites designed around your business model, brand identity, and customer acquisition goals.',
    fullDescription:
      'We develop custom corporate and business websites that load instantly, communicate your value proposition clearly, and guide visitors smoothly into inquiries. Built on modern stacks like Next.js and Tailwind CSS, these are durable digital assets, not disposable templates.',
    iconName: 'Laptop',
    deliverables: [
      {
        title: 'Bespoke UI/UX Architecture',
        description: 'Clean, spacious editorial layouts tailored specifically to your company proposition.',
      },
      {
        title: 'Next.js & React Full-Stack Codebase',
        description: 'Server-side rendering, static generation, and optimized client interactivity.',
      },
      {
        title: 'Responsive & Mobile-First Execution',
        description: 'Flawless presentation and touch interactions across phones, tablets, and desktops.',
      },
      {
        title: 'Lead Capture & CRM Integrations',
        description: 'Secure form processing, anti-spam protection, and automated email/webhook notifications.',
      },
      {
        title: 'SEO & Performance Optimization',
        description: '90+ Google Lighthouse performance scores, semantic markup, and metadata architecture.',
      },
    ],
    technologies: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    outcomes: [
      'Sub-second page load times that improve conversions',
      'Strong visual credibility that differentiates your brand',
      'Fully owned custom codebase without restrictive CMS locks',
    ],
    featured: true,
    tags: ['Next.js', 'React', 'Corporate Websites', 'Landing Pages', 'Tailwind CSS'],
  },
  {
    id: 'ecommerce-platforms',
    slug: 'ecommerce',
    title: 'Custom E-Commerce Platforms',
    shortTitle: 'E-Commerce',
    pillar: 'web-development',
    headline: 'High-converting online stores with complete commerce operations infrastructure.',
    shortDescription:
      'Custom online storefronts connected to inventory, order processing, customer accounts, and payment gateways.',
    fullDescription:
      'We build full-stack e-commerce platforms designed for speed, visual storytelling, and smooth customer checkout. Beyond the public storefront, our solutions include dedicated administrative systems to manage products, categories, stock, orders, and customer data.',
    iconName: 'ShoppingBag',
    deliverables: [
      {
        title: 'Visual Shopping Storefront',
        description: 'Product catalog, category filters, high-resolution product detail pages, and quick cart.',
      },
      {
        title: 'Streamlined Checkout Journey',
        description: 'Friction-free single-page or multi-step checkout optimized for mobile shoppers.',
      },
      {
        title: 'Back-Office Admin Center',
        description: 'Dedicated portal for order status management, inventory tracking, and stock notifications.',
      },
      {
        title: 'Payment Gateway Integration',
        description: 'Secure digital payment gateways, mobile wallet integrations (bKash/Nagad), and Cash-on-Delivery workflows.',
      },
      {
        title: 'Marketing & Analytics Tracking',
        description: 'Embedded Meta Pixel, CAPI, and GA4 enhanced e-commerce purchase tracking.',
      },
    ],
    technologies: ['Next.js', 'React', 'TypeScript', 'Prisma', 'Node.js', 'MySQL', 'Tailwind CSS'],
    outcomes: [
      'Higher checkout completion rates with frictionless buying',
      'Centralized operational control over catalog and orders',
      'Scalable database foundation capable of handling large catalogs',
    ],
    featured: true,
    tags: ['E-commerce', 'Online Store', 'Prisma', 'Inventory Management', 'Checkout CRO'],
  },
  {
    id: 'custom-web-applications',
    slug: 'custom-web-applications',
    title: 'Custom Web Applications',
    shortTitle: 'Web Applications',
    pillar: 'web-development',
    headline: 'Tailored digital products and software systems built for your exact workflows.',
    shortDescription:
      'Full-stack applications featuring authentication, role-based access control, relational databases, and custom business logic.',
    fullDescription:
      'When off-the-shelf software falls short, we architect custom web applications designed specifically around your operational processes. We engineer scalable databases, secure authentication systems, and intuitive user interfaces that streamline your internal operations.',
    iconName: 'Code2',
    deliverables: [
      {
        title: 'System Architecture & Database Design',
        description: 'Normalized relational database schemas (MySQL / PostgreSQL) designed for scale.',
      },
      {
        title: 'Secure Authentication & Session Handling',
        description: 'Multi-role authentication, password security, session management, and access tokens.',
      },
      {
        title: 'Role-Based Access Control (RBAC)',
        description: 'Granular permissions restricting actions and views according to assigned staff roles.',
      },
      {
        title: 'API & Business Logic Backend',
        description: 'Robust RESTful API endpoints, server-side data validation, and automated workflows.',
      },
      {
        title: 'Audit Logs & Activity History',
        description: 'Comprehensive operational logging tracking sensitive changes across the system.',
      },
    ],
    technologies: ['Next.js', 'TypeScript', 'React', 'Laravel', 'PHP', 'Node.js', 'Prisma', 'MySQL'],
    outcomes: [
      'Elimination of manual spreadsheets and fragmented tools',
      'Total control and ownership over proprietary business software',
      'Protected data privacy and internal operational transparency',
    ],
    featured: true,
    tags: ['Full-Stack', 'Custom Software', 'RBAC', 'Prisma', 'Laravel', 'MySQL'],
  },
  {
    id: 'admin-panels-dashboards',
    slug: 'admin-panels',
    title: 'Admin Panels & Dashboards',
    shortTitle: 'Admin Panels',
    pillar: 'web-development',
    headline: 'Centralized operational dashboards providing real-time business visibility.',
    shortDescription:
      'Modern administrative interfaces to manage leads, orders, inventory, billing, staff, and system analytics.',
    fullDescription:
      'We design and develop clean, dense, and fast admin panels that give business owners and operators immediate command over daily operations. With searchable tables, filterable views, quick actions, and data visualizations, business management becomes effortless.',
    iconName: 'LayoutDashboard',
    deliverables: [
      {
        title: 'Key Operational Metrics Dashboard',
        description: 'Real-time overview of revenue, orders, leads, active projects, and system health.',
      },
      {
        title: 'Data Management Tables',
        description: 'High-performance tables featuring instant search, multi-column sorting, pagination, and filters.',
      },
      {
        title: 'Staff & Team Access Controls',
        description: 'Administrative interfaces for inviting team members and delegating module permissions.',
      },
      {
        title: 'Content & Banner Management',
        description: 'Control public promotional banners and marketing announcements without editing code.',
      },
    ],
    technologies: ['React', 'Next.js', 'Tailwind CSS', 'TypeScript', 'MySQL'],
    outcomes: [
      'Rapid internal operations and instant data retrieval',
      'Usable, clean interface tailored to administrative efficiency',
      'Single source of truth for business data',
    ],
    featured: false,
    tags: ['Admin Dashboards', 'Internal Tools', 'Data Tables', 'CMS'],
  },
  {
    id: 'client-portals',
    slug: 'client-portals',
    title: 'Client Portals',
    shortTitle: 'Client Portals',
    pillar: 'web-development',
    headline: 'Dedicated authenticated workspaces that elevate your client experience.',
    shortDescription:
      'Private portals for clients to track active project progress, view deliverables, download assets, and manage invoices.',
    fullDescription:
      'Provide your clients with a premium, transparent experience. Our custom client portals allow customers to log in securely, monitor deliverable completion status in real time, communicate milestones, and view billing history—eliminating endless email check-ins.',
    iconName: 'ShieldCheck',
    deliverables: [
      {
        title: 'Client Authentication & Security',
        description: 'Isolated client accounts ensuring clients only access their company’s proprietary data.',
      },
      {
        title: 'Live Project & Deliverable Tracker',
        description: 'Visual timeline showing milestones, pending items, completed deliverables, and files.',
      },
      {
        title: 'Central Asset Download Hub',
        description: 'Secure file repository for downloading creative assets, reports, and project files.',
      },
      {
        title: 'Invoice & Payment Status View',
        description: 'Transparent billing history showing pending, paid, and overdue invoices.',
      },
    ],
    technologies: ['Next.js', 'React', 'TypeScript', 'Node.js', 'Tailwind CSS'],
    outcomes: [
      'Reduced client management overhead and repetitive status emails',
      'Significantly higher client retention and perceived professional value',
      'Clear milestone accountability for delivered work',
    ],
    featured: false,
    tags: ['Client Workspace', 'Portal', 'Project Tracking', 'Deliverables'],
  },
  {
    id: 'payment-api-integrations',
    slug: 'integrations',
    title: 'Payment & API Integrations',
    shortTitle: 'Payment & APIs',
    pillar: 'web-development',
    headline: 'Connect your web platform seamlessly with external services and payment gateways.',
    shortDescription:
      'Custom integrations for payment processors, CRMs, WhatsApp business messaging, email services, and cloud storage.',
    fullDescription:
      'A digital platform is only as powerful as its ecosystem connections. We build robust integration layers that connect your web systems with local and international payment gateways, CRM databases, marketing automation tools, and messaging channels.',
    iconName: 'Cpu',
    deliverables: [
      {
        title: 'Payment Gateway Integration',
        description: 'Secure integration of Stripe, SSLCommerz, bKash, Nagad, or custom merchant gateways.',
      },
      {
        title: 'Webhook Handlers & Event Processing',
        description: 'Reliable webhook endpoints with signature validation for instant transaction confirmation.',
      },
      {
        title: 'CRM & Messaging Automations',
        description: 'Connecting contact forms to HubSpot, WhatsApp Business API, and transactional email providers.',
      },
      {
        title: 'Third-Party RESTful API Connections',
        description: 'Custom middleware linking external logistics, inventory, or ERP systems.',
      },
    ],
    technologies: ['REST APIs', 'Webhooks', 'Payment Gateways', 'bKash/Nagad API', 'Node.js'],
    outcomes: [
      'Automated transaction settlement and instant order confirmation',
      'Synchronized customer data across marketing and sales tools',
      'Resilient webhook handling preventing dropped transactions',
    ],
    featured: false,
    tags: ['Payment Gateways', 'API Integration', 'Webhooks', 'WhatsApp API', 'bKash/Nagad'],
  },
];

export const marketingServices = services.filter((s) => s.pillar === 'marketing');
export const webDevelopmentServices = services.filter((s) => s.pillar === 'web-development');
export const featuredServices = services.filter((s) => s.featured);

export function getServiceBySlug(slug: string): ServiceItem | undefined {
  return services.find((s) => s.slug === slug);
}

// =================================================================
// UI-FACING MARKETING SERVICES (for MarketingSection.tsx)
// =================================================================

export const MARKETING_SERVICES: MarketingService[] = [
  {
    id: 'meta-ads',
    slug: 'meta-ads',
    title: 'Meta & Facebook Ads',
    shortDescription: 'High-ROAS campaigns with algorithmic scaling systems.',
    fullDescription:
      'We build Meta Ads campaigns that operate as reliable customer acquisition engines rather than sporadic ad boosts. From initial cold audience prospecting to retargeting and lookalike scaling, every campaign structure is aligned with real unit economics and bottom-line revenue.',
    tag: 'Paid Social',
    deliverables: [
      'Account structure & CBO strategy',
      'Prospecting & lookalike audience pools',
      'Systematic creative testing framework',
      'Server-side CAPI & Pixel attribution',
      '72-hour budget pruning & scaling',
    ],
  },
  {
    id: 'google-ads',
    slug: 'google-ads',
    title: 'Google Ads & PPC',
    shortDescription: 'Search, Performance Max, and intent capture.',
    fullDescription:
      'Google Ads captures customers at the exact moment they are looking for your solution. We design tightly targeted search campaigns with high-intent keyword strategies, negative keyword filtering, compelling responsive ad copies, and conversion-focused landing page alignment.',
    tag: 'Search PPC',
    deliverables: [
      'High-intent keyword group architecture',
      'Performance Max multi-channel asset groups',
      'Aggressive negative keyword filtering',
      'GA4 enhanced conversions & value bidding',
      'Responsive Search Ad copy testing',
    ],
  },
  {
    id: 'lead-generation',
    slug: 'lead-generation',
    title: 'Lead Generation Systems',
    shortDescription: 'Frictionless qualification forms and automated CRM triage.',
    fullDescription:
      'We build lead acquisition systems for service businesses, B2B companies, education institutions, and high-ticket offers. By qualifying prospects before they reach your team, you spend time closing deals rather than chasing cold inquiries.',
    tag: 'Pipeline Growth',
    deliverables: [
      'Multi-step lead qualification forms',
      'Meta Instant Forms & WhatsApp click-to-chat',
      'Automated CRM webhook routing',
      'Lead scoring & sales team feedback loops',
    ],
  },
  {
    id: 'creative-strategy',
    slug: 'creative-strategy',
    title: 'Creative Strategy & Ad Design',
    shortDescription: 'Static, carousel, and video concepts built on buyer psychology.',
    fullDescription:
      'In modern algorithmic advertising, creative is your primary targeting lever. We produce advertising assets designed around buyer psychology, addressing customer objections, demonstrating value clearly, and driving immediate action.',
    tag: 'Creative Production',
    deliverables: [
      'Customer pain point & objection research',
      'Static comparison boards & spotlights',
      'Multi-slide educational carousels',
      'Direct-response hook scripts & copy',
    ],
  },
  {
    id: 'funnel-strategy',
    slug: 'funnel-strategy',
    title: 'Funnel Strategy & CRO',
    shortDescription: 'End-to-end customer journey from click to checkout.',
    fullDescription:
      'Traffic without a conversion system is wasted capital. We design and optimize the full customer journey—ad hook to landing page, checkout, order bumps, and follow-ups—to maximize the percentage of visitors who become paying clients.',
    tag: 'Conversion CRO',
    deliverables: [
      'Full customer touchpoint journey mapping',
      'Landing page wireframes & CRO audit',
      'Offer stacking & value framing',
      'A/B split testing backlog execution',
    ],
  },
  {
    id: 'analytics-tracking',
    slug: 'analytics-tracking',
    title: 'Analytics & Conversion Tracking',
    shortDescription: 'CAPI, Pixel, GA4, and server-side attribution resilience.',
    fullDescription:
      'Without precise tracking, marketing optimization is just guesswork. We implement ironclad tracking setups combining client-side pixels and server-side conversion APIs so every lead, purchase, and micro-conversion is accurately captured.',
    tag: 'Data Architecture',
    deliverables: [
      'Meta Conversions API (CAPI) server routing',
      'Google Analytics 4 custom event triggers',
      'Google Tag Manager tag architecture',
      'Cross-platform conversion deduplication',
    ],
  },
];

// =================================================================
// UI-FACING WEB DEV CAPABILITIES (for WebDevSection.tsx)
// =================================================================

export const WEB_DEV_CAPABILITIES: WebDevCapability[] = [
  {
    id: 'business-websites',
    slug: 'business-websites',
    title: 'Business & Corporate Websites',
    shortDescription:
      'Fast, modern, editorial websites tailored to your brand identity and commercial conversion goals.',
    fullDescription:
      'We develop custom corporate and business websites that load in milliseconds, establish brand authority, and turn visitors into qualified inquiries. Built on Next.js and Tailwind CSS with sub-second speeds and zero template bloat.',
    technologies: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
    deliverables: [
      'Bespoke editorial UI/UX layout design',
      'Next.js App Router & React Server Components',
      'Mobile-first responsive engineering',
      'Lead capture forms with automated email notifications',
      'Technical SEO & 90+ Google Lighthouse score',
    ],
  },
  {
    id: 'ecommerce-platforms',
    slug: 'ecommerce',
    title: 'Custom E-Commerce Platforms',
    shortDescription:
      'High-converting online storefronts backed by complete back-office inventory and order operations.',
    fullDescription:
      'We build full-stack e-commerce platforms designed for visual storytelling and frictionless checkout. Connected to database-backed admin portals, inventory tracking, and integrated local and global payment gateways.',
    technologies: ['Next.js', 'Prisma', 'TypeScript', 'MySQL'],
    deliverables: [
      'Visual catalog & category exploration storefront',
      'Frictionless checkout journey optimized for mobile',
      'Centralized admin center for order processing',
      'Inventory control with automated stock warnings',
      'Payment gateway & mobile wallet integration (bKash/Nagad)',
    ],
  },
  {
    id: 'custom-web-applications',
    slug: 'custom-web-applications',
    title: 'Custom Web Applications',
    shortDescription:
      'Tailored digital products and business management systems engineered around your exact workflows.',
    fullDescription:
      'When off-the-shelf SaaS tools fall short, we architect custom web applications with relational databases, role-based access controls, and automated operational logic.',
    technologies: ['Next.js', 'Laravel', 'PHP', 'Prisma'],
    deliverables: [
      'Relational database architecture (MySQL / PostgreSQL)',
      'Secure multi-role authentication & session management',
      'Role-based access control (RBAC) permissions',
      'RESTful API endpoints & server-side validation',
      'Operational activity logging & audit trail',
    ],
  },
  {
    id: 'admin-dashboards',
    slug: 'admin-panels',
    title: 'Admin Panels & Dashboards',
    shortDescription:
      'Dense, high-speed operational dashboards providing single-pane business visibility and control.',
    fullDescription:
      'We engineer clean, fast admin panels that give business owners command over daily operations. Featuring searchable data tables, filterable views, quick actions, and data metrics.',
    technologies: ['React', 'Next.js', 'Tailwind CSS', 'TypeScript'],
    deliverables: [
      'Real-time operational dashboard with KPIs',
      'Fast searchable & filterable data tables',
      'Staff member invitation & permission control',
      'Promotional banner & announcement management',
    ],
  },
  {
    id: 'client-portals',
    slug: 'client-portals',
    title: 'Client Portals',
    shortDescription:
      'Dedicated authenticated workspaces for your clients to track active projects, files, and billing.',
    fullDescription:
      'Elevate your client experience with private, secure portals. Clients can inspect live deliverable milestones, download project assets, and review invoice payment statuses.',
    technologies: ['Next.js', 'TypeScript', 'Node.js', 'Tailwind CSS'],
    deliverables: [
      'Isolated client authentication & security',
      'Live milestone and deliverable tracker',
      'Asset repository for file downloads',
      'Invoice payment history & billing statuses',
    ],
  },
  {
    id: 'integrations-apis',
    slug: 'integrations',
    title: 'Payment & API Integrations',
    shortDescription:
      'Seamless connections between your web systems, payment gateways, CRMs, and communication APIs.',
    fullDescription:
      'We link your platform with external services: payment gateways (Stripe, bKash, Nagad), CRMs, WhatsApp business messaging, and automated third-party webhooks.',
    technologies: ['REST APIs', 'Webhooks', 'Node.js', 'Payment APIs'],
    deliverables: [
      'Payment gateway checkout & webhook settlement',
      'CRM integration with automatic lead capture',
      'WhatsApp Business API conversational routing',
      'Third-party ERP and logistics connectors',
    ],
  },
];

// =================================================================
// TECHNOLOGIES LIST (for WebDevSection.tsx)
// =================================================================

export const TECHNOLOGIES_LIST: TechnologyItem[] = [
  {
    name: 'Next.js',
    category: 'Framework',
    role: 'Server components, sub-second routing, and optimized SEO performance',
  },
  {
    name: 'React',
    category: 'Frontend UI',
    role: 'Dynamic component architecture and interactive user interfaces',
  },
  {
    name: 'TypeScript',
    category: 'Language',
    role: 'End-to-end type safety, resilient domain modeling, and fewer bugs',
  },
  {
    name: 'Laravel',
    category: 'Backend MVC',
    role: 'Robust PHP backend architecture, queue management, and secure APIs',
  },
  {
    name: 'PHP',
    category: 'Server-Side',
    role: 'Reliable backend execution, enterprise logic, and database processing',
  },
  {
    name: 'Node.js',
    category: 'Runtime',
    role: 'High-concurrency API routes, microservices, and server-side tracking',
  },
  {
    name: 'Prisma',
    category: 'Database ORM',
    role: 'Type-safe database schemas, migrations, and relationship handling',
  },
  {
    name: 'MySQL / PostgreSQL',
    category: 'Database',
    role: 'ACID-compliant relational data storage for commerce and enterprise',
  },
  {
    name: 'Tailwind CSS',
    category: 'Design System',
    role: 'Lightweight utility styling ensuring fast rendering and brand precision',
  },
];
