import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import crypto from 'crypto';
import { dbQuery } from '@/lib/db';
import { ProfileRecord, UserRole } from '@/types/database';

const SESSION_COOKIE = 'onedot_admin_session';
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

/**
 * Required — a hardcoded fallback here would mean anyone who reads this file
 * (or the public repo) can mint a valid owner session. Set it once:
 *   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
 */
function getSessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error(
      'ADMIN_SESSION_SECRET is not set. Admin auth is disabled until it is configured — see .env.local.'
    );
  }
  return secret;
}

// ── Password hashing ────────────────────────────────────────────────────────
// scrypt (Node stdlib, no dependency) with a random salt per password, stored
// as "salt:hash". Existing accounts still carry the old unsalted-SHA-256
// format (64 hex chars, no ':') from before this fix; verifyPassword accepts
// both and re-hashes to the new format on successful legacy login, so every
// account migrates itself the next time it signs in — no data migration to run.
const SCRYPT_KEYLEN = 64;

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, SCRYPT_KEYLEN).toString('hex');
  return `${salt}:${hash}`;
}

function isLegacySha256(hash: string): boolean {
  return /^[0-9a-f]{64}$/i.test(hash);
}

export function verifyPassword(password: string, storedHash: string): boolean {
  if (isLegacySha256(storedHash)) {
    const candidate = crypto.createHash('sha256').update(password).digest('hex');
    return crypto.timingSafeEqual(Buffer.from(candidate), Buffer.from(storedHash));
  }

  const [salt, hash] = storedHash.split(':');
  if (!salt || !hash) return false;
  const candidate = crypto.scryptSync(password, salt, SCRYPT_KEYLEN);
  const expected = Buffer.from(hash, 'hex');
  if (candidate.length !== expected.length) return false;
  return crypto.timingSafeEqual(candidate, expected);
}

// ── Session tokens ───────────────────────────────────────────────────────────
export function createSessionToken(userId: string, role: string): string {
  const payload = JSON.stringify({ userId, role, iat: Date.now() });
  const encoded = Buffer.from(payload).toString('base64url');
  const hmac = crypto.createHmac('sha256', getSessionSecret()).update(encoded).digest('base64url');
  return `${encoded}.${hmac}`;
}

export function verifySessionToken(token: string): { userId: string; role: string } | null {
  try {
    const [encoded, hmac] = token.split('.');
    if (!encoded || !hmac) return null;
    const expected = crypto.createHmac('sha256', getSessionSecret()).update(encoded).digest('base64url');
    const a = Buffer.from(hmac);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;

    const json = Buffer.from(encoded, 'base64url').toString('utf8');
    const session = JSON.parse(json) as { userId: string; role: string; iat: number };

    // A copied/leaked token should stop working once the session's own
    // lifetime elapses, not live forever independent of the cookie's maxAge.
    const ageSeconds = (Date.now() - session.iat) / 1000;
    if (!Number.isFinite(session.iat) || ageSeconds > SESSION_MAX_AGE_SECONDS || ageSeconds < 0) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

export async function getCurrentAdmin(): Promise<ProfileRecord | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = verifySessionToken(token);
  if (!session) return null;

  const res = await dbQuery<ProfileRecord>(
    'SELECT id, full_name, email, role, avatar_url, phone, active, created_at, updated_at FROM public.profiles WHERE id = $1 AND active = true',
    [session.userId]
  );

  return res.rows[0] || null;
}

export async function requireAdmin(): Promise<ProfileRecord> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect('/admin/login');
  }
  return admin;
}

export async function setAdminSession(profile: ProfileRecord) {
  const token = createSessionToken(profile.id, profile.role);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export function hasPermission(role: UserRole, permission: string): boolean {
  if (role === 'owner' || role === 'admin') return true;

  const permissionsMap: Record<UserRole, string[]> = {
    owner: ['*'],
    admin: ['*'],
    manager: [
      'leads.view', 'leads.create', 'leads.edit',
      'prospects.view', 'prospects.create', 'prospects.edit',
      'clients.view', 'clients.create', 'clients.edit',
      'projects.view', 'projects.create', 'projects.edit',
      'websites.view', 'websites.create', 'websites.edit',
      'quotations.view', 'quotations.create', 'quotations.edit',
      'billing.view',
      'content.view', 'content.create', 'content.edit',
      'analytics.view'
    ],
    marketing: [
      'leads.view', 'leads.create', 'leads.edit',
      'prospects.view',
      'content.view', 'content.create', 'content.edit',
      'analytics.view'
    ],
    developer: [
      'projects.view', 'projects.edit',
      'websites.view', 'websites.edit',
      'tasks.view', 'tasks.edit'
    ],
    finance: [
      'clients.view',
      'quotations.view', 'quotations.create', 'quotations.edit',
      'billing.view', 'billing.create', 'billing.edit',
      'analytics.view'
    ],
    editor: [
      'content.view', 'content.create', 'content.edit'
    ]
  };

  const allowed = permissionsMap[role] || [];
  return allowed.includes('*') || allowed.includes(permission);
}
