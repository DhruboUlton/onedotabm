import React from 'react';
import { getAnalyticsOverview } from '@/lib/services/analyticsService';
import { AnalyticsClient } from '@/components/admin/AnalyticsClient';

export const dynamic = 'force-dynamic';

export default async function AdminAnalyticsPage() {
  const overview = await getAnalyticsOverview();

  return <AnalyticsClient overview={overview} />;
}
