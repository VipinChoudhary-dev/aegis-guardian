'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Phone, Heart, AlertCircle, User, Droplet, Loader } from 'lucide-react';
import { DatabaseService, UserProfile } from '@/lib/database-supabase';
import { use } from 'react';

export default function EmergencyCardPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    loadProfile();
  }, [resolvedParams.id]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      
      // Try localStorage first (for same device)
      const localProfile = localStorage.getItem('aegis-profile');
      if (localProfile) {
        const savedProfile = JSON.parse(localProfile);
        if (savedProfile.digitalId === resolvedParams.id) {
          setProfile(savedProfile);
          setLoading(false);
          return;
        }
      }
      
      // Search for user by digital ID in Firebase
      const allUsers = await DatabaseService.getUserProfile(resolvedParams.id);
      
      if (allUsers) {
        setProfile(allUsers);
      } else {
        setError(true);
      }
    } catch (err) {
      console.error('Error loading profile:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 to-orange-900 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader className="h-16 w-16 animate-spin text-white mx-auto mb-4" />
          <p className="text-white text-xl">Loading Emergency Information...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 to-orange-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl p-8 max-w-md w-full text-center"
        >
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h1>
          <p className="text-gray-600">
            This Digital ID could not be found. Please check the QR code and try again.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 to-orange-900 p-4">
      <div className="max-w-2xl mx-auto py-8">
        {/* Emergency Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-600 text-white rounded-2xl p-6 mb-6 text-center"
        >
          <Shield className="h-12 w-12 mx-auto mb-2" />
          <h1 className="text-3xl font-bold mb-2">🚨 EMERGENCY CARD 🚨</h1>
          <p className="text-red-100">This person may need immediate assistance</p>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-8 mb-6"
        >
          {/* Photo and Basic Info */}
          <div className="flex items-center gap-6 mb-6 pb-6 border-b border-gray-200">
            <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
              {profile.photo ? (
                <img src={profile.photo} alt={profile.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="h-12 w-12 text-gray-400" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-900 mb-1">{profile.name}</h2>
              <p className="text-gray-600 flex items-center gap-2">
                <Phone className="h-4 w-4" />
                {profile.phone}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Digital ID: <span className="font-mono font-semibold">{profile.digitalId}</span>
              </p>
            </div>
          </div>

          {/* Blood Type */}
          {profile.bloodType && (
            <div className="bg-red-50 border-2 border-red-500 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3">
                <Droplet className="h-8 w-8 text-red-500" />
                <div>
                  <p className="text-sm text-gray-600 font-semibold">Blood Type</p>
                  <p className="text-3xl font-bold text-red-600">{profile.bloodType}</p>
                </div>
              </div>
            </div>
          )}

          {/* Medical Information */}
          {profile.medicalInfo && (
            <div className="bg-yellow-50 border-2 border-yellow-500 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-gray-900 mb-1">⚠️ Medical Conditions</p>
                  <p className="text-gray-700">{profile.medicalInfo}</p>
                </div>
              </div>
            </div>
          )}

          {/* Emergency Contacts */}
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Heart className="h-6 w-6 text-red-500" />
              Emergency Contacts
            </h3>
            <div className="space-y-3">
              {profile.emergencyContacts.map((contact, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="bg-gray-50 border border-gray-200 rounded-xl p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-gray-900">{contact.name}</p>
                      <p className="text-sm text-gray-600">{contact.relationship}</p>
                      <p className="text-lg font-mono text-gray-900 mt-1">{contact.phone}</p>
                    </div>
                    <button
                      onClick={() => handleCall(contact.phone)}
                      className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold transition-colors flex items-center gap-2"
                    >
                      <Phone className="h-5 w-5" />
                      Call Now
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 gap-4"
        >
          <a
            href="tel:100"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl p-6 text-center font-bold text-lg transition-colors"
          >
            🚓 Call Police<br />
            <span className="text-3xl">100</span>
          </a>
          <a
            href="tel:108"
            className="bg-red-600 hover:bg-red-700 text-white rounded-xl p-6 text-center font-bold text-lg transition-colors"
          >
            🚑 Call Ambulance<br />
            <span className="text-3xl">108</span>
          </a>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mt-6 text-white"
        >
          <h3 className="font-bold text-lg mb-3">📋 Instructions for First Responders:</h3>
          <ul className="space-y-2 text-sm">
            <li>✓ Check for medical conditions and allergies above</li>
            <li>✓ Contact emergency contacts immediately</li>
            <li>✓ Provide blood type information to medical staff</li>
            <li>✓ Call emergency services if not already done</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
