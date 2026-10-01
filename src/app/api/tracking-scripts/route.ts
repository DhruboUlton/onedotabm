import { getEnabledTrackingScripts } from '@/lib/services/trackingService';

// Public: these scripts run in every visitor's browser anyway. Fetched by the
// page at runtime, rather than baked into the layout, so editing a script does
// not mean rebuilding every static page.
export async function GET() {
  const scripts = await getEnabledTrackingScripts();
  return Response.json(
    scripts.map(({ id, code, placement }) => ({ id, code, placement })),
    { headers: { 'Cache-Control': 'public, max-age=0, s-maxage=60, stale-while-revalidate=300' } }
  );
}
