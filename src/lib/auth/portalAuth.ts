import crypto from 'crypto';
import { cookies } from 'next/headers';

// The client portal's session. Separate cookie and a separate HMAC context
// from the admin session, so one can never be replayed as the other.
const COOKIE = 'onedot_portal_session';
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

export type PortalSession = { kind: 'client' | 'project'; id: string };

function sign(payload: string): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error('ADMIN_SESSION_SECRET is not set.');
  return crypto.createHmac('sha256', secret).update(`portal:${payload}`).digest('base64url');
}

export async function setPortalSession(session: PortalSession): Promise<void> {
  const payload = Buffer.from(JSON.stringify({ ...session, iat: Date.now() })).toString('base64url');
  (await cookies()).set(COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function clearPortalSession(): Promise<void> {
  (await cookies()).delete(COOKIE);
}

export async function getPortalSession(): Promise<PortalSession | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  try {
    const [payload, mac] = token.split('.');
    if (!payload || !mac) return null;
    const expected = sign(payload);
    if (mac.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(mac), Buffer.from(expected))) return null;
    const s = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as PortalSession & { iat: number };
    const age = (Date.now() - s.iat) / 1000;
    if (!(age >= 0 && age <= MAX_AGE_SECONDS) || (s.kind !== 'client' && s.kind !== 'project')) return null;
    return { kind: s.kind, id: s.id };
  } catch {
    return null;
  }
}
