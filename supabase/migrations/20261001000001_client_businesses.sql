-- A client is a person, not a company.
--
-- Until now a client row carried exactly one company name, and it was required.
-- In practice one person often runs several businesses, and plenty of clients
-- have none worth recording. So:
--
--   * clients.company_name becomes optional. It is kept as a denormalized
--     display label only — the primary business name, written by the service
--     whenever a client's businesses change. Nothing else should write it.
--   * client_businesses holds the real list, one row per business.
--
-- Identity now lives in contact_person, email and phone.

ALTER TABLE public.clients ALTER COLUMN company_name DROP NOT NULL;

CREATE TABLE IF NOT EXISTS public.client_businesses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    industry TEXT,
    website TEXT,
    address TEXT,
    notes TEXT,
    -- Lowest position is the primary business, and the one whose name is
    -- mirrored into clients.company_name.
    position INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_client_businesses_client
    ON public.client_businesses(client_id, position);

-- Carry every existing company name over as that client's first business, so
-- no data is lost when company_name stops being the source of truth.
INSERT INTO public.client_businesses (client_id, name, industry, website, address, position)
SELECT c.id, c.company_name, c.industry, c.website, c.address, 0
FROM public.clients c
WHERE c.company_name IS NOT NULL
  AND btrim(c.company_name) <> ''
  AND NOT EXISTS (
      SELECT 1 FROM public.client_businesses b WHERE b.client_id = c.id
  );
