-- A quotation is priced either per line item (qty x unit price) or with one
-- lump-sum price for the whole scope.
ALTER TABLE public.quotations
  ADD COLUMN IF NOT EXISTS pricing_mode TEXT NOT NULL DEFAULT 'per_item'
    CHECK (pricing_mode IN ('per_item', 'single')),
  ADD COLUMN IF NOT EXISTS lump_sum NUMERIC(12, 2) NOT NULL DEFAULT 0;
