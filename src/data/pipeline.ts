import { PipelineStep } from '@/types';

/**
 * The 7-Stage Closed-Loop Acquisition Machine
 * Connects marketing, traffic, custom web engineering, conversion, and data into an unbroken growth loop.
 */
export const PIPELINE_STEPS: PipelineStep[] = [
  {
    stepNumber: '01',
    phase: 'Strategy',
    role: 'Commercial Architecture',
    title: 'Offer Positioning & Market Architecture',
    summary:
      'Before spending a dollar on media or writing a line of code, we define the core value proposition, unit economics, target audiences, and messaging hooks.',
    details: [
      'Target audience segmentation and customer avatar profiling',
      'Offer stack formulation, pricing strategy, and bonus structuring',
      'Competitor angle gap analysis and USP definition',
      'Customer unit economics and CAC/LTV target modeling',
    ],
    impact: 'Eliminates wasted ad spend on unviable propositions before launch.',
  },
  {
    stepNumber: '02',
    phase: 'Attention',
    role: 'Direct-Response Creative',
    title: 'High-Impact Creative & Hook Generation',
    summary:
      'We produce performance-engineered video concepts, visual carousels, and conversion copy that interrupt social feeds and spark high-intent user interest.',
    details: [
      'Direct-response copywriting focused on pain points and desires',
      'Static, carousel, and video creative asset production',
      'UGC-style product demonstrations and proof showcases',
      'Rapid multi-hook variation testing protocols',
    ],
    impact: 'Maximizes click-through rate (CTR) while driving down cost-per-click (CPC).',
  },
  {
    stepNumber: '03',
    phase: 'Traffic',
    role: 'Algorithmic Media Buying',
    title: 'Targeted Multi-Channel Traffic Generation',
    summary:
      'We deploy disciplined ad campaigns across Meta and Google, routing qualified prospects through structured awareness, consideration, and retargeting tiers.',
    details: [
      'Meta Advantage+ and custom interest audience targeting',
      'High-intent Google Search keyword bidding architecture',
      'Dynamic catalog retargeting for cart abandoners',
      'Budget distribution tuned to incremental return on ad spend',
    ],
    impact: 'Delivers a consistent, scalable flow of commercially qualified visitors.',
  },
  {
    stepNumber: '04',
    phase: 'Website',
    role: 'Full-Stack Engineering',
    title: 'High-Performance Web Architecture',
    summary:
      'Traffic lands on custom-engineered, lightning-fast Next.js storefronts and web apps that eliminate friction, load in under a second, and build instant trust.',
    details: [
      'Sub-second page load speeds optimized for mobile traffic',
      'Custom UI/UX designed around clear conversion hierarchy',
      'Clean Next.js & TypeScript code with zero third-party plugin bloat',
      'Seamless responsive layouts across mobile, tablet, and desktop',
    ],
    impact: 'Stops 40%+ bounce drop-offs caused by slow, generic templates.',
  },
  {
    stepNumber: '05',
    phase: 'Conversion',
    role: 'Behavioral Optimization',
    title: 'Checkout & Lead Conversion Optimization',
    summary:
      'We engineer intuitive checkout paths, frictionless lead capture forms, and integrated payment gateways that make buying effortless and immediate.',
    details: [
      'Frictionless multi-gateway payment integration (Cards, Mobile Banking)',
      'Form field minimization and smart autocomplete triggers',
      'Dynamic cart drawer with upsell and cross-sell triggers',
      'Automated order confirmation and client notification pathways',
    ],
    impact: 'Directly converts maximum click traffic into booked revenue and qualified leads.',
  },
  {
    stepNumber: '06',
    phase: 'Data',
    role: 'Attribution & Tracking',
    title: 'Server-Side Tracking & Full Attribution',
    summary:
      'We bypass browser restrictions and ad blockers with direct server-side CAPI and GA4 event tracking, delivering perfect data fidelity back to ad algorithms.',
    details: [
      'Server-side Meta Conversions API (CAPI) implementation',
      'Google Analytics 4 and Tag Manager custom event architecture',
      'Full-funnel drop-off event instrumentation and tracking',
      'Closed-loop attribution connecting ad spend to actual bank deposits',
    ],
    impact: 'Powers AI ad algorithms with accurate signal data for lower cost-per-acquisition.',
  },
  {
    stepNumber: '07',
    phase: 'Optimization',
    role: 'Compounding Iteration',
    title: 'Continuous Scaling & Iteration Loop',
    summary:
      'Data gathered from real customer actions feeds back into creative strategy, web performance tuning, and budget scaling in 72-hour review cycles.',
    details: [
      '72-hour creative performance audits to scale winners and cut losers',
      'Conversion rate A/B testing on landing page hooks and buttons',
      'Ongoing backend database query tuning and feature enhancements',
      'Transparent weekly reporting on ROAS, CPA, and net profitability',
    ],
    impact: 'Transforms one-off marketing campaigns into a compounding, scalable business engine.',
  },
];
