'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QrCode, Camera, X, CheckCircle, AlertCircle, Phone, User, Droplet, Heart } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Html5Qrcode } from 'html5-qrcode';
import { DatabaseService, UserProfile } from '@/lib/database-supabase';

export default function ScanPage() {
  const [scanning, setScanning] = useState(false);
  const [scannedData, setScannedData] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState('');
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [cameraPermission, setCameraPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');

  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, []);

  const startScanning = async () => {
    try {
      setError('');
      
      // Check if camera is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError('Camera not available on this device. Please use the file upload option below.');
        return;
      }

      // Request camera permission
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        stream.getTracks().forEach(track => track.stop());
        setCameraPermission('granted');
      } catch (permErr: any) {
        if (permErr.name === 'NotAllowedError') {
          setCameraPermission('denied');
          setError('❌ Camera permission denied. Please allow camera access in your browser settings, or use file upload below.');
          return;
        }
        throw permErr;
      }

      const html5QrCode = new Html5Qrcode('qr-reader');
      scannerRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0
        },
        onScanSuccess,
        onScanFailure
      );

      setScanning(true);
    } catch (err: any) {
      console.error('Camera error:', err);
      setError('⚠️ Camera failed to start. Try using file upload below or check browser permissions.');
    }
  };

  const stopScanning = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch (err) {
        console.error('Error stopping scanner:', err);
      }
      scannerRef.current = null;
    }
    setScanning(false);
  };

  const onScanSuccess = async (decodedText: string) => {
    console.log('QR Code scanned:', decodedText);
    
    try {
      // Parse the QR code data
      const data = JSON.parse(decodedText);
      
      if (data.type === 'aegis-emergency-card') {
        // Load profile from database or localStorage
        let userProfile: UserProfile | null = null;

        // Try Supabase first
        try {
          userProfile = await DatabaseService.getUserProfile(data.userId);
        } catch (error) {
          console.error('Supabase error, trying localStorage:', error);
        }

        // Fallback to localStorage
        if (!userProfile) {
          const localProfile = localStorage.getItem('aegis-profile');
          if (localProfile) {
            const parsed = JSON.parse(localProfile);
            if (parsed.userId === data.userId) {
              userProfile = parsed;
            }
          }
        }

        if (userProfile) {
          setProfile(userProfile);
          setScannedData(data);
          await stopScanning();
        } else {
          setError('Profile not found');
        }
      } else {
        setError('Invalid QR code format');
      }
    } catch (err) {
      // If not JSON, might be a URL
      if (decodedText.includes('/emergency-card/')) {
        const digitalId = decodedText.split('/emergency-card/')[1];
        setScannedData({ type: 'url', digitalId, url: decodedText });
        await stopScanning();
      } else {
        setError('Invalid QR code');
      }
    }
  };

  const onScanFailure = (error: string) => {
    // Ignore scan failures (happens continuously while scanning)
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setError('');
      const html5QrCode = new Html5Qrcode('qr-reader-file');
      
      const decodedText = await html5QrCode.scanFile(file, true);
      await onScanSuccess(decodedText);
      
      html5QrCode.clear();
    } catch (err) {
      console.error('File scan error:', err);
      setError('❌ Could not read QR code from image. Please try again with a clearer image.');
    }
  };

  const resetScanner = () => {
    setScannedData(null);
    setProfile(null);
    setError('');
  };

  const callEmergencyContact = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <QrCode className="w-16 h-16 text-purple-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-2">Emergency QR Scanner</h1>
          <p className="text-gray-300">Scan QR codes to help unconscious or injured people</p>
          <p className="text-sm text-gray-400 mt-2">Access emergency contacts, medical info, and call for help</p>
        </motion.div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-400" />
              <p className="text-red-300">{error}</p>
              <button
                onClick={() => setError('')}
                className="ml-auto text-red-400 hover:text-red-300"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scanner or Result */}
        {!scannedData && !profile ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
          >
            {/* Camera Permission Denied */}
            {cameraPermission === 'denied' && (
              <div className="text-center py-12">
                <Camera className="w-16 h-16 text-red-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Camera Access Denied</h3>
                <p className="text-gray-300 mb-4">
                  Please enable camera access in your browser settings to scan QR codes
                </p>
              </div>
            )}

            {/* Scanner */}
            {scanning ? (
              <div>
                <div id="qr-reader" className="rounded-lg overflow-hidden mb-4"></div>
                <button
                  onClick={stopScanning}
                  className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-2"
                >
                  <X className="w-5 h-5" />
                  Stop Scanning
                </button>
              </div>
            ) : (
              <div className="text-center py-12">
                <Camera className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Ready to Scan</h3>
                <p className="text-gray-300 mb-6">
                  Point your camera at an Aegis Guardian QR code
                </p>
                <button
                  onClick={startScanning}
                  className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-lg hover:from-purple-700 hover:to-blue-700 flex items-center justify-center gap-2 mx-auto mb-4"
                >
                  <Camera className="w-5 h-5" />
                  Start Camera Scan
                </button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-gray-900 text-gray-400">OR</span>
                  </div>
                </div>

                <div className="max-w-xs mx-auto">
                  <label className="block w-full cursor-pointer">
                    <div className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors">
                      <QrCode className="w-5 h-5" />
                      Upload QR Image
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-gray-400 mt-2">
                    If camera doesn't work, upload a screenshot of the QR code
                  </p>
                  <div id="qr-reader-file" className="hidden"></div>
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          /* Scanned Profile Display */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            {/* Success Header */}
            <div className="bg-green-500/20 border border-green-500 rounded-lg p-4 flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <div>
                <h3 className="text-lg font-bold text-white">QR Code Scanned Successfully!</h3>
                <p className="text-gray-300 text-sm">Emergency information loaded</p>
              </div>
            </div>

            {/* If URL scanned */}
            {scannedData?.type === 'url' && (
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center">
                <h3 className="text-xl font-bold text-white mb-4">Emergency Card Detected</h3>
                <p className="text-gray-300 mb-6">Digital ID: {scannedData.digitalId}</p>
                <a
                  href={scannedData.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  View Emergency Card
                </a>
              </div>
            )}

            {/* Profile Information */}
            {profile && (
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-4 mb-6">
                  {profile.photo ? (
                    <img
                      src={profile.photo}
                      alt={profile.name}
                      className="w-20 h-20 rounded-full border-4 border-purple-400"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-purple-600 flex items-center justify-center border-4 border-purple-400">
                      <User className="w-10 h-10 text-white" />
                    </div>
                  )}
                  <div>
                    <h2 className="text-2xl font-bold text-white">{profile.name}</h2>
                    <p className="text-gray-300">Digital ID: {profile.digitalId}</p>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-white/5 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-400 mb-1">
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">Phone</span>
                    </div>
                    <p className="text-white font-semibold">{profile.phone}</p>
                  </div>

                  {profile.bloodType && (
                    <div className="bg-white/5 p-4 rounded-lg">
                      <div className="flex items-center gap-2 text-gray-400 mb-1">
                        <Droplet className="w-4 h-4" />
                        <span className="text-sm">Blood Type</span>
                      </div>
                      <p className="text-white font-semibold">{profile.bloodType}</p>
                    </div>
                  )}
                </div>

                {/* Medical Info */}
                {profile.medicalInfo && (
                  <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-lg mb-6">
                    <div className="flex items-center gap-2 text-red-400 mb-2">
                      <Heart className="w-5 h-5" />
                      <span className="font-semibold">Medical Information</span>
                    </div>
                    <p className="text-white">{profile.medicalInfo}</p>
                  </div>
                )}

                {/* Emergency Contacts */}
                {profile.emergencyContacts && profile.emergencyContacts.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-white mb-3">Emergency Contacts</h3>
                    <div className="space-y-2">
                      {profile.emergencyContacts.map((contact, index) => (
                        <div
                          key={index}
                          className="bg-white/5 p-4 rounded-lg flex items-center justify-between"
                        >
                          <div>
                            <p className="text-white font-semibold">{contact.name}</p>
                            <p className="text-gray-400 text-sm">{contact.relationship}</p>
                          </div>
                          <button
                            onClick={() => callEmergencyContact(contact.phone)}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                          >
                            <Phone className="w-4 h-4" />
                            Call
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4">
              <button
                onClick={resetScanner}
                className="flex-1 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Scan Another
              </button>
              <button
                onClick={() => window.location.href = 'tel:112'}
                className="flex-1 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-2"
              >
                <Phone className="w-5 h-5" />
                Call Emergency (112)
              </button>
            </div>
          </motion.div>
        )}

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10"
        >
          <h3 className="text-lg font-bold text-white mb-3">How to Use</h3>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-purple-400">1.</span>
              <span>Click "Start Scanning" to activate your camera</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400">2.</span>
              <span>Point your camera at an Aegis Guardian QR code</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400">3.</span>
              <span>View emergency information and contact details</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400">4.</span>
              <span>Call emergency contacts or emergency services if needed</span>
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
