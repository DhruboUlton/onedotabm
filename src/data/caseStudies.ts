import { CaseStudy, FeaturedCaseStudy } from '@/types';

// =================================================================
// COMPREHENSIVE CASE STUDIES
// =================================================================

export const caseStudies: CaseStudy[] = [
  {
    id: 'case-study-solution-point',
    slug: 'solution-point',
    title: 'Solution Point — Education Acquisition Funnel & Course Sales Scale',
    client: 'Solution Point',
    industry: 'Education & Online Courses',
    service: 'Performance Marketing, Meta Ads & Funnel Strategy',
    period: 'Performance Campaign Cycle',
    summary:
      'How a structured Meta Ads prospecting framework and offer-led landing page conversion strategy generated 788 course enrollments and ~৳800K in sales revenue.',
    featured: true,
    heroMetric: {
      value: '788 Orders / ~৳800K',
      label: 'Verified Course Sales & Revenue',
    },
    overview: {
      client: 'Solution Point',
      industry: 'Education & Online Learning',
      service: 'Meta Ads, Funnel Strategy, Creative Design, Conversion Optimization',
      projectPeriod: 'Performance Campaign Cycle',
      objective:
        'Establish a scalable customer acquisition engine to generate direct course enrollments at an efficient, sustainable cost per order.',
    },
    challenge: {
      summary:
        'Solution Point was relying on sporadic promotions and organic reach, which could not support steady enrollment targets. Acquisition costs were volatile and drop-offs during enrollment were significant.',
      points: [
        'Volatile enrollment numbers between promotional cycles without predictable acquisition.',
        'Rising advertising costs caused by broad, unfocused audience targeting.',
        'High landing page drop-off rates due to unaddressed student objections regarding course value and outcomes.',
        'Lack of structured retargeting to capture prospective students who showed high purchase intent.',
      ],
    },
    strategy: {
      summary:
        'OneDot ABM rebuilt the entire acquisition architecture from ad creative to course enrollment, structuring distinct prospecting, qualification, and retargeting pools.',
      points: [
        'Audience Segmentation: Segmented target audiences into career starters, skill upgrade seekers, and competitive test candidates.',
        'Objection-Busting Creative Angles: Designed creatives focusing on syllabus practical outcomes, instructor credibility, and career return on investment.',
        'Offer Stacking & Value Framing: Restructured the enrollment page layout to highlight clear curriculum milestones, bonuses, and student proof.',
        'Multi-Tier Retargeting: Re-engaged users who visited the curriculum page or initiated checkout but did not complete payment.',
      ],
    },
    execution: {
      summary:
        'Executed an end-to-end performance campaign across Meta Ads Manager, paired with rigorous daily bid management and landing page optimization.',
      deliverables: [
        'Full Meta Ads account restructuring with clear prospecting and retargeting separation.',
        'Production of static comparison banners, curriculum highlights, and video concept hooks.',
        'Implementation of Meta Pixel and Conversion API for robust event tracking (ViewContent, InitiateCheckout, Purchase).',
        'Landing page copywriting and layout optimization for mobile visitors.',
        'Daily budget reallocation toward the top 20% highest-converting ad creatives.',
      ],
      technicalDetails: [
        'Meta Ads Manager Campaign Budget Optimization (CBO)',
        'Server-side Conversion API (CAPI) event deduplication',
        'Custom Audience exclusions preventing ad budget waste on enrolled students',
      ],
    },
    results: {
      summary:
        'The performance marketing system transformed Solution Point into a predictable enrollment machine, achieving substantial scale while maintaining strict profitability.',
      metrics: [
        {
          label: 'Total Course Orders',
          value: '788',
          note: 'Verified paid course purchases',
        },
        {
          label: 'Generated Sales Revenue',
          value: '800K',
          prefix: '~৳',
          note: 'Total gross sales driven by campaign',
        },
        {
          label: 'Acquisition Predictability',
          value: 'High',
          note: 'Consistent weekly enrollment run-rate',
        },
      ],
    },
    evidence: [
      {
        type: 'metric',
        title: 'Documented Order Volume',
        description: 'Verified backend order records confirming 788 paid course registrations.',
        items: [
          '788 verified course checkout completions',
          'Consistent enrollment pace across primary promotional windows',
        ],
      },
      {
        type: 'analytics',
        title: 'Conversion Attribution',
        description: 'Meta Ads Manager attribution matching actual merchant payment gateway receipts.',
        items: [
          'Direct attribution through Meta Pixel and server-side tracking',
          'Documented revenue total of approximately ৳800,000',
        ],
      },
    ],
    conclusion: {
      summary:
        'By treating education marketing as a structured value-communication process rather than simple ad boosts, Solution Point achieved sustainable commercial scale.',
      businessImpact: [
        'Established a predictable, repeatable model for launching new course cohorts.',
        'Reduced dependence on erratic organic promotions.',
        'Delivered over ৳800K in sales revenue with positive unit margins.',
      ],
      keyTakeaways: [
        'In education marketing, addressing the student’s outcome and confidence in the instructor drives higher conversion than discount-focused copy.',
        'Server-side conversion tracking is essential for feeding accurate signals back into the Meta ad auction.',
      ],
    },
    projectSlug: 'solution-point',
    tags: ['Education', 'Meta Ads', 'Funnel CRO', 'Course Sales'],
  },
  {
    id: 'case-study-autonex',
    slug: 'autonex',
    title: 'Autonex — Automotive Technology Marketing & Revenue Acceleration',
    client: 'Autonex Technology',
    industry: 'Technology & Automotive Services',
    service: 'Performance Marketing & Lead Generation',
    period: 'Growth Campaign Cycle',
    summary:
      'How targeted Meta Ads campaigns and rapid messaging lead triage generated ৳343K+ in verified revenue for an automotive technology specialist.',
    featured: true,
    heroMetric: {
      value: '৳343K+',
      label: 'Verified Generated Revenue',
    },
    overview: {
      client: 'Autonex Technology',
      industry: 'Technology & Automotive Services',
      service: 'Meta Ads, Lead Generation, Creative Strategy, Analytics Tracking',
      projectPeriod: 'Growth Campaign Cycle',
      objective:
        'Acquire high-intent customers for specialized automotive technology products and professional installation services.',
    },
    challenge: {
      summary:
        'Autonex offered sophisticated automotive technology solutions but struggled to generate consistent, qualified inquiries from commercial and vehicle-owner decision makers.',
      points: [
        'High reliance on offline networking and word of mouth with unpredictable sales cycles.',
        'Broad general marketing previously generated tire-kickers rather than qualified buyers.',
        'Lack of clear attribution connecting marketing spend to actual installation revenue.',
      ],
    },
    strategy: {
      summary:
        'Developed a focused lead-acquisition strategy that paired precision demographic and interest targeting with direct conversational response via WhatsApp triage.',
      points: [
        'Targeted Decision-Makers: Filtered audiences by vehicle ownership status, commercial interest, and geographic service areas.',
        'Problem-First Creatives: Highlighted operational vehicle reliability, modern feature upgrades, and technical peace of mind.',
        'Rapid-Response Lead Flow: Directed traffic into immediate WhatsApp conversations to answer technical questions before buyer enthusiasm cooled.',
      ],
    },
    execution: {
      summary:
        'Designed, deployed, and managed targeted Meta campaigns with real-time conversion monitoring and budget adjustment.',
      deliverables: [
        'Campaign structure optimized for messaging and lead qualification.',
        'Ad creative development focused on product installation demonstrations and technical specifications.',
        'Integration of WhatsApp messaging entry points with instant auto-responder qualification questions.',
        'Weekly revenue tracking linking ad campaign IDs to closed customer invoices.',
      ],
      technicalDetails: [
        'Click-to-WhatsApp and Instant Lead Form deployment',
        'UTM attribution tracking connecting inquiry source to revenue outcome',
      ],
    },
    results: {
      summary:
        'The campaign unlocked a new, highly lucrative sales channel, delivering ৳343K+ in verified customer revenue at a profitable return on ad spend.',
      metrics: [
        {
          label: 'Generated Revenue',
          value: '343K+',
          prefix: '৳',
          note: 'Documented sales revenue from campaign leads',
        },
        {
          label: 'Campaign Delivery',
          value: 'Profitable',
          note: 'Sustained positive commercial ROI',
        },
      ],
    },
    evidence: [
      {
        type: 'metric',
        title: 'Documented Revenue Impact',
        description: 'Sales records and verified revenue figures totaling over ৳343,000.',
        items: [
          'Documented gross revenue exceeding ৳343K',
          'Consistent qualification rate from inbound ad inquiries',
        ],
      },
    ],
    conclusion: {
      summary:
        'Pairing targeted paid traffic with friction-free conversational inquiry allows technical service businesses to close high-value sales with minimal lag.',
      businessImpact: [
        'Proved digital customer acquisition works profitably for automotive technology solutions.',
        'Created a reliable lead pipeline that can be scaled up or down based on operational service capacity.',
      ],
      keyTakeaways: [
        'For high-involvement automotive services, customers prefer direct conversational qualification over filling out long corporate forms.',
      ],
    },
    projectSlug: 'autonex',
    tags: ['Automotive Tech', 'Lead Generation', 'WhatsApp Funnel', 'Revenue Growth'],
  },
  {
    id: 'case-study-kanzie',
    slug: 'kanzie',
    title: 'Kanzie — Full-Stack E-Commerce & Unified Operations Platform',
    client: 'Ahil Ahmed / Kanzie',
    industry: 'Retail & E-Commerce',
    service: 'Custom Web Application & Commerce Infrastructure',
    period: 'Platform Engineering',
    summary:
      'Designing and developing a custom full-stack e-commerce storefront and centralized administrative operations center with role-based access control, inventory tracking, and activity audits.',
    featured: true,
    heroMetric: {
      value: 'Unified System',
      label: 'Storefront + Full Admin Center',
    },
    overview: {
      client: 'Ahil Ahmed / Kanzie',
      industry: 'Retail & Imported Toys',
      service: 'Full-Stack Web Development, Architecture, Database Modeling, Admin Systems',
      projectPeriod: 'Platform Engineering',
      objective:
        'Build a modern customer shopping experience and a powerful internal business operations center on a single unified, scalable codebase.',
    },
    challenge: {
      summary:
        'Standard e-commerce platforms either offered rigid, generic templates or required an expensive, brittle patchwork of third-party plugins that caused security issues, slow load times, and poor internal operational visibility.',
      points: [
        'Generic storefronts failed to provide the modern, dynamic customer browsing experience the brand demanded.',
        'Lack of unified back-office control: stock levels, orders, and customer data were scattered.',
        'No multi-staff support with role-based permissions, creating security risks when granting team access.',
        'Inability to audit internal administrative changes or track staff activity history.',
        'Promotional banner updates required manual developer intervention.',
      ],
    },
    strategy: {
      summary:
        'Architected a custom full-stack web application using Next.js, React, TypeScript, Prisma, and MySQL. The system decouples the fast public storefront from the powerful administrative center while sharing a unified, type-safe data model.',
      points: [
        'Type-Safe Domain Modeling: Modeled products, categories, orders, staff, permissions, and audit logs using Prisma ORM.',
        'Operational Workflow Design: Engineered the admin center around actual retail workflows (Pending → Confirmed → Processing → Shipped → Delivered).',
        'Granular RBAC Architecture: Implemented role-based access controls to safeguard sensitive financial data while giving catalog managers full access.',
        'Auditability & Transparency: Built an automated activity logger recording administrative actions for accountability.',
      ],
    },
    execution: {
      summary:
        'Delivered both the customer-facing storefront and the custom Kanzie Admin Center with modern responsive design, sub-second transitions, and robust database architecture.',
      deliverables: [
        'Customer Storefront: High-performance product catalog, category browsing, product detail view, and streamlined checkout.',
        'Kanzie Admin Center: Centralized dashboard with real-time operational overview (revenue, active orders, low-stock warnings).',
        'Product & Category Taxonomy: Hierarchical catalog management with instant storefront synchronization.',
        'Order Management System: Multi-state operational order processing pipeline with customer detail review.',
        'Inventory Management: Real-time stock tracking with automated low-stock warnings.',
        'Staff & RBAC System: Independent staff profiles with role-specific permission assignments.',
        'Activity Log: Automatic logging of critical system operations providing a complete audit trail.',
        'Banner & Content Control: Code-free management of storefront announcement bars and promotional banners.',
        'Fraud Check Module: Structured risk assessment for suspicious transaction evaluation.',
      ],
      technicalDetails: [
        'Frontend: Next.js App Router, React, TypeScript, Tailwind CSS, Framer Motion',
        'Backend: Node.js API routes with server-side validation',
        'Database: MySQL managed through Prisma ORM',
        'Authentication: Secure session handling with permission verification middleware',
      ],
    },
    results: {
      summary:
        'Kanzie replaced fragmented software tools with a centralized digital business platform that scales effortlessly with product catalog expansion and transaction volume.',
      metrics: [
        {
          label: 'Platform Architecture',
          value: 'Full-Stack',
          note: 'Storefront + Custom Admin Center',
        },
        {
          label: 'Content Agility',
          value: '100% Code-Free',
          note: 'Banners, catalog, and orders managed via UI',
        },
        {
          label: 'Security Layer',
          value: 'RBAC + Audit',
          note: 'Granular permissions and automated activity logging',
        },
      ],
    },
    evidence: [
      {
        type: 'architecture',
        title: 'Production Storefront & Admin Portal',
        description: 'Live application running at https://kanzie.shop/ with verified multi-module administration.',
        items: [
          'Customer Storefront with real-time catalog browsing',
          'Dedicated Kanzie Admin Center with RBAC and activity logs',
          'Documented database schema linking products, orders, inventory, and staff',
        ],
      },
    ],
    conclusion: {
      summary:
        'A custom-built commerce application provides total operational ownership, zero platform fees, and seamless internal workflows that off-the-shelf templates cannot match.',
      businessImpact: [
        'Eliminated third-party plugin subscription costs and security vulnerabilities.',
        'Provided staff members with clear, permission-gated operational workflows.',
        'Ensured sub-second page performance across all mobile and desktop devices.',
      ],
      keyTakeaways: [
        'E-commerce is an operational system, not just a storefront. Investing in the administration engine pays massive dividends in daily efficiency.',
      ],
    },
    projectSlug: 'kanzie',
    tags: ['Next.js', 'Prisma', 'Custom E-Commerce', 'RBAC', 'Admin Center'],
  },
  {
    id: 'case-study-lumiflick',
    slug: 'lumiflick',
    title: 'Lumiflick — Premium E-Commerce Architecture for Glass Poster Art',
    client: 'Lumiflick',
    industry: 'Home Decor & Online Retail',
    service: 'Modern E-Commerce Platform & Full-Stack Development',
    period: 'Platform Delivery',
    summary:
      'Engineering a full-stack e-commerce platform that elevates glass wall art through visual storytelling, curated collections, and high-performance database-driven commerce.',
    featured: true,
    heroMetric: {
      value: 'Modern Stack',
      label: 'Visual Discovery + Next.js Platform',
    },
    overview: {
      client: 'Lumiflick',
      industry: 'Home Decor & Premium Wall Art',
      service: 'Next.js Development, UI/UX Architecture, Prisma ORM, E-Commerce Engineering',
      projectPeriod: 'Full-Stack Platform Delivery',
      objective:
        'Create a visual-first e-commerce platform that communicates the premium craftsmanship of glass posters and provides a scalable digital foundation.',
    },
    challenge: {
      summary:
        'Glass posters are premium decorative statement pieces, but standard e-commerce templates treated them like generic flat prints. The brand needed an interface that communicated the tactile reflection, scratch resistance, and vivid depth of real glass.',
      points: [
        'Standard e-commerce themes failed to establish the perceived luxury of real glass construction.',
        'Product discovery was disjointed without clear category-level visual curation.',
        'The brand needed a custom database foundation capable of handling hundreds of artwork designs without performance degradation.',
      ],
    },
    strategy: {
      summary:
        'Engineered a modern full-stack web application centered on visual storytelling, high-resolution product showcase, and smooth micro-interactions.',
      points: [
        'Visual-Centric Storefront: Placed artwork at the center of the customer journey with expansive product cards and gallery transitions.',
        'Curated Collections: Organized designs into high-interest lifestyle categories (Anime, Cars, FIFA, Islamic, Motivational, Nature).',
        'Value-Focused Product Pages: Emphasized physical product specifications—frameless look, HD vivid colors, waterproof durability, and real glass.',
        'Scalable Database Layer: Used Prisma ORM to maintain clean separation between application presentation and commerce data.',
      ],
    },
    execution: {
      summary:
        'Built and deployed a responsive, high-performance e-commerce platform on Next.js, React, TypeScript, Prisma, and Tailwind CSS.',
      deliverables: [
        'Modern Storefront UI with responsive layouts across desktop, tablet, and mobile.',
        'Curated Category Catalog with instant filtering across themes and collections.',
        'Rich Product Presentation Pages with specification highlights and high-res imagery.',
        'Streamlined Cart & Purchasing Flow engineered to reduce checkout abandonment.',
        'Prisma-backed Database Integration for structured catalog expansion.',
        'Framer Motion UI micro-interactions providing fluid visual transitions.',
        'Administrative dashboard foundation for product and inventory updates.',
      ],
      technicalDetails: [
        'Framework: Next.js with React Server Components for optimal LCP',
        'Data Layer: Prisma ORM with structured relational schema',
        'Styling: Tailwind CSS design system with custom aspect-ratio and blur utilities',
      ],
    },
    results: {
      summary:
        'LumiFlick launched with a bespoke brand identity and digital commerce infrastructure that sets a new visual benchmark in the wall decor category.',
      metrics: [
        {
          label: 'Platform Experience',
          value: 'Bespoke',
          note: 'Custom Next.js & Prisma stack',
        },
        {
          label: 'Product Discovery',
          value: 'Curated',
          note: '7+ themed collections with visual navigation',
        },
        {
          label: 'Performance Score',
          value: 'Sub-Second',
          note: 'Fast server-side rendering on mobile',
        },
      ],
    },
    evidence: [
      {
        type: 'architecture',
        title: 'Live Production Platform',
        description: 'Verified platform live at https://www.lumiflick.shop showcasing curated collections and admin integration.',
        items: [
          'Live storefront with visual collection navigation',
          'Backend admin panel managing products, inventory, and orders',
        ],
      },
    ],
    conclusion: {
      summary:
        'When product perceived value is elevated through superior digital design and fast engineering, marketing conversion rates and customer satisfaction increase dramatically.',
      businessImpact: [
        'Positioned LumiFlick as a premium designer brand rather than a discount print shop.',
        'Built a scalable digital infrastructure capable of adding new artwork collections seamlessly.',
      ],
      keyTakeaways: [
        'For visually driven products, the digital shopping experience is the brand. Slow templates destroy customer trust before checkout.',
      ],
    },
    projectSlug: 'lumiflick',
    tags: ['E-Commerce', 'Next.js', 'Visual Storytelling', 'Prisma', 'Tailwind'],
  },
];

