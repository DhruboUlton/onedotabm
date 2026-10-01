import { dbQuery } from '@/lib/db';

export interface TrackingScript {
  id: string;
  name: string;
  description: string;
  code: string;
  placement: 'head' | 'body_start' | 'body_end';
  enabled: boolean;
}

export async function getTrackingScripts(): Promise<TrackingScript[]> {
  const res = await dbQuery<TrackingScript>(
    `SELECT id, name, description, code, placement, enabled FROM public.tracking_scripts ORDER BY created_at`
  );
  return res.rows;
}

// Called on every public page load; the route that serves it is cached for a
// minute at the edge (Cache-Control), so no in-process cache is kept here: route
// and server action can be separate bundles with separate module state.
export async function getEnabledTrackingScripts(): Promise<TrackingScript[]> {
  try {
    const res = await dbQuery<TrackingScript>(
      `SELECT id, name, description, code, placement, enabled FROM public.tracking_scripts WHERE enabled ORDER BY created_at`
    );
    return res.rows;
  } catch {
    return []; // a database hiccup must not take the public site down
  }
}

export async function saveTrackingScript(
  id: string | null,
  s: Pick<TrackingScript, 'name' | 'description' | 'code' | 'placement' | 'enabled'>
): Promise<TrackingScript> {
  const res = id
    ? await dbQuery<TrackingScript>(
        `UPDATE public.tracking_scripts SET name=$2, description=$3, code=$4, placement=$5, enabled=$6, updated_at=NOW()
         WHERE id=$1 RETURNING id, name, description, code, placement, enabled`,
        [id, s.name, s.description, s.code, s.placement, s.enabled]
      )
    : await dbQuery<TrackingScript>(
        `INSERT INTO public.tracking_scripts (name, description, code, placement, enabled) VALUES ($1,$2,$3,$4,$5)
         RETURNING id, name, description, code, placement, enabled`,
        [s.name, s.description, s.code, s.placement, s.enabled]
      );
  if (!res.rows[0]) throw new Error('Script not found');
  return res.rows[0];
}

export async function deleteTrackingScript(id: string): Promise<void> {
  await dbQuery(`DELETE FROM public.tracking_scripts WHERE id = $1`, [id]);
}

// ── Page views ──────────────────────────────────────────────────────────────

export async function recordPageView(path: string, referrer: string): Promise<void> {
  await dbQuery(`INSERT INTO public.page_views (path, referrer) VALUES ($1, $2)`, [path.slice(0, 200), referrer.slice(0, 200)]);
}

export interface PageViewStats {
  total: number;
  last7: number;
  prev7: number;
  last30: number;
  daily: { day: string; views: number }[];
  topPages: { path: string; views: number }[];
  blogPosts: { path: string; views: number }[];
}

export async function getPageViewStats(): Promise<PageViewStats> {
  const [counts, daily, top, blog] = await Promise.all([
    dbQuery<{ total: string; last7: string; prev7: string; last30: string }>(
      `SELECT COUNT(*) AS total,
              COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days') AS last7,
              COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '14 days' AND created_at < NOW() - INTERVAL '7 days') AS prev7,
              COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days') AS last30
         FROM public.page_views`
    ),
    dbQuery<{ day: string; views: string }>(
      `SELECT to_char(d, 'YYYY-MM-DD') AS day, COALESCE(v.n, 0) AS views
         FROM generate_series(CURRENT_DATE - 13, CURRENT_DATE, '1 day') d
         LEFT JOIN (SELECT created_at::date AS day, COUNT(*) AS n FROM public.page_views
                     WHERE created_at >= CURRENT_DATE - 13 GROUP BY 1) v ON v.day = d::date
        ORDER BY d`
    ),
    dbQuery<{ path: string; views: string }>(
      `SELECT path, COUNT(*) AS views FROM public.page_views GROUP BY path ORDER BY views DESC, path LIMIT 20`
    ),
    dbQuery<{ path: string; views: string }>(
      `SELECT path, COUNT(*) AS views FROM public.page_views WHERE path LIKE '/blog/%' GROUP BY path ORDER BY views DESC, path LIMIT 20`
    ),
  ]);
  const c = counts.rows[0];
  return {
    total: Number(c.total),
    last7: Number(c.last7),
    prev7: Number(c.prev7),
    last30: Number(c.last30),
    daily: daily.rows.map((r) => ({ day: r.day, views: Number(r.views) })),
    topPages: top.rows.map((r) => ({ path: r.path, views: Number(r.views) })),
    blogPosts: blog.rows.map((r) => ({ path: r.path, views: Number(r.views) })),
  };
}
