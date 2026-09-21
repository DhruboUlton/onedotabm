import { MetricItem, TrustClient } from '@/types';

export const METRICS_DATA: MetricItem[] = [
  {
    id: 'brands-scaled',
    value: 30,
    prefix: '',
    suffix: '+',
    label: 'Brands Scaled',
    description: 'Directly supported businesses across e-commerce, education, travel, tech, and retail.',
    category: 'aggregate',
    verified: true,
  },
  {
    id: 'campaigns-run',
    value: 300,
    prefix: '',
    suffix: '+',
    label: 'Campaigns Managed',
    description: 'High-performing customer acquisition campaigns executed across Meta, Google, and paid channels.',
    category: 'marketing',
    verified: true,
  },
  {
    id: 'ad-spend-managed',
    value: 70,
    prefix: '$',
    suffix: 'K+',
    label: 'Meta Ad Spend Managed',
    description: 'Directly overseen across Meta Ads Manager accounts with consistent ROAS and conversion accountability.',
    category: 'marketing',
    verified: true,
  },
  {
    id: 'websites-web-apps',
    value: 15,
    prefix: '',
    suffix: '+',
    label: 'Websites & Web Apps',
    description: 'Custom e-commerce platforms, corporate websites, admin portals, and web applications delivered end-to-end.',
    category: 'development',
    verified: true,
  },
];

export const verifiedMetrics = METRICS_DATA;
export const heroMetrics = METRICS_DATA;

export const TRUST_CLIENTS: TrustClient[] = [
  {
    id: 'autonex',
    name: 'Autonex Technology',
    logoText: 'AUTONEX',
    category: 'Automotive & Tech',
    note: '৳343K+ generated campaign revenue',
  },
  {
    id: 'kanzie',
    name: 'Kanzie Store',
    logoText: 'KANZIE',
    category: 'Retail & E-Commerce',
    note: 'Custom full-stack commerce platform & admin center',
  },
  {
    id: 'lumiflick',
    name: 'Lumiflick',
    logoText: 'LUMIFLICK',
    category: 'Home Decor & Art',
    note: 'Next.js glass poster e-commerce platform',
  },
  {
    id: 'solution-point',
    name: 'Solution Point',
    logoText: 'SOLUTION POINT',
    category: 'Education & Courses',
    note: '788 course orders · ~৳800K sales revenue',
  },
  {
    id: 'techstart-bd',
    name: 'TechStart BD',
    logoText: 'TECHSTART BD',
    category: 'E-Commerce & Tech',
    note: 'Scaled monthly revenue from $18K to $61K',
  },
  {
    id: 'qahaf',
    name: 'QAHAF',
    logoText: 'QAHAF',
    category: 'Apparel & Lifestyle',
    note: 'E-commerce brand acquisition & optimization',
  },
];
