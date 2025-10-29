'use client';

import { useState, useEffect } from 'react';
import { User, Phone, Camera, Globe, Save, Shield, Mail, MapPin } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { motion } from 'framer-motion';

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'हिन्दी (Hindi)', flag: '🇮🇳' },
  { code: 'kn', name: 'ಕನ್ನಡ (Kannada)', flag: '🇮🇳' },
  { code: 'ta', name: 'தமிழ் (Tamil)', flag: '🇮🇳' },
  { code: 'ml', name: 'മലയാളം (Malayalam)', flag: '🇮🇳' },
  { code: 'te', name: 'తెలుగు (Telugu)', flag: '🇮🇳' }
];

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    photo: '',
    emergencyContact1: '',
    emergencyContact2: '',
    language: 'en'
  });

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Load profile from localStorage
    const savedProfile = localStorage.getItem('aegis-profile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, []);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, photo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    localStorage.setItem('aegis-profile', JSON.stringify(profile));
    localStorage.setItem('aegis-language', profile.language);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto pt-20 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">
            <span className="glow-teal">Settings</span>
          </h1>
          <p className="text-gray-400 text-lg">Manage your profile and preferences</p>
        </motion.div>

        {/* Profile Photo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-8 mb-6"
        >
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              {profile.photo ? (
                <img
                  src={profile.photo}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-teal-400"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center">
                  <User className="h-16 w-16 text-white" />
                </div>
              )}
              <label className="absolute bottom-0 right-0 bg-teal-500 p-2 rounded-full cursor-pointer hover:bg-teal-600 transition-colors">
                <Camera className="h-5 w-5 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            </div>
            <p className="text-sm text-gray-400">Click camera icon to upload photo</p>
          </div>
        </motion.div>

        {/* Personal Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 mb-6"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <User className="h-6 w-6 text-teal-400" />
            Personal Information
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-teal-400 focus:outline-none transition-colors"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address
              </label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-teal-400 focus:outline-none transition-colors"
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone Number
              </label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-teal-400 focus:outline-none transition-colors"
                placeholder="+91 XXXXX XXXXX"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Address
              </label>
              <textarea
                value={profile.address}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-teal-400 focus:outline-none transition-colors"
                placeholder="Your address"
                rows={3}
              />
            </div>
          </div>
        </motion.div>

        {/* Emergency Contacts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6 mb-6"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Shield className="h-6 w-6 text-red-400" />
            Emergency Contacts
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Emergency Contact 1 (Name & Phone)
              </label>
              <input
                type="text"
                value={profile.emergencyContact1}
                onChange={(e) => setProfile({ ...profile, emergencyContact1: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-red-400 focus:outline-none transition-colors"
                placeholder="e.g., John Doe - +91 98765 43210"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Emergency Contact 2 (Name & Phone)
              </label>
              <input
                type="text"
                value={profile.emergencyContact2}
                onChange={(e) => setProfile({ ...profile, emergencyContact2: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-red-400 focus:outline-none transition-colors"
                placeholder="e.g., Jane Smith - +91 87654 32109"
              />
            </div>
          </div>
        </motion.div>

        {/* Language Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6 mb-6"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Globe className="h-6 w-6 text-blue-400" />
            Language Preference
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setProfile({ ...profile, language: lang.code })}
                className={`p-4 rounded-lg border-2 transition-all ${
                  profile.language === lang.code
                    ? 'border-teal-400 bg-teal-400/10'
                    : 'border-white/10 hover:border-white/30'
                }`}
              >
                <div className="text-3xl mb-2">{lang.flag}</div>
                <div className="text-sm font-medium text-white">{lang.name}</div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <button
            onClick={handleSave}
            className="w-full cyber-button py-4 text-lg font-bold flex items-center justify-center gap-3"
          >
            <Save className="h-6 w-6" />
            {saved ? '✓ Settings Saved!' : 'Save Settings'}
          </button>
        </motion.div>

        {/* Success Message */}
        {saved && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-6 glass-card p-4 border-l-4 border-teal-400"
          >
            <p className="text-teal-400 font-semibold flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Your settings have been saved successfully!
            </p>
          </motion.div>
        )}
      </div>
      <Navbar />
    </div>
  );
}
