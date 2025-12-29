-- Create electrical_installations table
CREATE TABLE IF NOT EXISTS electrical_installations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  installation_number TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  address TEXT,
  street TEXT,
  client_lat DOUBLE PRECISION,
  client_lng DOUBLE PRECISION,
  pee_lat DOUBLE PRECISION NOT NULL,
  pee_lng DOUBLE PRECISION NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for fast searching
CREATE INDEX IF NOT EXISTS idx_installation_number ON electrical_installations(installation_number);
CREATE INDEX IF NOT EXISTS idx_name ON electrical_installations USING GIN (to_tsvector('portuguese', name));
CREATE INDEX IF NOT EXISTS idx_address ON electrical_installations USING GIN (to_tsvector('portuguese', COALESCE(address, '') || ' ' || COALESCE(street, '')));

-- Enable Row Level Security
ALTER TABLE electrical_installations ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to read all installations
CREATE POLICY "Allow authenticated users to read installations"
  ON electrical_installations
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policy to allow service role to insert/update
CREATE POLICY "Allow service role to manage installations"
  ON electrical_installations
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Comments
COMMENT ON TABLE electrical_installations IS 'Electrical installations for Civil Defense search system';
COMMENT ON COLUMN electrical_installations.installation_number IS 'Unique installation number from EDP';
COMMENT ON COLUMN electrical_installations.pee_lat IS 'Primary latitude coordinate (PEE)';
COMMENT ON COLUMN electrical_installations.pee_lng IS 'Primary longitude coordinate (PEE)';
COMMENT ON COLUMN electrical_installations.client_lat IS 'Optional client-specific latitude';
COMMENT ON COLUMN electrical_installations.client_lng IS 'Optional client-specific longitude';
