import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowUpRight, LayoutDashboard } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { categories, getCategory, getDemosByCategory } from '@/demos/registry';

interface PageProps {
  params: Promise<{ category: string }>;
}

export function generateStaticParams() {
  return categories.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getCategory(slug);

  if (!category) return { title: 'Category Not Found' };

  return {
    title: `${category.name} Website Demos`,
    description: `Explore interactive ${category.name.toLowerCase()} demos created by OneDot ABM. ${category.description}`,
    openGraph: {
      title: `${category.name} Demos | OneDot ABM`,
      description: `Interactive ${category.name.toLowerCase()} web application demos by OneDot ABM.`,
    },
  };
}

export default async function DemoCategoryPage({ params }: PageProps) {
  const { category: slug } = await params;
  const category = getCategory(slug);

  if (!category) {
    notFound();
  }

  const categoryDemos = getDemosByCategory(slug);

  return (
    <div className="flex flex-col bg-[#F7F7F5]">
      {/* 01. Header */}
      <section className="pt-12 pb-14 md:pt-20 md:pb-16 border-b border-[#E5E5E2]">
        <Container>
          <Link
            href="/webapp-demo"
            className="inline-flex items-center gap-1.5 mb-8 text-xs font-mono uppercase tracking-wider text-[#858585] hover:text-[#111111] active:text-[#1400FF] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            All categories
          </Link>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 mb-5">
              <Badge variant="accent" size="sm">
                {category.name}
              </Badge>
              <span className="font-mono text-xs text-[#858585] uppercase tracking-wider">
                {categoryDemos.length} {categoryDemos.length === 1 ? 'demo' : 'demos'}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-[#111111] leading-[1.1] mb-4">
              {category.name} demos
            </h1>
            <p className="text-lg text-[#555555] leading-relaxed">{category.description}</p>
          </div>
        </Container>
      </section>

      {/* 02. Demos */}
      <section className="py-14 md:py-20">
        <Container>
          {categoryDemos.length > 0 ? (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {categoryDemos.map((demo) => (
                <li key={demo.slug}>
                  <Link
                    href={`/webapp-demo/${demo.category}/${demo.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#E5E5E2] bg-white transition-all duration-300 hover:border-[#D8D8D4] hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.995] active:duration-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1400FF]"
                  >
                    {/* Preview: the demo's screenshot in a laptop frame, or a
                        built wireframe while a demo has no screenshot yet */}
                    <div
                      className="relative h-44 sm:h-52 overflow-hidden"
                      style={{
                        backgroundImage: `linear-gradient(135deg, ${demo.preview.from}, ${demo.preview.to})`,
                      }}
                      aria-hidden="true"
                    >
                      <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(to_right,rgba(255,255,255,0.35)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.35)_1px,transparent_1px)] [background-size:2rem_2rem]" />

                      {demo.preview.image ? (
                        <div className="absolute inset-x-6 bottom-0 top-8 rounded-t-xl bg-[#1D1D1F] p-1.5 pb-0 shadow-[0_-8px_30px_rgba(0,0,0,0.3)]">
                          <div className="relative h-full overflow-hidden rounded-t-lg bg-white">
                            <Image
                              src={demo.preview.image}
                              alt=""
                              fill
                              sizes="(min-width: 768px) 45vw, 90vw"
                              className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="absolute inset-x-6 bottom-0 top-8 rounded-t-xl bg-white/95 shadow-[0_-8px_30px_rgba(0,0,0,0.18)] p-4">
                          <div className="flex items-center gap-1.5 mb-3">
                            <span className="w-2 h-2 rounded-full bg-[#E5E5E2]" />
                            <span className="w-2 h-2 rounded-full bg-[#E5E5E2]" />
                            <span className="w-2 h-2 rounded-full bg-[#E5E5E2]" />
                          </div>
                          <div className="h-2.5 w-1/3 rounded-full bg-[#111111]/80 mb-3" />
                          <div className="grid grid-cols-3 gap-2">
                            <div className="h-10 rounded-md bg-[#F0F0ED]" />
                            <div className="h-10 rounded-md bg-[#F0F0ED]" />
                            <div className="h-10 rounded-md bg-[#F0F0ED]" />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col justify-between gap-5 p-6">
                      <div>
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <h2 className="text-xl font-semibold text-[#111111] group-hover:text-[#1400FF] transition-colors">
                            {demo.name}
                          </h2>
                          {demo.hasAdmin && (
                            <span className="inline-flex items-center gap-1 shrink-0 font-mono text-[10px] uppercase tracking-wider text-[#858585]">
                              <LayoutDashboard className="w-3 h-3" />
                              Admin
                            </span>
                          )}
                        </div>

                        <p className="text-sm text-[#555555] leading-relaxed">{demo.description}</p>

                        <ul className="flex flex-wrap gap-1.5 mt-4">
                          {demo.tags.map((tag) => (
                            <li
                              key={tag}
                              className="rounded-full border border-[#E5E5E2] bg-[#F7F7F5] px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[#555555]"
                            >
                              {tag}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[#111111]">
                        View demo
                        <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-2xl border border-[#E5E5E2] bg-white p-8 sm:p-12 max-w-2xl">
              <h2 className="text-xl font-semibold text-[#111111] mb-2">
                No {category.name.toLowerCase()} demo published yet
              </h2>
              <p className="text-sm text-[#555555] leading-relaxed mb-6">
                This category is on the build list. If you need one now, tell us what it has to do —
                a scoped build usually beats a demo anyway.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button href="/start-a-project" variant="primary" size="sm" arrow="horizontal">
                  Start a Project
                </Button>
                <Button href="/webapp-demo" variant="secondary" size="sm">
                  Browse other categories
                </Button>
              </div>
            </div>
          )}
        </Container>
      </section>
    </div>
  );
}
