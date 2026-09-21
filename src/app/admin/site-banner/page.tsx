import React from 'react';
import { getSiteBannerDb, getAllSiteBannersDb } from '@/lib/services/contentService';
import { SiteBannerClientView } from './SiteBannerClientView';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Site Banner Manager | OneDot ABM',
  description: 'Manage top announcement banner, emergency notices, and high-priority broadcasts.',
};

export default async function SiteBannerPage() {
  const [activeBanner, allBanners] = await Promise.all([
    getSiteBannerDb(),
    getAllSiteBannersDb(),
  ]);

  return (
    <SiteBannerClientView
      initialBanner={activeBanner}
      allBanners={allBanners}
    />
  );
}
