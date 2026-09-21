import { Project, WebAppSystem } from '@/types';

// =================================================================
// PRIMARY PROJECTS CATALOG
// =================================================================

export const projects: Project[] = [
  {
    id: 'kanzie-ecommerce',
    slug: 'kanzie',
    title: 'Kanzie | Full-Stack E-Commerce & Business Operations Platform',
    client: 'Ahil Ahmed / Kanzie',
    category: 'custom-web-application',
    categoryLabel: 'Custom Web Application & E-Commerce',
    industry: 'Retail & E-Commerce',
    year: '2026',
    highlightMetric: 'Storefront + Admin Center',
    summary:
      'A custom-built, full-stack e-commerce platform and centralized administration system managing retail storefront, product catalog, inventory, orders, staff permissions, and activity audits.',
    description:
      'A custom-built, full-stack e-commerce platform and centralized administration system managing retail storefront, product catalog, inventory, orders, staff permissions, and activity audits.',
    fullOverview:
      'Kanzie was engineered to combine a fast, modern customer storefront with a complete internal commerce operations system. Rather than using disconnected plugins, the platform unites products, stock notifications, operational order workflows, fraud checks, staff roles, and audit trails under a unified TypeScript architecture.',
    liveUrl: 'https://kanzie.shop/',
    featured: true,
    showOnHome: true,
    deliverables: [
      'Customer storefront with catalog navigation',
      'Custom Kanzie Admin Center with real-time KPIs',
      'Product & category hierarchy management',
      'Operational order pipeline (Pending → Delivered)',
      'Inventory control with automated low-stock alerts',
      'Staff management with granular RBAC permissions',
      'Activity logging audit trail',
      'Code-free banner management & fraud checking',
    ],
    services: [
      'Custom Web Application Development',
      'E-Commerce Platform Architecture',
      'Admin Center Development',
      'Role-Based Access Control',
      'Database Modeling',
    ],
    technologies: [
      'Next.js',
      'React',
      'TypeScript',
      'Tailwind CSS',
      'Node.js',
      'Prisma',
      'MySQL',
      'Framer Motion',
    ],
    features: [
      'Customer-Facing Storefront with scalable product catalog',
      'Custom Kanzie Admin Center with real-time operational overview',
      'Product Management & Taxonomy with category organization',
      'Operational Order Workflow (Pending, Confirmed, Processing, Shipped, Delivered)',
      'Inventory Control with low-stock alerts',
      'Staff Management with individual administrative accounts',
      'Role-Based Permissions (RBAC) restricting sensitive financial data',
      'Activity Logging providing a full operational audit trail',
      'Banner & Store Content Management without code changes',
      'Fraud Checking module to evaluate suspicious transactions',
      'Integrations layer for external payment and communication services',
    ],
    images: [
      {
        url: 'https://lh3.googleusercontent.com/d/1Ab86PMMRI9MDqdZuk-eT2T9zugHOoSBQ',
        alt: 'Kanzie Store View',
        heading: 'Store View',
        caption: 'Customer-facing modern storefront for imported toys',
        isCover: true,
      },
      {
        url: 'https://lh3.googleusercontent.com/d/1RsXApVHy8NSy7Ke3x42rT_RGvzDZnmWv',
        alt: 'Kanzie Admin Center',
        heading: 'Admin Center',
        caption: 'Centralized administration dashboard managing orders, catalog, staff, and inventory',
        isCover: false,
      },
    ],
    caseStudySlug: 'kanzie',
  },
  {
    id: 'lumiflick-platform',
    slug: 'lumiflick',
    title: 'Lumiflick | Premium E-Commerce Platform for Glass Posters',
    client: 'Lumiflick',
    category: 'e-commerce-platform',
    categoryLabel: 'E-Commerce Platform',
    industry: 'Home Decor & Online Retail',
    year: '2026',
    highlightMetric: 'Visual Art Storefront',
    summary:
      'A full-stack e-commerce platform built for a premium glass poster brand, combining curated visual collections, rich product storytelling, database-backed commerce, and an admin management interface.',
    description:
      'A full-stack e-commerce platform built for a premium glass poster brand, combining curated visual collections, rich product storytelling, database-backed commerce, and an admin management interface.',
    fullOverview:
      'LumiFlick was built to position glass posters as premium modern interior statement pieces rather than commodity paper posters. The application combines visual storytelling, curated category discovery, detailed product specifications, and a scalable database foundation powered by Prisma and Next.js.',
    liveUrl: 'https://www.lumiflick.shop',
    featured: true,
    showOnHome: true,
    deliverables: [
      'Visual-first e-commerce storefront',
      'Curated themed collections (Anime, Cars, FIFA, Islamic, Nature)',
      'Product specifications highlighting real glass and waterproof finish',
      'Frictionless mobile checkout flow',
      'Prisma ORM database integration',
      'Custom administrative panel for store management',
    ],
    services: [
      'E-Commerce Development',
      'Full-Stack Architecture',
      'Database Design',
      'Admin Panel Integration',
      'Responsive UI/UX',
    ],
    technologies: [
      'Next.js',
      'React',
      'TypeScript',
      'Prisma',
      'Node.js',
      'Tailwind CSS',
      'Framer Motion',
    ],
    features: [
      'Visual Storefront centered on high-definition artwork presentation',
      'Structured Catalog with curated collections (Anime, Cars, FIFA, Islamic, Nature)',
      'Product Value Presentation emphasizing real glass, vivid color, and frameless design',
      'Streamlined Customer Checkout journey minimizing purchase friction',
      'Prisma ORM Database Integration for structured catalog management',
      'Responsive layout optimized for mobile, tablet, and desktop viewing',
      'Framer Motion micro-interactions enhancing product exploration',
      'Scalable store architecture designed for continuous catalog expansion',
    ],
    images: [
      {
        url: 'https://lh3.googleusercontent.com/d/15PdVFaSJnnTET3mJYP_RVYAGxNtw4dNw',
        alt: 'Lumiflick Storefront',
        heading: 'Storefront',
        caption: 'Curated e-commerce storefront for premium glass posters',
        isCover: true,
      },
      {
        url: 'https://lh3.googleusercontent.com/d/1rPDTxIgkTe3Qc6ysYN4278F6l8zD6EnB',
        alt: 'Lumiflick Admin Panel',
        heading: 'Admin Panel',
        caption: 'Backend administrative panel for managing products, collections, and orders',
        isCover: false,
      },
    ],
    caseStudySlug: 'lumiflick',
  },
  {
    id: 'solution-point-education',
    slug: 'solution-point',
    title: 'Solution Point | Education Marketing & Course Acquisition Funnel',
    client: 'Solution Point',
    category: 'performance-marketing',
    categoryLabel: 'Performance Marketing',
    industry: 'Education & Online Learning',
    year: '2025',
    highlightMetric: '788 Orders · ~৳800K Rev',
    summary:
      'A performance marketing and conversion funnel campaign that generated 788 course orders and approximately ৳800K in sales revenue through targeted Meta Ads and offer positioning.',
    description:
      'A performance marketing and conversion funnel campaign that generated 788 course orders and approximately ৳800K in sales revenue through targeted Meta Ads and offer positioning.',
    fullOverview:
      'Solution Point required a predictable acquisition system to scale enrollment for online educational courses. By restructuring the ad campaigns around high-intent student audiences, developing objection-busting creative angles, and optimizing the enrollment landing page, the campaign achieved exceptional scale.',
    featured: true,
    showOnHome: true,
    deliverables: [
      'Meta Ads account restructuring (Prospecting & Retargeting)',
      'Direct-response ad creative design & hook scripts',
      'Course curriculum landing page conversion optimization',
      'CAPI & Pixel event tracking implementation',
      'Daily 72-hour budget scaling & bid management',
    ],
    services: [
      'Meta Ads Campaign Setup & Management',
      'Course Offer Positioning',
      'Ad Creative Development',
      'Conversion Rate Optimization',
      'Attribution & Pixel Tracking',
    ],
    technologies: [
      'Meta Ads Manager',
      'Meta Pixel',
      'Conversion API',
      'Landing Page CRO',
      'Google Analytics',
    ],
    features: [
      'Multi-angle Meta Ads prospecting targeting students and career seekers',
      'Direct-response course value framing overcoming price objections',
      'Retargeting sequences re-engaging course page visitors',
      'Clean conversion tracking monitoring cost per course purchase',
    ],
    results: [
      {
        label: 'Course Orders',
        value: '788',
        detail: 'Verified course enrollments generated',
      },
      {
        label: 'Revenue Generated',
        value: '800K',
        prefix: '~৳',
        detail: 'Total sales revenue driven by campaign',
      },
      {
        label: 'Acquisition Model',
        value: 'Predictable',
        detail: 'Profitable cost per acquisition framework',
      },
    ],
    images: [],
    caseStudySlug: 'solution-point',
  },
  {
    id: 'autonex-automotive',
    slug: 'autonex',
    title: 'Autonex | Automotive Technology Marketing & Revenue Campaign',
    client: 'Autonex Technology',
    category: 'performance-marketing',
    categoryLabel: 'Performance Marketing',
    industry: 'Technology & Automotive Services',
    year: '2025',
    highlightMetric: '৳343K+ Revenue Generated',
    summary:
      'A targeted marketing project that delivered ৳343K+ in verified generated revenue by capturing customer demand through Meta Ads and WhatsApp lead qualification.',
    description:
      'A targeted marketing project that delivered ৳343K+ in verified generated revenue by capturing customer demand through Meta Ads and WhatsApp lead qualification.',
    fullOverview:
      'Autonex Technology required a direct customer-acquisition system to drive service inquiries and hardware solutions in the automotive technology space. OneDot ABM structured a focused paid acquisition strategy pairing Meta targeting with rapid inquiry triage.',
    featured: true,
    showOnHome: true,
    deliverables: [
      'Targeted paid acquisition across Meta Ads Manager',
      'Direct conversational WhatsApp lead qualification funnel',
      'Commercial vehicle decision-maker audience targeting',
      'Weekly revenue attribution connecting leads to closed sales',
    ],
    services: [
      'Meta Ads Setup & Management',
      'Lead Generation & Qualification',
      'Creative Strategy & Messaging',
      'Conversion Tracking',
    ],
    technologies: [
      'Meta Ads Manager',
      'Meta Pixel',
      'WhatsApp Business API',
      'Google Analytics',
    ],
    features: [
      'High-intent audience targeting for automotive tech services',
      'Problem-led creative hooks highlighting service efficiency',
      'Frictionless lead capture routing inquiries to instant messaging',
      'Continuous campaign monitoring and budget reallocation',
    ],
    results: [
      {
        label: 'Generated Revenue',
        value: '343K+',
        prefix: '৳',
        detail: 'Documented sales revenue generated',
      },
      {
        label: 'Campaign Delivery',
        value: 'Profitable',
        detail: 'Sustained positive return on marketing capital',
      },
    ],
    images: [],
    caseStudySlug: 'autonex',
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
export const webApplicationProjects = projects.filter(
  (p) => p.category === 'custom-web-application' || p.category === 'e-commerce-platform'
);

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

// =================================================================
// UI-FACING SELECTED PROJECTS (for SelectedWork.tsx)
// =================================================================

export const SELECTED_PROJECTS: Project[] = [
  {
    id: 'kanzie',
    slug: 'kanzie',
    title: 'Kanzie — Full-Stack E-Commerce & Admin Center',
    client: 'Ahil Ahmed',
    category: 'Web Applications',
    industry: 'Retail & Toys',
    highlightMetric: 'Full Admin Center + Storefront',
    summary:
      'Custom-built online store paired with an internal management platform handling catalog, operational orders, inventory alerts, RBAC staff permissions, and activity logs.',
    deliverables: [
      'Customer storefront with catalog navigation',
      'Admin Center with operational KPIs',
      'Role-based access permissions (RBAC)',
      'Automated activity audit log',
    ],
    technologies: ['Next.js', 'React', 'TypeScript', 'Prisma', 'MySQL', 'Tailwind CSS'],
    featured: true,
  },
  {
    id: 'lumiflick',
    slug: 'lumiflick',
    title: 'Lumiflick — Glass Poster Brand Platform',
    client: 'Lumiflick',
    category: 'E-commerce',
    industry: 'Home Decor & Art',
    highlightMetric: 'Visual Art Platform',
    summary:
      'Modern e-commerce platform built for a premium glass poster brand, combining curated visual collections, rich product storytelling, and database-backed commerce.',
    deliverables: [
      'Visual-first product catalog',
      'Curated themed collections',
      'Frictionless checkout journey',
      'Prisma ORM database schema',
    ],
    technologies: ['Next.js', 'React', 'TypeScript', 'Prisma', 'Tailwind CSS', 'Framer Motion'],
    featured: true,
  },
  {
    id: 'solution-point',
    slug: 'solution-point',
    title: 'Solution Point — Education Course Funnel',
    client: 'Solution Point',
    category: 'Marketing',
    industry: 'Education & Courses',
    highlightMetric: '788 Orders · ~৳800K Rev',
    summary:
      'High-converting performance marketing funnel generating 788 paid course enrollments and approximately ৳800K in verified sales revenue through Meta Ads.',
    deliverables: [
      'Prospecting & retargeting account structure',
      'Curriculum value framing & objection handling',
      'Server-side CAPI & Pixel attribution',
      'Daily ROAS optimization & budget scaling',
    ],
    technologies: ['Meta Ads Manager', 'CAPI', 'Meta Pixel', 'GA4'],
    featured: true,
  },
  {
    id: 'autonex',
    slug: 'autonex',
    title: 'Autonex — Automotive Technology Marketing',
    client: 'Autonex Technology',
    category: 'Marketing',
    industry: 'Automotive & Tech',
    highlightMetric: '৳343K+ Revenue Generated',
    summary:
      'Targeted paid acquisition strategy connecting Meta Ads to rapid WhatsApp conversational qualification, generating ৳343K+ in verified gross revenue.',
    deliverables: [
      'Decision-maker demographic targeting',
      'Direct WhatsApp conversational routing',
      'Product installation video hooks',
      'Campaign revenue attribution tracking',
    ],
    technologies: ['Meta Ads Manager', 'WhatsApp Business API', 'Pixel'],
    featured: true,
  },
];

// =================================================================
// UI-FACING WEB APP SHOWCASE DATA (for WebAppShowcase.tsx)
// =================================================================

export const WEB_APP_SHOWCASE_DATA: WebAppSystem[] = [
  {
    id: 'kanzie-system',
    name: 'KANZIE',
    subtitle: 'Full-Stack E-Commerce & Business Operations System',
    category: 'Full-Stack Web Application',
    description:
      'A custom-built full-stack e-commerce and internal operations application built for an imported toy brand. Replaces off-the-shelf templates with custom product catalog management, order workflows, real-time inventory tracking, staff management, role-based permissions, and administrative activity logging.',
    stats: [
      { label: 'Tech Stack', value: 'Next.js + Prisma + MySQL' },
      { label: 'Security', value: 'Full RBAC Architecture' },
      { label: 'Scope', value: 'Storefront + Admin Center' },
    ],
    architecture: {
      frontend: [
        'Next.js App Router & React 19',
        'TypeScript for full-stack type safety',
        'Tailwind CSS design system',
        'Framer Motion micro-interactions',
      ],
      backend: [
        'Node.js REST API routes',
        'Role & permission verification middleware',
        'Server-side schema validation',
        'Automated activity audit logger',
      ],
      database: [
        'MySQL relational database engine',
        'Prisma ORM for schema migrations',
        'Relational product, order, and user models',
        'ACID-compliant order transactions',
      ],
      infra: [
        'High-speed cloud deployment',
        'Secure SSL encryption',
        'CAPI server-side event tracking',
        'Optimized responsive asset delivery',
      ],
    },
    keyModules: [
      {
        title: 'Customer Storefront & Catalog',
        description:
          'A modern, responsive customer shopping journey with category discovery, high-resolution product showcase, and streamlined cart.',
        highlights: [
          'Responsive Storefront',
          'Category Taxonomy',
          'Product Specifications',
          'Dynamic Cart',
        ],
      },
      {
        title: 'Operational Order Management',
        description:
          'Multi-state operational order processing pipeline tracking customer details, delivery addresses, and payment status.',
        highlights: [
          'Pending → Delivered Pipeline',
          'Order Detail Review',
          'Payment Status Tracking',
          'Customer History',
        ],
      },
      {
        title: 'Inventory & Stock Control',
        description:
          'Dedicated stock monitoring module with low-stock alerts to prevent fulfillment issues before they affect sales.',
        highlights: [
          'Real-Time Stock Counts',
          'Low-Stock Notifications',
          'SKU Organization',
          'Batch Adjustments',
        ],
      },
      {
        title: 'Staff Management & Role Permissions (RBAC)',
        description:
          'Independent staff profiles with role-specific permission delegation, keeping sensitive financial data restricted to Super Admins.',
        highlights: [
          'Multi-User Accounts',
          'Custom Roles & Permissions',
          'Access Gating',
          'Zero Shared Passwords',
        ],
      },
      {
        title: 'Operational Activity Logging',
        description:
          'Automated audit trail recording administrative actions across products, orders, and system settings for complete accountability.',
        highlights: [
          'Staff Action Logging',
          'Timestamped Audits',
          'Change Tracking',
          'Security Accountability',
        ],
      },
      {
        title: 'Store Content & Banner Control',
        description:
          'Administrative module allowing marketing banners, announcements, and promotional copy to be updated without code changes.',
        highlights: [
          'Code-Free Banner Updates',
          'Scheduled Promotions',
          'Store-Level Settings',
          'Instant Synchronization',
        ],
      },
    ],
    adminCapabilities: [
      'Executive KPI Dashboard (Revenue, Orders, Products, Stock)',
      'Product & Category Catalog Manager',
      'Order Status Processing Pipeline (Pending → Delivered)',
      'Inventory Tracking with Low-Stock Alerts',
      'Multi-User Staff Account Management',
      'Granular Role-Based Permissions (RBAC)',
      'Automated Activity Audit Logging',
      'Code-Free Promotional Banner Management',
      'Fraud Check & Transaction Risk Review',
    ],
  },
  {
    id: 'lumiflick-system',
    name: 'LUMIFLICK',
    subtitle: 'Premium E-Commerce Platform for Glass Posters',
    category: 'E-Commerce Platform',
    description:
      'A modern full-stack e-commerce platform built for a premium glass poster and wall-art brand. Designed around a visual-first shopping journey, product storytelling, curated collections, database-backed commerce, and a dedicated administrative interface.',
    stats: [
      { label: 'Framework', value: 'Next.js + React' },
      { label: 'Data Layer', value: 'Prisma ORM' },
      { label: 'Collections', value: '7 Curated Themes' },
    ],
    architecture: {
      frontend: [
        'Next.js App Router & React Components',
        'TypeScript type-safe contracts',
        'Tailwind CSS typography & blur utilities',
        'Framer Motion smooth page transitions',
      ],
      backend: [
        'Node.js server-side functions',
        'RESTful commerce API routes',
        'Server-side rendered product pages (SSR)',
        'Optimized image serving pipeline',
      ],
      database: [
        'Prisma ORM for database queries',
        'Structured catalog & collection models',
        'Order & customer relational schema',
        'Consistent backend architecture',
      ],
      infra: [
        'Cloud hosting with Edge caching',
        'Sub-second first contentful render',
        'Meta Pixel & CAPI tracking',
        'Responsive mobile-first layout',
      ],
    },
    keyModules: [
      {
        title: 'Visual Storefront & Storytelling',
        description:
          'Puts artwork and physical craftsmanship at the center of the customer journey, highlighting real glass, vivid colors, and frameless design.',
        highlights: [
          'High-Definition Visuals',
          'Frameless Glass Showcase',
          'Tactile Specifications',
          'Perceived Value CRO',
        ],
      },
      {
        title: 'Curated Collection Discovery',
        description:
          'Category-driven structure grouping artwork into high-intent lifestyle themes (Anime, Cars, FIFA, Islamic, Nature, Motivational).',
        highlights: [
          'Themed Collections',
          'Instant Category Filtering',
          'Scalable Catalog Taxonomy',
          'Frictionless Browsing',
        ],
      },
      {
        title: 'Streamlined Purchasing Journey',
        description:
          'Friction-minimized checkout flow optimized for desktop and mobile shoppers with instant cart feedback.',
        highlights: [
          'Mobile-Optimized Cart',
          'Single-Flow Checkout',
          'Clear Value Reminders',
          'Fast Cart Drawer',
        ],
      },
      {
        title: 'Prisma Database Architecture',
        description:
          'Database-backed product, collection, and order entities managed through a consistent backend architecture without hardcoded content.',
        highlights: [
          'Type-Safe Data Models',
          'Schema Migrations',
          'High-Speed Queries',
          'Future-Proof Scalability',
        ],
      },
    ],
    adminCapabilities: [
      'Product Catalog & Variant Presentation Manager',
      'Curated Collection & Category Taxonomy Setup',
      'Order Processing & Customer Data View',
      'Stock & Fulfillment Visibility',
      'Storefront Promotional Announcements',
      'Integrated Analytics & Meta Pixel Event Tracking',
    ],
  },
];