export const featuredCaseStudies = caseStudies.filter((cs) => cs.featured);

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return caseStudies.find((cs) => cs.slug === slug);
}

// =================================================================
// UI-FACING FEATURED CASE STUDIES (for FeaturedCaseStudies.tsx)
// =================================================================

export const FEATURED_CASE_STUDIES: FeaturedCaseStudy[] = [
  {
    slug: 'solution-point',
    client: 'Solution Point',
    industry: 'Education & Online Courses',
    period: 'Campaign Cycle',
    title: 'Education Acquisition Funnel: 788 Course Orders & ~৳800K Revenue',
    challenge:
      'Erratic enrollments between promotions, rising Meta ad costs, and high landing-page drop-offs caused by unaddressed student hesitation.',
    strategy:
      'Stratified audience prospecting into career seekers, designed objection-busting creative angles, and restructured the enrollment funnel with clear value milestones.',
    execution: [
      'Restructured Meta Ads into prospecting & retargeting tiers',
      'Produced syllabus-focused direct-response creative assets',
      'Optimized course enrollment checkout for mobile visitors',
      'Deployed CAPI server-side event tracking for reliable attribution',
    ],
    results: [
      { metric: '788', label: 'Course Orders', detail: 'Verified paid course purchases' },
      { metric: '~৳800K', label: 'Sales Revenue', detail: 'Gross revenue driven by campaign' },
      { metric: 'Predictable', label: 'Acquisition Model', detail: 'Consistent weekly enrollment pace' },
    ],
    tags: ['Education', 'Meta Ads', 'Funnel CRO', 'Direct Response'],
  },
  {
    slug: 'autonex',
    client: 'Autonex Technology',
    industry: 'Technology & Automotive Services',
    period: 'Growth Campaign',
    title: 'Automotive Tech Marketing: ৳343K+ in Verified Revenue',
    challenge:
      'Niche commercial market with high customer consideration cycles, relying heavily on offline word of mouth without an inbound pipeline.',
    strategy:
      'Targeted vehicle decision-makers with benefit-driven video hooks, routing traffic directly into instant WhatsApp conversational qualification.',
    execution: [
      'Targeted Meta Ads campaign for vehicle commercial decision-makers',
      'Product installation video demonstrations and problem-led copies',
      'Automated WhatsApp conversational triage for high-intent leads',
      'Weekly revenue attribution connecting ad set IDs to closed sales',
    ],
    results: [
      { metric: '৳343K+', label: 'Generated Revenue', detail: 'Documented sales from campaign' },
      { metric: 'Direct', label: 'Inquiry Routing', detail: 'Instant WhatsApp qualification' },
      { metric: 'Profitable', label: 'Commercial ROI', detail: 'Sustained positive return on capital' },
    ],
    tags: ['Automotive Tech', 'Lead Generation', 'WhatsApp Funnel', 'B2B/B2C'],
  },
  {
    slug: 'kanzie',
    client: 'Ahil Ahmed / Kanzie',
    industry: 'Retail & Imported Toys',
    period: 'Platform Delivery',
    title: 'Full-Stack E-Commerce & Centralized Operations Platform',
    challenge:
      'Off-the-shelf templates lacked internal control: no multi-user staff permissions, inventory alerts were disjointed, and manual developer work was needed for promotional changes.',
    strategy:
      'Architected a full-stack Next.js + Prisma + MySQL application uniting the public storefront with an operational admin center, granular RBAC, and automated activity logging.',
    execution: [
      'Engineered customer storefront with dynamic category navigation',
      'Built custom Kanzie Admin Center with real-time operational overview',
      'Implemented role-based permissions (RBAC) and activity audit logging',
      'Delivered code-free banner management and fraud check review',
    ],
    results: [
      { metric: 'Full-Stack', label: 'Architecture', detail: 'Storefront + Custom Admin Center' },
      { metric: '100%', label: 'Code-Free Agility', detail: 'Banners & catalog managed via UI' },
      { metric: 'RBAC', label: 'Security Layer', detail: 'Granular permissions & audit logs' },
    ],
    tags: ['Next.js', 'Prisma', 'Custom E-Commerce', 'RBAC', 'Admin Center'],
  },
  {
    slug: 'lumiflick',
    client: 'Lumiflick',
    industry: 'Home Decor & Premium Wall Art',
    period: 'Platform Delivery',
    title: 'Modern E-Commerce Architecture for Glass Poster Art',
    challenge:
      'Generic e-commerce themes treated luxury glass art like flat posters, failing to convey the high-definition depth, frameless look, and tactile craftsmanship of real glass.',
    strategy:
      'Created a visual-first shopping journey placing high-res artwork at the center, backed by 7+ curated themed collections and a scalable Prisma database foundation.',
    execution: [
      'Built modern storefront with curated lifestyle collection discovery',
      'Designed specification-led product pages highlighting real glass and durability',
      'Integrated Prisma ORM database for structured catalog management',
      'Optimized mobile checkout flow to minimize purchase friction',
    ],
    results: [
      { metric: 'Bespoke', label: 'Brand Positioning', detail: 'Custom Next.js & React UI' },
      { metric: 'Curated', label: 'Product Discovery', detail: '7+ themed lifestyle collections' },
      { metric: 'Sub-Second', label: 'Performance', detail: 'Fast server-rendered pages' },
    ],
    tags: ['E-Commerce', 'Next.js', 'Visual Storytelling', 'Prisma', 'Tailwind'],
  },
];
