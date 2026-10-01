-- Invoices carry what the client sees on their invoice page: how the discount
-- and tax were worked out, two kinds of notes, an optional pay-now button, and
-- how long the public link stays open after payment.

ALTER TABLE public.invoices
  -- Which of the client's businesses is billed, and the name and address
  -- printed on the invoice. Picking a business fills both; they stay editable.
  ADD COLUMN IF NOT EXISTS business_id UUID REFERENCES public.client_businesses(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS client_company TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS client_address TEXT NOT NULL DEFAULT '',

  -- discount and tax keep holding the computed amounts; these are the inputs.
  ADD COLUMN IF NOT EXISTS discount_type TEXT NOT NULL DEFAULT 'none'
    CHECK (discount_type IN ('none', 'percent', 'fixed')),
  ADD COLUMN IF NOT EXISTS discount_value NUMERIC(12, 2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS discount_note TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS tax_rate NUMERIC(6, 3) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS tax_label TEXT NOT NULL DEFAULT 'Tax',

  -- notes stays the payment instructions; invoice_notes is everything else.
  ADD COLUMN IF NOT EXISTS invoice_notes TEXT NOT NULL DEFAULT '',

  ADD COLUMN IF NOT EXISTS cta_enabled BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS cta_title TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS cta_description TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS cta_payment_link TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS cta_button_text TEXT NOT NULL DEFAULT 'Pay Now',

  -- The public link is fully open until 3 days after payment, then PDF-only
  -- until day 10. The two dates override those windows.
  ADD COLUMN IF NOT EXISTS fully_paid_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS access_expires_at DATE,
  ADD COLUMN IF NOT EXISTS pdf_expires_at DATE;

ALTER TABLE public.invoice_items ADD COLUMN IF NOT EXISTS position INTEGER NOT NULL DEFAULT 0;
ALTER TABLE public.payments ALTER COLUMN payment_method SET DEFAULT '';

-- Existing invoices: express their stored amounts as inputs, so re-saving one
-- keeps the same total.
UPDATE public.invoices SET discount_type = 'fixed', discount_value = discount
 WHERE discount > 0 AND discount_type = 'none';

UPDATE public.invoices SET tax_rate = ROUND(tax * 100 / NULLIF(subtotal - discount, 0), 3)
 WHERE tax > 0 AND tax_rate = 0 AND subtotal - discount > 0;

UPDATE public.invoices SET fully_paid_at = updated_at
 WHERE status = 'paid' AND fully_paid_at IS NULL;

UPDATE public.invoices i SET client_company = COALESCE(c.company_name, ''), client_address = COALESCE(c.address, '')
  FROM public.clients c
 WHERE c.id = i.client_id AND i.client_company = '' AND i.client_address = '';
