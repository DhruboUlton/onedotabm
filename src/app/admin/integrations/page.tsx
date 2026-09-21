import React from 'react';
import { getIntegrations } from '@/lib/services/systemService';
import { IntegrationsClient } from '@/components/admin/IntegrationsClient';

export const dynamic = 'force-dynamic';

export default async function AdminIntegrationsPage() {
  const integrations = await getIntegrations();

  return <IntegrationsClient integrations={integrations} />;
}
