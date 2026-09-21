-- OneDot ABM — Company Settings Migration
CREATE TABLE IF NOT EXISTS public.company_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name TEXT NOT NULL DEFAULT 'OneDot ABM',
    tagline TEXT DEFAULT 'Strategic Marketing & Custom Web Development',
    email TEXT DEFAULT 'hello@onedotabm.com',
    phone TEXT DEFAULT '+880 1700-000000',
    address TEXT DEFAULT 'Gulshan-2, Dhaka 1212, Bangladesh',
    website TEXT DEFAULT 'https://onedotabm.com',
    default_currency TEXT DEFAULT 'BDT',
    tax_rate NUMERIC(5, 2) DEFAULT 0.00,
    invoice_prefix TEXT DEFAULT 'INV',
    quotation_prefix TEXT DEFAULT 'Q',
    notify_email TEXT DEFAULT 'dhrubo@onedotabm.com',
    notify_on_lead BOOLEAN DEFAULT true,
    notify_on_invoice BOOLEAN DEFAULT true,
    notify_on_payment BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
