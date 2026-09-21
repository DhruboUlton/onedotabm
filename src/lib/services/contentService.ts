import { dbQuery } from '@/lib/db';
import {
  PortfolioItemRecord,
  CaseStudyRecord,
  BlogPostRecord,
  LogoRecord,
  SiteBannerRecord,
  ContentStatus,
} from '@/types/database';
import { logActivity } from '@/lib/services/activityService';

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// ============================================================================
// 1. PORTFOLIO
// ============================================================================

export async function getPortfolioItems(filter?: {
  category?: string;
  published?: boolean;
  search?: string;
}): Promise<PortfolioItemRecord[]> {
  const categoryParam = filter?.category && filter.category !== 'all' ? filter.category : null;
  const publishedParam = typeof filter?.published === 'boolean' ? filter.published : null;
  const searchParam = filter?.search?.trim() ? filter.search.trim() : null;

  const res = await dbQuery<PortfolioItemRecord>(
    `SELECT 
       p.id,
       p.title,
       p.slug,
       p.client_id,
       p.category,
       p.description,
       p.featured_image,
       p.gallery,
       p.services,
       p.technologies,
       p.project_url,
       p.completion_date::text,
       p.featured,
       p.published,
       p.sort_order,
       p.created_at::text,
       p.updated_at::text,
       c.company_name AS client_name
     FROM public.portfolio_items p
     LEFT JOIN public.clients c ON c.id = p.client_id
     WHERE ($1::text IS NULL OR p.category = $1)
       AND ($2::boolean IS NULL OR p.published = $2)
       AND ($3::text IS NULL OR (p.title ILIKE '%' || $3 || '%' OR p.description ILIKE '%' || $3 || '%'))
     ORDER BY p.sort_order ASC, p.created_at DESC`,
    [categoryParam, publishedParam, searchParam]
  );

  return res.rows;
}

export async function getPortfolioItemById(id: string): Promise<PortfolioItemRecord | null> {
  const res = await dbQuery<PortfolioItemRecord>(
    `SELECT 
       p.id,
       p.title,
       p.slug,
       p.client_id,
       p.category,
       p.description,
       p.featured_image,
       p.gallery,
       p.services,
       p.technologies,
       p.project_url,
       p.completion_date::text,
       p.featured,
       p.published,
       p.sort_order,
       p.created_at::text,
       p.updated_at::text,
       c.company_name AS client_name
     FROM public.portfolio_items p
     LEFT JOIN public.clients c ON c.id = p.client_id
     WHERE p.id = $1::uuid OR p.slug = $1`,
    [id]
  );

  return res.rows[0] || null;
}

export async function createPortfolioItem(
  data: {
    title: string;
    slug?: string;
    client_id?: string | null;
    category: string;
    description?: string | null;
    featured_image?: string | null;
    gallery?: string[];
    services?: string[];
    technologies?: string[];
    project_url?: string | null;
    completion_date?: string | null;
    featured?: boolean;
    published?: boolean;
    sort_order?: number;
  },
  actor?: { id?: string; name?: string }
): Promise<PortfolioItemRecord> {
  const finalSlug = data.slug?.trim() ? slugify(data.slug) : slugify(data.title);

  const res = await dbQuery<PortfolioItemRecord>(
    `INSERT INTO public.portfolio_items (
       title,
       slug,
       client_id,
       category,
       description,
       featured_image,
       gallery,
       services,
       technologies,
       project_url,
       completion_date,
       featured,
       published,
       sort_order
     ) VALUES (
       $1,
       $2,
       $3::uuid,
       $4,
       $5,
       $6,
       COALESCE($7, '{}'),
       COALESCE($8, '{}'),
       COALESCE($9, '{}'),
       $10,
       $11::date,
       COALESCE($12, false),
       COALESCE($13, true),
       COALESCE($14, 0)
     ) RETURNING *`,
    [
      data.title,
      finalSlug,
      data.client_id || null,
      data.category,
      data.description || null,
      data.featured_image || null,
      data.gallery || [],
      data.services || [],
      data.technologies || [],
      data.project_url || null,
      data.completion_date || null,
      data.featured ?? false,
      data.published ?? true,
      data.sort_order ?? 0,
    ]
  );

  const created = res.rows[0];

  await logActivity({
    actorId: actor?.id,
    actorName: actor?.name || 'Admin',
    action: 'created_portfolio_item',
    entityType: 'portfolio_item',
    entityId: created.id,
    entityTitle: created.title,
    metadata: { category: created.category, slug: created.slug },
  });

  return created;
}

