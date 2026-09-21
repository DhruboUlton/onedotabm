import React from 'react';
import { getCompanySettings } from '@/lib/services/systemService';
import { SettingsClient } from '@/components/admin/SettingsClient';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  const settings = await getCompanySettings();

  return <SettingsClient initialSettings={settings} />;
}
