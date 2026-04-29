# ⚡ Quick Setup - E-FIR & QR Scanner

## 🚨 If you see "Supabase error, saving locally"

This means the E-FIR table doesn't exist in Supabase yet. **It still works with localStorage!**

### Fix in 2 minutes:

1. **Open Supabase Dashboard**: https://supabase.com
2. **Go to SQL Editor**
3. **Paste this SQL**:

```sql
-- E-FIR Table
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

-- Indexes
CREATE INDEX IF NOT EXISTS idx_efirs_user_id ON efirs(user_id);
CREATE INDEX IF NOT EXISTS idx_efirs_status ON efirs(status);

-- Permissions
ALTER TABLE efirs ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Allow all for efirs" ON efirs FOR ALL USING (true);
```

4. **Click Run** (or press Ctrl+Enter)
5. **Done!** Refresh your app and try again

---

## ✅ What Works Right Now (Without SQL)

### **E-FIR System:**
- ✅ Submit E-FIR
- ✅ Upload photos
- ✅ Track E-FIRs
- ✅ Saves to localStorage
- ❌ Cross-device sync (needs SQL)

### **QR Scanner:**
- ✅ Scan QR codes
- ✅ View profiles
- ✅ Call contacts
- ✅ Works perfectly!

---

## 🧪 Test Without Supabase

Everything works with localStorage:

### **Test E-FIR:**
```bash
1. Go to http://localhost:3000/efir
2. Fill form
3. Upload photos
4. Submit
5. Check console: "✅ E-FIR saved locally"
6. Go to /efir/track to see it!
```

### **Test QR Scanner:**
```bash
1. Go to http://localhost:3000/profile-new
2. Create profile
3. Click "View Digital ID"
4. Go to http://localhost:3000/scan
5. Allow camera
6. Scan the QR code
7. Profile loads!
```

---

## 🔧 Troubleshooting

### **"uploadImage is not a function"**
✅ **FIXED!** Changed to `uploadEvidencePhoto`

### **"Supabase error"**
✅ **WORKS!** Falls back to localStorage
💡 Run SQL to enable cloud sync

### **Camera not working**
- Allow camera permission
- Use HTTPS or localhost
- Try different browser

---

## 📱 Mobile Testing

Works great on mobile!

```bash
# On same WiFi:
http://192.168.1.9:3000

# Test:
✅ E-FIR submission
✅ Photo upload from camera
✅ QR scanning with rear camera
✅ All features work!
```

---

## 🎯 Current Status

| Feature | LocalStorage | Supabase |
|---------|-------------|----------|
| E-FIR Submit | ✅ Works | ⚠️ Needs SQL |
| E-FIR Track | ✅ Works | ⚠️ Needs SQL |
| QR Scanner | ✅ Works | ✅ Works |
| Profiles | ✅ Works | ✅ Works |
| Emergencies | ✅ Works | ✅ Works |

---

## 🚀 Next Steps

1. **Test everything locally** (works now!)
2. **Run SQL in Supabase** (optional, for cloud sync)
3. **Deploy to production**

**Everything works right now with localStorage!** 🎉