export async function updatePortfolioItem(
  id: string,
  data: Partial<PortfolioItemRecord>,
  actor?: { id?: string; name?: string }
): Promise<PortfolioItemRecord> {
  const finalSlug = data.slug !== undefined ? (data.slug ? slugify(data.slug) : null) : undefined;

  const res = await dbQuery<PortfolioItemRecord>(
    `UPDATE public.portfolio_items SET
       title = COALESCE($1, title),
       slug = CASE WHEN $2 IS NOT NULL THEN $2 ELSE slug END,
       client_id = CASE WHEN $3 IS NOT NULL THEN $3::uuid ELSE client_id END,
       category = COALESCE($4, category),
       description = CASE WHEN $5 IS NOT NULL THEN $5 ELSE description END,
       featured_image = CASE WHEN $6 IS NOT NULL THEN $6 ELSE featured_image END,
       gallery = COALESCE($7, gallery),
       services = COALESCE($8, services),
       technologies = COALESCE($9, technologies),
       project_url = CASE WHEN $10 IS NOT NULL THEN $10 ELSE project_url END,
       completion_date = CASE WHEN $11 IS NOT NULL THEN $11::date ELSE completion_date END,
       featured = COALESCE($12, featured),
       published = COALESCE($13, published),
       sort_order = COALESCE($14, sort_order),
       updated_at = NOW()
     WHERE id = $15::uuid
     RETURNING *`,
    [
      data.title ?? null,
      finalSlug,
      data.client_id !== undefined ? data.client_id : null,
      data.category ?? null,
      data.description !== undefined ? data.description : null,
      data.featured_image !== undefined ? data.featured_image : null,
      data.gallery ?? null,
      data.services ?? null,
      data.technologies ?? null,
      data.project_url !== undefined ? data.project_url : null,
      data.completion_date !== undefined ? data.completion_date : null,
      data.featured ?? null,
      data.published ?? null,
      data.sort_order ?? null,
      id,
    ]
  );

  if (res.rows.length === 0) {
    throw new Error(`Portfolio item ${id} not found`);
  }

  const updated = res.rows[0];

  await logActivity({
    actorId: actor?.id,
    actorName: actor?.name || 'Admin',
    action: 'updated_portfolio_item',
    entityType: 'portfolio_item',
    entityId: updated.id,
    entityTitle: updated.title,
    metadata: { published: updated.published },
  });

  return updated;
}

export async function deletePortfolioItem(
  id: string,
  actor?: { id?: string; name?: string }
): Promise<boolean> {
  const res = await dbQuery<{ id: string; title: string }>(
    `DELETE FROM public.portfolio_items WHERE id = $1::uuid RETURNING id, title`,
    [id]
  );

  if (res.rows.length > 0) {
    await logActivity({
      actorId: actor?.id,
      actorName: actor?.name || 'Admin',
      action: 'deleted_portfolio_item',
      entityType: 'portfolio_item',
      entityId: id,
      entityTitle: res.rows[0].title,
    });
    return true;
  }
  return false;
}

// ============================================================================
// 2. CASE STUDIES
// ============================================================================

