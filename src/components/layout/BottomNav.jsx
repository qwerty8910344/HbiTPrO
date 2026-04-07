import React from 'react';
import { Home, Users, BarChart3, Timer, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

const BottomNav = ({ currentView, setView }) => {
  const navItems = [
    { id: 'today', icon: <Home size={26} strokeWidth={3} /> },
    { id: 'stats', icon: <BarChart3 size={26} strokeWidth={3} /> },
    { id: 'groups', icon: <Users size={26} strokeWidth={3} /> },
    { id: 'focus', icon: <Timer size={26} strokeWidth={3} /> },
    { id: 'settings', icon: <Settings size={26} strokeWidth={3} /> },
  ];

  return (
    <nav className="fixed bottom-10 left-1/2 -translate-x-1/2 ios-card-glass w-[92%] max-w-[400px] px-2 py-2.5 flex items-center justify-between z-[100] shadow-2xl border-white/60">
      {navItems.map((item) => (
        <motion.button
          key={item.id}
          whileTap={{ scale: 0.85 }}
          onClick={() => setView(item.id)}
          className={`relative p-3.5 rounded-[22px] transition-all flex flex-col items-center gap-1 tap-effect ${
            currentView === item.id 
              ? 'text-red-500 bg-white/20 shadow-inner scale-110' 
              : 'text-[#8E8E93]/60 hover:text-black'
          }`}
        >
          {item.icon}
          
          {currentView === item.id && (
            <motion.div 
              layoutId="nav-bubble"
              className="absolute inset-0 bg-white/30 rounded-[22px] -z-10 shadow-sm border border-white/40"
              transition={{ type: 'spring', bounce: 0.3, duration: 0.5 }}
            />
          )}

          {/* Active indicator dot */}
          {currentView === item.id && (
            <div className="absolute -bottom-1.5 w-1.5 h-1.5 bg-red-500 rounded-full shadow-lg shadow-red-500/50" />
          )}
        </motion.button>
      ))}
    </nav>
  );
};

export default BottomNav;
