import React from 'react';
import { notFound } from 'next/navigation';
import { getClientById } from '@/lib/services/crmService';
import { ClientDetailClientView } from './ClientDetailClientView';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const client = await getClientById(id);
  return {
    title: client ? `${client.company_name} — Client 360° | OneDot CRM` : 'Client Not Found',
  };
}

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const client = await getClientById(id);

  if (!client) {
    notFound();
  }

  return <ClientDetailClientView client={client} />;
}