export async function getCaseStudiesDb(filter?: {
  status?: string;
  search?: string;
}): Promise<CaseStudyRecord[]> {
  const statusParam = filter?.status && filter.status !== 'all' ? filter.status : null;
  const searchParam = filter?.search?.trim() ? filter.search.trim() : null;

  const res = await dbQuery<CaseStudyRecord>(
    `SELECT 
       id,
       title,
       slug,
       client_id,
       client_name,
       industry,
       challenge,
       strategy,
       execution,
       result,
       services,
       hero_metric_value,
       hero_metric_label,
       metrics,
       images,
       testimonial,
       status,
       featured,
       created_at::text,
       updated_at::text
     FROM public.case_studies
     WHERE ($1::text IS NULL OR status::text = $1)
       AND ($2::text IS NULL OR (title ILIKE '%' || $2 || '%' OR client_name ILIKE '%' || $2 || '%' OR industry ILIKE '%' || $2 || '%'))
     ORDER BY created_at DESC`,
    [statusParam, searchParam]
  );

  return res.rows.map((row) => ({
    ...row,
    metrics: typeof row.metrics === 'string' ? JSON.parse(row.metrics) : row.metrics || [],
  }));
}

export async function getCaseStudyDbById(id: string): Promise<CaseStudyRecord | null> {
  const res = await dbQuery<CaseStudyRecord>(
    `SELECT 
       id,
       title,
       slug,
       client_id,
       client_name,
       industry,
       challenge,
       strategy,
       execution,
       result,
       services,
       hero_metric_value,
       hero_metric_label,
       metrics,
       images,
       testimonial,
       status,
       featured,
       created_at::text,
       updated_at::text
     FROM public.case_studies
     WHERE id = $1::uuid OR slug = $1`,
    [id]
  );

  if (res.rows.length === 0) return null;

  const row = res.rows[0];
  return {
    ...row,
    metrics: typeof row.metrics === 'string' ? JSON.parse(row.metrics) : row.metrics || [],
  };
}

export async function createCaseStudyDb(
  data: {
    title: string;
    slug?: string;
    client_id?: string | null;
    client_name: string;
    industry: string;
    challenge: string;
    strategy: string;
    execution: string;
    result: string;
    services?: string[];
    hero_metric_value?: string | null;
    hero_metric_label?: string | null;
    metrics?: Array<{ metric: string; label: string; detail?: string }>;
    images?: string[];
    testimonial?: string | null;
    status?: ContentStatus;
    featured?: boolean;
  },
  actor?: { id?: string; name?: string }
): Promise<CaseStudyRecord> {
  const finalSlug = data.slug?.trim() ? slugify(data.slug) : slugify(data.title);
  const metricsJson = JSON.stringify(data.metrics || []);

  const res = await dbQuery<CaseStudyRecord>(
    `INSERT INTO public.case_studies (
       title,
       slug,
       client_id,
       client_name,
       industry,
       challenge,
       strategy,
       execution,
       result,
       services,
       hero_metric_value,
       hero_metric_label,
       metrics,
       images,
       testimonial,
       status,
       featured
     ) VALUES (
       $1,
       $2,
       $3::uuid,
       $4,
       $5,
       $6,
       $7,
       $8,
       $9,
       COALESCE($10, '{}'),
       $11,
       $12,
       $13::jsonb,
       COALESCE($14, '{}'),
       $15,
       COALESCE($16::content_status_enum, 'published'),
       COALESCE($17, false)
     ) RETURNING *`,
    [
      data.title,
      finalSlug,
      data.client_id || null,
      data.client_name,
      data.industry,
      data.challenge,
      data.strategy,
      data.execution,
      data.result,
      data.services || [],
      data.hero_metric_value || null,
      data.hero_metric_label || null,
      metricsJson,
      data.images || [],
      data.testimonial || null,
      data.status || 'published',
      data.featured ?? false,
    ]
  );

  const created = res.rows[0];

  await logActivity({
    actorId: actor?.id,
    actorName: actor?.name || 'Admin',
    action: 'created_case_study',
    entityType: 'case_study',
    entityId: created.id,
    entityTitle: created.title,
    metadata: { client: created.client_name, industry: created.industry },
  });

  return {
    ...created,
    metrics: typeof created.metrics === 'string' ? JSON.parse(created.metrics) : created.metrics || [],
  };
}

