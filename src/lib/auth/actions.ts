"use server";

import { redirect } from "next/navigation";
import { dbQuery } from "@/lib/db";
import {
  hashPassword,
  setAdminSession,
  clearAdminSession,
  getCurrentAdmin,
} from "@/lib/auth/adminAuth";
import { ProfileRecord, NotificationRecord } from "@/types/database";
import {
  logActivity,
  getNotifications,
  markNotificationRead,
} from "@/lib/services/activityService";

export interface LoginActionState {
  error?: string | null;
  success?: boolean;
}

export async function loginAdminAction(
  prevState: LoginActionState | null,
  formData: FormData
): Promise<LoginActionState> {
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Please provide both email and password." };
  }

  try {
    const res = await dbQuery<ProfileRecord>(
      `SELECT id, full_name, email, password_hash, role, avatar_url, phone, active, created_at, updated_at
       FROM public.profiles
       WHERE LOWER(email) = LOWER($1) AND active = true
       LIMIT 1`,
      [email]
    );

    const user = res.rows[0];

    if (!user || !user.password_hash) {
      return { error: "Invalid credentials or account inactive." };
    }

    const inputHash = hashPassword(password);
    if (inputHash !== user.password_hash) {
      return { error: "Invalid credentials. Please verify your password." };
    }

    await setAdminSession(user);

    await logActivity({
      actorId: user.id,
      actorName: user.full_name,
      action: "auth.login",
      entityType: "admin_session",
      entityId: user.id,
      entityTitle: `Admin login by ${user.full_name}`,
      metadata: { email: user.email, role: user.role },
    });
  } catch (err: unknown) {
    // If it's a redirect error thrown by Next.js, rethrow
    if (err && typeof err === "object" && "digest" in err) {
      throw err;
    }
    console.error("Login error:", err);
    return { error: "Authentication system error. Please try again." };
  }

  redirect("/admin/dashboard");
}

export async function logoutAdminAction(): Promise<void> {
  const admin = await getCurrentAdmin();
  if (admin) {
    await logActivity({
      actorId: admin.id,
      actorName: admin.full_name,
      action: "auth.logout",
      entityType: "admin_session",
      entityId: admin.id,
      entityTitle: `Admin logout by ${admin.full_name}`,
    });
  }
  await clearAdminSession();
  redirect("/admin/login");
}

export async function fetchAdminNotificationsAction(limit = 10): Promise<NotificationRecord[]> {
  try {
    const admin = await getCurrentAdmin();
    return await getNotifications(admin?.id, limit);
  } catch (err) {
    console.error("Failed to fetch notifications:", err);
    return [];
  }
}

export async function markAdminNotificationReadAction(id: string): Promise<boolean> {
  try {
    await markNotificationRead(id);
    return true;
  } catch (err) {
    console.error("Failed to mark notification as read:", err);
    return false;
  }
}
