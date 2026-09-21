import React from 'react';
import { getLogosDb } from '@/lib/services/contentService';
import { LogosClientView } from './LogosClientView';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Client Logos Cloud | OneDot ABM',
  description: 'Manage trusted client badges, brand collaborations, and homepage social proof cloud.',
};

export default async function LogosPage() {
  const logos = await getLogosDb();
  return <LogosClientView initialLogos={logos} />;
}