export async function updateCaseStudyDb(
  id: string,
  data: Partial<CaseStudyRecord>,
  actor?: { id?: string; name?: string }
): Promise<CaseStudyRecord> {
  const finalSlug = data.slug !== undefined ? (data.slug ? slugify(data.slug) : null) : undefined;
  const metricsJson = data.metrics !== undefined ? JSON.stringify(data.metrics) : undefined;

  const res = await dbQuery<CaseStudyRecord>(
    `UPDATE public.case_studies SET
       title = COALESCE($1, title),
       slug = CASE WHEN $2 IS NOT NULL THEN $2 ELSE slug END,
       client_id = CASE WHEN $3 IS NOT NULL THEN $3::uuid ELSE client_id END,
       client_name = COALESCE($4, client_name),
       industry = COALESCE($5, industry),
       challenge = COALESCE($6, challenge),
       strategy = COALESCE($7, strategy),
       execution = COALESCE($8, execution),
       result = COALESCE($9, result),
       services = COALESCE($10, services),
       hero_metric_value = CASE WHEN $11 IS NOT NULL THEN $11 ELSE hero_metric_value END,
       hero_metric_label = CASE WHEN $12 IS NOT NULL THEN $12 ELSE hero_metric_label END,
       metrics = CASE WHEN $13 IS NOT NULL THEN $13::jsonb ELSE metrics END,
       images = COALESCE($14, images),
       testimonial = CASE WHEN $15 IS NOT NULL THEN $15 ELSE testimonial END,
       status = COALESCE($16::content_status_enum, status),
       featured = COALESCE($17, featured),
       updated_at = NOW()
     WHERE id = $18::uuid
     RETURNING *`,
    [
      data.title ?? null,
      finalSlug,
      data.client_id !== undefined ? data.client_id : null,
      data.client_name ?? null,
      data.industry ?? null,
      data.challenge ?? null,
      data.strategy ?? null,
      data.execution ?? null,
      data.result ?? null,
      data.services ?? null,
      data.hero_metric_value !== undefined ? data.hero_metric_value : null,
      data.hero_metric_label !== undefined ? data.hero_metric_label : null,
      metricsJson,
      data.images ?? null,
      data.testimonial !== undefined ? data.testimonial : null,
      data.status ?? null,
      data.featured ?? null,
      id,
    ]
  );

  if (res.rows.length === 0) {
    throw new Error(`Case study ${id} not found`);
  }

  const updated = res.rows[0];

  await logActivity({
    actorId: actor?.id,
    actorName: actor?.name || 'Admin',
    action: 'updated_case_study',
    entityType: 'case_study',
    entityId: updated.id,
    entityTitle: updated.title,
    metadata: { status: updated.status },
  });

  return {
    ...updated,
    metrics: typeof updated.metrics === 'string' ? JSON.parse(updated.metrics) : updated.metrics || [],
  };
}

export async function deleteCaseStudyDb(
  id: string,
  actor?: { id?: string; name?: string }
): Promise<boolean> {
  const res = await dbQuery<{ id: string; title: string }>(
    `DELETE FROM public.case_studies WHERE id = $1::uuid RETURNING id, title`,
    [id]
  );

  if (res.rows.length > 0) {
    await logActivity({
      actorId: actor?.id,
      actorName: actor?.name || 'Admin',
      action: 'deleted_case_study',
      entityType: 'case_study',
      entityId: id,
      entityTitle: res.rows[0].title,
    });
    return true;
  }
  return false;
}

// ============================================================================
// 3. BLOG POSTS
// ============================================================================

