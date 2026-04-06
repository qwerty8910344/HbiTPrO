import React from 'react';
import { Home, Users, BarChart3, Timer, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

const BottomNav = ({ currentView, setView }) => {
  const navItems = [
    { id: 'today', icon: <Home size={24} strokeWidth={2.5} /> },
    { id: 'reports', icon: <BarChart3 size={24} strokeWidth={2.5} /> },
    { id: 'groups', icon: <Users size={24} strokeWidth={2.5} /> },
    { id: 'focus', icon: <Timer size={24} strokeWidth={2.5} /> },
    { id: 'settings', icon: <Settings size={24} strokeWidth={2.5} /> },
  ];

  return (
    <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 ios-card-glass w-[90%] max-w-[380px] px-4 py-3 flex items-center justify-between z-50">
      {navItems.map((item) => (
        <motion.button
          key={item.id}
          whileTap={{ scale: 0.8 }}
          onClick={() => setView(item.id)}
          className={`relative p-3 rounded-full transition-all flex flex-col items-center gap-1 ${
            currentView === item.id 
              ? 'text-[var(--primary-pink)]' 
              : 'text-[#8E8E93] hover:text-black'
          }`}
        >
          {item.icon}
          
          {currentView === item.id && (
            <motion.div 
              layoutId="bubble"
              className="absolute inset-0 bg-[#FF4D6D]/10 rounded-[20px] -z-10"
              transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
            />
          )}

          {/* Active indicator dot */}
          {currentView === item.id && (
            <div className="absolute -bottom-1 w-1 h-1 bg-[var(--primary-pink)] rounded-full" />
          )}
        </motion.button>
      ))}
    </nav>
  );
};

export default BottomNav;
