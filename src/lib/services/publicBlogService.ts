import { cache } from 'react';
import { PublicBlogPost } from '@/types';
import { BlogPostRecord } from '@/types/database';
import { getBlogPostsDb } from './contentService';
import { seedBlogPosts } from '@/data/blog';

/**
 * Public-facing reads for the blog. Posts are authored in /admin/blog and live
 * in `public.blog_posts`; the seeds in src/data/blog.ts render only while that
 * table has no published rows, or if the database is unreachable, so /blog is
 * never blank.
 */

function toPublicPost(record: BlogPostRecord & { author_name?: string }): PublicBlogPost {
  return {
    slug: record.slug,
    title: record.title,
    excerpt: record.excerpt ?? '',
    category: record.category,
    tags: record.tags ?? [],
    content: record.content,
    publishedAt: record.published_at ?? record.created_at,
    author: record.author_name ?? 'OneDot ABM',
    featuredImage: record.featured_image,
  };
}

function byNewest(a: PublicBlogPost, b: PublicBlogPost): number {
  return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
}

/** Deduplicated per request, so a page can call this more than once. */
export const getPublishedPosts = cache(async function getPublishedPosts(): Promise<PublicBlogPost[]> {
  try {
    const rows = await getBlogPostsDb({ status: 'published' });
    const posts = rows.map(toPublicPost).sort(byNewest);
    return posts.length > 0 ? posts : seedBlogPosts;
  } catch (error) {
    console.error('Blog: falling back to seed posts', error);
    return seedBlogPosts;
  }
});

export async function getPublishedPostBySlug(slug: string): Promise<PublicBlogPost | null> {
  const posts = await getPublishedPosts();
  return posts.find((post) => post.slug === slug) ?? null;
}
