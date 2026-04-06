import React from 'react';
import { 
  Home, 
  Users, 
  BarChart2, 
  FileText, 
  Settings, 
  Plus, 
  Crown,
  Menu,
  Timer
} from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = ({ currentView, setView }) => {
  const navItems = [
    { id: 'today', icon: <Home size={22} />, label: 'Today' },
    { id: 'groups', icon: <Users size={22} />, label: 'Groups' },
    { id: 'stats', icon: <BarChart2 size={22} />, label: 'Stats' },
    { id: 'focus', icon: <Timer size={22} />, label: 'Focus' },
    { id: 'reports', icon: <FileText size={22} />, label: 'Reports' },
    { id: 'settings', icon: <Settings size={22} />, label: 'Settings' },
  ];

  return (
    <aside className="glass-card hidden md:flex flex-col h-[calc(100vh-40px)] w-72 m-5 p-6 fixed left-0 top-0 z-50">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-10 h-10 bg-[var(--primary)] rounded-xl flex items-center justify-center shadow-lg">
          <Crown className="text-white" size={24} />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">HabitPro</h1>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <motion.button
            key={item.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setView(item.id)}
            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all ${
              currentView === item.id 
                ? 'bg-white shadow-sm text-[var(--primary)] font-semibold' 
                : 'text-[var(--text-muted)] hover:bg-white/50'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </motion.button>
        ))}
      </nav>

      <div className="mt-auto">
        <div className="glass-card bg-white/30 p-4 rounded-3xl border-dashed border-2 border-white/50">
          <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Pro Member</p>
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold">Lifetime Plan</span>
            <Crown size={14} className="text-yellow-500" />
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
