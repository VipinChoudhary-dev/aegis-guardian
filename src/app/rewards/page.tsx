'use client';

import { useState, useEffect } from 'react';
import { Award, MapPin, Calendar, ExternalLink, Trophy } from 'lucide-react';
import { useAccount } from 'wagmi';
import { Navbar } from '@/components/Navbar';
import { motion } from 'framer-motion';

interface NFTReward {
  id: string;
  name: string;
  icon: string;
  image?: string;
  location: string;
  date: string;
  rarity: 'common' | 'rare' | 'legendary';
}

export default function RewardsPage() {
  const { address, isConnected } = useAccount();
  const [nfts, setNfts] = useState<NFTReward[]>([]);

  useEffect(() => {
    // Load NFTs from localStorage
    const savedNFTs = localStorage.getItem('aegis-nfts');
    if (savedNFTs) {
      setNfts(JSON.parse(savedNFTs));
    }
  }, []);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'from-amber-500 to-yellow-500';
      case 'rare': return 'from-purple-500 to-pink-500';
      default: return 'from-blue-500 to-indigo-500';
    }
  };

  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'border-amber-500';
      case 'rare': return 'border-purple-500';
      default: return 'border-blue-500';
    }
  };

  // NFT rewards work for everyone! Wallet adds blockchain minting

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-6xl mx-auto pt-20 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-full mb-6 shadow-2xl">
            <Trophy className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent">
            NFT Rewards Collection
          </h1>
          <p className="text-slate-400">Collect unique NFTs by visiting tourist spots in Bengaluru</p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-3 gap-4 max-w-3xl mx-auto mb-12"
        >
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700/50 text-center">
            <div className="text-3xl font-bold text-indigo-400 mb-1">{nfts.length}</div>
            <div className="text-sm text-slate-400">Total NFTs</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700/50 text-center">
            <div className="text-3xl font-bold text-purple-400 mb-1">
              {nfts.filter(n => n.rarity === 'rare').length}
            </div>
            <div className="text-sm text-slate-400">Rare NFTs</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700/50 text-center">
            <div className="text-3xl font-bold text-amber-400 mb-1">
              {nfts.filter(n => n.rarity === 'legendary').length}
            </div>
            <div className="text-sm text-slate-400">Legendary</div>
          </div>
        </motion.div>

        {/* NFT Grid */}
        {nfts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-6">🗺️</div>
            <h3 className="text-2xl font-bold mb-4">No NFTs Yet</h3>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">
              Visit tourist spots on the map to collect unique NFT badges. Each location has its own special NFT!
            </p>
            <a
              href="/map"
              className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-semibold transition-colors"
            >
              <MapPin className="h-5 w-5 mr-2" />
              Explore Map
            </a>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {nfts.map((nft, index) => (
              <motion.div
                key={nft.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-slate-800/50 backdrop-blur-xl rounded-2xl overflow-hidden border-2 ${getRarityBorder(nft.rarity)} shadow-2xl hover:scale-105 transition-transform`}
              >
                {/* NFT Image/Icon */}
                <div className={`h-48 bg-gradient-to-br ${getRarityColor(nft.rarity)} flex items-center justify-center relative overflow-hidden`}>
                  {nft.image ? (
                    <>
                      <img 
                        src={nft.image} 
                        alt={nft.name}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30"></div>
                    </>
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-black/20"></div>
                      <div className="text-8xl relative z-10">{nft.icon}</div>
                    </>
                  )}
                  <div className="absolute top-3 right-3 z-20">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      nft.rarity === 'legendary' ? 'bg-amber-500 text-white' :
                      nft.rarity === 'rare' ? 'bg-purple-500 text-white' :
                      'bg-blue-500 text-white'
                    }`}>
                      {nft.rarity}
                    </span>
                  </div>
                </div>

                {/* NFT Details */}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3">{nft.name}</h3>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-slate-400">
                      <MapPin className="h-4 w-4 mr-2" />
                      {nft.location}
                    </div>
                    <div className="flex items-center text-sm text-slate-400">
                      <Calendar className="h-4 w-4 mr-2" />
                      {nft.date}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2">
                      <ExternalLink className="h-4 w-4" />
                      View on Chain
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Available Locations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <MapPin className="h-6 w-6 text-indigo-400" />
            Available NFT Locations
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center gap-4 p-4 bg-slate-700/30 rounded-xl">
              <div className="text-4xl">🌳</div>
              <div>
                <h4 className="font-semibold">Lalbagh Botanical Garden</h4>
                <p className="text-sm text-slate-400">Common NFT</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-slate-700/30 rounded-xl">
              <div className="text-4xl">🛕</div>
              <div>
                <h4 className="font-semibold">ISKCON Temple</h4>
                <p className="text-sm text-slate-400">Rare NFT</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-slate-700/30 rounded-xl">
              <div className="text-4xl">🏛️</div>
              <div>
                <h4 className="font-semibold">Vidhana Soudha</h4>
                <p className="text-sm text-slate-400">Legendary NFT</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-slate-700/30 rounded-xl">
              <div className="text-4xl">🦁</div>
              <div>
                <h4 className="font-semibold">Bannerghatta National Park</h4>
                <p className="text-sm text-slate-400">Rare NFT</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      <Navbar />
    </div>
  );
}
