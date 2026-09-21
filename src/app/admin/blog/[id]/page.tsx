import React from 'react';
import { notFound } from 'next/navigation';
import { getBlogPostDbById } from '@/lib/services/contentService';
import { getProfilesOptions } from '@/lib/services/operationsService';
import { BlogEditorClientView } from './BlogEditorClientView';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getBlogPostDbById(id);
  if (!post) return { title: 'Post Not Found | OneDot ABM' };
  return {
    title: `Edit ${post.title} | Blog CMS`,
    description: `Edit blog article content, category, tags, and status.`,
  };
}

export default async function BlogPostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [post, authors] = await Promise.all([
    getBlogPostDbById(id),
    getProfilesOptions(),
  ]);

  if (!post) {
    notFound();
  }

  return <BlogEditorClientView post={post} authors={authors} />;
}
