import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import crypto from 'crypto';
import { dbQuery } from '@/lib/db';
import { ProfileRecord, UserRole } from '@/types/database';

const SESSION_COOKIE = 'onedot_admin_session';

export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export function createSessionToken(userId: string, role: string): string {
  const payload = JSON.stringify({ userId, role, iat: Date.now() });
  const encoded = Buffer.from(payload).toString('base64url');
  const secret = process.env.ADMIN_SESSION_SECRET || 'onedot_abm_secret_key_2026_production';
  const hmac = crypto.createHmac('sha256', secret).update(encoded).digest('base64url');
  return `${encoded}.${hmac}`;
}

export function verifySessionToken(token: string): { userId: string; role: string } | null {
  try {
    const [encoded, hmac] = token.split('.');
    if (!encoded || !hmac) return null;
    const secret = process.env.ADMIN_SESSION_SECRET || 'onedot_abm_secret_key_2026_production';
    const expected = crypto.createHmac('sha256', secret).update(encoded).digest('base64url');
    if (hmac !== expected) return null;
    const json = Buffer.from(encoded, 'base64url').toString('utf8');
    return JSON.parse(json);
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
    maxAge: 60 * 60 * 24 * 7, // 7 days
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
