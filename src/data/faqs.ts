import { FaqItem } from '@/types';

/**
 * Frequently Asked Questions
 * Categorized into: General, Marketing, Web Development, Process
 */
export const FAQ_DATA: FaqItem[] = [
  // =================================================================
  // GENERAL
  // =================================================================
  {
    id: 'why-combine',
    question: 'What makes OneDot ABM different from a typical digital agency?',
    answer:
      'Most agencies offer either advertising or website design in isolation. OneDot ABM integrates performance marketing with custom full-stack web development under one roof. Marketing creates targeted demand; custom web engineering builds the high-speed conversion systems, admin dashboards, and checkout experiences that turn that demand into profitable revenue.',
    category: 'General',
    categoryLabel: 'General',
    featured: true,
  },
  {
    id: 'international-clients',
    question: 'Do you work with businesses outside of Bangladesh?',
    answer:
      'Yes. While our headquarters are in Bangladesh, we work with brands, e-commerce stores, startups, and service firms internationally across North America, Europe, the Middle East, and Asia-Pacific. All communication, reporting, and deliverables are handled through streamlined digital workflows.',
    category: 'General',
    categoryLabel: 'General',
    featured: true,
  },
  {
    id: 'team-structure',
    question: 'Who will be managing and executing my project?',
    answer:
      'Every engagement is directly overseen and strategized by OneDot ABM founder Dhrubo Duti Biswas, ensuring high-level strategic alignment and direct accountability. Implementation is carried out with specialized engineering and creative rigor rather than passed off to junior account managers.',
    category: 'General',
    categoryLabel: 'General',
    featured: false,
  },
  {
    id: 'client-portal-access',
    question: 'How do clients track their active projects and deliverables?',
    answer:
      'Clients receive secure access to our authenticated Client Portal at dhruboduti.com/project-access. Within the portal, you can monitor live deliverable completion statuses (Pending → Uploaded), review timeline milestones, download project assets, and inspect invoice histories in real time.',
    category: 'General',
    categoryLabel: 'General',
    featured: false,
  },

  // =================================================================
  // MARKETING
  // =================================================================
  {
    id: 'minimum-budget',
    question: 'What is your recommended minimum advertising budget?',
    answer:
      'For paid advertising (Meta & Google Ads), we generally recommend a minimum monthly ad spend of $1,000–$2,000 (or local equivalent) paid directly to the ad platforms. This ensures sufficient conversion data volume for algorithmic optimization, creative testing, and statistical significance.',
    category: 'Marketing',
    categoryLabel: 'Marketing',
    featured: true,
  },
  {
    id: 'timeline-results',
    question: 'How quickly can we expect to see results from advertising campaigns?',
    answer:
      'Initial testing signals and lead flow typically begin within the first 7–14 days of launch. Profitable scaling and algorithmic stability generally compound between days 30 to 60 as creative winners are identified, audience exclusions take effect, and bid optimization matures.',
    category: 'Marketing',
    categoryLabel: 'Marketing',
    featured: true,
  },
  {
    id: 'creative-production',
    question: 'Do you design and produce the ad creatives as well?',
    answer:
      'Yes. Creative strategy is central to performance marketing. We write the copy, design static visual assets, format multi-product carousels, and script UGC-style video concepts tailored to customer psychology and objection handling.',
    category: 'Marketing',
    categoryLabel: 'Marketing',
    featured: false,
  },
  {
    id: 'conversion-tracking',
    question: 'How do you handle iOS privacy restrictions and data tracking?',
    answer:
      'We implement robust server-side tracking using Meta Conversions API (CAPI) and Google Tag Manager / GA4 alongside standard browser pixels. This dual-layer setup recovers signal loss from ad blockers and iOS 14.5+ privacy updates, giving the ad platforms clean conversion data.',
    category: 'Marketing',
    categoryLabel: 'Marketing',
    featured: false,
  },

  // =================================================================
  // WEB DEVELOPMENT
  // =================================================================
  {
    id: 'tech-stack',
    question: 'Which technologies do you use for web development?',
    answer:
      'We choose modern technologies suited to project requirements: Next.js, React, TypeScript, and Tailwind CSS for lightning-fast frontend applications; Node.js, Laravel, PHP, and Prisma for scalable backends; and MySQL or PostgreSQL for relational data architectures. We do not lock clients into restrictive website builders when custom solutions are required.',
    category: 'Web Development',
    categoryLabel: 'Web Development',
    featured: true,
  },
  {
    id: 'code-ownership',
    question: 'Do we own the source code and digital assets upon completion?',
    answer:
      'Yes, 100%. Upon final project sign-off and payment, full intellectual property rights, source code repositories, design assets, and administrative credentials are transferred to your organization. You have zero vendor lock-in.',
    category: 'Web Development',
    categoryLabel: 'Web Development',
    featured: true,
  },
  {
    id: 'custom-systems',
    question: 'Can you build custom internal software like admin panels and CRM tools?',
    answer:
      'Yes. Our flagship development capabilities include custom operational software: role-based access control (RBAC), customer storefronts, inventory tracking, staff activity auditing, and custom business management systems — as demonstrated in platforms like Kanzie.',
    category: 'Web Development',
    categoryLabel: 'Web Development',
    featured: false,
  },
  {
    id: 'maintenance-hosting',
    question: 'Do you provide hosting setup, domain configuration, and ongoing maintenance?',
    answer:
      'Yes. We configure production hosting on industry-standard infrastructure (Vercel, AWS, or custom Linux VPS environments) including SSL certificates, automated backup systems, DNS records, and continuous CI/CD deployment pipelines.',
    category: 'Web Development',
    categoryLabel: 'Web Development',
    featured: false,
  },

  // =================================================================
  // PROCESS
  // =================================================================
  {
    id: 'onboarding-process',
    question: 'How does a new engagement start?',
    answer:
      'Every project begins with our Week 1 Discovery phase. We review your existing data, ad accounts, unit economics, or software requirements, conduct competitor analysis, and establish concrete milestone deliverables and pricing before any contracts are signed.',
    category: 'Process',
    categoryLabel: 'Process',
    featured: true,
  },
  {
    id: 'pricing-model',
    question: 'What are your commercial engagement models?',
    answer:
      'We offer transparent, milestone-based models: fixed-fee scopes for custom web application and website development, and monthly management retainers for ongoing performance marketing campaigns. We provide detailed line-item quotations so there are never hidden fees.',
    category: 'Process',
    categoryLabel: 'Process',
    featured: true,
  },
  {
    id: 'revision-policy',
    question: 'What is your review and iteration policy during development?',
    answer:
      'Projects include structured feedback checkpoints at every phase (wireframes, design prototypes, staging builds). We conduct iterative revisions to guarantee the delivered product matches approved specifications before public launch.',
    category: 'Process',
    categoryLabel: 'Process',
    featured: false,
  },
  {
    id: 'reporting-frequency',
    question: 'How often will we receive reports and campaign updates?',
    answer:
      'Performance marketing clients receive continuous real-time dashboard visibility, formal weekly KPI summaries (spend, CPA, ROAS, conversions), and monthly strategic growth reviews with founder Dhrubo Duti Biswas.',
    category: 'Process',
    categoryLabel: 'Process',
    featured: false,
  },
];

export const faqs = FAQ_DATA;
