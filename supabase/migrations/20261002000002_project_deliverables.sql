-- Projects are tracked as services, each holding deliverables, each holding
-- files. This replaces the flat task list and the milestones list. The old
-- tables are left in place but nothing reads them any more.

-- 1. Project status ----------------------------------------------------------

-- planning, in_progress, review and revision all meant "being worked on".
UPDATE public.projects
   SET status = 'active'
 WHERE status IN ('planning', 'in_progress', 'review', 'revision');

ALTER TABLE public.projects ALTER COLUMN status SET DEFAULT 'active';

-- A project can exist before anyone is attached to it, and the clients now live
-- in project_clients. client_id mirrors the first of them.
ALTER TABLE public.projects ALTER COLUMN client_id DROP NOT NULL;
ALTER TABLE public.projects ALTER COLUMN service_type SET DEFAULT '';

ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS invoice_number TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS completed_at DATE,
  -- What the client types, with their email, to open the project portal.
  ADD COLUMN IF NOT EXISTS access_code TEXT UNIQUE;

-- Projects already completed were finished on time as far as we know; without
-- a date their deadline badge would read Overdue forever.
UPDATE public.projects SET completed_at = updated_at::date
 WHERE status = 'completed' AND completed_at IS NULL;

-- One code per client opens their whole workspace (every project of theirs).
ALTER TABLE public.clients
  ADD COLUMN IF NOT EXISTS access_code TEXT UNIQUE;

-- 2. Clients on a project ----------------------------------------------------

CREATE TABLE IF NOT EXISTS public.project_clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    business_id UUID REFERENCES public.client_businesses(id) ON DELETE SET NULL,
    position INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (project_id, client_id)
);
CREATE INDEX IF NOT EXISTS idx_project_clients_project ON public.project_clients(project_id);
CREATE INDEX IF NOT EXISTS idx_project_clients_client ON public.project_clients(client_id);

INSERT INTO public.project_clients (project_id, client_id, business_id, position)
SELECT id, client_id, business_id, 0
  FROM public.projects
 WHERE client_id IS NOT NULL
ON CONFLICT (project_id, client_id) DO NOTHING;

-- 3. Services, deliverables, files ------------------------------------------

CREATE TABLE IF NOT EXISTS public.project_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT 'New Service',
    description TEXT NOT NULL DEFAULT '',
    deadline DATE,
    position INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_project_services_project ON public.project_services(project_id);

CREATE TABLE IF NOT EXISTS public.project_deliverables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id UUID NOT NULL REFERENCES public.project_services(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT 'New Deliverable',
    type TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
      'pending', 'in_progress', 'analyzing', 'designing', 'review', 'revision',
      'approved', 'optimizing', 'uploaded', 'delivering', 'completed'
    )),
    notes TEXT NOT NULL DEFAULT '',
    deadline DATE,
    completed_at DATE,
    position INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_project_deliverables_service ON public.project_deliverables(service_id);

CREATE TABLE IF NOT EXISTS public.deliverable_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deliverable_id UUID NOT NULL REFERENCES public.project_deliverables(id) ON DELETE CASCADE,
    name TEXT NOT NULL DEFAULT 'file',
    url TEXT NOT NULL,
    size INTEGER NOT NULL DEFAULT 0,
    mime_type TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_deliverable_files_deliverable ON public.deliverable_files(deliverable_id);

-- Carry existing tasks over: one "Tasks" service per project that had any.
INSERT INTO public.project_services (project_id, title, position)
SELECT DISTINCT project_id, 'Tasks', 0 FROM public.project_tasks;

INSERT INTO public.project_deliverables (service_id, title, status, notes, deadline, completed_at, position, created_at)
SELECT s.id,
       t.title,
       CASE t.status WHEN 'todo' THEN 'pending' ELSE t.status::text END,
       COALESCE(t.description, ''),
       t.due_date,
       CASE WHEN t.status = 'completed' THEN t.updated_at::date END,
       (ROW_NUMBER() OVER (PARTITION BY t.project_id ORDER BY t.created_at)) - 1,
       t.created_at
  FROM public.project_tasks t
  JOIN public.project_services s ON s.project_id = t.project_id AND s.title = 'Tasks';

-- 4. Templates ---------------------------------------------------------------

-- services: [{ "title": "...", "deliverables": [{ "title": "...", "type": "..." }] }]
CREATE TABLE IF NOT EXISTS public.project_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    services JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Access codes for everything that already exists -------------------------

-- PROJ- plus six characters from an alphabet without 0/O/1/I. A collision
-- breaks the UNIQUE constraint and fails the migration loudly, never silently.
CREATE OR REPLACE FUNCTION public.generate_access_code() RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  code TEXT := 'PROJ-';
BEGIN
  FOR i IN 1..6 LOOP
    code := code || substr(chars, 1 + floor(random() * length(chars))::int, 1);
  END LOOP;
  RETURN code;
END;
$$ LANGUAGE plpgsql VOLATILE;

UPDATE public.projects SET access_code = public.generate_access_code() WHERE access_code IS NULL;
UPDATE public.clients  SET access_code = public.generate_access_code() WHERE access_code IS NULL;
