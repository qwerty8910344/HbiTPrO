import React from 'react';
import { Home, Users, BarChart3, Timer, Settings, FileText, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const BottomNav = ({ currentView, setView }) => {
  const navItems = [
    { id: 'today', icon: <Home size={22} strokeWidth={2.5} />, label: 'Home' },
    { id: 'stats', icon: <BarChart3 size={22} strokeWidth={2.5} />, label: 'Stats' },
    { id: 'reports', icon: <FileText size={22} strokeWidth={2.5} />, label: 'Reports' },
    { id: 'groups', icon: <Users size={22} strokeWidth={2.5} />, label: 'Squad' },
    { id: 'focus', icon: <Timer size={22} strokeWidth={2.5} />, label: 'Focus' },
    { id: 'motivation', icon: <Sparkles size={22} strokeWidth={2.5} />, label: 'Vibe' },
    { id: 'settings', icon: <Settings size={22} strokeWidth={2.5} />, label: 'Settings' },
  ];

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 ios-card-glass w-[96%] max-w-[420px] px-1.5 py-2 flex items-center justify-between z-[100] shadow-2xl">
      {navItems.map((item) => (
        <motion.button
          key={item.id}
          whileTap={{ scale: 0.85 }}
          onClick={() => setView(item.id)}
          className={`relative px-2 py-2 rounded-[18px] transition-all flex flex-col items-center gap-0.5 tap-effect ${
            currentView === item.id 
              ? 'text-[#4ADE80]' 
              : 'text-[#6B7280] hover:text-[#E5E7EB]'
          }`}
        >
          {item.icon}
          <span className={`text-[8px] font-black uppercase tracking-wider ${
            currentView === item.id ? 'text-[#4ADE80]' : 'text-[#6B7280]/60'
          }`}>
            {item.label}
          </span>
          
          {currentView === item.id && (
            <motion.div 
              layoutId="nav-bubble"
              className="absolute inset-0 bg-[#16A34A]/10 rounded-[18px] -z-10 border border-[#16A34A]/20"
              transition={{ type: 'spring', bounce: 0.3, duration: 0.5 }}
            />
          )}
        </motion.button>
      ))}
    </nav>
  );
};

export default BottomNav;
