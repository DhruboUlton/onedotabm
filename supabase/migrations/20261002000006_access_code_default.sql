-- Every new client gets a portal credential without the app having to ask for
-- one. Projects already get theirs in code; this covers clients, and projects
-- created by any other path.

ALTER TABLE public.clients ALTER COLUMN access_code SET DEFAULT public.generate_access_code();
ALTER TABLE public.projects ALTER COLUMN access_code SET DEFAULT public.generate_access_code();
