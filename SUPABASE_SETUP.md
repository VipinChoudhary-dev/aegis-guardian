# 🚀 Supabase Setup Guide

## Step 1: Create Supabase Project (2 minutes)

1. Go to https://supabase.com
2. Click "Start your project"
3. Sign in with GitHub
4. Click "New Project"
5. Enter:
   - Name: `aegis-guardian`
   - Database Password: (generate one)
   - Region: Choose closest to you
6. Click "Create new project"
7. Wait 2 minutes for setup

## Step 2: Get Your API Keys

1. In Supabase dashboard, go to "Settings" → "API"
2. Copy these values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## Step 3: Create Database Tables

1. In Supabase dashboard, click "SQL Editor"
2. Click "New Query"
3. Paste this SQL:

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT UNIQUE NOT NULL,
  wallet_address TEXT,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  blood_type TEXT,
  photo TEXT,
  emergency_contacts JSONB NOT NULL DEFAULT '[]'::jsonb,
  medical_info TEXT,
  digital_id TEXT UNIQUE NOT NULL,
  qr_code TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_active TIMESTAMPTZ DEFAULT NOW()
);

-- Emergencies table
CREATE TABLE emergencies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  alert_id TEXT UNIQUE NOT NULL,
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  user_phone TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL,
  location JSONB NOT NULL,
  type TEXT NOT NULL,
  status TEXT NOT NULL,
  police_notified BOOLEAN DEFAULT FALSE,
  ambulance_notified BOOLEAN DEFAULT FALSE,
  verified_by TEXT,
  verified_at TIMESTAMPTZ
);

-- E-FIRs table
CREATE TABLE efirs (
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

-- NFTs table
CREATE TABLE nfts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nft_id TEXT UNIQUE NOT NULL,
  user_id TEXT NOT NULL,
  type TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  minted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_users_user_id ON users(user_id);
CREATE INDEX idx_users_digital_id ON users(digital_id);
CREATE INDEX idx_emergencies_status ON emergencies(status);
CREATE INDEX idx_emergencies_user_id ON emergencies(user_id);
CREATE INDEX idx_efirs_user_id ON efirs(user_id);
CREATE INDEX idx_nfts_user_id ON nfts(user_id);
```

4. Click "Run" or press `Ctrl+Enter`
5. You should see "Success. No rows returned"

## Step 4: Enable Row Level Security (RLS) - Optional

For production, add these policies:

```sql
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE efirs ENABLE ROW LEVEL SECURITY;
ALTER TABLE nfts ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read/write (for now)
CREATE POLICY "Allow all for users" ON users FOR ALL USING (true);
CREATE POLICY "Allow all for emergencies" ON emergencies FOR ALL USING (true);
CREATE POLICY "Allow all for efirs" ON efirs FOR ALL USING (true);
CREATE POLICY "Allow all for nfts" ON nfts FOR ALL USING (true);
```

## Step 5: Update Environment Variables

Update your `.env.local` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Step 6: Test the Connection

1. Restart your dev server: `npm run dev`
2. Go to `/profile-new`
3. Create a profile
4. Check Supabase dashboard → "Table Editor" → "users"
5. You should see your profile!

## ✅ Done!

Supabase is way better than Firebase:
- ✅ Simpler setup
- ✅ Real PostgreSQL database
- ✅ Instant APIs
- ✅ Better free tier
- ✅ Actually works!

## 📚 Supabase Features You Get:

1. **Real-time subscriptions** - Alerts appear instantly
2. **PostgreSQL** - Powerful queries
3. **Auto-generated APIs** - No backend code needed
4. **Authentication** - If you need it later
5. **Storage** - For images/files
6. **Edge Functions** - Serverless functions

## 🔧 Troubleshooting

If you get errors:
1. Check your API keys in `.env.local`
2. Make sure all tables are created
3. Restart dev server
4. Check Supabase dashboard logs

Need help? Supabase has amazing docs: https://supabase.com/docs
