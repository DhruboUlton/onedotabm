import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { formatBlogDate } from "@/data/blog";
import { getPublishedPosts } from "@/lib/services/publicBlogService";
import { readingMinutes } from "@/lib/markdown";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Blog — Marketing & Web Development Notes",
  description:
    "Working notes from OneDot ABM on performance marketing, conversion, tracking, and custom web application decisions.",
  openGraph: {
    title: "OneDot ABM Blog",
    description:
      "Working notes on performance marketing, conversion, tracking, and custom web application decisions.",
  },
};

export default async function BlogIndexPage() {
  const posts = await getPublishedPosts();
  const [featured, ...rest] = posts;

  return (
    <div className="flex flex-col bg-[#F7F7F5]">
      {/* 01. Header */}
      <section className="pt-12 pb-16 md:pt-20 md:pb-24 border-b border-[#E5E5E2]">
        <Container>
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 mb-6">
              <Badge variant="subtle" dot={false}>
                FIELD NOTES
              </Badge>
              <span className="text-xs font-mono text-[#858585] uppercase tracking-wider">
                Marketing • Web Development • Strategy
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-[#111111] leading-[1.08] mb-6">
              What We Learn <span className="text-[#1400FF]">Running Campaigns.</span>
            </h1>

            <p className="text-lg sm:text-xl text-[#555555] leading-relaxed max-w-2xl">
              No trend commentary. These are the decisions, structures, and fixes that changed
              results on real accounts and real builds — written down so clients can hold us to
              them.
            </p>
          </div>
        </Container>
      </section>

      {featured && (
        /* 02. Featured Post */
        <section className="py-16 md:py-20 border-b border-[#E5E5E2]">
          <Container>
            <Link href={`/blog/${featured.slug}`} className="group block">
              <Card surface="white" hoverEffect className="p-8 sm:p-12 border-[#D8D8D4]">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                  <div className="lg:col-span-8">
                    <div className="flex flex-wrap items-center gap-3 mb-5">
                      <Badge variant="accent" size="sm">
                        Latest
                      </Badge>
                      <Badge variant="subtle" size="sm">
                        {featured.category}
                      </Badge>
                      <span className="font-mono text-xs text-[#858585]">
                        {formatBlogDate(featured.publishedAt)}
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-4xl font-semibold text-[#111111] tracking-tight leading-[1.15] mb-4 group-hover:text-[#1400FF] transition-colors">
                      {featured.title}
                    </h2>

                    <p className="text-base sm:text-lg text-[#555555] leading-relaxed max-w-2xl">
                      {featured.excerpt}
                    </p>
                  </div>

                  <div className="lg:col-span-4 flex flex-col gap-4 border-t lg:border-t-0 lg:border-l border-[#E5E5E2] pt-6 lg:pt-0 lg:pl-10">
                    <div className="font-mono text-xs uppercase tracking-wider text-[#858585]">
                      <div className="flex items-center gap-1.5 mb-2">
                        <Clock className="w-3.5 h-3.5" />
                        {readingMinutes(featured.content)} min read
                      </div>
                      <div>{featured.author}</div>
                    </div>

                    <span className="inline-flex items-center gap-2 text-sm font-medium text-[#111111]">
                      Read the write-up
                      <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          </Container>
        </section>
      )}

      {/* 03. Post Grid */}
      <section className="py-16 md:py-24">
        <Container>
          {rest.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rest.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="group block h-full">
                  <Card
                    surface="white"
                    hoverEffect
                    className="h-full p-7 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Badge variant="subtle" size="sm">
                          {post.category}
                        </Badge>
                        <span className="font-mono text-[11px] text-[#858585]">
                          {formatBlogDate(post.publishedAt)}
                        </span>
                      </div>

                      <h3 className="text-xl font-semibold text-[#111111] leading-snug mb-3 group-hover:text-[#1400FF] transition-colors">
                        {post.title}
                      </h3>

                      <p className="text-sm text-[#555555] leading-relaxed">{post.excerpt}</p>
                    </div>

                    <div className="flex items-center justify-between pt-6 mt-6 border-t border-[#E5E5E2] font-mono text-[11px] uppercase tracking-wider text-[#858585]">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {readingMinutes(post.content)} min
                      </span>
                      <ArrowUpRight className="w-4 h-4 text-[#111111] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-base text-[#555555]">
              More write-ups are on the way. In the meantime,{" "}
              <Link href="/case-studies" className="text-[#1400FF] underline underline-offset-2">
                the case studies
              </Link>{" "}
              cover the same ground with client numbers attached.
            </p>
          )}
        </Container>
      </section>

      {/* 04. CTA */}
      <section className="py-16 md:py-20 border-t border-[#E5E5E2] bg-white">
        <Container>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="max-w-xl">
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#111111] mb-2">
                Want this applied to your account?
              </h2>
              <p className="text-base text-[#555555] leading-relaxed">
                Send the context and we will tell you which of these actually applies to your
                funnel — before anyone talks about budget.
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