export async function getBlogPostsDb(filter?: {
  category?: string;
  status?: string;
  search?: string;
}): Promise<BlogPostRecord[]> {
  const categoryParam = filter?.category && filter.category !== 'all' ? filter.category : null;
  const statusParam = filter?.status && filter.status !== 'all' ? filter.status : null;
  const searchParam = filter?.search?.trim() ? filter.search.trim() : null;

  const res = await dbQuery<BlogPostRecord & { author_name?: string }>(
    `SELECT 
       b.id,
       b.title,
       b.slug,
       b.excerpt,
       b.content,
       b.featured_image,
       b.author_id,
       b.category,
       b.tags,
       b.seo_title,
       b.seo_description,
       b.canonical_url,
       b.published_at::text,
       b.status,
       b.created_at::text,
       b.updated_at::text,
       p.full_name AS author_name
     FROM public.blog_posts b
     LEFT JOIN public.profiles p ON p.id = b.author_id
     WHERE ($1::text IS NULL OR b.category = $1)
       AND ($2::text IS NULL OR b.status::text = $2)
       AND ($3::text IS NULL OR (b.title ILIKE '%' || $3 || '%' OR b.excerpt ILIKE '%' || $3 || '%' OR b.content ILIKE '%' || $3 || '%'))
     ORDER BY b.created_at DESC`,
    [categoryParam, statusParam, searchParam]
  );

  return res.rows;
}

export async function getBlogPostDbById(id: string): Promise<BlogPostRecord | null> {
  const res = await dbQuery<BlogPostRecord & { author_name?: string }>(
    `SELECT 
       b.id,
       b.title,
       b.slug,
       b.excerpt,
       b.content,
       b.featured_image,
       b.author_id,
       b.category,
       b.tags,
       b.seo_title,
       b.seo_description,
       b.canonical_url,
       b.published_at::text,
       b.status,
       b.created_at::text,
       b.updated_at::text,
       p.full_name AS author_name
     FROM public.blog_posts b
     LEFT JOIN public.profiles p ON p.id = b.author_id
     WHERE b.id = $1::uuid OR b.slug = $1`,
    [id]
  );

  return res.rows[0] || null;
}

export async function createBlogPostDb(
  data: {
    title: string;
    slug?: string;
    excerpt?: string | null;
    content: string;
    featured_image?: string | null;
    author_id?: string | null;
    category?: string;
    tags?: string[];
    seo_title?: string | null;
    seo_description?: string | null;
    canonical_url?: string | null;
    published_at?: string | null;
    status?: ContentStatus;
  },
  actor?: { id?: string; name?: string }
): Promise<BlogPostRecord> {
  const finalSlug = data.slug?.trim() ? slugify(data.slug) : slugify(data.title);
  const status = data.status || 'draft';
  const publishedAt =
    status === 'published'
      ? data.published_at || new Date().toISOString()
      : data.published_at || null;

  const res = await dbQuery<BlogPostRecord>(
    `INSERT INTO public.blog_posts (
       title,
       slug,
       excerpt,
       content,
       featured_image,
       author_id,
       category,
       tags,
       seo_title,
       seo_description,
       canonical_url,
       published_at,
       status
     ) VALUES (
       $1,
       $2,
       $3,
       $4,
       $5,
       $6::uuid,
       COALESCE($7, 'Marketing'),
       COALESCE($8, '{}'),
       $9,
       $10,
       $11,
       $12::timestamptz,
       COALESCE($13::content_status_enum, 'draft')
     ) RETURNING *`,
    [
      data.title,
      finalSlug,
      data.excerpt || null,
      data.content,
      data.featured_image || null,
      data.author_id || null,
      data.category || 'Marketing',
      data.tags || [],
      data.seo_title || null,
      data.seo_description || null,
      data.canonical_url || null,
      publishedAt,
      status,
    ]
  );

  const created = res.rows[0];

  await logActivity({
    actorId: actor?.id,
    actorName: actor?.name || 'Admin',
    action: 'created_blog_post',
    entityType: 'blog_post',
    entityId: created.id,
    entityTitle: created.title,
    metadata: { status: created.status, slug: created.slug },
  });

  return created;
}

