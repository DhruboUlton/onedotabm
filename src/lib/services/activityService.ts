import { dbQuery } from '@/lib/db';
import { ActivityRecord, NotificationRecord } from '@/types/database';

export async function logActivity(params: {
  actorId?: string | null;
  actorName?: string;
  action: string;
  entityType: string;
  entityId?: string | null;
  entityTitle?: string | null;
  metadata?: Record<string, unknown>;
}): Promise<void> {
  try {
    await dbQuery(
      `INSERT INTO public.activities (actor_id, actor_name, action, entity_type, entity_id, entity_title, metadata)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        params.actorId || null,
        params.actorName || 'System',
        params.action,
        params.entityType,
        params.entityId || null,
        params.entityTitle || null,
        JSON.stringify(params.metadata || {}),
      ]
    );
  } catch (err) {
    console.error('Failed to log activity:', err);
  }
}

export async function getRecentActivities(limit = 20): Promise<ActivityRecord[]> {
  const res = await dbQuery<ActivityRecord>(
    `SELECT * FROM public.activities ORDER BY created_at DESC LIMIT $1`,
    [limit]
  );
  return res.rows;
}

export async function createNotification(params: {
  userId?: string | null;
  title: string;
  message: string;
  type?: string;
  linkUrl?: string | null;
}): Promise<void> {
  try {
    await dbQuery(
      `INSERT INTO public.notifications (user_id, title, message, type, link_url)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        params.userId || null,
        params.title,
        params.message,
        params.type || 'info',
        params.linkUrl || null,
      ]
    );
  } catch (err) {
    console.error('Failed to create notification:', err);
  }
}

export async function getNotifications(userId?: string, limit = 10): Promise<NotificationRecord[]> {
  const res = await dbQuery<NotificationRecord>(
    `SELECT * FROM public.notifications 
     WHERE ($1::uuid IS NULL OR user_id = $1::uuid OR user_id IS NULL)
     ORDER BY created_at DESC LIMIT $2`,
    [userId || null, limit]
  );
  return res.rows;
}

export async function markNotificationRead(id: string): Promise<void> {
  await dbQuery(`UPDATE public.notifications SET read = true WHERE id = $1`, [id]);
}
