'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, AlertTriangle } from 'lucide-react';
import { DatabaseService } from '@/lib/database-supabase';

export function GlobalShakeDetector() {
  const [shakeCount, setShakeCount] = useState(0);
  const [shakeDetected, setShakeDetected] = useState(false);
  const [stealthActivated, setStealthActivated] = useState(false);
  const [motionPermission, setMotionPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  
  const lastShakeTime = useRef(0);
  const shakeTimeout = useRef<NodeJS.Timeout | undefined>(undefined);

  // Request motion permission on mount
  useEffect(() => {
    requestMotionPermission();
  }, []);

  const requestMotionPermission = async () => {
    if (typeof window === 'undefined') return;

    // Check if iOS 13+ and needs permission
    if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
      try {
        const permission = await (DeviceMotionEvent as any).requestPermission();
        setMotionPermission(permission);
      } catch (error) {
        console.error('Permission denied for motion');
        setMotionPermission('denied');
      }
    } else {
      // Non-iOS devices
      setMotionPermission('granted');
    }
  };

  // Shake detection
  useEffect(() => {
    if (motionPermission !== 'granted') return;
    
    const handleMotion = (event: DeviceMotionEvent) => {
      const acc = event.accelerationIncludingGravity;
      if (!acc || !acc.x || !acc.y || !acc.z) return;

      const totalDelta = Math.abs(acc.x) + Math.abs(acc.y) + Math.abs(acc.z);

      // Detect shake
      if (totalDelta > 25) {
        const now = Date.now();
        if (now - lastShakeTime.current > 200) {
          lastShakeTime.current = now;
          setShakeCount(prev => {
            const newCount = prev + 1;
            
            // Reset counter after 5 seconds of no shaking
            if (shakeTimeout.current) clearTimeout(shakeTimeout.current);
            shakeTimeout.current = setTimeout(() => setShakeCount(0), 5000);
            
            // Trigger stealth SOS after 8 shakes
            if (newCount >= 8 && !stealthActivated) {
              triggerStealthSOS();
              setStealthActivated(true);
              setTimeout(() => setStealthActivated(false), 10000); // Reset after 10s
            }
            
            return newCount;
          });
          
          setShakeDetected(true);
          setTimeout(() => setShakeDetected(false), 500);
        }
      }
    };

    window.addEventListener('devicemotion', handleMotion);
    return () => window.removeEventListener('devicemotion', handleMotion);
  }, [motionPermission, stealthActivated]);

  const triggerStealthSOS = async () => {
    console.log('🚨 STEALTH SOS ACTIVATED!');
    
    // Get location
    let location = { lat: 0, lng: 0 };
    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      location = { lat: pos.coords.latitude, lng: pos.coords.longitude };
    } catch (error) {
      console.error('Location error:', error);
    }

    // Get profile
    const profile = JSON.parse(localStorage.getItem('aegis-profile') || '{}');
    
    // Create stealth alert
    const alert = {
      userId: profile.userId || 'anonymous',
      userName: profile.name || 'Unknown User',
      userPhone: profile.phone || 'N/A',
      location,
      timestamp: new Date(),
      type: 'stealth' as const,
      status: 'pending' as const,
      policeNotified: false,
      ambulanceNotified: false,
    };

    // Save to Supabase
    try {
      await DatabaseService.createEmergencyAlert(alert);
      console.log('✅ Stealth SOS saved to Supabase');
    } catch (error) {
      console.error('Supabase error, saving locally:', error);
      // Fallback to localStorage
      const localAlerts = JSON.parse(localStorage.getItem('aegis-emergency-alerts') || '[]');
      localAlerts.push({ ...alert, alertId: `ALERT-${Date.now()}` });
      localStorage.setItem('aegis-emergency-alerts', JSON.stringify(localAlerts));
      console.log('✅ Stealth SOS saved locally');
    }

    // Show notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('🚨 Stealth SOS Activated', {
        body: 'Emergency alert sent silently to authorities',
        icon: '/icon.png',
      });
    }
  };

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  return (
    <>
      {/* Shake Counter Indicator */}
      <AnimatePresence>
        {shakeDetected && shakeCount > 0 && shakeCount < 8 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-purple-600/90 backdrop-blur-lg px-6 py-3 rounded-full border border-purple-400 shadow-lg"
          >
            <div className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 animate-bounce text-white" />
              <span className="font-semibold text-white">Shake: {shakeCount}/8</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stealth SOS Activated */}
      <AnimatePresence>
        {stealthActivated && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-red-600/95 backdrop-blur-lg p-8 rounded-2xl border-2 border-red-400 shadow-2xl max-w-sm"
          >
            <div className="text-center">
              <AlertTriangle className="h-16 w-16 text-white mx-auto mb-4 animate-pulse" />
              <h3 className="text-2xl font-bold text-white mb-2">🚨 Stealth SOS Activated</h3>
              <p className="text-white/90 mb-4">
                Silent emergency alert sent to authorities
              </p>
              <div className="bg-white/20 rounded-lg p-3">
                <p className="text-sm text-white">
                  Help is on the way. Stay calm and safe.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Motion Permission Request */}
      {motionPermission === 'prompt' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-24 left-4 right-4 z-40 bg-purple-600/90 backdrop-blur-lg p-4 rounded-xl border border-purple-400 shadow-lg"
        >
          <div className="flex items-start gap-3">
            <Smartphone className="h-6 w-6 text-white flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h4 className="font-bold text-white mb-1">Enable Stealth SOS</h4>
              <p className="text-sm text-white/90 mb-3">
                Shake your phone 8 times anywhere in the app to send silent emergency alert
              </p>
              <button
                onClick={requestMotionPermission}
                className="w-full px-4 py-2 bg-white text-purple-600 font-bold rounded-lg hover:bg-purple-50 transition-colors"
              >
                Enable Motion Detection
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}
