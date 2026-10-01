import React from 'react';
import { getAnalyticsOverview } from '@/lib/services/analyticsService';
import { getPageViewStats } from '@/lib/services/trackingService';
import { AnalyticsClient } from '@/components/admin/AnalyticsClient';
import { PageViewsPanel } from './PageViewsPanel';

export const dynamic = 'force-dynamic';

export default async function AdminAnalyticsPage() {
  const [overview, views] = await Promise.all([getAnalyticsOverview(), getPageViewStats()]);

  return (
    <div className="space-y-10">
      <PageViewsPanel stats={views} />
      <AnalyticsClient overview={overview} />
    </div>
  );
}
