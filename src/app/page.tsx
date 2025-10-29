'use client';

import { motion } from 'framer-motion';
import { Shield, Map, FileText, Award, Building2, Phone, User, Activity, TrendingUp, AlertTriangle, CheckCircle, Zap, QrCode } from 'lucide-react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { useEffect, useState } from 'react';
import { SoundManager } from '@/utils/sounds';

export default function Home() {
  const [stats, setStats] = useState({
    safeZones: 10,
    alerts: 4,
    nftsCollected: 0,
    reportsSubmitted: 0
  });

  useEffect(() => {
    // Load stats from localStorage
    const nfts = JSON.parse(localStorage.getItem('aegis-nfts') || '[]');
    setStats(prev => ({ ...prev, nftsCollected: nfts.length }));
  }, []);

  return (
    <div className="min-h-screen">
      {/* Top Navigation Bar */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center"
              style={{ animation: 'glow-pulse 2s infinite' }}
            >
              <Shield className="h-6 w-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold glow-teal" style={{ animation: 'logo-glow 3s infinite' }}>
                AEGIS
              </h1>
              <p className="text-xs text-gray-400">Smart Travel Shield</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 glass rounded-lg">
              <Activity className="h-4 w-4 text-teal-400" />
              <span className="text-sm text-gray-300">System Active</span>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Main Dashboard */}
      <div className="pt-24 pb-32 px-4 max-w-7xl mx-auto">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-4xl font-bold mb-2">
            Welcome to <span className="glow-teal">AEGIS</span>
          </h2>
          <p className="text-gray-400 text-lg">Your AI-powered travel security companion</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="h-8 w-8 text-teal-400" />
              <TrendingUp className="h-4 w-4 text-green-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stats.safeZones}</div>
            <div className="text-sm text-gray-400">Safe Zones</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <AlertTriangle className="h-8 w-8 text-red-400" />
              <Activity className="h-4 w-4 text-red-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stats.alerts}</div>
            <div className="text-sm text-gray-400">Active Alerts</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <Award className="h-8 w-8 text-blue-400" />
              <Zap className="h-4 w-4 text-blue-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stats.nftsCollected}</div>
            <div className="text-sm text-gray-400">NFTs Collected</div>
          </motion.div>
        </div>

        {/* Emergency SOS - Featured */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-8"
        >
          <Link href="/guardian" onClick={() => SoundManager.playClick()}>
            <div className="relative group cursor-pointer">
              <div className="absolute -inset-1 bg-gradient-to-r from-red-500 via-pink-500 to-red-500 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition duration-300"></div>
              <div className="relative glass-card p-8 border-2 border-red-500/30 hover:border-red-500/60 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center animate-pulse">
                      <Shield className="h-10 w-10 text-white" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-white mb-2">Emergency SOS</h3>
                      <p className="text-gray-400">Instant emergency response • Shake to activate</p>
                    </div>
                  </div>
                  <div className="hidden md:flex items-center gap-4 text-sm">
                    <div className="px-4 py-2 glass rounded-lg">
                      <span className="text-blue-400">Police: 100</span>
                    </div>
                    <div className="px-4 py-2 glass rounded-lg">
                      <span className="text-red-400">Ambulance: 108</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Main Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Link href="/map" onClick={() => SoundManager.playClick()}>
              <div className="glass-card p-6 h-full group cursor-pointer">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-teal-400 to-green-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Map className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Safety Map</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Real-time danger zones, safe spots & NFT locations with live weather
                </p>
                <div className="flex gap-2 flex-wrap">
                  <span className="px-2 py-1 text-xs bg-red-500/20 text-red-400 rounded-full border border-red-500/30">Danger Zones</span>
                  <span className="px-2 py-1 text-xs bg-teal-500/20 text-teal-400 rounded-full border border-teal-500/30">Safe Spots</span>
                </div>
              </div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Link href="/profile-new" onClick={() => SoundManager.playClick()}>
              <div className="glass-card p-6 h-full group cursor-pointer">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <User className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Digital ID</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Blockchain-verified identity with QR code for instant verification
                </p>
                <div className="flex gap-2 flex-wrap">
                  <span className="px-2 py-1 text-xs bg-blue-500/20 text-blue-400 rounded-full border border-blue-500/30">QR Code</span>
                  <span className="px-2 py-1 text-xs bg-purple-500/20 text-purple-400 rounded-full border border-purple-500/30">Blockchain</span>
                </div>
              </div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <Link href="/rewards" onClick={() => SoundManager.playClick()}>
              <div className="glass-card p-6 h-full group cursor-pointer">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">NFT Rewards</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Collect unique NFTs by visiting famous tourist spots in Bengaluru
                </p>
                <div className="flex gap-2 flex-wrap">
                  <span className="px-2 py-1 text-xs bg-yellow-500/20 text-yellow-400 rounded-full border border-yellow-500/30">10 Spots</span>
                  <span className="px-2 py-1 text-xs bg-orange-500/20 text-orange-400 rounded-full border border-orange-500/30">Rare NFTs</span>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>

        {/* Secondary Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
          >
            <Link href="/efir" onClick={() => SoundManager.playClick()}>
              <div className="glass-card p-6 group cursor-pointer">
                <FileText className="h-8 w-8 text-blue-400 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-bold text-white mb-2">File E-FIR</h3>
                <p className="text-gray-400 text-sm">Submit electronic police reports with evidence directly to authorities</p>
              </div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
          >
            <Link href="/safety" onClick={() => SoundManager.playClick()}>
              <div className="glass-card p-6 group cursor-pointer">
                <Building2 className="h-8 w-8 text-cyan-400 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-bold text-white mb-2">Safe Hotels & Embassies</h3>
                <p className="text-gray-400 text-sm">Verified safe hotels and embassy contacts</p>
              </div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <Link href="/contacts" onClick={() => SoundManager.playClick()}>
              <div className="glass-card p-6 group cursor-pointer">
                <Phone className="h-8 w-8 text-teal-400 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-bold text-white mb-2">Emergency Contacts</h3>
                <p className="text-gray-400 text-sm">Quick access to all emergency numbers</p>
              </div>
            </Link>
          </motion.div>
        </div>

        {/* Status Banner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="mt-8 glass-card p-6 border-l-4 border-teal-400"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 rounded-full bg-teal-400 animate-pulse"></div>
              <div>
                <p className="font-semibold text-white">
                  All Features Active
                </p>
                <p className="text-sm text-gray-400">
                  Emergency services, NFT rewards, and E-FIR ready
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <Navbar />
    </div>
  );
}
