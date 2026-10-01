import { headers } from 'next/headers';

const hits = new Map<string, number[]>();

/**
 * Sliding-window limit per client IP for public endpoints.
 * ponytail: in-memory per server instance, so a serverless deploy spreads the
 * budget across instances; move to a shared store (KV/Redis) if abuse shows up.
 */
export async function rateLimit(bucket: string, limit: number, windowSeconds: number): Promise<boolean> {
  const h = await headers();
  const ip = h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip') || 'unknown';
  const key = `${bucket}:${ip}`;
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowSeconds * 1000);
  if (recent.length >= limit) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);
  return true;
}
