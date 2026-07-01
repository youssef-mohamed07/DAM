-- جدول العملاء المحتملين — DAM Properties
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'assigned', 'contacted', 'won', 'lost')),
  source TEXT NOT NULL CHECK (source IN ('property', 'contact', 'manual')),
  property_id TEXT,
  property_slug TEXT,
  property_title TEXT,
  client_name TEXT,
  client_phone TEXT,
  client_email TEXT,
  message TEXT,
  goal TEXT,
  property_type TEXT,
  budget TEXT,
  district TEXT,
  assigned_sales_id TEXT,
  assigned_at TIMESTAMPTZ,
  notes TEXT
);

CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads (created_at DESC);
CREATE INDEX IF NOT EXISTS leads_status_idx ON leads (status);
CREATE INDEX IF NOT EXISTS leads_property_id_idx ON leads (property_id);
CREATE INDEX IF NOT EXISTS leads_assigned_sales_id_idx ON leads (assigned_sales_id);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "leads_public_insert" ON leads;
CREATE POLICY "leads_public_insert" ON leads FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "leads_public_select" ON leads;
CREATE POLICY "leads_public_select" ON leads FOR SELECT USING (true);

DROP POLICY IF EXISTS "leads_public_update" ON leads;
CREATE POLICY "leads_public_update" ON leads FOR UPDATE USING (true);
