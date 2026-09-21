import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Clock } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatBlogDate } from "@/data/blog";
import { getPublishedPostBySlug, getPublishedPosts } from "@/lib/services/publicBlogService";
import { renderMarkdown, readingMinutes } from "@/lib/markdown";

// Shelf rebuild: hourly on its own, or immediately when /admin/blog
// mutates a post (see src/app/admin/blog/actions.ts).
export const revalidate = 3600;

// Without this the route is server-rendered on every request and the
// revalidate window above does nothing — each visit hits the database.
// Prerendering the known slugs puts each post on its own cache shelf;
// dynamicParams keeps slugs published after this build working on demand.
export const dynamicParams = true;

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  if (!post) {
    return { title: "Post Not Found" };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      publishedTime: post.publishedAt,
      authors: [post.author],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const posts = await getPublishedPosts();
  const currentIndex = posts.findIndex((p) => p.slug === post.slug);
  const nextPost = currentIndex >= 0 ? posts[(currentIndex + 1) % posts.length] : posts[0];

  return (
    <article className="flex flex-col bg-[#F7F7F5]">
      {/* 01. Article Header */}
      <section className="pt-12 pb-14 md:pt-20 md:pb-20 border-b border-[#E5E5E2] bg-white">
        <Container size="narrow">
          <div className="flex items-center gap-2 mb-8 text-xs font-mono">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-[#858585] hover:text-[#111111] active:text-[#1400FF] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              BLOG
            </Link>
            <span className="text-[#D8D8D4]">/</span>
            <span className="text-[#555555] uppercase tracking-wider">{post.category}</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 mb-6">
            <Badge variant="accent" size="sm">
              {post.category}
            </Badge>
            {post.tags.map((tag) => (
              <span key={tag} className="font-mono text-[11px] text-[#858585]">
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-[#111111] leading-[1.1] mb-6">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-lg text-[#555555] leading-relaxed max-w-2xl mb-8">{post.excerpt}</p>
          )}

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-6 border-t border-[#E5E5E2] font-mono text-xs uppercase tracking-wider text-[#858585]">
            <span>{post.author}</span>
            <time dateTime={post.publishedAt}>{formatBlogDate(post.publishedAt)}</time>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {readingMinutes(post.content)} min read
            </span>
          </div>
        </Container>
      </section>

      {/* 02. Body — markdown from the admin editor, escaped before rendering */}
      <section className="py-16 md:py-20">
        <Container size="narrow">
          <div
            className="blog-prose"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
          />
        </Container>
      </section>

      {/* 03. Next Post + CTA */}
      {nextPost && (
        <section className="py-16 border-t border-[#E5E5E2] bg-white">
          <Container size="narrow">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
              <Link href={`/blog/${nextPost.slug}`} className="group block">
                <div className="font-mono text-xs uppercase tracking-wider text-[#858585] mb-2">
                  Next post
                </div>
                <div className="text-xl font-semibold text-[#111111] leading-snug group-hover:text-[#1400FF] transition-colors inline-flex items-start gap-2">
                  {nextPost.title}
                  <ArrowUpRight className="w-5 h-5 shrink-0 mt-1 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </Link>

              <div className="sm:text-right">
                <Button href="/start-a-project" variant="primary" size="lg" arrow="horizontal">
                  Start a Project
                </Button>
              </div>
            </div>
          </Container>
        </section>
      )}
    </article>
  );
}
