'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Shield, Phone, Heart, AlertCircle, User, Droplet, Loader } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

interface EmergencyContact {
  n: string; // name
  p: string; // phone
  r: string; // relationship
}

interface EmergencyData {
  id?: string;
  name?: string;
  phone?: string;
  blood?: string;
  medical?: string;
  contacts?: EmergencyContact[];
}

function EmergencyCardContent() {
  const searchParams = useSearchParams();
  const [data, setData] = useState<EmergencyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    loadData();
  }, [searchParams]);

  const loadData = () => {
    try {
      setLoading(true);
      
      const encodedData = searchParams.get('data');
      if (!encodedData) {
        setError(true);
        setLoading(false);
        return;
      }

      // Decode the data
      const decodedStr = decodeURIComponent(atob(encodedData));
      const emergencyData: EmergencyData = JSON.parse(decodedStr);
      
      setData(emergencyData);
      setError(false);
    } catch (err) {
      console.error('Error loading emergency data:', err);
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

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 to-orange-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl p-8 max-w-md w-full text-center"
        >
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid QR Code</h1>
          <p className="text-gray-600">
            This QR code is invalid or corrupted. Please scan a valid Aegis Guardian emergency QR code.
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
          {/* Basic Info */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                <User className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900 mb-1">{data.name || 'Unknown'}</h2>
                {data.phone && (
                  <p className="text-gray-600 flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {data.phone}
                  </p>
                )}
              </div>
            </div>
            {data.id && (
              <p className="text-sm text-gray-500">
                Digital ID: <span className="font-mono font-semibold">{data.id}</span>
              </p>
            )}
          </div>

          {/* Blood Type */}
          {data.blood && (
            <div className="bg-red-50 border-2 border-red-500 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3">
                <Droplet className="h-8 w-8 text-red-500" />
                <div>
                  <p className="text-sm text-gray-600 font-semibold">Blood Type</p>
                  <p className="text-3xl font-bold text-red-600">{data.blood}</p>
                </div>
              </div>
            </div>
          )}

          {/* Medical Information */}
          {data.medical && (
            <div className="bg-yellow-50 border-2 border-yellow-500 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-gray-900 mb-1">⚠️ Medical Conditions</p>
                  <p className="text-gray-700">{data.medical}</p>
                </div>
              </div>
            </div>
          )}

          {/* Emergency Contacts */}
          {data.contacts && data.contacts.length > 0 && (
            <div className="mb-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Heart className="h-6 w-6 text-red-500" />
                Emergency Contacts
              </h3>
              <div className="space-y-3">
                {data.contacts.map((contact, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="bg-gray-50 border border-gray-200 rounded-xl p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-gray-900">{contact.n}</p>
                        <p className="text-sm text-gray-600">{contact.r}</p>
                        <p className="text-lg font-mono text-gray-900 mt-1">{contact.p}</p>
                      </div>
                      <button
                        onClick={() => handleCall(contact.p)}
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
          )}
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

export default function EmergencyCardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-red-900 to-orange-900 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader className="h-16 w-16 animate-spin text-white mx-auto mb-4" />
          <p className="text-white text-xl">Loading Emergency Information...</p>
        </div>
      </div>
    }>
      <EmergencyCardContent />
    </Suspense>
  );
}
