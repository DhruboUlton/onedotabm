import React from 'react';
import { getBlogPostsDb } from '@/lib/services/contentService';
import { getProfilesOptions } from '@/lib/services/operationsService';
import { BlogClientView } from './BlogClientView';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Blog & Insights CMS | OneDot ABM',
  description: 'Manage thought leadership, case insights, and marketing articles.',
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
    status?: string;
    search?: string;
  }>;
}) {
  const resolvedParams = await searchParams;
  const [posts, authors] = await Promise.all([
    getBlogPostsDb({
      category: resolvedParams.category,
      status: resolvedParams.status,
      search: resolvedParams.search,
    }),
    getProfilesOptions(),
  ]);

  return <BlogClientView initialPosts={posts} authors={authors} />;
}
