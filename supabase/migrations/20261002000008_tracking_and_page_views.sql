-- Scripts the admin pastes in (Google Tag Manager, Meta pixel, ...) and where
-- on the public site they go; and a row per public page view.

CREATE TABLE IF NOT EXISTS public.tracking_scripts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    code TEXT NOT NULL,
    placement TEXT NOT NULL DEFAULT 'head' CHECK (placement IN ('head', 'body_start', 'body_end')),
    enabled BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.page_views (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    path TEXT NOT NULL,
    referrer TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_page_views_path ON public.page_views(path);
CREATE INDEX IF NOT EXISTS idx_page_views_created ON public.page_views(created_at DESC);
