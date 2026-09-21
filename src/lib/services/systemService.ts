import { dbQuery } from '@/lib/db';
import {
  IntegrationRecord,
  ProfileRecord,
  UserRole,
  CompanySettingsRecord,
} from '@/types/database';
import { logActivity } from '@/lib/services/activityService';
import { hashPassword } from '@/lib/auth/adminAuth';

// ============================================================================
// INTEGRATIONS
// ============================================================================

export async function getIntegrations(): Promise<IntegrationRecord[]> {
  const res = await dbQuery<IntegrationRecord>(
    `SELECT * FROM public.integrations ORDER BY name ASC`
  );
  return res.rows;
}

export async function toggleIntegration(
  provider: string,
  status: 'connected' | 'disconnected' | 'error',
  config?: Record<string, unknown>
): Promise<IntegrationRecord> {
  let query: string;
  let params: any[];

  if (config) {
    query = `
      UPDATE public.integrations
      SET 
        status = $1, 
        config = config || $2::jsonb, 
        last_synced_at = CASE WHEN $1 = 'connected' THEN NOW() ELSE last_synced_at END,
        updated_at = NOW()
      WHERE provider = $3
      RETURNING *
    `;
    params = [status, JSON.stringify(config), provider];
  } else {
    query = `
      UPDATE public.integrations
      SET 
        status = $1, 
        last_synced_at = CASE WHEN $1 = 'connected' THEN NOW() ELSE last_synced_at END,
        updated_at = NOW()
      WHERE provider = $2
      RETURNING *
    `;
    params = [status, provider];
  }

  const res = await dbQuery<IntegrationRecord>(query, params);

  if (res.rows.length === 0) {
    throw new Error(`Integration provider not found: ${provider}`);
  }

  const updated = res.rows[0];

  await logActivity({
    action: `integration.${status}`,
    entityType: 'integration',
    entityId: updated.id,
    entityTitle: updated.name,
    metadata: { provider, status },
  });

  return updated;
}

export async function updateIntegrationConfig(
  provider: string,
  config: Record<string, unknown>
): Promise<IntegrationRecord> {
  const res = await dbQuery<IntegrationRecord>(
    `
    UPDATE public.integrations
    SET 
      config = $1::jsonb,
      updated_at = NOW()
    WHERE provider = $2
    RETURNING *
    `,
    [JSON.stringify(config), provider]
  );

  if (res.rows.length === 0) {
    throw new Error(`Integration provider not found: ${provider}`);
  }

  const updated = res.rows[0];

  await logActivity({
    action: 'integration.config_updated',
    entityType: 'integration',
    entityId: updated.id,
    entityTitle: updated.name,
    metadata: { provider },
  });

  return updated;
}

// ============================================================================
// TEAM MANAGEMENT
// ============================================================================

export async function getTeamMembers(): Promise<ProfileRecord[]> {
  const res = await dbQuery<ProfileRecord>(
    `
    SELECT id, auth_user_id, full_name, email, role, avatar_url, phone, active, created_at, updated_at
    FROM public.profiles
    ORDER BY (role = 'owner') DESC, role ASC, full_name ASC
    `
  );
  return res.rows;
}

export async function createTeamMember(data: {
  full_name: string;
  email: string;
  role: UserRole;
  phone?: string | null;
  active?: boolean;
  avatar_url?: string | null;
  password?: string;
}): Promise<ProfileRecord> {
  const passwordHash = data.password ? hashPassword(data.password) : hashPassword('onedot2026!');

  const res = await dbQuery<ProfileRecord>(
    `
    INSERT INTO public.profiles (
      full_name, email, password_hash, role, phone, avatar_url, active
    )
    VALUES ($1, $2, $3, $4, $5, $6, COALESCE($7, true))
    RETURNING id, auth_user_id, full_name, email, role, avatar_url, phone, active, created_at, updated_at
    `,
    [
      data.full_name,
      data.email.toLowerCase().trim(),
      passwordHash,
      data.role,
      data.phone || null,
      data.avatar_url || null,
      data.active !== undefined ? data.active : true,
    ]
  );

  const created = res.rows[0];

  await logActivity({
    action: 'team.member_created',
    entityType: 'profile',
    entityId: created.id,
    entityTitle: created.full_name,
    metadata: { email: created.email, role: created.role },
  });

  return created;
}

