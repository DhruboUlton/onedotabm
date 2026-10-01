'use server';

import { rateLimit } from '@/lib/rateLimit';
import { setPortalSession, clearPortalSession } from '@/lib/auth/portalAuth';
import { verifyPortalLogin } from '@/lib/services/portalService';

export async function portalLoginAction(email: string, code: string): Promise<{ ok: boolean; error?: string }> {
  if (!(await rateLimit('portal-login', 10, 600))) {
    return { ok: false, error: 'Too many attempts. Wait a few minutes and try again.' };
  }
  try {
    const session = await verifyPortalLogin(String(email ?? ''), String(code ?? ''));
    if (!session) return { ok: false, error: 'That email and credential do not match. Please check and try again.' };
    await setPortalSession(session);
    return { ok: true };
  } catch (e) {
    console.error('[portal login] failed', e);
    return { ok: false, error: 'Something went wrong. Please try again.' };
  }
}

export async function portalLogoutAction(): Promise<void> {
  await clearPortalSession();
}
