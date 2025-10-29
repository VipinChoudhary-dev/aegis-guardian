'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, MapPin, User, Home, FileText, Award, Building2, Phone, Settings, QrCode } from 'lucide-react';
import { motion } from 'framer-motion';
import { SoundManager } from '@/utils/sounds';

export function Navbar() {
  const pathname = usePathname();
  
  const navItems = [
    { href: '/', icon: Home, label: 'Home', color: 'teal' },
    { href: '/guardian', icon: Shield, label: 'SOS', color: 'red' },
    { href: '/profile-new', icon: User, label: 'Profile', color: 'indigo' },
    { href: '/efir', icon: FileText, label: 'E-FIR', color: 'blue' },
    { href: '/rewards', icon: Award, label: 'NFT', color: 'yellow' },
    { href: '/map', icon: MapPin, label: 'Map', color: 'green' },
  ];

  const getColorClasses = (color: string, isActive: boolean) => {
    if (!isActive) return 'text-gray-400 hover:text-white';
    
    const colors: { [key: string]: string } = {
      teal: 'text-teal-400 border-teal-400 bg-teal-400/10',
      green: 'text-green-400 border-green-400 bg-green-400/10',
      red: 'text-red-400 border-red-400 bg-red-400/10',
      blue: 'text-blue-400 border-blue-400 bg-blue-400/10',
      purple: 'text-purple-400 border-purple-400 bg-purple-400/10',
      yellow: 'text-yellow-400 border-yellow-400 bg-yellow-400/10',
      cyan: 'text-cyan-400 border-cyan-400 bg-cyan-400/10',
      indigo: 'text-indigo-400 border-indigo-400 bg-indigo-400/10',
      gray: 'text-gray-400 border-gray-400 bg-gray-400/10'
    };
    
    return colors[color] || colors.teal;
  };
  
  return (
    <motion.nav
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-0 left-0 right-0 z-50 glass-card border-t border-white/10"
    >
      <div className="max-w-full mx-auto px-2 py-3">
        <div className="flex items-center justify-around gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link 
                key={item.href}
                href={item.href} 
                className="relative group"
                onClick={() => SoundManager.playClick()}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex flex-col items-center px-3 py-2 rounded-xl transition-all ${
                    isActive 
                      ? `border ${getColorClasses(item.color, true)}` 
                      : 'border border-transparent hover:border-white/20'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${getColorClasses(item.color, isActive)}`} />
                  <span className={`text-xs mt-1 font-medium ${getColorClasses(item.color, isActive)}`}>
                    {item.label}
                  </span>
                </motion.div>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 rounded-xl"
                    style={{
                      boxShadow: `0 0 20px rgba(0, 255, 198, 0.3)`
                    }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
}
