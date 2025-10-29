'use client';

import { useState } from 'react';
import { Phone, MapPin, Globe, Shield, X } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { SoundManager } from '@/utils/sounds';

const emergencyContacts = [
  {
    name: 'Police',
    number: '100',
    description: 'For any crime, theft, or safety emergency',
    image: 'https://assets.thehansindia.com/h-upload/2024/10/09/1487604-bng-police.webp',
    color: 'blue',
    available: '24/7'
  },
  {
    name: 'Ambulance',
    number: '108',
    description: 'Medical emergencies and health issues',
    image: 'https://images.unsplash.com/photo-1587745416684-47953f16f02f?w=400',
    color: 'red',
    available: '24/7'
  },
  {
    name: 'Fire Service',
    number: '101',
    description: 'Fire accidents and rescue operations',
    image: 'https://www.phoenix.gov/adobe/dynamicmedia/deliver/dm-aid--6d47957a-b3dd-4597-b1c0-32c1bdbc546a/mh17-still.png?preferwebp=true&quality=85',
    color: 'orange',
    available: '24/7'
  },
  {
    name: 'Women Helpline',
    number: '1091',
    description: 'Support for women in distress',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
    color: 'pink',
    available: '24/7'
  },
  {
    name: 'Child Helpline',
    number: '1098',
    description: 'Protection and support for children',
    image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400',
    color: 'yellow',
    available: '24/7'
  },
  {
    name: 'Tourist Helpline',
    number: '1363',
    description: 'Assistance for tourists in Karnataka',
    image: 'https://i.huffpost.com/gen/2006764/images/o-TOURIST-facebook.jpg',
    color: 'green',
    available: '24/7'
  }
];

const embassies = [
  {
    name: 'US Consulate',
    phone: '+91-80-2220-6500',
    address: 'Racecourse Road, Bengaluru',
    image: 'https://images.unsplash.com/photo-1569982175971-d92b01cf8694?w=400',
    flag: '🇺🇸'
  },
  {
    name: 'UK Deputy High Commission',
    phone: '+91-80-2221-1200',
    address: 'Vittal Mallya Road, Bengaluru',
    image: 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=400',
    flag: '🇬🇧'
  },
  {
    name: 'German Consulate',
    phone: '+91-80-2220-0100',
    address: 'Prestige Takt, Bengaluru',
    image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=400',
    flag: '🇩🇪'
  },
  {
    name: 'French Consulate',
    phone: '+91-80-4012-4200',
    address: 'Shanthala Nagar, Bengaluru',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400',
    flag: '🇫🇷'
  }
];

export default function ContactsPage() {
  const [callingContact, setCallingContact] = useState<{ name: string; number: string } | null>(null);

  const handleCall = (name: string, number: string) => {
    SoundManager.playNotification();
    setCallingContact({ name, number });
    
    // Auto close after 3 seconds
    setTimeout(() => {
      setCallingContact(null);
      // Actually initiate call
      window.location.href = `tel:${number}`;
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-7xl mx-auto pt-20 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4">
            <span className="neon-text-green">Emergency</span>{' '}
            <span className="neon-text-blue">Contacts</span>
          </h1>
          <p className="text-gray-400 text-xl">Quick access to all emergency services</p>
        </motion.div>

        {/* Emergency Numbers */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-6 neon-text-red">🚨 Emergency Services</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {emergencyContacts.map((contact, index) => (
              <motion.div
                key={contact.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="relative group cursor-pointer"
                onClick={() => handleCall(contact.name, contact.number)}
              >
                <div className={`absolute -inset-0.5 bg-gradient-to-r from-${contact.color}-500 to-${contact.color}-700 rounded-2xl blur opacity-60 group-hover:opacity-100 transition duration-300`}></div>
                <div className="relative bg-black border-2 border-gray-800 rounded-2xl overflow-hidden hover:scale-105 transition-transform">
                  <div className="h-40 overflow-hidden">
                    <img src={contact.image} alt={contact.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-2">{contact.name}</h3>
                    <div className="text-4xl font-bold mb-3 neon-text-yellow">{contact.number}</div>
                    <p className="text-gray-400 text-sm mb-3">{contact.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-green-400 border border-green-500 px-2 py-1 rounded-full">
                        {contact.available}
                      </span>
                      <Phone className="h-6 w-6 text-green-400" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Embassy Contacts */}
        <div>
          <h2 className="text-3xl font-bold mb-6 neon-text-blue">🌐 Embassy Contacts</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {embassies.map((embassy, index) => (
              <motion.div
                key={embassy.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="relative group cursor-pointer"
                onClick={() => handleCall(embassy.name, embassy.phone)}
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-50 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative bg-black border-2 border-gray-800 rounded-2xl overflow-hidden hover:scale-105 transition-transform">
                  <div className="h-48 overflow-hidden relative">
                    <img src={embassy.image} alt={embassy.name} className="w-full h-full object-cover" />
                    <div className="absolute top-4 right-4 text-6xl">{embassy.flag}</div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-3">{embassy.name}</h3>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-green-400">
                        <Phone className="h-4 w-4 mr-2" />
                        <span className="font-mono">{embassy.phone}</span>
                      </div>
                      <div className="flex items-center text-gray-400">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span className="text-sm">{embassy.address}</span>
                      </div>
                    </div>
                    <button className="w-full py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-all">
                      Call Now
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 border-2 border-yellow-500 rounded-2xl p-8 bg-yellow-500/5"
        >
          <div className="flex items-start gap-4">
            <Shield className="h-8 w-8 text-yellow-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-2xl font-bold mb-3 neon-text-yellow">Important Information</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  <span>All emergency numbers are toll-free and available 24/7</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Your location will be automatically shared when calling emergency services</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Embassy contacts are for citizens of respective countries</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Save these numbers in your phone for quick access</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Calling Popup */}
        <AnimatePresence>
          {callingContact && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.8, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 20 }}
                className="glass-card p-8 max-w-md w-full text-center border-2 border-teal-400"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center"
                >
                  <Phone className="h-10 w-10 text-white" />
                </motion.div>
                
                <h2 className="text-2xl font-bold mb-2 glow-teal">Contacting...</h2>
                <p className="text-3xl font-bold text-white mb-2">{callingContact.name}</p>
                <p className="text-xl text-gray-300 mb-6 font-mono">{callingContact.number}</p>
                
                <div className="flex gap-2 mb-4">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1, delay: 0 }}
                    className="w-3 h-3 bg-teal-400 rounded-full"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                    className="w-3 h-3 bg-teal-400 rounded-full"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                    className="w-3 h-3 bg-teal-400 rounded-full"
                  />
                </div>
                
                <p className="text-sm text-gray-400">Connecting in 3 seconds...</p>
                
                <button
                  onClick={() => setCallingContact(null)}
                  className="mt-6 px-6 py-2 bg-red-500 hover:bg-red-600 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Navbar />
    </div>
  );
}