export async function updateTeamMember(
  id: string,
  data: {
    full_name?: string;
    email?: string;
    role?: UserRole;
    phone?: string | null;
    avatar_url?: string | null;
    active?: boolean;
    password?: string;
  }
): Promise<ProfileRecord> {
  const updates: string[] = [];
  const params: any[] = [];
  let paramIdx = 1;

  if (data.full_name !== undefined) {
    updates.push(`full_name = $${paramIdx++}`);
    params.push(data.full_name);
  }
  if (data.email !== undefined) {
    updates.push(`email = $${paramIdx++}`);
    params.push(data.email.toLowerCase().trim());
  }
  if (data.role !== undefined) {
    updates.push(`role = $${paramIdx++}`);
    params.push(data.role);
  }
  if (data.phone !== undefined) {
    updates.push(`phone = $${paramIdx++}`);
    params.push(data.phone);
  }
  if (data.avatar_url !== undefined) {
    updates.push(`avatar_url = $${paramIdx++}`);
    params.push(data.avatar_url);
  }
  if (data.active !== undefined) {
    updates.push(`active = $${paramIdx++}`);
    params.push(data.active);
  }
  if (data.password) {
    updates.push(`password_hash = $${paramIdx++}`);
    params.push(hashPassword(data.password));
  }

  updates.push(`updated_at = NOW()`);
  params.push(id);

  const query = `
    UPDATE public.profiles
    SET ${updates.join(', ')}
    WHERE id = $${paramIdx}
    RETURNING id, auth_user_id, full_name, email, role, avatar_url, phone, active, created_at, updated_at
  `;

  const res = await dbQuery<ProfileRecord>(query, params);

  if (res.rows.length === 0) {
    throw new Error(`Team member not found: ${id}`);
  }

  const updated = res.rows[0];

  await logActivity({
    action: 'team.member_updated',
    entityType: 'profile',
    entityId: updated.id,
    entityTitle: updated.full_name,
    metadata: { role: updated.role, active: updated.active },
  });

  return updated;
}

export async function deleteTeamMember(id: string): Promise<boolean> {
  // Prevent deleting the last owner
  const target = await dbQuery<ProfileRecord>('SELECT * FROM public.profiles WHERE id = $1', [id]);
  if (target.rows.length === 0) return false;

  if (target.rows[0].role === 'owner') {
    const ownerCount = await dbQuery<{ count: string }>(
      "SELECT count(*) FROM public.profiles WHERE role = 'owner'"
    );
    if (parseInt(ownerCount.rows[0].count, 10) <= 1) {
      throw new Error('Cannot delete the primary owner of OneDot ABM.');
    }
  }

  const res = await dbQuery('DELETE FROM public.profiles WHERE id = $1 RETURNING id', [id]);
  const deleted = (res.rowCount ?? 0) > 0;

  if (deleted) {
    await logActivity({
      action: 'team.member_deleted',
      entityType: 'profile',
      entityId: id,
      entityTitle: target.rows[0].full_name,
    });
  }

  return deleted;
}

// ============================================================================
// SETTINGS
// ============================================================================

export const DEFAULT_SETTINGS: CompanySettingsRecord = {
  company_name: 'OneDot ABM',
  tagline: 'Strategic Marketing & Custom Web Development',
  email: 'hello@onedotabm.com',
  phone: '+880 1700-000000',
  address: 'Gulshan-2, Dhaka 1212, Bangladesh',
  website: 'https://onedotabm.com',
  default_currency: 'BDT',
  tax_rate: 0.00,
  invoice_prefix: 'INV',
  quotation_prefix: 'Q',
  notify_email: 'dhrubo@onedotabm.com',
  notify_on_lead: true,
  notify_on_invoice: true,
  notify_on_payment: true,
};

