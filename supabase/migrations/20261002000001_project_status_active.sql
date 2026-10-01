-- Projects move to four states: active, on_hold, completed, cancelled.
--
-- Adding an enum value cannot share a transaction with statements that use it,
-- so this file only adds the value. 20261002000002 moves the rows over.

ALTER TYPE project_status_enum ADD VALUE IF NOT EXISTS 'active';
