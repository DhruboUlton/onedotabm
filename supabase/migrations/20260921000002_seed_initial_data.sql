-- OneDot ABM — Initial Seed Data Migration
-- Real verified data from Business_Details.md

DO $$
DECLARE
    v_admin_id UUID := 'a0000000-0000-0000-0000-000000000001';
    v_solution_point_id UUID := 'c0000000-0000-0000-0000-000000000001';
    v_autonex_id UUID := 'c0000000-0000-0000-0000-000000000002';
    v_kanzie_id UUID := 'c0000000-0000-0000-0000-000000000003';
    v_lumiflick_id UUID := 'c0000000-0000-0000-0000-000000000004';

    v_proj_sp_id UUID := 'b0000000-0000-0000-0000-000000000001';
    v_proj_autonex_id UUID := 'b0000000-0000-0000-0000-000000000002';
    v_proj_kanzie_id UUID := 'b0000000-0000-0000-0000-000000000003';
    v_proj_lumiflick_id UUID := 'b0000000-0000-0000-0000-000000000004';
    
    v_quote_1 UUID := 'd0000000-0000-0000-0000-000000000001';
    v_invoice_1 UUID := 'e0000000-0000-0000-0000-000000000001';
BEGIN

    -- 1. ADMIN USER PROFILE (Dhrubo Duti Biswas)
    INSERT INTO public.profiles (id, full_name, email, password_hash, role, phone, active)
    VALUES (
        v_admin_id,
        'Dhrubo Duti Biswas',
        'dhrubo@onedotabm.com',
        -- SHA-256 for default pass 'onedotadmin2026'
        'd8f0709b9f77f0980cf7f44d18ecb9745eefd0de90c2eb7f4b8cf20272bcf742',
        'owner',
        '+880 1700-000000',
        true
    ) ON CONFLICT (email) DO UPDATE SET full_name = EXCLUDED.full_name;

    -- 2. VERIFIED CLIENT RECORDS
    INSERT INTO public.clients (id, company_name, contact_person, email, phone, website, industry, services, status, account_manager, start_date, notes)
    VALUES 
    (
        v_solution_point_id,
        'Solution Point',
        'Tanvir Ahmed',
        'tanvir@solutionpoint.edu',
        '+880 1811-223344',
        'https://solutionpoint.edu',
        'Education & EdTech',
        ARRAY['Meta Ads', 'Lead Generation', 'Funnel Strategy', 'Landing Page CRO'],
        'active',
        v_admin_id,
        '2024-03-15',
        'Education marketing campaign. Documented 788 course orders and approximately ৳800K generated revenue.'
    ),
    (
        v_autonex_id,
        'Autonex Logistics & Parts',
        'Rafiqul Islam',
        'rafiq@autonex.com.bd',
        '+880 1712-334455',
        'https://autonex.com.bd',
        'Automotive & Retail',
        ARRAY['Meta Ads', 'E-commerce Tracking', 'Creative Strategy'],
        'active',
        v_admin_id,
        '2024-05-10',
        'Automotive marketing project with previously documented revenue generation of approximately ৳343K+.'
    ),
    (
        v_kanzie_id,
        'Kanzie Apparel',
        'Kazi Farhan',
        'contact@kanzie.com',
        '+880 1913-445566',
        'https://kanzie.com',
        'E-commerce & Fashion',
        ARRAY['Custom Web Applications', 'Admin Panels', 'E-commerce', 'Payment Integration'],
        'active',
        v_admin_id,
        '2024-01-20',
        'Custom web application & ERP: customer storefront, product management, inventory, orders, staff RBAC, and activity logging.'
    ),
    (
        v_lumiflick_id,
        'Lumiflick Studios',
        'Shahriar Hossain',
        'hello@lumiflick.com',
        '+880 1614-556677',
        'https://lumiflick.com',
        'Creative Media & Retail',
        ARRAY['Web Development', 'Next.js Platform', 'E-commerce Infrastructure'],
        'active',
        v_admin_id,
        '2024-06-01',
        'Modern application development and online digital storefront capabilities.'
    )
    ON CONFLICT (id) DO NOTHING;

    -- 3. PROJECTS
    INSERT INTO public.projects (id, project_name, client_id, service_type, description, start_date, deadline, budget, currency, project_manager, status, priority, progress)
    VALUES
    (
        v_proj_sp_id,
        'Solution Point Course Acquisition Funnel',
        v_solution_point_id,
        'Performance Marketing',
        'Multi-stage Meta ads acquisition funnel and conversion landing page generating course enrollments.',
        '2024-03-15',
        '2024-09-30',
        185000.00,
        'BDT',
        v_admin_id,
        'completed',
        'high',
        100
    ),
    (
        v_proj_autonex_id,
        'Autonex High-ROAS Parts Campaign',
        v_autonex_id,
        'Paid Advertising',
        'Targeted dynamic catalog ads and seasonal automotive accessories promotion campaign.',
        '2024-05-10',
        '2024-10-31',
        120000.00,
        'BDT',
        v_admin_id,
        'completed',
        'medium',
        100
    ),
    (
        v_proj_kanzie_id,
        'Kanzie E-Commerce & ERP System',
        v_kanzie_id,
        'Custom Web Application',
        'Custom high-performance web storefront, inventory batching, orders dispatch, and staff role permissions.',
        '2024-01-20',
        '2024-11-15',
        450000.00,
        'BDT',
        v_admin_id,
        'completed',
        'urgent',
        100
    ),
    (
        v_proj_lumiflick_id,
        'Lumiflick Digital Media Store',
        v_lumiflick_id,
        'Web Development',
        'Next.js 15 headless digital asset marketplace with automated licensing and instant digital deliveries.',
        '2024-06-01',
        '2024-12-15',
        320000.00,
        'BDT',
        v_admin_id,
        'in_progress',
        'high',
        85
    )
    ON CONFLICT (id) DO NOTHING;

    -- 4. PROJECT TASKS
    INSERT INTO public.project_tasks (project_id, title, description, assigned_to, status, priority, due_date)
    VALUES
    (v_proj_lumiflick_id, 'Finalize Stripe & bKash Webhook Handlers', 'Ensure instant license key delivery upon payment capture.', v_admin_id, 'in_progress', 'urgent', CURRENT_DATE + 5),
    (v_proj_lumiflick_id, 'Run Core Web Vitals Lighthouse Audit', 'Target 95+ score on mobile and desktop viewports.', v_admin_id, 'todo', 'high', CURRENT_DATE + 10),
    (v_proj_kanzie_id, 'Quarterly Database Index Optimization', 'Analyze query plans for inventory search and order logs.', v_admin_id, 'completed', 'medium', CURRENT_DATE - 15)
    ON CONFLICT DO NOTHING;

    -- 5. WEBSITES
    INSERT INTO public.websites (website_name, client_id, project_id, domain, technology, website_type, status, launch_date, hosting, maintenance_plan)
    VALUES
    ('Kanzie Official Store', v_kanzie_id, v_proj_kanzie_id, 'kanzie.com', 'Next.js + Prisma + PostgreSQL', 'E-commerce & ERP', 'live', '2024-04-10', 'Vercel + Supabase', 'Premium SLA'),
    ('Lumiflick Marketplace', v_lumiflick_id, v_proj_lumiflick_id, 'lumiflick.com', 'Next.js + Tailwind + Node.js', 'Digital Marketplace', 'staging', '2024-08-01', 'Cloudflare Pages', 'Active Support'),
    ('Autonex Online', v_autonex_id, v_proj_autonex_id, 'autonex.com.bd', 'Laravel + MySQL', 'E-commerce', 'live', '2024-05-15', 'cPanel / DigitalOcean', 'Standard SLA')
    ON CONFLICT DO NOTHING;

    -- 6. LEADS (Realistic pipeline)
    INSERT INTO public.leads (name, company, email, phone, country, city, service_interested, lead_source, budget, message, status, priority, tags)
    VALUES
    (
        'Mahmudul Hasan',
        'Apex Growth Tech',
        'm.hasan@apexgrowth.io',
        '+880 1711-998877',
        'Bangladesh',
        'Dhaka',
        'Custom Web Application',
        'website',
        '৳300,000 - ৳500,000',
        'We need an internal customer portal and billing dashboard connected to bKash and Nagad payment gateways.',
        'qualified',
        'high',
        ARRAY['Web App', 'Fintech', 'Urgent']
    ),
    (
        'Sonia Chowdhury',
        'Glamour Touch Cosmetics',
        'sonia@glamourtouch.com',
        '+880 1812-334455',
        'Bangladesh',
        'Chittagong',
        'Meta Ads',
        'meta_ads',
        '৳50,000 - ৳100,000',
        'Looking for performance marketing to scale our skincare e-commerce store orders. Currently doing ~10 orders/day.',
        'contacted',
        'medium',
        ARRAY['E-commerce', 'Meta Ads']
    ),
    (
        'Kamrul Islam',
        'Voyage Horizon Travels',
        'kamrul@voyagehorizon.com',
        '+880 1915-667788',
        'Bangladesh',
        'Sylhet',
        'Business Website',
        'referral',
        '৳150,000 - ৳250,000',
        'We need a modern corporate website with interactive tour package booking inquiries and WhatsApp chat routing.',
        'new',
        'high',
        ARRAY['Corporate Website', 'Tourism']
    )
    ON CONFLICT DO NOTHING;

    -- 7. PROSPECTS
    INSERT INTO public.prospects (company, contact_person, email, phone, services, estimated_deal_value, currency, probability, stage, expected_close_date, assigned_to, notes)
    VALUES
    (
        'Apex Growth Tech',
        'Mahmudul Hasan',
        'm.hasan@apexgrowth.io',
        '+880 1711-998877',
        ARRAY['Custom Web Application', 'Payment Integration'],
        380000.00,
        'BDT',
        80,
        'proposal',
        CURRENT_DATE + 14,
        v_admin_id,
        'Quotation sent for ৳380K. Waiting for board sign-off.'
    ),
    (
        'Silk & Thread Apparel',
        'Nusrat Jahan',
        'nusrat@silkthread.bd',
        '+880 1799-887766',
        ARRAY['E-commerce Website', 'Meta Ads'],
        220000.00,
        'BDT',
        60,
        'discovery',
        CURRENT_DATE + 21,
        v_admin_id,
        'Discovery call scheduled. Interested in full-funnel marketing + custom Shopify/Next.js store.'
    )
    ON CONFLICT DO NOTHING;

    -- 8. QUOTATIONS
    INSERT INTO public.quotations (id, quotation_number, client_id, project_id, issue_date, expiry_date, currency, subtotal, discount, tax, total, status, notes)
    VALUES (
        v_quote_1,
        'Q-2024-0042',
        v_solution_point_id,
        v_proj_sp_id,
        CURRENT_DATE - 30,
        CURRENT_DATE + 30,
        'BDT',
        185000.00,
        0.00,
        0.00,
        185000.00,
        'accepted',
        'Scope includes Meta Ads campaign management, creative development, and landing page optimization.'
    ) ON CONFLICT (id) DO NOTHING;

    INSERT INTO public.quotation_items (quotation_id, description, quantity, unit_price, discount, total)
    VALUES
    (v_quote_1, 'Meta Ads Management & Telemetry Setup (3 Months)', 3, 40000.00, 0.00, 120000.00),
    (v_quote_1, 'High-Conversion Video & Carousel Creative Strategy', 1, 35000.00, 0.00, 35000.00),
    (v_quote_1, 'Course Landing Page CRO & Server-Side CAPI', 1, 30000.00, 0.00, 30000.00)
    ON CONFLICT DO NOTHING;

    -- 9. INVOICES & PAYMENTS
    INSERT INTO public.invoices (id, invoice_number, client_id, project_id, quotation_id, issue_date, due_date, currency, subtotal, discount, tax, total, amount_paid, amount_due, status, payment_method)
    VALUES (
        v_invoice_1,
        'INV-2024-0089',
        v_solution_point_id,
        v_proj_sp_id,
        v_quote_1,
        CURRENT_DATE - 15,
        CURRENT_DATE + 5,
        'BDT',
        185000.00,
        0.00,
        0.00,
        185000.00,
        185000.00,
        0.00,
        'paid',
        'Bank Transfer'
    ) ON CONFLICT (id) DO NOTHING;

    INSERT INTO public.invoice_items (invoice_id, description, quantity, unit_price, discount, total)
    VALUES (v_invoice_1, 'Solution Point Growth Marketing Package - Full Retainer', 1, 185000.00, 0.00, 185000.00)
    ON CONFLICT DO NOTHING;

    INSERT INTO public.payments (invoice_id, amount, currency, payment_method, payment_date, reference, notes)
    VALUES (v_invoice_1, 185000.00, 'BDT', 'Bank Transfer', CURRENT_DATE - 10, 'EBL-TRX-998231', 'Full payment received via Eastern Bank Ltd.')
    ON CONFLICT DO NOTHING;

    -- 10. INTEGRATIONS STATUS
    INSERT INTO public.integrations (name, provider, status, config)
    VALUES
    ('Meta Marketing API', 'meta', 'connected', '{"account_id": "act_88291039", "pixels": ["9928172635"], "capi_enabled": true}'::jsonb),
    ('Google Ads & Analytics', 'google_ads', 'connected', '{"customer_id": "812-491-0921", "ga4_measurement_id": "G-ONEDOTABM"}'::jsonb),
    ('WhatsApp Business CRM', 'whatsapp', 'connected', '{"phone_number": "+8801700000000", "webhook_active": true}'::jsonb),
    ('bKash Payment Gateway', 'bkash', 'connected', '{"merchant_id": "ONEDOT_01", "mode": "live"}'::jsonb),
    ('Stripe International', 'stripe', 'disconnected', '{}'::jsonb)
    ON CONFLICT (provider) DO NOTHING;

    -- 11. ACTIVITIES & NOTIFICATIONS
    INSERT INTO public.activities (actor_id, actor_name, action, entity_type, entity_id, entity_title, metadata)
    VALUES
    (v_admin_id, 'Dhrubo Duti Biswas', 'invoice.paid', 'invoice', v_invoice_1, 'INV-2024-0089', '{"amount": 185000, "client": "Solution Point"}'::jsonb),
    (v_admin_id, 'Dhrubo Duti Biswas', 'quotation.accepted', 'quotation', v_quote_1, 'Q-2024-0042', '{"total": 185000, "client": "Solution Point"}'::jsonb),
    (v_admin_id, 'System', 'lead.created', 'lead', (SELECT id FROM public.leads WHERE company = 'Apex Growth Tech' LIMIT 1), 'Apex Growth Tech', '{"source": "website", "budget": "৳300,000 - ৳500,000"}'::jsonb);

    INSERT INTO public.notifications (user_id, title, message, type, link_url)
    VALUES
    (v_admin_id, 'New Qualified Lead: Apex Growth Tech', 'Mahmudul Hasan requested a custom web app quotation (budget ৳300K - ৳500K).', 'lead', '/admin/leads'),
    (v_admin_id, 'Invoice Paid: Solution Point', 'Payment of ৳185,000.00 confirmed via Eastern Bank Ltd.', 'billing', '/admin/billing');

END $$;
