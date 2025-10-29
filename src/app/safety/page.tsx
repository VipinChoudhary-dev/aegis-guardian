'use client';

import { useState } from 'react';
import { Building2, Phone, MapPin, Star, Shield, Globe, X, Wifi, Coffee, Car, Utensils } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { safeHotels, embassies } from '@/data/touristSpots';

export default function SafetyPage() {
  const [activeTab, setActiveTab] = useState<'hotels' | 'embassies'>('hotels');
  const [selectedHotel, setSelectedHotel] = useState<any>(null);

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-6xl mx-auto pt-20 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-blue-500 rounded-full mb-6 shadow-2xl">
            <Shield className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Safety Resources
          </h1>
          <p className="text-purple-200">Verified safe hotels & embassy contacts</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 max-w-md mx-auto">
          <button
            onClick={() => setActiveTab('hotels')}
            className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'hotels'
                ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg'
                : 'bg-purple-700/30 text-purple-200 hover:bg-purple-700/50'
            }`}
          >
            <Building2 className="h-5 w-5 inline mr-2" />
            Safe Hotels
          </button>
          <button
            onClick={() => setActiveTab('embassies')}
            className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'embassies'
                ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg'
                : 'bg-purple-700/30 text-purple-200 hover:bg-purple-700/50'
            }`}
          >
            <Globe className="h-5 w-5 inline mr-2" />
            Embassies
          </button>
        </div>

        {/* Hotels Tab */}
        {activeTab === 'hotels' && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="grid md:grid-cols-2 gap-6"
          >
            {safeHotels.map((hotel, index) => (
              <motion.div
                key={hotel.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-purple-800/30 backdrop-blur-xl rounded-2xl overflow-hidden border border-purple-600/50 shadow-2xl hover:scale-105 transition-transform"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold">{hotel.name}</h3>
                    {hotel.verified && (
                      <div className="bg-green-500 px-2 py-1 rounded-full flex items-center gap-1">
                        <Shield className="h-3 w-3" />
                        <span className="text-xs font-semibold">Verified</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(hotel.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  <p className="text-purple-200 text-sm mb-4">{hotel.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="text-green-400 font-bold text-lg">{hotel.price}</div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setSelectedHotel(hotel)}
                        className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 rounded-lg font-semibold transition-all"
                      >
                        View Details
                      </button>
                      {(hotel as any).bookingUrl && (
                        <a 
                          href={(hotel as any).bookingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 rounded-lg font-semibold transition-all"
                        >
                          Book Now
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Embassies Tab */}
        {activeTab === 'embassies' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-3xl mx-auto space-y-4"
          >
            {embassies.map((embassy, index) => (
              <motion.div
                key={embassy.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-purple-800/30 backdrop-blur-xl rounded-xl p-6 border border-purple-600/50 shadow-xl hover:shadow-2xl transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                      <Globe className="h-5 w-5 text-blue-400" />
                      {embassy.name}
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center text-purple-200">
                        <Phone className="h-4 w-4 mr-2 text-green-400" />
                        <a href={`tel:${embassy.phone}`} className="hover:text-green-400 transition-colors">
                          {embassy.phone}
                        </a>
                      </div>
                      <div className="flex items-center text-purple-200">
                        <MapPin className="h-4 w-4 mr-2 text-yellow-400" />
                        <span>{embassy.address}</span>
                      </div>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-lg font-semibold transition-all">
                    Call Now
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 bg-blue-900/20 border border-blue-500/30 rounded-xl p-6 max-w-3xl mx-auto"
        >
          <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-400" />
            Safety Tips
          </h3>
          <ul className="space-y-2 text-sm text-purple-200">
            <li className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <span>All listed hotels are verified for safety and security</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <span>Keep embassy contact numbers saved in your phone</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <span>Share your hotel details with family or friends</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <span>Use official booking channels for best rates and safety</span>
            </li>
          </ul>
        </motion.div>

        {/* Hotel Details Modal */}
        <AnimatePresence>
          {selectedHotel && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedHotel(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gray-900 border-2 border-green-500 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="relative h-64 overflow-hidden">
                  <img src={selectedHotel.image} alt={selectedHotel.name} className="w-full h-full object-cover" />
                  <button
                    onClick={() => setSelectedHotel(null)}
                    className="absolute top-4 right-4 bg-black/80 p-2 rounded-full hover:bg-black transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                  {selectedHotel.verified && (
                    <div className="absolute top-4 left-4 bg-green-500 px-3 py-1 rounded-full flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      <span className="font-semibold">Verified Safe</span>
                    </div>
                  )}
                </div>

                <div className="p-8">
                  <h2 className="text-3xl font-bold mb-2 neon-text-green">{selectedHotel.name}</h2>
                  <div className="flex items-center gap-2 mb-6">
                    {[...Array(selectedHotel.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-gray-400 ml-2">({selectedHotel.rating} Star Hotel)</span>
                  </div>

                  <p className="text-gray-300 text-lg mb-6">{selectedHotel.description}</p>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-black/50 border border-gray-700 rounded-lg p-4">
                      <Wifi className="h-6 w-6 text-blue-400 mb-2" />
                      <p className="text-sm font-semibold">Free WiFi</p>
                      <p className="text-xs text-gray-400">High-speed internet</p>
                    </div>
                    <div className="bg-black/50 border border-gray-700 rounded-lg p-4">
                      <Coffee className="h-6 w-6 text-yellow-400 mb-2" />
                      <p className="text-sm font-semibold">Breakfast</p>
                      <p className="text-xs text-gray-400">Complimentary</p>
                    </div>
                    <div className="bg-black/50 border border-gray-700 rounded-lg p-4">
                      <Car className="h-6 w-6 text-green-400 mb-2" />
                      <p className="text-sm font-semibold">Parking</p>
                      <p className="text-xs text-gray-400">Free valet service</p>
                    </div>
                    <div className="bg-black/50 border border-gray-700 rounded-lg p-4">
                      <Utensils className="h-6 w-6 text-red-400 mb-2" />
                      <p className="text-sm font-semibold">Restaurant</p>
                      <p className="text-xs text-gray-400">Multi-cuisine</p>
                    </div>
                  </div>

                  <div className="bg-green-500/10 border border-green-500 rounded-lg p-4 mb-6">
                    <h3 className="font-bold text-lg mb-2 text-green-400">Safety Features</h3>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li className="flex items-center gap-2">
                        <span className="text-green-400">✓</span>
                        <span>24/7 Security & CCTV surveillance</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-400">✓</span>
                        <span>Female-friendly & solo traveler safe</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-400">✓</span>
                        <span>Emergency response team on-site</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-400">✓</span>
                        <span>Verified by Aegis Guardian</span>
                      </li>
                    </ul>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Starting from</p>
                      <p className="text-3xl font-bold neon-text-yellow">{selectedHotel.price}</p>
                      <p className="text-gray-400 text-xs">per night</p>
                    </div>
                    {(selectedHotel as any).bookingUrl ? (
                      <a 
                        href={(selectedHotel as any).bookingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 rounded-xl font-bold text-lg transition-all inline-block"
                      >
                        Book Now
                      </a>
                    ) : (
                      <button className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 rounded-xl font-bold text-lg transition-all">
                        Book Now
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Navbar />
    </div>
  );
}
