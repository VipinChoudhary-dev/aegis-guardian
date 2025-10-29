-- E-FIR Tables for Supabase
-- Run this in Supabase SQL Editor

-- E-FIRs table (already created, but adding if missing)
CREATE TABLE IF NOT EXISTS efirs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fir_id TEXT UNIQUE NOT NULL,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  incident_date TIMESTAMPTZ NOT NULL,
  location JSONB NOT NULL,
  evidence JSONB DEFAULT '[]'::jsonb,
  status TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- NFTs table (already created, but adding if missing)
CREATE TABLE IF NOT EXISTS nfts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nft_id TEXT UNIQUE NOT NULL,
  user_id TEXT NOT NULL,
  type TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  minted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_efirs_user_id ON efirs(user_id);
CREATE INDEX IF NOT EXISTS idx_efirs_status ON efirs(status);
CREATE INDEX IF NOT EXISTS idx_nfts_user_id ON nfts(user_id);

-- Enable Row Level Security (optional for now)
ALTER TABLE efirs ENABLE ROW LEVEL SECURITY;
ALTER TABLE nfts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow all for efirs" ON efirs;
DROP POLICY IF EXISTS "Allow all for nfts" ON nfts;

-- Allow all operations for now (you can restrict later)
CREATE POLICY "Allow all for efirs" ON efirs FOR ALL USING (true);
CREATE POLICY "Allow all for nfts" ON nfts FOR ALL USING (true);

-- Success message
SELECT 'E-FIR tables created successfully!' as message;
