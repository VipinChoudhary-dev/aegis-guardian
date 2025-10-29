'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, AlertTriangle, Phone, MapPin, CheckCircle, XCircle, 
  Clock, User, Droplet, Heart, Eye, QrCode, Loader, Bell
} from 'lucide-react';
import { DatabaseService, EmergencyAlert } from '@/lib/database-supabase';

export default function ManagerDashboard() {
  const [alerts, setAlerts] = useState<EmergencyAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAlert, setSelectedAlert] = useState<EmergencyAlert | null>(null);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Simple password protection (in production, use proper auth)
  const MANAGER_PASSWORD = 'Vipin091105';

  useEffect(() => {
    if (isAuthenticated) {
      loadAlerts();
      // Refresh every 10 seconds
      const interval = setInterval(loadAlerts, 10000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const loadAlerts = async () => {
    try {
      setLoading(true);
      
      let allAlerts: EmergencyAlert[] = [];
      
      // Load from localStorage first (always available)
      const localAlerts = JSON.parse(localStorage.getItem('aegis-emergency-alerts') || '[]');
      console.log('Local alerts:', localAlerts);
      allAlerts = [...localAlerts];
      
      // Try to also load from Firebase
      try {
        const firebaseAlerts = await DatabaseService.getPendingEmergencies();
        console.log('Firebase alerts:', firebaseAlerts);
        
        // Merge with local alerts (avoid duplicates)
        firebaseAlerts.forEach(fbAlert => {
          if (!allAlerts.find(a => a.alertId === fbAlert.alertId)) {
            allAlerts.push(fbAlert);
          }
        });
      } catch (error) {
        console.warn('Firebase load failed, using localStorage only');
      }
      
      // Filter for pending status
      const pendingAlerts = allAlerts.filter(a => a.status === 'pending');
      console.log('Pending alerts:', pendingAlerts);
      setAlerts(pendingAlerts);
    } catch (error) {
      console.error('Error loading alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    if (password === MANAGER_PASSWORD) {
      setIsAuthenticated(true);
      setPassword('');
    } else {
      alert('❌ Incorrect password');
    }
  };

  const verifyAlert = async (alertId: string, action: 'verify' | 'false_alarm') => {
    try {
      const status = action === 'verify' ? 'verified' : 'false_alarm';
      
      // Update in Firebase
      try {
        await DatabaseService.updateEmergencyAlert(alertId, {
          status,
          verifiedBy: 'Manager',
          verifiedAt: new Date()
        });
      } catch (error) {
        // Update in localStorage
        const localAlerts = JSON.parse(localStorage.getItem('aegis-emergency-alerts') || '[]');
        const updatedAlerts = localAlerts.map((a: EmergencyAlert) => 
          a.alertId === alertId ? { ...a, status, verifiedBy: 'Manager', verifiedAt: new Date() } : a
        );
        localStorage.setItem('aegis-emergency-alerts', JSON.stringify(updatedAlerts));
      }
      
      // Reload alerts
      await loadAlerts();
      setSelectedAlert(null);
      
      if (action === 'verify') {
        alert('✅ Emergency verified! Now dispatch police/ambulance.');
      } else {
        alert('✅ Marked as false alarm.');
      }
    } catch (error) {
      console.error('Error updating alert:', error);
      alert('❌ Error updating alert');
    }
  };

  const dispatchServices = async (alertId: string, service: 'police' | 'ambulance' | 'both') => {
    try {
      const updates: Partial<EmergencyAlert> = {
        status: 'dispatched',
        policeNotified: service === 'police' || service === 'both',
        ambulanceNotified: service === 'ambulance' || service === 'both'
      };
      
      await DatabaseService.updateEmergencyAlert(alertId, updates);
      await loadAlerts();
      
      alert(`✅ ${service.toUpperCase()} dispatched!`);
    } catch (error) {
      console.error('Error dispatching:', error);
    }
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gray-800 border-2 border-teal-500 rounded-2xl p-8 max-w-md w-full"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-teal-500 to-blue-500 rounded-full mb-4">
              <Shield className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Manager Dashboard</h1>
            <p className="text-gray-400">Enter password to access emergency control center</p>
          </div>

          <div className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              placeholder="Enter manager password"
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-teal-500 focus:outline-none"
            />
            <button
              onClick={handleLogin}
              className="w-full py-3 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 rounded-lg font-bold text-white transition-all"
            >
              Login
            </button>
          </div>

        </motion.div>
      </div>
    );
  }

  // Dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-4">
      <div className="max-w-7xl mx-auto py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-blue-500 rounded-full flex items-center justify-center">
                <Shield className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
                  Manager Dashboard
                </h1>
                <p className="text-gray-400">Emergency Control Center</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={async () => {
                  // Create test alert
                  const testAlert: Omit<EmergencyAlert, 'alertId'> = {
                    userId: 'test-user-' + Date.now(),
                    userName: 'Test User',
                    userPhone: '+91-9876543210',
                    timestamp: new Date(),
                    location: { lat: 28.6139, lng: 77.2090, address: 'New Delhi' },
                    type: 'manual_police',
                    status: 'pending',
                    policeNotified: false,
                    ambulanceNotified: false
                  };
                  
                  try {
                    await DatabaseService.createEmergencyAlert(testAlert);
                    alert('✅ Test alert created!');
                    loadAlerts();
                  } catch (error) {
                    // Save to localStorage
                    const localAlerts = JSON.parse(localStorage.getItem('aegis-emergency-alerts') || '[]');
                    localAlerts.push({ ...testAlert, alertId: 'test-' + Date.now() });
                    localStorage.setItem('aegis-emergency-alerts', JSON.stringify(localAlerts));
                    alert('✅ Test alert created (localStorage)!');
                    loadAlerts();
                  }
                }}
                className="px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg font-semibold transition-colors"
              >
                ➕ Test Alert
              </button>
              <button
                onClick={loadAlerts}
                className="px-4 py-2 bg-teal-500 hover:bg-teal-600 rounded-lg font-semibold transition-colors"
              >
                🔄 Refresh
              </button>
              <button
                onClick={() => setIsAuthenticated(false)}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg font-semibold transition-colors"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-red-500/20 border-2 border-red-500 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <Bell className="h-8 w-8 text-red-500" />
                <div>
                  <p className="text-sm text-gray-400">Pending Alerts</p>
                  <p className="text-3xl font-bold text-red-500">{alerts.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-500/20 border-2 border-yellow-500 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <Clock className="h-8 w-8 text-yellow-500" />
                <div>
                  <p className="text-sm text-gray-400">Avg Response Time</p>
                  <p className="text-3xl font-bold text-yellow-500">2.5m</p>
                </div>
              </div>
            </div>

            <div className="bg-green-500/20 border-2 border-green-500 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-sm text-gray-400">Resolved Today</p>
                  <p className="text-3xl font-bold text-green-500">12</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Alerts List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-red-500" />
            Active Emergency Alerts
          </h2>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="h-12 w-12 animate-spin text-teal-400" />
            </div>
          ) : alerts.length === 0 ? (
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-12 text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">No Active Alerts</h3>
              <p className="text-gray-400">All emergencies have been handled. Great job!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {alerts.map((alert, index) => (
                <motion.div
                  key={alert.alertId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-800 border-2 border-red-500 rounded-xl p-6 hover:border-red-400 transition-colors cursor-pointer"
                  onClick={() => setSelectedAlert(alert)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                          <AlertTriangle className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">{alert.userName}</h3>
                          <p className="text-gray-400">{alert.userPhone}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                        <div>
                          <p className="text-xs text-gray-400">Type</p>
                          <p className="font-semibold">
                            {alert.type === 'manual_police' ? '🚓 Police' : 
                             alert.type === 'manual_ambulance' ? '🚑 Ambulance' : 
                             alert.type === 'stealth' ? '🤫 Stealth SOS' :
                             '📱 Shake SOS'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Time</p>
                          <p className="font-semibold">
                            {new Date(alert.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Location</p>
                          <p className="font-semibold text-xs">
                            {alert.location.lat.toFixed(4)}, {alert.location.lng.toFixed(4)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Status</p>
                          <span className="px-2 py-1 bg-yellow-500 text-black text-xs font-bold rounded">
                            PENDING
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedAlert(alert);
                      }}
                      className="px-4 py-2 bg-teal-500 hover:bg-teal-600 rounded-lg font-semibold transition-colors flex items-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      Review
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Alert Detail Modal */}
        <AnimatePresence>
          {selectedAlert && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedAlert(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gray-900 border-2 border-red-500 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <h2 className="text-3xl font-bold mb-6 text-red-500">🚨 Emergency Alert Details</h2>

                <div className="space-y-6">
                  {/* User Info */}
                  <div className="bg-gray-800 rounded-xl p-6">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Victim Information
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-400">Name</p>
                        <p className="font-bold text-lg">{selectedAlert.userName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Phone</p>
                        <p className="font-bold text-lg">{selectedAlert.userPhone}</p>
                      </div>
                    </div>
                  </div>

                  {/* Emergency Details */}
                  <div className="bg-gray-800 rounded-xl p-6">
                    <h3 className="text-xl font-bold mb-4">Emergency Details</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-400">Type</p>
                        <p className="font-bold text-lg">
                          {selectedAlert.type === 'manual_police' ? '🚓 Police Needed' : 
                           selectedAlert.type === 'manual_ambulance' ? '🚑 Medical Emergency' : 
                           selectedAlert.type === 'stealth' ? '🤫 Stealth SOS (Silent Alert)' :
                           '📱 Shake Sensor Triggered'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Time</p>
                        <p className="font-bold">{new Date(selectedAlert.timestamp).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Location</p>
                        <p className="font-mono">{selectedAlert.location.lat.toFixed(6)}, {selectedAlert.location.lng.toFixed(6)}</p>
                        <a
                          href={`https://www.google.com/maps?q=${selectedAlert.location.lat},${selectedAlert.location.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-teal-400 hover:text-teal-300 text-sm flex items-center gap-1 mt-1"
                        >
                          <MapPin className="h-4 w-4" />
                          Open in Google Maps
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold">Manager Actions</h3>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => verifyAlert(selectedAlert.alertId, 'verify')}
                        className="py-4 bg-green-500 hover:bg-green-600 rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="h-6 w-6" />
                        Verify Emergency
                      </button>
                      <button
                        onClick={() => verifyAlert(selectedAlert.alertId, 'false_alarm')}
                        className="py-4 bg-yellow-500 hover:bg-yellow-600 text-black rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <XCircle className="h-6 w-6" />
                        False Alarm
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <button
                        onClick={() => dispatchServices(selectedAlert.alertId, 'police')}
                        className="py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold transition-colors"
                      >
                        🚓 Dispatch Police
                      </button>
                      <button
                        onClick={() => dispatchServices(selectedAlert.alertId, 'ambulance')}
                        className="py-3 bg-red-600 hover:bg-red-700 rounded-xl font-bold transition-colors"
                      >
                        🚑 Dispatch Ambulance
                      </button>
                      <button
                        onClick={() => dispatchServices(selectedAlert.alertId, 'both')}
                        className="py-3 bg-purple-600 hover:bg-purple-700 rounded-xl font-bold transition-colors"
                      >
                        🚨 Dispatch Both
                      </button>
                    </div>

                    <a
                      href={`tel:${selectedAlert.userPhone}`}
                      className="block w-full py-3 bg-teal-500 hover:bg-teal-600 rounded-xl font-bold text-center transition-colors flex items-center justify-center gap-2"
                    >
                      <Phone className="h-5 w-5" />
                      Call Victim
                    </a>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedAlert(null)}
                  className="mt-6 w-full py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-bold transition-colors"
                >
                  Close
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
