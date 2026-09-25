import { DemoCategory, DemoMeta } from './types';

/**
 * The single place the showcase learns what exists.
 *
 * Metadata only — never import demo components or demo data here, or the
 * showcase landing page starts pulling every demo's bundle.
 *
 * To add a demo, see ./README.md — create the folder, drop <DemoFrame /> in its
 * root layout, then add one entry to `demos` below. Nothing else changes.
 */

export const categories: DemoCategory[] = [
  {
    slug: 'ecommerce',
    name: 'E-commerce',
    description: 'Storefronts, product catalogues, cart and checkout flows.',
    icon: 'shopping-bag',
  },
  {
    slug: 'crm',
    name: 'CRM',
    description: 'Pipelines, contact records and deal tracking interfaces.',
    icon: 'users',
  },
  {
    slug: 'blog',
    name: 'Personal Blog',
    description: 'Editorial layouts, reading experiences and author pages.',
    icon: 'pen-tool',
  },
  {
    slug: 'organization',
    name: 'Organization',
    description: 'Corporate sites, team directories and service pages.',
    icon: 'building',
  },
  {
    slug: 'portfolio',
    name: 'Portfolio',
    description: 'Case study layouts and creative project showcases.',
    icon: 'layout-grid',
  },
  {
    slug: 'education',
    name: 'Education',
    description: 'Course catalogues, curricula and enrolment journeys.',
    icon: 'graduation-cap',
  },
  {
    slug: 'restaurant',
    name: 'Restaurant',
    description: 'Menus, reservation flows and location pages.',
    icon: 'utensils',
  },
  {
    slug: 'booking',
    name: 'Booking',
    description: 'Availability calendars and appointment scheduling.',
    icon: 'calendar',
  },
  {
    slug: 'saas',
    name: 'SaaS',
    description: 'Product marketing sites, pricing tiers and app dashboards.',
    icon: 'cloud',
  },
  {
    slug: 'other',
    name: 'Other',
    description: 'Interfaces that do not fit a standard category.',
    icon: 'shapes',
  },
];

export const demos: DemoMeta[] = [
  {
    slug: 'demo-01',
    category: 'ecommerce',
    name: 'Shuddha Harvest',
    description:
      'A complete responsive organic pantry storefront with pure gawa ghee, wild honey, cold-pressed oils, bundles, cart drawer, checkout and full merchant admin panel.',
    tags: ['Storefront', 'Product Details', 'Cart & Checkout', 'Admin Panel'],
    hasAdmin: true,
    preview: {
      from: '#062E25',
      to: '#E87121',
      image: '/demo-assets/ecommerce/demo-01-preview.jpg',
    },
  },
];

export function getCategory(slug: string): DemoCategory | undefined {
  return categories.find((category) => category.slug === slug);
}

export function getDemosByCategory(categorySlug: string): DemoMeta[] {
  return demos.filter((demo) => demo.category === categorySlug);
}

export function getDemo(categorySlug: string, demoSlug: string): DemoMeta | undefined {
  return demos.find((demo) => demo.category === categorySlug && demo.slug === demoSlug);
}

/** Categories that currently have at least one demo, for the landing page. */
export function getCategoryDemoCount(categorySlug: string): number {
  return getDemosByCategory(categorySlug).length;
}

export function demoHref(demo: Pick<DemoMeta, 'category' | 'slug'>): string {
  return `/webapp-demo/${demo.category}/${demo.slug}`;
}