export async function getCompanySettings(): Promise<CompanySettingsRecord> {
  try {
    const res = await dbQuery<CompanySettingsRecord>(
      `SELECT * FROM public.company_settings LIMIT 1`
    );

    if (res.rows.length > 0) {
      const row = res.rows[0];
      return {
        ...row,
        tax_rate: Number(row.tax_rate) || 0,
      };
    }

    // Insert default if table empty
    const insertRes = await dbQuery<CompanySettingsRecord>(
      `
      INSERT INTO public.company_settings (
        company_name, tagline, email, phone, address, website,
        default_currency, tax_rate, invoice_prefix, quotation_prefix,
        notify_email, notify_on_lead, notify_on_invoice, notify_on_payment
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *
      `,
      [
        DEFAULT_SETTINGS.company_name,
        DEFAULT_SETTINGS.tagline,
        DEFAULT_SETTINGS.email,
        DEFAULT_SETTINGS.phone,
        DEFAULT_SETTINGS.address,
        DEFAULT_SETTINGS.website,
        DEFAULT_SETTINGS.default_currency,
        DEFAULT_SETTINGS.tax_rate,
        DEFAULT_SETTINGS.invoice_prefix,
        DEFAULT_SETTINGS.quotation_prefix,
        DEFAULT_SETTINGS.notify_email,
        DEFAULT_SETTINGS.notify_on_lead,
        DEFAULT_SETTINGS.notify_on_invoice,
        DEFAULT_SETTINGS.notify_on_payment,
      ]
    );

    return {
      ...insertRes.rows[0],
      tax_rate: Number(insertRes.rows[0].tax_rate) || 0,
    };
  } catch (error) {
    console.error('Error fetching company settings, using fallback:', error);
    return DEFAULT_SETTINGS;
  }
}

export async function updateCompanySettings(
  data: Partial<CompanySettingsRecord>
): Promise<CompanySettingsRecord> {
  const current = await getCompanySettings();

  const updatedValues = {
    company_name: data.company_name ?? current.company_name,
    tagline: data.tagline ?? current.tagline,
    email: data.email ?? current.email,
    phone: data.phone ?? current.phone,
    address: data.address ?? current.address,
    website: data.website ?? current.website,
    default_currency: data.default_currency ?? current.default_currency,
    tax_rate: data.tax_rate !== undefined ? Number(data.tax_rate) : current.tax_rate,
    invoice_prefix: data.invoice_prefix ?? current.invoice_prefix,
    quotation_prefix: data.quotation_prefix ?? current.quotation_prefix,
    notify_email: data.notify_email ?? current.notify_email,
    notify_on_lead: data.notify_on_lead ?? current.notify_on_lead,
    notify_on_invoice: data.notify_on_invoice ?? current.notify_on_invoice,
    notify_on_payment: data.notify_on_payment ?? current.notify_on_payment,
  };

  const res = await dbQuery<CompanySettingsRecord>(
    `
    UPDATE public.company_settings
    SET
      company_name = $1,
      tagline = $2,
      email = $3,
      phone = $4,
      address = $5,
      website = $6,
      default_currency = $7,
      tax_rate = $8,
      invoice_prefix = $9,
      quotation_prefix = $10,
      notify_email = $11,
      notify_on_lead = $12,
      notify_on_invoice = $13,
      notify_on_payment = $14,
      updated_at = NOW()
    RETURNING *
    `,
    [
      updatedValues.company_name,
      updatedValues.tagline,
      updatedValues.email,
      updatedValues.phone,
      updatedValues.address,
      updatedValues.website,
      updatedValues.default_currency,
      updatedValues.tax_rate,
      updatedValues.invoice_prefix,
      updatedValues.quotation_prefix,
      updatedValues.notify_email,
      updatedValues.notify_on_lead,
      updatedValues.notify_on_invoice,
      updatedValues.notify_on_payment,
    ]
  );

  const updated = res.rows[0] || updatedValues;

  await logActivity({
    action: 'settings.updated',
    entityType: 'settings',
    entityTitle: 'Company Configuration',
    metadata: { updated_by: 'Admin' },
  });

  return {
    ...updated,
    tax_rate: Number(updated.tax_rate) || 0,
  };
}
