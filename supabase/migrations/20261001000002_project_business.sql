-- A client may run several businesses, so a project needs to say which one it
-- is for. Optional: plenty of work is for the person, not a business, and every
-- project that already exists predates the distinction.
--
-- ON DELETE SET NULL, because removing a business should not take its projects
-- with it.

ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS business_id UUID REFERENCES public.client_businesses(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_projects_business ON public.projects(business_id);