export async function updateBlogPostDb(
  id: string,
  data: Partial<BlogPostRecord>,
  actor?: { id?: string; name?: string }
): Promise<BlogPostRecord> {
  const finalSlug = data.slug !== undefined ? (data.slug ? slugify(data.slug) : null) : undefined;

  // If status is updated to published, ensure published_at is set
  let publishedAt = data.published_at;
  if (data.status === 'published' && !data.published_at) {
    publishedAt = new Date().toISOString();
  }

  const res = await dbQuery<BlogPostRecord>(
    `UPDATE public.blog_posts SET
       title = COALESCE($1, title),
       slug = CASE WHEN $2 IS NOT NULL THEN $2 ELSE slug END,
       excerpt = CASE WHEN $3 IS NOT NULL THEN $3 ELSE excerpt END,
       content = COALESCE($4, content),
       featured_image = CASE WHEN $5 IS NOT NULL THEN $5 ELSE featured_image END,
       author_id = CASE WHEN $6 IS NOT NULL THEN $6::uuid ELSE author_id END,
       category = COALESCE($7, category),
       tags = COALESCE($8, tags),
       seo_title = CASE WHEN $9 IS NOT NULL THEN $9 ELSE seo_title END,
       seo_description = CASE WHEN $10 IS NOT NULL THEN $10 ELSE seo_description END,
       canonical_url = CASE WHEN $11 IS NOT NULL THEN $11 ELSE canonical_url END,
       published_at = CASE WHEN $12 IS NOT NULL THEN $12::timestamptz ELSE published_at END,
       status = COALESCE($13::content_status_enum, status),
       updated_at = NOW()
     WHERE id = $14::uuid
     RETURNING *`,
    [
      data.title ?? null,
      finalSlug,
      data.excerpt !== undefined ? data.excerpt : null,
      data.content ?? null,
      data.featured_image !== undefined ? data.featured_image : null,
      data.author_id !== undefined ? data.author_id : null,
      data.category ?? null,
      data.tags ?? null,
      data.seo_title !== undefined ? data.seo_title : null,
      data.seo_description !== undefined ? data.seo_description : null,
      data.canonical_url !== undefined ? data.canonical_url : null,
      publishedAt !== undefined ? publishedAt : null,
      data.status ?? null,
      id,
    ]
  );

  if (res.rows.length === 0) {
    throw new Error(`Blog post ${id} not found`);
  }

  const updated = res.rows[0];

  await logActivity({
    actorId: actor?.id,
    actorName: actor?.name || 'Admin',
    action: 'updated_blog_post',
    entityType: 'blog_post',
    entityId: updated.id,
    entityTitle: updated.title,
    metadata: { status: updated.status },
  });

  return updated;
}

export async function deleteBlogPostDb(
  id: string,
  actor?: { id?: string; name?: string }
): Promise<boolean> {
  const res = await dbQuery<{ id: string; title: string }>(
    `DELETE FROM public.blog_posts WHERE id = $1::uuid RETURNING id, title`,
    [id]
  );

  if (res.rows.length > 0) {
    await logActivity({
      actorId: actor?.id,
      actorName: actor?.name || 'Admin',
      action: 'deleted_blog_post',
      entityType: 'blog_post',
      entityId: id,
      entityTitle: res.rows[0].title,
    });
    return true;
  }
  return false;
}

// ============================================================================
// 4. LOGOS
// ============================================================================

export async function getLogosDb(filter?: {
  category?: string;
  published?: boolean;
}): Promise<LogoRecord[]> {
  const categoryParam = filter?.category && filter.category !== 'all' ? filter.category : null;
  const publishedParam = typeof filter?.published === 'boolean' ? filter.published : null;

  const res = await dbQuery<LogoRecord>(
    `SELECT 
       id,
       company_name,
       logo_url,
       website,
       category,
       featured,
       display_order,
       published,
       created_at::text,
       updated_at::text
     FROM public.logos
     WHERE ($1::text IS NULL OR category = $1)
       AND ($2::boolean IS NULL OR published = $2)
     ORDER BY display_order ASC, created_at DESC`,
    [categoryParam, publishedParam]
  );

  return res.rows;
}

