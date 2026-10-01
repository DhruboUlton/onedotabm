-- Quotations carry the proposal the client reads: a title, scope, timeline,
-- payment terms, how the discount and tax were worked out, and a line-item
-- scope of deliverables.

ALTER TABLE public.quotations
  ADD COLUMN IF NOT EXISTS title TEXT NOT NULL DEFAULT 'Project Quotation',
  ADD COLUMN IF NOT EXISTS business_id UUID REFERENCES public.client_businesses(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS client_company TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS client_address TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS scope_overview TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS project_timeline TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS payment_terms TEXT NOT NULL DEFAULT '',
  -- terms stays the terms and conditions; notes stays the private notes.
  ADD COLUMN IF NOT EXISTS discount_type TEXT NOT NULL DEFAULT 'none'
    CHECK (discount_type IN ('none', 'percent', 'fixed')),
  ADD COLUMN IF NOT EXISTS discount_value NUMERIC(12, 2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS discount_note TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS tax_rate NUMERIC(6, 3) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS tax_label TEXT NOT NULL DEFAULT 'Tax',
  ADD COLUMN IF NOT EXISTS converted_invoice_id UUID REFERENCES public.invoices(id) ON DELETE SET NULL;

ALTER TABLE public.quotation_items
  ADD COLUMN IF NOT EXISTS deliverables TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS position INTEGER NOT NULL DEFAULT 0;

UPDATE public.quotations SET discount_type = 'fixed', discount_value = discount
 WHERE discount > 0 AND discount_type = 'none';

UPDATE public.quotations SET tax_rate = ROUND(tax * 100 / NULLIF(subtotal - discount, 0), 3)
 WHERE tax > 0 AND tax_rate = 0 AND subtotal - discount > 0;

UPDATE public.quotations q SET client_company = COALESCE(c.company_name, ''), client_address = COALESCE(c.address, '')
  FROM public.clients c
 WHERE c.id = q.client_id AND q.client_company = '' AND q.client_address = '';

