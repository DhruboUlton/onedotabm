import { ProcessStep } from '@/types';

/**
 * The 5-Phase Client Execution Process
 * Structured from initial discovery through scaled optimization.
 */
export const PROCESS_STEPS: ProcessStep[] = [
  {
    step: '01',
    phase: 'Discovery & Audit',
    duration: 'Days 1–5',
    title: 'Discover & Analyze Requirements',
    tagline: 'Audit & Requirements Discovery',
    description:
      'We conduct an uncompromising deep dive into your business model, customer unit economics, target audience data, historical campaign results, and competitive environment. We build on verifiable data, never guesswork.',
    keyDeliverables: [
      'Comprehensive Ad Account & Pixel Tracking Audit',
      'Technical Scope & System Architecture Specification',
      'Unit Economics & Target CAC/ROAS Model',
      'Competitor Positioning & Differentiation Map',
    ],
    clientInvolvement: 'One 60-minute kick-off interview and secure read-only access to existing ad accounts, analytics, or repositories.',
    activities: [
      'Comprehensive audit of current ad accounts, pixels, and tracking setups',
      'Analysis of customer lifetime value (LTV), margins, and target CAC thresholds',
      'Technical architecture evaluation for website and web application scope',
      'Competitor positioning and customer objection research',
    ],
    deliverables: [
      'Discovery Audit Document',
      'Requirements & Technical Scope Specification',
      'Growth Opportunities Roadmap',
    ],
  },
  {
    step: '02',
    phase: 'Architecture & Strategy',
    duration: 'Week 2',
    title: 'Strategize Funnel & Systems',
    tagline: 'Strategy Architecture & Funnel Design',
    description:
      'We design the comprehensive growth blueprint and technical system architecture. We map out how traffic will be attracted, how the web application will process and convert visitors, and how data will flow into your operational dashboard.',
    keyDeliverables: [
      'Full-Funnel Paid Media & Audience Strategy',
      'Figma UX / UI Wireframes & Layout Prototypes',
      'Data Architecture & Event Tracking Plan (CAPI + GA4)',
      'Creative Angle Scripts & Messaging Angles',
    ],
    clientInvolvement: 'Async review of wireframes and strategic plan with one 45-minute alignment checkpoint.',
    activities: [
      'Paid media campaign hierarchy and audience segmentation plan',
      'Full-funnel mapping: ad hooks → landing page → checkout / lead capture',
      'Database schema modeling and UI/UX wireframing for web builds',
      'Offer positioning, bonus stacking, and conversion rate optimization planning',
    ],
    deliverables: [
      'Strategic Campaign Blueprint',
      'Figma UX / UI Wireframes & Information Architecture',
      'Event Attribution & Tracking Specification',
    ],
  },
  {
    step: '03',
    phase: 'Engineering & Creative',
    duration: 'Weeks 3–4',
    title: 'Build Web Systems & Ad Creatives',
    tagline: 'Creative Production & Full-Stack Development',
    description:
      'We execute both the creative assets and the custom digital infrastructure. From writing persuasive direct-response ad copy to coding performant Next.js components, database schemas, and admin panels, everything is built to commercial standards.',
    keyDeliverables: [
      'Complete Suite of Production Ad Creatives (Static & Video)',
      'Custom Responsive Web Codebase (Next.js, TypeScript, Tailwind)',
      'Backend Database & Admin Management Panels',
      'Server-Side Conversion API (CAPI) & Pixel Setup',
    ],
    clientInvolvement: 'Private staging URL walk-through to test functionality and provide focused feedback before deployment.',
    activities: [
      'Production of static, carousel, and video advertising creatives',
      'Full-stack website and web application coding (Next.js, TypeScript, Tailwind)',
      'Relational database integration and role-based access control setup',
      'Server-side Conversion API (CAPI) and GA4 event instrumentation',
    ],
    deliverables: [
      'Ready-to-Deploy Creative Asset Suite',
      'Production-Ready Custom Web Codebase',
      'Staging Environment for Client Review & Approval',
    ],
  },
  {
    step: '04',
    phase: 'Deployment & Verification',
    duration: 'Week 5',
    title: 'Launch Campaigns & Deploy Platforms',
    tagline: 'Systematic Rollout & Testing',
    description:
      'We launch campaigns and deploy web systems with disciplined control. Rather than dumping entire ad budgets immediately, we conduct structured multi-angle tests across creative variants, audiences, and placements to identify winners quickly.',
    keyDeliverables: [
      'Zero-Downtime Production Deployment & DNS Setup',
      'Live Media Buying Across Meta and Google Ad Accounts',
      'End-to-End Form & Checkout Conversion Verification',
      'Admin Team Handover & Client Portal Access',
    ],
    clientInvolvement: 'Final commercial sign-off and receiving authenticated team access to portals and dashboards.',
    activities: [
      'Controlled ad account launch with isolated testing ad sets',
      'Zero-downtime web deployment and DNS / SSL configuration',
      'Live transaction and lead capture end-to-end verification',
      'Client team onboarding and admin panel training',
    ],
    deliverables: [
      'Live Marketing Campaigns across Meta / Google',
      'Production Web Platform Deployment',
      'Verified Lead Capture & CRM Routing Check',
    ],
  },
  {
    step: '05',
    phase: 'Scaling & Iteration',
    duration: 'Ongoing Retainer',
    title: 'Optimize, Attribute & Scale',
    tagline: 'Data-Driven Scaling & Continuous Improvement',
    description:
      'Growth compounds through relentless iteration. We run 72-hour review cycles to prune underperforming ad creatives, allocate capital to verified winners, improve checkout conversion rates, and expand system capabilities.',
    keyDeliverables: [
      'Continuous 72-Hour Ad Creative & Bid Optimization',
      'Weekly Transparent KPI Attribution Reports',
      'Conversion Rate Optimization (CRO) Heatmap Audits',
      'Ongoing Security Updates & Codebase Maintenance',
    ],
    clientInvolvement: 'Bi-weekly 30-minute strategic review to discuss performance trends, new product launches, and scaling budgets.',
    activities: [
      '72-hour media optimization: killing low-ROAS ads and scaling winners',
      'Landing page A/B testing on headlines, layout, and call-to-actions',
      'Weekly transparent reporting on spend, revenue, CPA, and ROAS',
      'Iterative feature updates and technical maintenance',
    ],
    deliverables: [
      'Weekly Performance Attribution Reports',
      'Continuous Creative Experiment Log',
      'Quarterly Strategic Growth Reviews',
    ],
  },
];

export const processSteps = PROCESS_STEPS;
