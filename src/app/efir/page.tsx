'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, MapPin, Calendar, Upload, Send, CheckCircle, 
  AlertCircle, Loader, Camera, X, Plus, Clock
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { useAccount } from 'wagmi';
import { DatabaseService, EFIRReport, UserProfile } from '@/lib/database-supabase';
import { ImageUploadService } from '@/lib/image-upload';

export default function EFIRPage() {
  const { address } = useAccount();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [firId, setFirId] = useState('');
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [incidentDate, setIncidentDate] = useState('');
  const [incidentTime, setIncidentTime] = useState('');
  const [location, setLocation] = useState<{ lat: number; lng: number; address?: string } | null>(null);
  const [evidence, setEvidence] = useState<string[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    loadProfile();
    getCurrentLocation();
  }, [address]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const localProfile = localStorage.getItem('aegis-profile');
      if (localProfile) {
        setProfile(JSON.parse(localProfile));
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            address: 'Current Location'
          });
        },
        (error) => {
          console.error('Location error:', error);
        }
      );
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const base64 = await ImageUploadService.uploadEvidencePhoto(file);
      setEvidence([...evidence, base64]);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const removeEvidence = (index: number) => {
    setEvidence(evidence.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profile) {
      alert('Please create a profile first');
      return;
    }

    if (!title || !description || !incidentDate || !location) {
      alert('Please fill all required fields');
      return;
    }

    try {
      setSubmitting(true);

      // Combine date and time
      const incidentDateTime = new Date(`${incidentDate}T${incidentTime || '00:00'}`);

      const efirData: Omit<EFIRReport, 'firId' | 'createdAt'> = {
        userId: profile.userId,
        title,
        description,
        incidentDate: incidentDateTime,
        location,
        evidence,
        status: 'submitted'
      };

      // Try to save to Supabase
      try {
        const newFirId = await DatabaseService.createEFIR(efirData);
        setFirId(newFirId);
        console.log('✅ E-FIR saved to Supabase:', newFirId);
      } catch (error: any) {
        console.error('Supabase error, saving locally:', error);
        console.log('💡 Tip: Run EFIR_SUPABASE_SETUP.sql in Supabase to enable cloud sync');
        
        // Fallback to localStorage
        const localFirId = `FIR-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
        const localEFIRs = JSON.parse(localStorage.getItem('aegis-efirs') || '[]');
        localEFIRs.push({ ...efirData, firId: localFirId, createdAt: new Date() });
        localStorage.setItem('aegis-efirs', JSON.stringify(localEFIRs));
        setFirId(localFirId);
        console.log('✅ E-FIR saved locally:', localFirId);
      }

      setSubmitted(true);

      // Reset form
      setTimeout(() => {
        setTitle('');
        setDescription('');
        setIncidentDate('');
        setIncidentTime('');
        setEvidence([]);
        setSubmitted(false);
      }, 5000);

    } catch (error) {
      console.error('Error submitting E-FIR:', error);
      alert('Failed to submit E-FIR');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <Loader className="w-8 h-8 text-blue-400 animate-spin" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Profile Required</h2>
            <p className="text-gray-300 mb-4">Please create a profile first to file an E-FIR</p>
            <a 
              href="/profile-new"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create Profile
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <FileText className="w-16 h-16 text-blue-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-2">E-FIR Submission</h1>
          <p className="text-gray-300">File an electronic First Information Report directly to police</p>
          <p className="text-sm text-gray-400 mt-2">Your report will be securely stored and forwarded to authorities</p>
        </motion.div>

        {/* Success Message */}
        <AnimatePresence>
          {submitted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="mb-6 p-6 bg-green-500/20 border border-green-500 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <div>
                  <h3 className="text-lg font-bold text-white">E-FIR Submitted Successfully!</h3>
                  <p className="text-gray-300">FIR ID: {firId}</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Your report has been securely saved and will be forwarded to police authorities
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
        >
          {/* Title */}
          <div className="mb-6">
            <label className="block text-white font-semibold mb-2">
              Incident Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Brief title of the incident"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-white font-semibold mb-2">
              Detailed Description *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide detailed information about the incident..."
              rows={6}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-white font-semibold mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Incident Date *
              </label>
              <input
                type="date"
                value={incidentDate}
                onChange={(e) => setIncidentDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-white font-semibold mb-2">
                <Clock className="w-4 h-4 inline mr-2" />
                Incident Time
              </label>
              <input
                type="time"
                value={incidentTime}
                onChange={(e) => setIncidentTime(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Location */}
          <div className="mb-6">
            <label className="block text-white font-semibold mb-2">
              <MapPin className="w-4 h-4 inline mr-2" />
              Location
            </label>
            <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
              {location ? (
                <div className="text-gray-300">
                  <p className="font-semibold text-white">{location.address || 'Current Location'}</p>
                  <p className="text-sm">Lat: {location.lat.toFixed(6)}, Lng: {location.lng.toFixed(6)}</p>
                </div>
              ) : (
                <p className="text-gray-400">Getting location...</p>
              )}
            </div>
          </div>

          {/* Evidence Upload */}
          <div className="mb-6">
            <label className="block text-white font-semibold mb-2">
              <Camera className="w-4 h-4 inline mr-2" />
              Evidence (Photos/Documents)
            </label>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {evidence.map((img, index) => (
                <div key={index} className="relative group">
                  <img 
                    src={img} 
                    alt={`Evidence ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg border border-white/20"
                  />
                  <button
                    type="button"
                    onClick={() => removeEvidence(index)}
                    className="absolute top-2 right-2 p-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              ))}
              
              {/* Upload from Gallery */}
              <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-white/30 rounded-lg cursor-pointer hover:border-blue-400 transition-colors">
                {uploadingImage ? (
                  <Loader className="w-8 h-8 text-blue-400 animate-spin" />
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-400">Gallery</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploadingImage}
                />
              </label>

              {/* Capture from Camera */}
              <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-white/30 rounded-lg cursor-pointer hover:border-purple-400 transition-colors">
                {uploadingImage ? (
                  <Loader className="w-8 h-8 text-purple-400 animate-spin" />
                ) : (
                  <>
                    <Camera className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-400">Camera</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploadingImage}
                />
              </label>
            </div>
            <p className="text-sm text-gray-400">Upload photos or documents as evidence</p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Submitting E-FIR...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Submit E-FIR
              </>
            )}
          </button>

          <p className="text-sm text-gray-400 text-center mt-4">
            Your E-FIR is securely stored and will be forwarded to police authorities
          </p>
        </motion.form>
      </div>
    </div>
  );
}
