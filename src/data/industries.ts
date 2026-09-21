import { IndustryItem } from '@/types';

/**
 * High-Growth Industry Blueprints
 * Categorized and referenced with verified case proof where applicable.
 */
export const INDUSTRIES_DATA: IndustryItem[] = [
  {
    id: 'ecommerce',
    name: 'E-Commerce & DTC Brands',
    slug: 'e-commerce',
    tag: 'Retail Infrastructure',
    headline: 'High-converting storefronts and scalable paid acquisition engines for online retail.',
    description:
      'We help consumer brands and online merchants eliminate checkout friction, scale profitable paid ads across Meta and Google, and operate unified backend admin systems that manage inventory, orders, and fulfillment.',
    caseReference: 'Kanzie Platform & Lumiflick E-Commerce',
    typicalNeeds: [
      'Sub-second mobile checkout speed',
      'Unified inventory & order management',
      'Dynamic product catalog ads',
      'Server-side CAPI attribution tracking',
    ],
    relevantServices: [
      'Custom E-Commerce Web Apps',
      'Meta Performance Ads',
      'Conversion Rate Optimization',
      'Inventory Management Backends',
    ],
    challengesAddressed: [
      'High shopping cart abandonment and slow mobile loading speeds',
      'Rising customer acquisition costs (CAC) eating product margins',
      'Fragmented operational tools between sales channels and stock warehouses',
    ],
    solutionsProvided: [
      'Custom full-stack e-commerce platforms (Next.js + Prisma) with sub-second page loads',
      'Algorithmic Meta Ads prospecting and multi-tier retargeting systems',
      'Centralized admin centers featuring inventory management and order fulfillment workflows',
    ],
    relatedProjectSlugs: ['kanzie', 'lumiflick'],
    relatedCaseStudySlugs: ['kanzie', 'lumiflick'],
    tags: ['Online Retail', 'Direct-to-Consumer', 'Catalog Ads', 'Checkout CRO', 'Inventory Systems'],
  },
  {
    id: 'education',
    name: 'Education & E-Learning',
    slug: 'education',
    tag: 'Course Enrollment',
    headline: 'Predictable student enrollment funnels and online course acquisition systems.',
    description:
      'We work with educational institutions, online academies, and course creators to build high-converting curriculum presentation pages and scalable, low-cost student acquisition campaigns.',
    caseReference: 'Solution Point (788 Orders, ~৳800K Revenue)',
    typicalNeeds: [
      'High-converting course curriculum landing pages',
      'Low-cost inquiry and registration funnels',
      'Rapid student counselor lead routing',
      'Student outcome social proof positioning',
    ],
    relevantServices: [
      'Lead Generation Campaigns',
      'Course Landing Pages',
      'Meta & Google Ads Management',
      'Conversion Rate Optimization',
    ],
    challengesAddressed: [
      'Volatile enrollment numbers outside of seasonal promotional spikes',
      'High prospect hesitation and price objections on digital learning programs',
      'Inefficient ad spend targeting low-intent or uncommitted candidates',
    ],
    solutionsProvided: [
      'Value-stacked course landing page architectures with clear outcome milestones',
      'Direct-response Meta Ads campaigns addressing student career motivations',
      'Automated inquiry capture and rapid counselor routing',
    ],
    relatedProjectSlugs: ['solution-point'],
    relatedCaseStudySlugs: ['solution-point'],
    tags: ['Online Courses', 'EdTech', 'Enrollment Funnels', 'Student Acquisition', 'Lead Gen'],
  },
  {
    id: 'travel',
    name: 'Travel & Hospitality',
    slug: 'travel',
    tag: 'High-Ticket Inquiries',
    headline: 'Direct inquiry pipelines and high-ticket customer acquisition for travel operators.',
    description:
      'We develop conversational lead funnels and localized paid campaigns for destination management companies, specialized tour operators, and hospitality brands looking for high-value bookings.',
    caseReference: 'Marhaba DMC Strategic Lead System',
    typicalNeeds: [
      'Conversational WhatsApp & Messenger funnels',
      'High-ticket tour package presentation',
      'Geographic ad targeting across commercial hubs',
      'Automated inquiry qualification workflows',
    ],
    relevantServices: [
      'Travel Lead Generation',
      'Tour Landing Pages',
      'Multi-Channel Paid Ads',
      'Conversational Marketing',
    ],
    challengesAddressed: [
      'Long consideration cycles for high-ticket travel packages and pilgrimage services',
      'Heavy reliance on third-party aggregators and costly offline brokers',
      'Customer drop-offs when forced to navigate complex inquiry forms',
    ],
    solutionsProvided: [
      'Messenger-first and WhatsApp lead campaigns that qualify prospective travelers instantly',
      'High-converting destination package landing pages with transparent itinerary breakdowns',
      'Geographically targeted Meta ad campaigns focused on commercial hubs',
    ],
    relatedProjectSlugs: [],
    relatedCaseStudySlugs: [],
    tags: ['DMC', 'Travel Tech', 'Tour Operators', 'Conversational Funnels', 'Hospitality'],
  },
  {
    id: 'technology',
    name: 'Technology & B2B SaaS',
    slug: 'technology',
    tag: 'Web Systems & Growth',
    headline: 'Demand generation, trial signups, and custom web applications for tech companies.',
    description:
      'We combine high-intent Google Search advertising with custom-built software architectures, client portals, and modern interactive web applications engineered for scalability.',
    caseReference: 'Autonex (৳343K+ Revenue Growth)',
    typicalNeeds: [
      'Custom web application & dashboard development',
      'High-intent search intent capture',
      'Role-based staff & client access control',
      'Product demo conversion funnels',
    ],
    relevantServices: [
      'Custom Web Applications',
      'Admin Dashboards & Portals',
      'Google Ads & Search Marketing',
      'API & Database Engineering',
    ],
    challengesAddressed: [
      'Struggling to communicate complex technical value propositions succinctly',
      'High cost-per-demo and unqualified inbound lead flow',
      'Need for bespoke internal admin dashboards and client-facing portals',
    ],
    solutionsProvided: [
      'High-intent Google Ads and Search Console SEO positioning',
      'Interactive Next.js product landing pages featuring clear visual hierarchy',
      'Custom web applications with role-based access control and API integrations',
    ],
    relatedProjectSlugs: ['autonex', 'kanzie'],
    relatedCaseStudySlugs: ['autonex', 'kanzie'],
    tags: ['B2B SaaS', 'Software', 'Automotive Tech', 'Admin Portals', 'Demand Generation'],
  },
  {
    id: 'professional-services',
    name: 'Professional Services',
    slug: 'professional-services',
    tag: 'Authority & Inquiries',
    headline: 'Authority-building websites and qualified consultation inquiry systems.',
    description:
      'We help consultancies, corporate agencies, and legal practices establish digital market authority, showcase case evidence, and generate high-value consultation inquiries consistently.',
    caseReference: 'Executive Advisory Portals & Funnels',
    typicalNeeds: [
      'Editorial, high-credibility corporate website',
      'Prospect qualification before consultation calls',
      'Client portal for deliverable tracking',
      'Thought leadership content architecture',
    ],
    relevantServices: [
      'Corporate Web Development',
      'Client Portal Engineering',
      'B2B Lead Generation',
      'Brand & Visual Identity',
    ],
    challengesAddressed: [
      'Outdated corporate websites that fail to reflect modern capabilities',
      'Lack of consistent inbound inquiries from high-budget clients',
      'Client management friction caused by endless status update emails',
    ],
    solutionsProvided: [
      'Editorial, premium business websites built with Next.js and Tailwind CSS',
      'Lead qualification workflows that filter prospects before booking consultation calls',
      'Dedicated client portals for milestone tracking and deliverable management',
    ],
    relatedProjectSlugs: [],
    relatedCaseStudySlugs: [],
    tags: ['Consulting', 'B2B Services', 'Corporate Identity', 'Client Portals', 'Lead Qualification'],
  },
  {
    id: 'real-estate',
    name: 'Real Estate & Property',
    slug: 'real-estate',
    tag: 'Property Showcase',
    headline: 'High-intent buyer acquisition and property showcase platforms.',
    description:
      'We build targeted digital campaigns and modern property showcase websites that connect developers and agencies with verified property buyers and investors.',
    caseReference: 'Luxury Development Showcase Systems',
    typicalNeeds: [
      'High-resolution visual property landing pages',
      'Strict demographic buyer targeting',
      'Instant lead dispatch to sales agents',
      'Interactive floorplan & amenity viewers',
    ],
    relevantServices: [
      'Property Landing Pages',
      'Meta High-Ticket Ads',
      'Lead Qualification Funnels',
      'Visual Asset Presentation',
    ],
    challengesAddressed: [
      'High ad spend wasted on non-serious leads with no purchasing capacity',
      'Slow mobile websites that fail to showcase high-resolution architectural imagery',
      'Delayed sales response times allowing hot buyer interest to go cold',
    ],
    solutionsProvided: [
      'Strict demographic and geographic audience filtering on Meta and Google',
      'Fast-loading visual property landing pages with interactive floorplan previews',
      'Instant lead routing directly into sales team WhatsApp and CRM pipelines',
    ],
    relatedProjectSlugs: [],
    relatedCaseStudySlugs: [],
    tags: ['Property Development', 'Luxury Real Estate', 'High-Ticket Lead Gen', 'Visual Showcase'],
  },
  {
    id: 'retail',
    name: 'Retail & Local Commerce',
    slug: 'retail',
    tag: 'Omnichannel Growth',
    headline: 'Omnichannel customer acquisition connecting online ads to physical and digital sales.',
    description:
      'We provide independent retailers and consumer brands with targeted local acquisition campaigns and custom inventory-connected storefronts.',
    caseReference: 'Storefront & Stock Automation Systems',
    typicalNeeds: [
      'Synchronized physical & online inventory',
      'Hyper-local radius advertising campaigns',
      'Frictionless mobile ordering experience',
      'Automated customer re-engagement',
    ],
    relevantServices: [
      'Custom Retail E-Commerce',
      'Local Radius Advertising',
      'Inventory Synchronization',
      'Brand Social Strategy',
    ],
    challengesAddressed: [
      'Competition from massive e-commerce marketplaces and discount chains',
      'Disconnected inventory tracking between physical storefront and online sales',
      'Difficulty attributing offline foot traffic to digital ad campaigns',
    ],
    solutionsProvided: [
      'Local-radius Meta ad campaigns driving store visits and localized ordering',
      'Custom inventory and order management applications',
      'Direct-to-consumer online shopping channels that build brand equity',
    ],
    relatedProjectSlugs: ['kanzie'],
    relatedCaseStudySlugs: ['kanzie'],
    tags: ['Retail', 'Local Commerce', 'Store Traffic', 'Inventory Alerts', 'Omnichannel'],
  },
  {
    id: 'startups',
    name: 'Startups & Growing SMEs',
    slug: 'startups',
    tag: 'Venture Execution',
    headline: 'Full-stack digital execution to validate, launch, and scale commercial ventures.',
    description:
      'We act as the combined marketing and web engineering partner for emerging businesses, building minimum viable digital infrastructure and driving immediate initial traction.',
    caseReference: 'MVP to Scaled Platform Roadmaps',
    typicalNeeds: [
      'Fast-to-market MVP web applications',
      'Early customer acquisition & validation',
      'Unified tech stack without technical debt',
      'Transparent milestone-based pricing',
    ],
    relevantServices: [
      'Full-Stack Next.js Engineering',
      'Rapid Paid Ad Testing',
      'Brand Identity Systems',
      'Analytics & Funnel Setup',
    ],
    challengesAddressed: [
      'Limited internal bandwidth to manage multiple disconnected freelancers and agencies',
      'Need to test product-market fit quickly without accumulating technical debt',
      'Budget constraints requiring high efficiency and fast time-to-market',
    ],
    solutionsProvided: [
      'Turnkey digital launch: Brand identity, Next.js web application, and tracking setup',
      'Rapid paid traffic experiments to validate consumer demand and pricing tiers',
      'Scalable TypeScript codebase ready for venture expansion without complete rewrites',
    ],
    relatedProjectSlugs: ['lumiflick', 'kanzie'],
    relatedCaseStudySlugs: ['lumiflick', 'kanzie'],
    tags: ['Startups', 'MVP Launch', 'Agile Growth', 'Product Validation', 'SME Scale'],
  },
];

export const industries = INDUSTRIES_DATA;

export function getIndustryBySlug(slug: string): IndustryItem | undefined {
  return INDUSTRIES_DATA.find((i) => i.slug === slug || i.id === slug);
}
