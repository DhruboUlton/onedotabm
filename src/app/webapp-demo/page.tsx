import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowUpRight,
  Building,
  Calendar,
  Cloud,
  GraduationCap,
  LayoutGrid,
  PenTool,
  Shapes,
  ShoppingBag,
  Users,
  Utensils,
} from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { categories, demos, getCategoryDemoCount } from '@/demos/registry';
import { DemoIconName } from '@/demos/types';

export const metadata: Metadata = {
  title: 'WebApp Demos — Interactive Product Showcase',
  description:
    'Explore interactive web application demos built by OneDot ABM. Browse storefronts, dashboards and admin panels as working interfaces, not screenshots.',
  openGraph: {
    title: 'WebApp Demos | OneDot ABM',
    description:
      'Interactive web application demos you can click through — storefronts, admin panels and dashboards built by OneDot ABM.',
  },
};

const icons: Record<DemoIconName, React.ComponentType<{ className?: string }>> = {
  'shopping-bag': ShoppingBag,
  users: Users,
  'pen-tool': PenTool,
  building: Building,
  'layout-grid': LayoutGrid,
  'graduation-cap': GraduationCap,
  utensils: Utensils,
  calendar: Calendar,
  cloud: Cloud,
  shapes: Shapes,
};

export default function WebAppDemoIndexPage() {
  const liveCount = demos.length;

  return (
    <div className="flex flex-col bg-[#F7F7F5]">
      {/* 01. Header */}
      <section className="pt-12 pb-16 md:pt-20 md:pb-24 border-b border-[#E5E5E2]">
        <Container>
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 mb-6">
              <Badge variant="subtle" dot={false}>
                WEBAPP DEMOS
              </Badge>
              <span className="text-xs font-mono text-[#858585] uppercase tracking-wider">
                {liveCount} interactive {liveCount === 1 ? 'build' : 'builds'} · click through
                anything
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-[#111111] leading-[1.08] mb-6">
              Working software, <span className="text-[#1400FF]">not screenshots.</span>
            </h1>

            <p className="text-lg sm:text-xl text-[#555555] leading-relaxed max-w-2xl">
              Every demo below is a real frontend you can use — browse the catalogue, add to the
              cart, open the admin panel, change a status. Nothing is a picture of an interface.
            </p>
          </div>
        </Container>
      </section>

      {/* 02. Categories */}
      <section className="py-16 md:py-24">
        <Container>
          <div className="flex items-end justify-between gap-6 mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#111111]">
                Browse by category
              </h2>
              <p className="text-sm text-[#555555] mt-1">
                Pick the kind of product closest to what you need built.
              </p>
            </div>
          </div>

          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => {
              const Icon = icons[category.icon];
              const count = getCategoryDemoCount(category.slug);
              const isEmpty = count === 0;

              return (
                <li key={category.slug}>
                  <Link
                    href={`/webapp-demo/${category.slug}`}
                    className="group flex h-full flex-col justify-between gap-6 rounded-2xl border border-[#E5E5E2] bg-white p-6 transition-all duration-300 hover:border-[#D8D8D4] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.995] active:duration-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1400FF]"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl border border-[#E5E5E2] bg-[#F7F7F5] text-[#1400FF]">
                          <Icon className="w-5 h-5" />
                        </span>

                        <span
                          className={
                            isEmpty
                              ? 'font-mono text-[10px] uppercase tracking-wider text-[#858585]'
                              : 'font-mono text-[10px] uppercase tracking-wider text-[#1400FF]'
                          }
                        >
                          {isEmpty ? 'In production' : `${count} demo${count === 1 ? '' : 's'}`}
                        </span>
                      </div>

                      <h3 className="text-lg font-semibold text-[#111111] group-hover:text-[#1400FF] transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-sm text-[#555555] leading-relaxed mt-1.5">
                        {category.description}
                      </p>
                    </div>

                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#111111]">
                      {isEmpty ? 'See what is coming' : 'Browse demos'}
                      <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Container>
      </section>

      {/* 03. CTA */}
      <section className="py-16 md:py-20 border-t border-[#E5E5E2] bg-white">
        <Container>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="max-w-xl">
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#111111] mb-2">
                Want one of these built for your business?
              </h2>
              <p className="text-base text-[#555555] leading-relaxed">
                Tell us the workflow you are trying to replace. We will show you the closest thing
                we have already shipped.
              </p>
            </div>
            <Button href="/start-a-project" variant="primary" size="lg" arrow="horizontal">
              Start a Project
            </Button>
          </div>
        </Container>
      </section>
    </div>
  );
}
