# 💻 Tech Stack - Complete Explanation

## Frontend Framework

### Next.js 14 (App Router)
**Why:** Server-side rendering, better SEO, built-in routing, TypeScript support
**What it does:** Handles page routing, server components, API routes
**Key features used:**
- App Router for file-based routing
- Server components for performance
- Image optimization
- Built-in CSS support

### TypeScript
**Why:** Type safety, better IDE support, catch errors early
**What it does:** Adds static typing to JavaScript
**Benefits:**
- Autocomplete in VS Code
- Catch bugs before runtime
- Better code documentation
- Easier refactoring

### Tailwind CSS
**Why:** Utility-first, fast development, consistent design
**What it does:** Provides pre-built CSS classes
**Example:**
```tsx
<div className="bg-gradient-to-r from-teal-500 to-blue-500 rounded-lg p-6">
```

### Framer Motion
**Why:** Smooth animations, better UX
**What it does:** Animates components
**Example:**
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.5 }}
>
```

## Blockchain

### RainbowKit
**Why:** Beautiful wallet connection UI
**What it does:** Connects MetaMask, WalletConnect, etc.
**Features:**
- One-click wallet connection
- Multiple wallet support
- Mobile-friendly

### Wagmi
**Why:** React hooks for Ethereum
**What it does:** Interact with blockchain
**Example:**
```tsx
const { address, isConnected } = useAccount();
```

## Backend/Database

### Supabase
**Why:** PostgreSQL, real-time, authentication, storage
**What it does:** Complete backend solution
**Features used:**
- PostgreSQL database
- Real-time subscriptions
- Row Level Security
- Storage for images

**Example:**
```typescript
await supabase.from('users').insert(userData);
```

### LocalStorage
**Why:** Offline support, fast access
**What it does:** Browser storage fallback
**When used:** When Supabase is unavailable

## Maps

### Leaflet
**Why:** Lightweight, open-source, customizable
**What it does:** Interactive maps
**Features:**
- Markers for locations
- Circles for zones
- Popups for info
- Real-time tracking

### OpenStreetMap
**Why:** Free, community-driven
**What it does:** Provides map tiles
**Alternative to:** Google Maps (no API key needed)

## Media

### ImgBB API
**Why:** Free image hosting, CDN
**What it does:** Stores uploaded images
**Process:**
1. User uploads image
2. Compress to base64
3. Send to ImgBB
4. Get back URL
5. Store URL in database

### QR Code React
**Why:** Generate QR codes easily
**What it does:** Creates QR codes from data
**Example:**
```tsx
<QRCodeReact 
  value={JSON.stringify(profileData)} 
  size={256} 
/>
```

## Audio

### Web Audio API
**Why:** No external files, instant sounds
**What it does:** Generates sounds programmatically
**Sounds created:**
- Click (800Hz, 100ms)
- Success (C-E-G chord)
- Alarm (alternating 900/700Hz)

## APIs Used

### Geolocation API
**Purpose:** Get user's GPS location
**Usage:**
```typescript
navigator.geolocation.getCurrentPosition((pos) => {
  const { latitude, longitude } = pos.coords;
});
```

### DeviceMotion API
**Purpose:** Detect phone shaking
**Usage:**
```typescript
window.addEventListener('devicemotion', (event) => {
  const acc = event.accelerationIncludingGravity;
  // Detect shake
});
```

### Notification API
**Purpose:** Browser notifications
**Usage:**
```typescript
new Notification('Emergency Alert', {
  body: 'SOS activated'
});
```

## Development Tools

### VS Code
**Extensions used:**
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript and JavaScript Language Features

### Package Manager
**npm** - Node Package Manager
**Commands:**
```bash
npm install          # Install dependencies
npm run dev         # Development server
npm run build       # Production build
npm start           # Start production server
```

## Deployment

### Vercel
**Why:** Made for Next.js, automatic deployments, CDN
**Features:**
- Git integration
- Automatic HTTPS
- Environment variables
- Analytics
- Edge functions

**Deployment process:**
```bash
vercel --prod
```

## Complete Dependencies

```json
{
  "dependencies": {
    "next": "14.0.0",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "typescript": "5.2.2",
    "@supabase/supabase-js": "2.38.0",
    "@rainbow-me/rainbowkit": "2.0.0",
    "wagmi": "2.0.0",
    "viem": "2.0.0",
    "framer-motion": "10.16.0",
    "tailwindcss": "3.3.0",
    "leaflet": "1.9.4",
    "react-leaflet": "4.2.1",
    "qrcode.react": "3.1.0",
    "html5-qrcode": "2.3.8",
    "lucide-react": "0.292.0"
  }
}
```

## Why These Choices?

### Next.js over Create React App
- Better performance (SSR)
- Built-in routing
- Image optimization
- API routes
- Better SEO

### Supabase over Firebase
- PostgreSQL (more powerful)
- Better TypeScript support
- Open source
- Real-time subscriptions
- Row Level Security

### Tailwind over Bootstrap
- Smaller bundle size
- More customizable
- Utility-first approach
- Better for custom designs

### Leaflet over Google Maps
- Free (no API key)
- Open source
- Lightweight
- Customizable

## Performance Optimizations

1. **Image Compression**
   - Resize to max 1200px
   - 80% JPEG quality
   - Base64 encoding

2. **Code Splitting**
   - Next.js automatic splitting
   - Dynamic imports for heavy components

3. **Caching**
   - LocalStorage for offline
   - Browser caching
   - CDN caching (Vercel)

4. **Lazy Loading**
   - Images load on scroll
   - Components load on demand

## Security Measures

1. **Environment Variables**
   - API keys in .env.local
   - Never committed to Git

2. **HTTPS Only**
   - Vercel provides automatic HTTPS
   - Geolocation requires HTTPS

3. **Input Validation**
   - TypeScript type checking
   - Form validation
   - Sanitize user input

4. **Database Security**
   - Row Level Security
   - Prepared statements
   - No SQL injection

## Browser Compatibility

**Supported Browsers:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Mobile:**
- iOS 14+
- Android 10+

**Required Features:**
- Geolocation API
- DeviceMotion API
- LocalStorage
- Web Audio API
- Canvas API
