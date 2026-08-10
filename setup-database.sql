-- Jalankan script ini di Supabase SQL Editor (New query -> paste -> Run)

CREATE TABLE app_storage (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE app_storage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow all" ON app_storage
  FOR ALL USING (true) WITH CHECK (true);
