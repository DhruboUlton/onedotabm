import { redirect } from 'next/navigation';

export default async function AdpnRedirectPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  const path = slug && slug.length > 0 ? `/${slug.join('/')}` : '';
  redirect(`/webapp-demo/ecommerce/demo-02/admin${path}`);
}
