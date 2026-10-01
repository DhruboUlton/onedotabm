import React from 'react';
import { getIntegrations } from '@/lib/services/systemService';
import { getTrackingScripts } from '@/lib/services/trackingService';
import { IntegrationsClient } from '@/components/admin/IntegrationsClient';
import { TrackingScriptsPanel } from './TrackingScriptsPanel';

export const dynamic = 'force-dynamic';

export default async function AdminIntegrationsPage() {
  const [integrations, scripts] = await Promise.all([getIntegrations(), getTrackingScripts()]);

  return (
    <div className="space-y-10">
      <TrackingScriptsPanel initial={scripts} />
      <IntegrationsClient integrations={integrations} />
    </div>
  );
}
