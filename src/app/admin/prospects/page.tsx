import React from 'react';
import { getOutreachProspects } from '@/lib/services/outreachService';
import { ProspectsView } from './ProspectsView';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Prospects | OneDot ABM' };

export default async function ProspectsPage() {
  return <ProspectsView initial={await getOutreachProspects()} />;
}
