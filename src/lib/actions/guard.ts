import { revalidatePath } from 'next/cache';
import { getCurrentAdmin } from '@/lib/auth/adminAuth';
import { ProfileRecord } from '@/types/database';

export interface ActionResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Every server action is a public POST endpoint, so each one must check the
 * session itself. Wrap the body in this: it refuses without an admin session,
 * turns a thrown error into { success: false, error }, and revalidates the
 * given paths on success.
 */
export async function adminAction<T>(
  fn: (admin: ProfileRecord) => Promise<T>,
  revalidate: string[] = []
): Promise<ActionResponse<T>> {
  const admin = await getCurrentAdmin();
  if (!admin) return { success: false, error: 'Unauthorized' };
  try {
    const data = await fn(admin);
    for (const path of revalidate) revalidatePath(path);
    return { success: true, data };
  } catch (error) {
    console.error('Admin action failed:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Something went wrong' };
  }
}

export function actorOf(admin: ProfileRecord) {
  return { id: admin.id, name: admin.full_name };
}