export async function createLogoDb(
  data: {
    company_name: string;
    logo_url: string;
    website?: string | null;
    category?: string;
    featured?: boolean;
    display_order?: number;
    published?: boolean;
  },
  actor?: { id?: string; name?: string }
): Promise<LogoRecord> {
  const res = await dbQuery<LogoRecord>(
    `INSERT INTO public.logos (
       company_name,
       logo_url,
       website,
       category,
       featured,
       display_order,
       published
     ) VALUES (
       $1,
       $2,
       $3,
       COALESCE($4, 'Client'),
       COALESCE($5, true),
       COALESCE($6, 0),
       COALESCE($7, true)
     ) RETURNING *`,
    [
      data.company_name,
      data.logo_url,
      data.website || null,
      data.category || 'Client',
      data.featured ?? true,
      data.display_order ?? 0,
      data.published ?? true,
    ]
  );

  const created = res.rows[0];

  await logActivity({
    actorId: actor?.id,
    actorName: actor?.name || 'Admin',
    action: 'created_logo',
    entityType: 'logo',
    entityId: created.id,
    entityTitle: created.company_name,
    metadata: { displayOrder: created.display_order },
  });

  return created;
}

export async function updateLogoDb(
  id: string,
  data: Partial<LogoRecord>,
  actor?: { id?: string; name?: string }
): Promise<LogoRecord> {
  const res = await dbQuery<LogoRecord>(
    `UPDATE public.logos SET
       company_name = COALESCE($1, company_name),
       logo_url = COALESCE($2, logo_url),
       website = CASE WHEN $3 IS NOT NULL THEN $3 ELSE website END,
       category = COALESCE($4, category),
       featured = COALESCE($5, featured),
       display_order = COALESCE($6, display_order),
       published = COALESCE($7, published),
       updated_at = NOW()
     WHERE id = $8::uuid
     RETURNING *`,
    [
      data.company_name ?? null,
      data.logo_url ?? null,
      data.website !== undefined ? data.website : null,
      data.category ?? null,
      data.featured ?? null,
      data.display_order !== undefined ? data.display_order : null,
      data.published ?? null,
      id,
    ]
  );

  if (res.rows.length === 0) {
    throw new Error(`Logo ${id} not found`);
  }

  const updated = res.rows[0];

  await logActivity({
    actorId: actor?.id,
    actorName: actor?.name || 'Admin',
    action: 'updated_logo',
    entityType: 'logo',
    entityId: updated.id,
    entityTitle: updated.company_name,
  });

  return updated;
}

export async function deleteLogoDb(
  id: string,
  actor?: { id?: string; name?: string }
): Promise<boolean> {
  const res = await dbQuery<{ id: string; company_name: string }>(
    `DELETE FROM public.logos WHERE id = $1::uuid RETURNING id, company_name`,
    [id]
  );

  if (res.rows.length > 0) {
    await logActivity({
      actorId: actor?.id,
      actorName: actor?.name || 'Admin',
      action: 'deleted_logo',
      entityType: 'logo',
      entityId: id,
      entityTitle: res.rows[0].company_name,
    });
    return true;
  }
  return false;
}

// ============================================================================
// 5. SITE BANNER
// ============================================================================

export async function getSiteBannerDb(): Promise<SiteBannerRecord | null> {
  const res = await dbQuery<SiteBannerRecord>(
    `SELECT 
       id,
       message,
       link_text,
       link_url,
       enabled,
       start_date::text,
       end_date::text,
       priority,
       created_at::text,
       updated_at::text
     FROM public.site_banners
     ORDER BY priority DESC, created_at DESC
     LIMIT 1`
  );

  return res.rows[0] || null;
}

export async function getAllSiteBannersDb(): Promise<SiteBannerRecord[]> {
  const res = await dbQuery<SiteBannerRecord>(
    `SELECT 
       id,
       message,
       link_text,
       link_url,
       enabled,
       start_date::text,
       end_date::text,
       priority,
       created_at::text,
       updated_at::text
     FROM public.site_banners
     ORDER BY priority DESC, created_at DESC`
  );

  return res.rows;
}

