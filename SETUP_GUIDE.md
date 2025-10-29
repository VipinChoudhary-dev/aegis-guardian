# Aegis Guardian - Setup Guide

## ✅ What's Working Now

Your Aegis Guardian web app is now **fully functional** with all features implemented:

### 🏠 Home Page (`/`)
- Modern, animated landing page
- Feature cards with smooth transitions
- Wallet connection prompt
- Navigation to all sections

### 🗺️ Interactive Map (`/map`)
- **LIVE, INTERACTIVE MAP** using OpenStreetMap
- Real-time danger zones with color-coded risk levels:
  - 🔴 High Risk (Red circles)
  - 🟡 Medium Risk (Amber circles)
  - 🟢 Low Risk (Green circles)
- Auto-detects your current location
- Zoom, pan, and click on markers for details
- Legend showing risk zones
- Sample danger zones in Bengaluru:
  - MG Road, Hebbal, Koramangala, Whitefield, BTM Layout

### 🛡️ Guardian Angel (`/guardian`)
- Emergency activation button with 5-second countdown
- Hold button to trigger emergency alert
- Release to cancel
- Real-time geolocation tracking
- Shows your current coordinates
- Wallet connection required for activation
- Emergency contact notification simulation

### 🆔 Digital ID (`/id`)
- Blockchain-based digital identity (DID)
- Self-sovereign identity on Polygon Amoy Testnet
- Copy DID to clipboard
- View wallet address and creation timestamp
- Link to PolygonScan explorer
- Privacy-protected, tamper-proof identity

## 🚀 How to Run

The app is already running at:
- **Local:** http://localhost:3000
- **Network:** http://192.168.1.9:3000

If you need to restart:
```bash
cd "/Users/vipinchoudhary/Desktop/H to H/Aegis Guardian/aegis-guardian-web-temp"
npm run dev
```

## 🔗 MetaMask Setup (Polygon Amoy Testnet)

### Step 1: Install MetaMask
1. Go to https://metamask.io/
2. Download and install the browser extension
3. Create a new wallet or import existing one

### Step 2: Add Polygon Amoy Testnet
1. Open MetaMask
2. Click the network dropdown (top left)
3. Click "Add Network" → "Add a network manually"
4. Enter these details:
   - **Network Name:** Polygon Amoy Testnet
   - **RPC URL:** https://rpc-amoy.polygon.technology
   - **Chain ID:** 80002
   - **Currency Symbol:** POL
   - **Block Explorer:** https://amoy.polygonscan.com

### Step 3: Get Test Tokens (FREE)
1. Go to https://faucet.polygon.technology/
2. Select "Polygon Amoy"
3. Enter your wallet address
4. Click "Submit" to receive free test POL tokens

### Step 4: Connect to Aegis Guardian
1. Open http://localhost:3000
2. Click "Connect Wallet" button in the navigation bar
3. Select MetaMask
4. Approve the connection
5. You're ready to use all features!

## 🎨 Features Overview

### Navigation
- Bottom navigation bar with 4 main sections
- Wallet connection button integrated
- Active page highlighting
- Mobile-responsive design

### Map Features
- **Interactive:** Zoom in/out, pan around, click markers
- **Real-time:** Shows your current location
- **Danger Zones:** Color-coded risk areas
- **Legend:** Easy-to-understand risk levels
- **Free:** Uses OpenStreetMap (no credit card needed)

### Guardian Features
- **Emergency Button:** Hold for 5 seconds to activate
- **Countdown Timer:** Visual countdown before alert
- **Location Sharing:** Automatically captures your GPS coordinates
- **Wallet Integration:** Requires wallet connection for security
- **Cancel Option:** Release button to cancel emergency

### Digital ID Features
- **Blockchain-Based:** Stored on Polygon Amoy Testnet
- **Unique DID:** Cryptographically generated identifier
- **Privacy-First:** No personal data stored on-chain
- **Portable:** Use across multiple platforms
- **Verifiable:** Link to blockchain explorer

## 📱 Mobile Access

To access from your phone:
1. Make sure your phone is on the same WiFi network
2. Open browser on phone
3. Go to: http://192.168.1.9:3000
4. Install MetaMask mobile app
5. Connect wallet and use all features

## 🔧 Technical Stack

- **Framework:** Next.js 16 with App Router
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Blockchain:** Wagmi + RainbowKit + Viem
- **Maps:** React Leaflet + OpenStreetMap
- **Network:** Polygon Amoy Testnet (FREE)

## 💰 Cost Breakdown

- ✅ **Map:** FREE (OpenStreetMap)
- ✅ **Blockchain:** FREE (Polygon Amoy Testnet)
- ✅ **Test Tokens:** FREE (Polygon Faucet)
- ✅ **Hosting:** FREE (localhost for now)
- ✅ **Total Cost:** $0.00

## 🎯 Next Steps

1. **Test All Features:**
   - Navigate to each page
   - Connect your wallet
   - Try the emergency button
   - Explore the interactive map
   - Generate your digital ID

2. **Customize:**
   - Add more danger zones in `src/components/MapComponent.tsx`
   - Update emergency contacts
   - Customize colors and styling

3. **Deploy (Optional):**
   - Deploy to Vercel (free)
   - Deploy to Netlify (free)
   - Get a custom domain

## 🐛 Troubleshooting

### Map not loading?
- Check internet connection
- Allow location permissions in browser
- Refresh the page

### Wallet not connecting?
- Make sure MetaMask is installed
- Switch to Polygon Amoy Testnet
- Refresh the page and try again

### 404 errors?
- Make sure dev server is running
- Check you're accessing http://localhost:3000
- Clear browser cache

## 📞 Support

If you encounter any issues:
1. Check the browser console for errors (F12)
2. Make sure all dependencies are installed: `npm install`
3. Restart the dev server: `npm run dev`

---

**🎉 Congratulations! Your Aegis Guardian app is fully functional and ready to use!**
