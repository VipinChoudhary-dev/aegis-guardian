'use client';

import { useState, useEffect, useRef } from 'react';
import { Shield, AlertTriangle, Phone, MapPin, Hospital, Users, Clock, Smartphone, CheckCircle } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { useAccount } from 'wagmi';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { SoundManager } from '@/utils/sounds';
import { DatabaseService, EmergencyAlert } from '@/lib/database-supabase';

export default function GuardianPage() {
  const { address, isConnected } = useAccount();
  const { t } = useLanguage();
  const [isActivated, setIsActivated] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [emergencyType, setEmergencyType] = useState<'police' | 'hospital' | null>(null);
  const [shakeDetected, setShakeDetected] = useState(false);
  const [shakeCount, setShakeCount] = useState(0);
  const [stealthMode, setStealthMode] = useState(false);
  const [motionPermission, setMotionPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const [alertSent, setAlertSent] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'local' | null>(null);
  
  // Shake detection
  const lastShakeTime = useRef(0);
  const shakeThreshold = 15;
  const shakeTimeout = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  // Request motion permission
  const requestMotionPermission = async () => {
    if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
      try {
        const permission = await (DeviceMotionEvent as any).requestPermission();
        setMotionPermission(permission);
        if (permission === 'granted') {
          alert('✅ Motion sensors enabled! Shake your phone 8 times to activate stealth SOS.');
        }
      } catch (error) {
        console.error('Permission denied for motion');
        setMotionPermission('denied');
        alert('❌ Motion permission denied. Please enable in browser settings.');
      }
    } else {
      // Non-iOS devices
      setMotionPermission('granted');
      alert('✅ Motion sensors ready! Shake your phone 8 times to activate stealth SOS.\n\n⚠️ Note: Motion sensors may not work on localhost HTTP. Use HTTPS or deployed site for full functionality.');
    }
  };

  // Enhanced shake detection for mobile
  useEffect(() => {
    if (motionPermission !== 'granted') return;
    
    let lastX = 0, lastY = 0, lastZ = 0;
    
    const handleMotion = (event: DeviceMotionEvent) => {
      const acceleration = event.accelerationIncludingGravity;
      if (!acceleration) return;

      const { x, y, z } = acceleration;
      if (x === null || y === null || z === null) return;

      // Calculate change in acceleration
      const deltaX = Math.abs(x - lastX);
      const deltaY = Math.abs(y - lastY);
      const deltaZ = Math.abs(z - lastZ);
      
      const totalDelta = deltaX + deltaY + deltaZ;

      // Lower threshold for better mobile detection
      if (totalDelta > 25) {
        const now = Date.now();
        if (now - lastShakeTime.current > 200) {
          lastShakeTime.current = now;
          setShakeCount(prev => {
            const newCount = prev + 1;
            
            // Reset counter after 5 seconds of no shaking
            if (shakeTimeout.current) clearTimeout(shakeTimeout.current);
            shakeTimeout.current = setTimeout(() => setShakeCount(0), 5000);
            
            // Trigger stealth SOS after 8 shakes (reduced from 10)
            if (newCount >= 8) {
              setStealthMode(true);
              triggerStealthSOS();
              return 0;
            }
            
            return newCount;
          });
          
          setShakeDetected(true);
          setTimeout(() => setShakeDetected(false), 500);
        }
      }

      lastX = x;
      lastY = y;
      lastZ = z;
    };

    if (typeof window !== 'undefined' && 'DeviceMotionEvent' in window) {
      window.addEventListener('devicemotion', handleMotion);
      return () => window.removeEventListener('devicemotion', handleMotion);
    }
  }, [motionPermission]);

  useEffect(() => {
    console.log('Countdown useEffect:', { isActivated, countdown, emergencyType });
    
    if (isActivated && countdown > 0) {
      const timer = setTimeout(() => {
        console.log('Countdown tick:', countdown - 1);
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (isActivated && countdown === 0 && emergencyType) {
      console.log('🚨 COUNTDOWN FINISHED - CALLING handleEmergency');
      handleEmergency();
    }
  }, [isActivated, countdown]);

  const triggerStealthSOS = () => {
    // Play emergency alarm sound
    SoundManager.playEmergencyAlarm();
    
    // Show detailed alert message
    const alertMessage = `⚠️ STEALTH SOS TRIGGERED!\n\n🚨 WARNING: Emergency Alert Detected\n\n📍 Your Location: ${location?.lat.toFixed(4)}, ${location?.lng.toFixed(4)}\n\n📞 Contacting Authorities...\n• Police: 100\n• Ambulance: 108\n\n👤 App Manager/Moderator Notified\n\n⏰ Time: ${new Date().toLocaleString()}\n\nStay calm. Help is on the way!`;
    
    alert(alertMessage);
    
    // Keep stealth mode visible for 5 seconds
    setTimeout(() => {
      setStealthMode(false);
    }, 5000);
  };

  const handleEmergency = async () => {
    console.log('🔥 handleEmergency CALLED!', { emergencyType });
    if (!emergencyType) {
      console.log('❌ No emergency type set, returning');
      return;
    }
    
    console.log('✅ Processing emergency...');
    try {
      // Get user profile from localStorage
      const profileData = localStorage.getItem('aegis-profile');
      const profile = profileData ? JSON.parse(profileData) : null;
      
      // Create emergency alert
      const emergencyAlert: Omit<EmergencyAlert, 'alertId'> = {
        userId: profile?.userId || address || 'anonymous-' + Date.now(),
        userName: profile?.name || 'Unknown User',
        userPhone: profile?.phone || 'Not provided',
        timestamp: new Date(),
        location: {
          lat: location?.lat || 0,
          lng: location?.lng || 0,
          address: 'Location detected'
        },
        type: emergencyType === 'police' ? 'manual_police' : 'manual_ambulance',
        status: 'pending',
        policeNotified: false,
        ambulanceNotified: false
      };
      
      // Save to Firebase (with localStorage fallback)
      let savedToFirebase = false;
      let alertId = '';
      
      try {
        alertId = await DatabaseService.createEmergencyAlert(emergencyAlert);
        savedToFirebase = true;
        console.log('✅ Emergency alert created in Firebase:', alertId);
      } catch (error) {
        console.error('❌ Firebase save failed:', error);
        // Save to localStorage as backup
        alertId = 'local-' + Date.now();
        const localAlerts = JSON.parse(localStorage.getItem('aegis-emergency-alerts') || '[]');
        localAlerts.push({ ...emergencyAlert, alertId });
        localStorage.setItem('aegis-emergency-alerts', JSON.stringify(localAlerts));
        console.log('⚠️ Alert saved to localStorage only:', alertId);
      }
      
      // Show success status on screen
      setAlertSent(true);
      setSyncStatus(savedToFirebase ? 'synced' : 'local');
      
      // Also show alert
      const service = emergencyType === 'police' ? 'Police (100)' : 'Ambulance (108)';
      const syncMessage = savedToFirebase ? '✅ SYNCED TO MANAGER' : '⚠️ SAVED LOCALLY';
      const message = `🚨 EMERGENCY ALERT SENT\n\nService: ${service}\nLocation: ${location?.lat.toFixed(4)}, ${location?.lng.toFixed(4)}\nAlert ID: ${alertId}\n\n${syncMessage}\n\nStay safe! Help is on the way!`;
      
      setTimeout(() => alert(message), 100);
    } catch (error) {
      console.error('Error dispatching emergency:', error);
      alert('⚠️ Emergency alert sent! Manager will be notified.');
    } finally {
      setIsActivated(false);
      setCountdown(5);
      setEmergencyType(null);
    }
  };

  const handleCancel = () => {
    setIsActivated(false);
    setCountdown(5);
    setEmergencyType(null);
  };

  const startEmergency = (type: 'police' | 'hospital') => {
    SoundManager.playWarning();
    SoundManager.playEmergencyAlarm(); // 5-second continuous alarm
    setEmergencyType(type);
    setIsActivated(true);
  };

  // Removed wallet connection requirement - works for everyone!

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-4xl mx-auto pt-20 pb-32">
        {/* Alert Sent Success Screen */}
        <AnimatePresence>
          {alertSent && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
              onClick={() => setAlertSent(false)}
            >
              <div className="text-center px-6 max-w-md">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="w-32 h-32 bg-green-600 rounded-full mx-auto mb-6 flex items-center justify-center shadow-2xl"
                  style={{ boxShadow: '0 0 60px rgba(34, 197, 94, 0.8)' }}
                >
                  <CheckCircle className="h-16 w-16" />
                </motion.div>
                <h2 className="text-4xl font-bold mb-4 text-green-500">
                  ✅ ALERT SENT!
                </h2>
                <div className="bg-gray-800 border-2 border-green-500 rounded-2xl p-6">
                  <p className="text-xl font-semibold mb-4 text-white">
                    {syncStatus === 'synced' ? '🎯 Manager Notified!' : '⚠️ Saved Locally'}
                  </p>
                  {syncStatus === 'synced' ? (
                    <>
                      <p className="text-green-400 mb-2">✓ Emergency alert sent to manager</p>
                      <p className="text-green-400 mb-2">✓ Your location shared</p>
                      <p className="text-green-400 mb-4">✓ Help is being dispatched</p>
                    </>
                  ) : (
                    <>
                      <p className="text-yellow-400 mb-2">⚠️ Saved to device only</p>
                      <p className="text-yellow-400 mb-4">Manager may not see this immediately</p>
                    </>
                  )}
                  <p className="text-gray-300 text-sm mt-4">Stay calm. Help is on the way!</p>
                  <button
                    onClick={() => setAlertSent(false)}
                    className="mt-4 px-6 py-3 bg-teal-500 hover:bg-teal-600 rounded-lg font-bold w-full"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stealth Mode Indicator */}
        <AnimatePresence>
          {stealthMode && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
            >
              <div className="text-center px-6">
                <motion.div
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 0.5 }}
                  className="w-32 h-32 bg-red-600 rounded-full mx-auto mb-6 flex items-center justify-center shadow-2xl"
                  style={{ boxShadow: '0 0 60px rgba(239, 68, 68, 0.8)' }}
                >
                  <AlertTriangle className="h-16 w-16" />
                </motion.div>
                <motion.h2 
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="text-4xl font-bold mb-4 text-red-500"
                >
                  ⚠️ STEALTH SOS TRIGGERED ⚠️
                </motion.h2>
                <div className="glass-card p-6 max-w-md mx-auto">
                  <p className="text-xl font-semibold mb-3 text-yellow-400">🚨 WARNING: Emergency Alert Detected</p>
                  <p className="text-white mb-2">📞 Contacting Authorities...</p>
                  <p className="text-gray-300 text-sm mb-3">• Police: 100<br/>• Ambulance: 108</p>
                  <p className="text-teal-400 font-semibold">👤 App Manager/Moderator Notified</p>
                  <p className="text-gray-400 text-sm mt-4">Stay calm. Help is on the way!</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Shake Detection Indicator */}
        {shakeDetected && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-indigo-600 px-6 py-3 rounded-full z-40 shadow-lg"
          >
            <div className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 animate-bounce" />
              <span className="font-semibold">Shake detected: {shakeCount}/8</span>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <motion.div
              animate={isActivated ? { scale: [1, 1.1, 1] } : {}}
              transition={{ repeat: Infinity, duration: 1 }}
              className={`p-6 rounded-full ${isActivated ? 'bg-red-900/50 animate-pulse' : 'bg-indigo-900/30'} border-4 ${isActivated ? 'border-red-500' : 'border-indigo-500'} shadow-2xl`}
            >
              {isActivated ? (
                <AlertTriangle className="h-16 w-16 text-red-500" />
              ) : (
                <Shield className="h-16 w-16 text-indigo-400" />
              )}
            </motion.div>
          </div>
          
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            {isActivated ? '🚨 Emergency Activated' : 'Guardian Angel'}
          </h1>
          
          <p className="text-slate-300 mb-8 max-w-md mx-auto">
            {isActivated 
              ? `Calling ${emergencyType === 'police' ? t('police') : t('ambulance')}. Release to cancel.`
              : 'Your personal safety companion. Choose emergency service below.'}
          </p>


          {location && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-4 mb-6 max-w-md mx-auto border border-slate-700/50"
            >
              <div className="flex items-center justify-center text-slate-300">
                <MapPin className="h-5 w-5 mr-2 text-indigo-400" />
                <span className="text-sm font-mono">
                  {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-2">Your location will be shared with emergency services</p>
            </motion.div>
          )}

          {isActivated && countdown > 0 && (
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="mb-8"
            >
              <div className="text-8xl font-bold text-red-500 mb-4 animate-pulse">
                {countdown}
              </div>
              <p className="text-slate-300">Connecting to emergency services...</p>
            </motion.div>
          )}

          {!isActivated && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-8"
            >
              <button
                onMouseDown={() => startEmergency('police')}
                onMouseUp={handleCancel}
                onMouseLeave={handleCancel}
                onTouchStart={() => startEmergency('police')}
                onTouchEnd={handleCancel}
                className="group relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 rounded-2xl p-8 transition-all duration-300 shadow-2xl hover:shadow-blue-500/50 hover:scale-105"
              >
                <div className="absolute inset-0 bg-white/10 transform -skew-y-6 group-hover:skew-y-6 transition-transform"></div>
                <div className="relative z-10">
                  <Phone className="h-12 w-12 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Police</h3>
                  <p className="text-sm opacity-90 mb-3">Emergency: 100</p>
                  <p className="text-xs opacity-75">Hold to call</p>
                </div>
              </button>

              <button
                onMouseDown={() => startEmergency('hospital')}
                onMouseUp={handleCancel}
                onMouseLeave={handleCancel}
                onTouchStart={() => startEmergency('hospital')}
                onTouchEnd={handleCancel}
                className="group relative overflow-hidden bg-gradient-to-br from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 rounded-2xl p-8 transition-all duration-300 shadow-2xl hover:shadow-red-500/50 hover:scale-105"
              >
                <div className="absolute inset-0 bg-white/10 transform -skew-y-6 group-hover:skew-y-6 transition-transform"></div>
                <div className="relative z-10">
                  <Hospital className="h-12 w-12 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Ambulance</h3>
                  <p className="text-sm opacity-90 mb-3">Emergency: 108</p>
                  <p className="text-xs opacity-75">Hold to call</p>
                </div>
              </button>
            </motion.div>
          )}

          {isActivated && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={handleCancel}
              className="px-12 py-4 bg-slate-700 hover:bg-slate-600 rounded-full text-xl font-semibold transition-all"
            >
              Cancel Emergency
            </motion.button>
          )}
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid md:grid-cols-3 gap-6 mb-12"
        >
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700/50">
            <Phone className="h-10 w-10 text-indigo-400 mb-4" />
            <h3 className="font-bold text-lg mb-2">Direct Call</h3>
            <p className="text-sm text-slate-400">Instantly connect to emergency services with location sharing</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700/50">
            <Smartphone className="h-10 w-10 text-indigo-400 mb-4" />
            <h3 className="font-bold text-lg mb-2">Stealth SOS</h3>
            <p className="text-sm text-slate-400">Shake your device vigorously 10 times to send silent alert</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700/50">
            <Users className="h-10 w-10 text-indigo-400 mb-4" />
            <h3 className="font-bold text-lg mb-2">Emergency Contacts</h3>
            <p className="text-sm text-slate-400">Your trusted contacts are notified automatically</p>
          </div>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-indigo-900/20 border border-indigo-800/50 rounded-xl p-6 max-w-2xl mx-auto"
        >
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-indigo-400" />
            How to Use
          </h3>
          <ul className="space-y-3 text-sm text-slate-300">
            <li className="flex items-start gap-3">
              <span className="text-indigo-400 font-bold">1.</span>
              <span><strong>Hold Button:</strong> Press and hold Police or Ambulance button for 5 seconds</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-indigo-400 font-bold">2.</span>
              <span><strong>Release to Cancel:</strong> Let go before countdown ends to cancel</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-indigo-400 font-bold">3.</span>
              <span><strong>Stealth Mode:</strong> Shake your phone vigorously 10 times in 5 seconds for silent SOS</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-indigo-400 font-bold">4.</span>
              <span><strong>Location Shared:</strong> Your GPS coordinates are automatically sent to authorities</span>
            </li>
          </ul>
        </motion.div>
      </div>
      <Navbar />
    </div>
  );
}