export async function createSiteBannerDb(
  data: {
    message: string;
    link_text?: string | null;
    link_url?: string | null;
    enabled?: boolean;
    start_date?: string | null;
    end_date?: string | null;
    priority?: number;
  },
  actor?: { id?: string; name?: string }
): Promise<SiteBannerRecord> {
  const res = await dbQuery<SiteBannerRecord>(
    `INSERT INTO public.site_banners (
       message,
       link_text,
       link_url,
       enabled,
       start_date,
       end_date,
       priority
     ) VALUES (
       $1,
       $2,
       $3,
       COALESCE($4, false),
       $5::date,
       $6::date,
       COALESCE($7, 1)
     ) RETURNING *`,
    [
      data.message,
      data.link_text || null,
      data.link_url || null,
      data.enabled ?? false,
      data.start_date || null,
      data.end_date || null,
      data.priority ?? 1,
    ]
  );

  const created = res.rows[0];

  await logActivity({
    actorId: actor?.id,
    actorName: actor?.name || 'Admin',
    action: 'created_site_banner',
    entityType: 'site_banner',
    entityId: created.id,
    entityTitle: created.message.slice(0, 40),
    metadata: { enabled: created.enabled },
  });

  return created;
}

export async function updateSiteBannerDb(
  id: string,
  data: Partial<SiteBannerRecord>,
  actor?: { id?: string; name?: string }
): Promise<SiteBannerRecord> {
  // If id is 'primary' or new, or if table is empty, handle upsert
  if (!id || id === 'primary') {
    const existing = await getSiteBannerDb();
    if (existing) {
      id = existing.id;
    } else {
      return createSiteBannerDb(
        {
          message: data.message || 'Welcome to OneDot ABM',
          link_text: data.link_text,
          link_url: data.link_url,
          enabled: data.enabled ?? false,
          start_date: data.start_date,
          end_date: data.end_date,
          priority: data.priority ?? 1,
        },
        actor
      );
    }
  }

  const res = await dbQuery<SiteBannerRecord>(
    `UPDATE public.site_banners SET
       message = COALESCE($1, message),
       link_text = CASE WHEN $2 IS NOT NULL THEN $2 ELSE link_text END,
       link_url = CASE WHEN $3 IS NOT NULL THEN $3 ELSE link_url END,
       enabled = COALESCE($4, enabled),
       start_date = CASE WHEN $5 IS NOT NULL THEN $5::date ELSE start_date END,
       end_date = CASE WHEN $6 IS NOT NULL THEN $6::date ELSE end_date END,
       priority = COALESCE($7, priority),
       updated_at = NOW()
     WHERE id = $8::uuid
     RETURNING *`,
    [
      data.message ?? null,
      data.link_text !== undefined ? data.link_text : null,
      data.link_url !== undefined ? data.link_url : null,
      data.enabled ?? null,
      data.start_date !== undefined ? data.start_date : null,
      data.end_date !== undefined ? data.end_date : null,
      data.priority !== undefined ? data.priority : null,
      id,
    ]
  );

  if (res.rows.length === 0) {
    throw new Error(`Site banner ${id} not found`);
  }

  const updated = res.rows[0];

  await logActivity({
    actorId: actor?.id,
    actorName: actor?.name || 'Admin',
    action: 'updated_site_banner',
    entityType: 'site_banner',
    entityId: updated.id,
    entityTitle: updated.message.slice(0, 40),
    metadata: { enabled: updated.enabled },
  });

  return updated;
}

export async function deleteSiteBannerDb(
  id: string,
  actor?: { id?: string; name?: string }
): Promise<boolean> {
  const res = await dbQuery<{ id: string; message: string }>(
    `DELETE FROM public.site_banners WHERE id = $1::uuid RETURNING id, message`,
    [id]
  );

  if (res.rows.length > 0) {
    await logActivity({
      actorId: actor?.id,
      actorName: actor?.name || 'Admin',
      action: 'deleted_site_banner',
      entityType: 'site_banner',
      entityId: id,
      entityTitle: res.rows[0].message.slice(0, 40),
    });
    return true;
  }
  return false;
}
