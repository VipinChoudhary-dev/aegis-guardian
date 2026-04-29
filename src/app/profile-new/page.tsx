'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Camera, Save, Phone, Heart, QrCode, Plus, X, 
  Download, Shield, AlertCircle, CheckCircle, Loader
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import QRCodeReact from 'react-qr-code';
import { DatabaseService, UserProfile, EmergencyContact } from '@/lib/database-supabase';
import { QRCodeService, DigitalIDData } from '@/lib/qrcode-utils';
import { ImageUploadService } from '@/lib/image-upload';

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    name: '',
    phone: '',
    email: '',
    bloodType: '',
    photo: '',
    medicalInfo: '',
    emergencyContacts: []
  });
  const [qrCodeData, setQrCodeData] = useState<string>('');
  const [showQRModal, setShowQRModal] = useState(false);
  const [newContact, setNewContact] = useState<EmergencyContact>({
    name: '',
    phone: '',
    relationship: ''
  });
  const [showAddContact, setShowAddContact] = useState(false);

  // Load profile from Supabase
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      
      // Try localStorage first (faster and always works)
      const localProfile = localStorage.getItem('aegis-profile');
      if (localProfile) {
        const savedProfile = JSON.parse(localProfile);
        setProfile(savedProfile);
        if (savedProfile.qrCode) {
          setQrCodeData(savedProfile.qrCode);
        }
        setLoading(false);
        return;
      }
      
      // If no local profile, try Firebase
      const userId = 'user-' + Date.now();
      const existingProfile = await DatabaseService.getUserProfile(userId);
      
      if (existingProfile) {
        setProfile(existingProfile);
        const qrData = await generateQRCode(existingProfile);
        setQrCodeData(qrData);
      } else {
        // New user - generate digital ID
        const digitalId = DatabaseService.generateDigitalId();
        setProfile(prev => ({
          ...prev,
          userId,
          digitalId,
          emergencyContacts: []
        }));
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateQRCode = async (profileData: Partial<UserProfile>): Promise<string> => {
    // Embed essential data in URL params so it works without database
    const emergencyData = {
      id: profileData.digitalId,
      name: profileData.name,
      phone: profileData.phone,
      blood: profileData.bloodType,
      medical: profileData.medicalInfo,
      contacts: profileData.emergencyContacts?.map(c => ({
        n: c.name,
        p: c.phone,
        r: c.relationship
      }))
    };
    
    // Compress and encode
    const dataStr = JSON.stringify(emergencyData);
    const encoded = btoa(encodeURIComponent(dataStr));
    
    const baseUrl = window.location.origin;
    const emergencyCardUrl = `${baseUrl}/emergency-card?data=${encoded}`;
    return emergencyCardUrl;
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const photoBase64 = await ImageUploadService.uploadProfilePhoto(file);
      setProfile(prev => ({ ...prev, photo: photoBase64 }));
    } catch (error: any) {
      alert(error.message);
    }
  };

  const addEmergencyContact = () => {
    if (!newContact.name || !newContact.phone || !newContact.relationship) {
      alert('Please fill all contact fields');
      return;
    }

    setProfile(prev => ({
      ...prev,
      emergencyContacts: [...(prev.emergencyContacts || []), newContact]
    }));

    setNewContact({ name: '', phone: '', relationship: '' });
    setShowAddContact(false);
  };

  const removeEmergencyContact = (index: number) => {
    setProfile(prev => ({
      ...prev,
      emergencyContacts: prev.emergencyContacts?.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    if (!profile.name || !profile.phone) {
      alert('Please fill in Name and Phone number');
      return;
    }

    if (!profile.emergencyContacts || profile.emergencyContacts.length === 0) {
      alert('Please add at least one emergency contact');
      return;
    }

    try {
      setSaving(true);
      
      const userId = profile.userId || 'user-' + Date.now();
      const digitalId = profile.digitalId || DatabaseService.generateDigitalId();

      // Generate QR code
      const qrCode = await generateQRCode({ ...profile, digitalId });

      const fullProfile: Omit<UserProfile, 'createdAt' | 'lastActive'> = {
        userId,
        walletAddress: undefined,
        name: profile.name!,
        phone: profile.phone!,
        email: profile.email,
        bloodType: profile.bloodType,
        photo: profile.photo,
        emergencyContacts: profile.emergencyContacts!,
        medicalInfo: profile.medicalInfo,
        digitalId,
        qrCode
      };

      // Save to localStorage first (always works)
      localStorage.setItem('aegis-profile', JSON.stringify(fullProfile));
      
      // Try to save to Firebase (optional, won't block if it fails)
      try {
        const existingProfile = await DatabaseService.getUserProfile(userId);
        if (existingProfile) {
          await DatabaseService.updateUserProfile(userId, fullProfile);
        } else {
          await DatabaseService.createUserProfile(fullProfile);
        }
      } catch (firebaseError) {
        console.warn('Firebase save failed, but profile saved locally:', firebaseError);
        // Continue anyway - localStorage backup is enough for now
      }

      setProfile({ ...fullProfile });
      setQrCodeData(qrCode);
      
      alert('✅ Profile saved successfully!');
    } catch (error: any) {
      console.error('Error saving profile:', error);
      alert('❌ Error: ' + (error.message || 'Please try again'));
    } finally {
      setSaving(false);
    }
  };

  const downloadQRCode = () => {
    const svg = document.getElementById('qr-code-svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `aegis-guardian-${profile.digitalId}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Loader className="h-12 w-12 animate-spin text-teal-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-4xl mx-auto pt-20 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-teal-500 to-blue-500 rounded-full mb-4">
            <User className="h-10 w-10" />
          </div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
            Your Profile & Digital ID
          </h1>
          <p className="text-gray-400">Complete your profile for emergency identification</p>
        </motion.div>

        {/* Digital ID Card */}
        {profile.digitalId && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-teal-500/20 to-blue-500/20 border-2 border-teal-500 rounded-2xl p-6 mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Shield className="h-8 w-8 text-teal-400" />
                <div>
                  <h3 className="text-xl font-bold">Digital ID</h3>
                  <p className="text-sm text-gray-400">{profile.digitalId}</p>
                </div>
              </div>
              <button
                onClick={() => setShowQRModal(true)}
                className="px-4 py-2 bg-teal-500 hover:bg-teal-600 rounded-lg font-semibold flex items-center gap-2 transition-colors"
              >
                <QrCode className="h-5 w-5" />
                View QR
              </button>
            </div>
            <p className="text-sm text-gray-300">
              💡 Your Digital ID can be scanned in emergencies to access your medical info and emergency contacts
            </p>
          </motion.div>
        )}

        {/* Profile Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-900 border border-gray-800 rounded-2xl p-8 mb-8"
        >
          {/* Photo Upload */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gray-800 border-4 border-teal-500 overflow-hidden">
                {profile.photo ? (
                  <img src={profile.photo} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="h-16 w-16 text-gray-600" />
                  </div>
                )}
              </div>
              <label className="absolute bottom-0 right-0 w-10 h-10 bg-teal-500 hover:bg-teal-600 rounded-full flex items-center justify-center cursor-pointer transition-colors">
                <Camera className="h-5 w-5" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-300">
                Full Name *
              </label>
              <input
                type="text"
                value={profile.name || ''}
                onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-teal-500 focus:outline-none"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-300">
                Phone Number *
              </label>
              <input
                type="tel"
                value={profile.phone || ''}
                onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-teal-500 focus:outline-none"
                placeholder="+91-9876543210"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-300">
                Email (Optional)
              </label>
              <input
                type="email"
                value={profile.email || ''}
                onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-teal-500 focus:outline-none"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-300">
                Blood Type
              </label>
              <select
                value={profile.bloodType || ''}
                onChange={(e) => setProfile(prev => ({ ...prev, bloodType: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-teal-500 focus:outline-none"
              >
                <option value="">Select Blood Type</option>
                {BLOOD_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Medical Info */}
          <div className="mb-8">
            <label className="block text-sm font-semibold mb-2 text-gray-300">
              Medical Conditions / Allergies
            </label>
            <textarea
              value={profile.medicalInfo || ''}
              onChange={(e) => setProfile(prev => ({ ...prev, medicalInfo: e.target.value }))}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-teal-500 focus:outline-none h-24 resize-none"
              placeholder="e.g., Diabetic, Allergic to penicillin, Asthma..."
            />
          </div>

          {/* Emergency Contacts */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Heart className="h-6 w-6 text-red-500" />
                Emergency Contacts *
              </h3>
              <button
                onClick={() => setShowAddContact(true)}
                className="px-4 py-2 bg-teal-500 hover:bg-teal-600 rounded-lg font-semibold flex items-center gap-2 transition-colors"
              >
                <Plus className="h-5 w-5" />
                Add Contact
              </button>
            </div>

            {profile.emergencyContacts && profile.emergencyContacts.length > 0 ? (
              <div className="space-y-3">
                {profile.emergencyContacts.map((contact, index) => (
                  <div
                    key={index}
                    className="bg-gray-800 border border-gray-700 rounded-lg p-4 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-semibold">{contact.name}</p>
                      <p className="text-sm text-gray-400">{contact.phone}</p>
                      <p className="text-xs text-teal-400">{contact.relationship}</p>
                    </div>
                    <button
                      onClick={() => removeEmergencyContact(index)}
                      className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                    >
                      <X className="h-5 w-5 text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-yellow-500/10 border border-yellow-500 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-yellow-200">
                  Please add at least one emergency contact. They will be notified in case of emergency.
                </p>
              </div>
            )}
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-4 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 rounded-xl font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <Loader className="h-5 w-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                Save Profile
              </>
            )}
          </button>
        </motion.div>

        {/* Add Contact Modal */}
        <AnimatePresence>
          {showAddContact && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
              onClick={() => setShowAddContact(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gray-900 border-2 border-teal-500 rounded-2xl p-8 max-w-md w-full"
              >
                <h3 className="text-2xl font-bold mb-6">Add Emergency Contact</h3>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Name</label>
                    <input
                      type="text"
                      value={newContact.name}
                      onChange={(e) => setNewContact(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-teal-500 focus:outline-none"
                      placeholder="Mother"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Phone</label>
                    <input
                      type="tel"
                      value={newContact.phone}
                      onChange={(e) => setNewContact(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-teal-500 focus:outline-none"
                      placeholder="+91-9876543210"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Relationship</label>
                    <input
                      type="text"
                      value={newContact.relationship}
                      onChange={(e) => setNewContact(prev => ({ ...prev, relationship: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-teal-500 focus:outline-none"
                      placeholder="Mother, Father, Spouse, Friend..."
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowAddContact(false)}
                    className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addEmergencyContact}
                    className="flex-1 py-3 bg-teal-500 hover:bg-teal-600 rounded-lg font-semibold transition-colors"
                  >
                    Add Contact
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* QR Code Modal */}
        <AnimatePresence>
          {showQRModal && qrCodeData && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
              onClick={() => setShowQRModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl p-8 max-w-md w-full"
              >
                <h3 className="text-2xl font-bold mb-2 text-gray-900 text-center">
                  Your Digital ID QR Code
                </h3>
                <p className="text-sm text-gray-600 text-center mb-6">
                  Scan this in emergencies to access your info
                </p>

                <div className="bg-white p-6 rounded-xl mb-6 flex justify-center">
                  <QRCodeReact
                    id="qr-code-svg"
                    value={qrCodeData}
                    size={256}
                    level="H"
                  />
                </div>

                <div className="bg-gray-100 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-700 text-center">
                    <strong>Digital ID:</strong> {profile.digitalId}
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-xs text-blue-800 text-center">
                    📱 <strong>To help someone:</strong> Use Google Lens to scan their QR code and view their emergency contacts
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowQRModal(false)}
                    className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg font-semibold transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={downloadQRCode}
                    className="flex-1 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <Download className="h-5 w-5" />
                    Download
                  </button>
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
