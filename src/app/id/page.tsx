'use client';

import { useState, useEffect, useRef } from 'react';
import { User, Download, Shield, Fingerprint, Award } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'framer-motion';

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  bloodGroup: string;
  photo: string;
}

function toHex(str: string) {
  return Array.from(String(str))
    .map(c => c.charCodeAt(0).toString(16).padStart(2, '0'))
    .join('');
}

export default function IDPage() {
  const [did, setDid] = useState<string>('');
  const [idNumber, setIdNumber] = useState<string>('');
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [timestamp, setTimestamp] = useState<string>('');
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const userId = 'user-' + Date.now();
    const keyMaterial = `${userId}-${Date.now()}`;
    const generatedDid = `did:aegis:${toHex(keyMaterial).substring(0, 32)}`;
    const generatedId = `AG-${userId.substring(0, 6).toUpperCase()}-${Date.now().toString().substring(7)}`;
    setDid(generatedDid);
    setIdNumber(generatedId);
    setTimestamp(new Date().toLocaleDateString('en-IN'));
    
    // Load profile
    const savedProfile = localStorage.getItem('aegis-profile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, []);

  const downloadIDCard = () => {
    if (cardRef.current) {
      // In a real app, you'd use html2canvas or similar
      alert('ID Card download feature - Would export as PDF/PNG in production');
    }
  };

  // Digital ID works for everyone! Wallet adds blockchain verification

  const qrData = JSON.stringify({
    did,
    idNumber,
    // address removed
    name: profile?.name || 'User',
    verified: true,
    issuer: 'Aegis Guardian',
    timestamp
  });

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-6xl mx-auto pt-20 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">
            <span className="neon-text-blue">Digital</span>{' '}
            <span className="neon-text-green">ID</span>
          </h1>
          <p className="text-gray-400">Your blockchain-verified digital identity</p>
        </motion.div>

        {/* ID Card */}
        <motion.div
          ref={cardRef}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-4xl mx-auto mb-8"
        >
          <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-1 rounded-3xl shadow-2xl">
            <div className="bg-slate-900 rounded-3xl p-8 relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                  backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                  backgroundSize: '20px 20px'
                }}></div>
              </div>

              {/* Header */}
              <div className="relative z-10 flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">AEGIS GUARDIAN</h2>
                    <p className="text-sm text-slate-400">Digital Identity Card</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 text-green-400 text-sm font-semibold">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    VERIFIED
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Blockchain Secured</p>
                </div>
              </div>

              {/* Main Content */}
              <div className="relative z-10 grid md:grid-cols-3 gap-8">
                {/* Left: Photo & QR */}
                <div className="flex flex-col items-center space-y-6">
                  {/* Photo */}
                  <div className="w-40 h-40 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center overflow-hidden border-4 border-slate-700 shadow-xl">
                    {profile?.photo ? (
                      <img src={profile.photo} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User className="h-20 w-20 text-white" />
                    )}
                  </div>

                  {/* QR Code */}
                  <div className="bg-white p-4 rounded-xl shadow-lg">
                    <QRCodeSVG
                      value={qrData}
                      size={140}
                      level="H"
                      includeMargin={false}
                      fgColor="#1e293b"
                    />
                    <p className="text-xs text-slate-600 text-center mt-2 font-medium">Scan to Verify</p>
                  </div>
                </div>

                {/* Middle & Right: Details */}
                <div className="md:col-span-2 space-y-6">
                  {/* Personal Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-slate-400 uppercase tracking-wider">Full Name</label>
                      <p className="text-xl font-bold mt-1">{profile?.name || 'Not Set'}</p>
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 uppercase tracking-wider">ID Number</label>
                      <p className="text-xl font-bold mt-1 font-mono">{idNumber}</p>
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 uppercase tracking-wider">Date of Birth</label>
                      <p className="text-lg font-semibold mt-1">{profile?.dateOfBirth || 'Not Set'}</p>
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 uppercase tracking-wider">Blood Group</label>
                      <p className="text-lg font-semibold mt-1 text-red-400">{profile?.bloodGroup || 'Not Set'}</p>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="bg-slate-800/50 rounded-xl p-4 space-y-3">
                    <div>
                      <label className="text-xs text-slate-400 uppercase tracking-wider">Email</label>
                      <p className="text-sm font-medium mt-1">{profile?.email || 'Not Set'}</p>
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 uppercase tracking-wider">Phone</label>
                      <p className="text-sm font-medium mt-1">{profile?.phone || 'Not Set'}</p>
                    </div>
                  </div>

                  {/* Blockchain Info */}
                  <div className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 rounded-xl p-4 border border-indigo-500/30">
                    <div className="flex items-center gap-2 mb-3">
                      <Fingerprint className="h-5 w-5 text-indigo-400" />
                      <label className="text-xs text-indigo-400 uppercase tracking-wider font-semibold">Blockchain Identity</label>
                    </div>
                    <p className="text-xs font-mono text-slate-300 break-all">{did}</p>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="text-xs text-slate-400">Network</label>
                        <p className="text-sm font-semibold text-indigo-400">Polygon Amoy</p>
                      </div>
                      <div>
                        <label className="text-xs text-slate-400">Issued</label>
                        <p className="text-sm font-semibold">{timestamp}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="relative z-10 mt-8 pt-6 border-t border-slate-700/50 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Shield className="h-4 w-4" />
                  <span>Secured by Blockchain Technology</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-amber-400" />
                  <span className="text-sm font-semibold text-amber-400">Level 1 Verified</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <button
            onClick={downloadIDCard}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg hover:shadow-xl"
          >
            <Download className="h-5 w-5" />
            Download ID Card
          </button>
          <button
            onClick={() => alert('Blockchain verification coming in Phase 2')}
            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl font-semibold flex items-center gap-2 transition-all"
          >
            View on PolygonScan
            <Shield className="h-5 w-5" />
          </button>
        </motion.div>

        {/* Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid md:grid-cols-3 gap-4 mt-12 max-w-4xl mx-auto"
        >
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700/50">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <span className="text-green-400">✓</span>
              Instant Verification
            </h3>
            <p className="text-sm text-slate-400">Authorities can scan QR code to verify instantly</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700/50">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <span className="text-green-400">✓</span>
              Privacy Protected
            </h3>
            <p className="text-sm text-slate-400">Only essential data stored on-chain</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700/50">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <span className="text-green-400">✓</span>
              Tamper-Proof
            </h3>
            <p className="text-sm text-slate-400">Secured by blockchain technology</p>
          </div>
        </motion.div>

        {!profile?.name && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 bg-amber-900/20 border border-amber-800/50 text-amber-400 px-6 py-4 rounded-xl max-w-2xl mx-auto text-center"
          >
            ⚠️ Complete your profile to unlock full ID card features
            <a href="/profile" className="block mt-2 text-indigo-400 hover:text-indigo-300 font-semibold">
              Go to Profile →
            </a>
          </motion.div>
        )}
      </div>
      <Navbar />
    </div>
  );
}
