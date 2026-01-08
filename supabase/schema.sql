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
COMMENT ON TABLE electrical_installations IS 'Unidades Consumidoras para sistema de busca da Defesa Civil';
COMMENT ON COLUMN electrical_installations.installation_number IS 'Número simplificado da UC (6 dígitos centrais)';
COMMENT ON COLUMN electrical_installations.pee_lat IS 'Latitude coordenada primária';
COMMENT ON COLUMN electrical_installations.pee_lng IS 'Longitude coordenada primária';
COMMENT ON COLUMN electrical_installations.client_lat IS 'Latitude opcional do cliente';
COMMENT ON COLUMN electrical_installations.client_lng IS 'Longitude opcional do cliente';
