-- Prospects are cold-outreach targets imported from CSV (businesses to email or
-- DM), tracked through four follow-ups. This is not the deal pipeline in
-- public.prospects, which is left alone.

CREATE TABLE IF NOT EXISTS public.outreach_prospects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_name TEXT NOT NULL,
    phone TEXT NOT NULL DEFAULT '',
    email TEXT NOT NULL DEFAULT '',
    website TEXT NOT NULL DEFAULT '',
    city TEXT NOT NULL DEFAULT '',
    category TEXT NOT NULL DEFAULT '',
    contact_type TEXT NOT NULL DEFAULT '',
    google_rating TEXT NOT NULL DEFAULT '',
    google_review_count TEXT NOT NULL DEFAULT '',
    owner_name TEXT NOT NULL DEFAULT '',
    major_services TEXT NOT NULL DEFAULT '',
    facebook TEXT NOT NULL DEFAULT '',
    instagram TEXT NOT NULL DEFAULT '',
    linkedin TEXT NOT NULL DEFAULT '',
    twitter TEXT NOT NULL DEFAULT '',
    tiktok TEXT NOT NULL DEFAULT '',
    youtube TEXT NOT NULL DEFAULT '',
    pinterest TEXT NOT NULL DEFAULT '',
    batch TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'new'
      CHECK (status IN ('new', 'contacted', 'replied', 'converted', 'not_interested')),
    email_sent_at TIMESTAMPTZ,
    dm_sent_at TIMESTAMPTZ,
    follow_up_1_at TIMESTAMPTZ,
    follow_up_2_at TIMESTAMPTZ,
    follow_up_3_at TIMESTAMPTZ,
    follow_up_4_at TIMESTAMPTZ,
    notes TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_outreach_prospects_status ON public.outreach_prospects(status);
CREATE INDEX IF NOT EXISTS idx_outreach_prospects_batch ON public.outreach_prospects(batch);
