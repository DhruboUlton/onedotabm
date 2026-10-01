-- A quotation turned into an invoice is Converted. Adding an enum value cannot
-- share a transaction with statements that use it, so it lives on its own.

ALTER TYPE quotation_status_enum ADD VALUE IF NOT EXISTS 'converted';
