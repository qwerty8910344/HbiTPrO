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
import { useSettings } from '../../context/SettingsContext';

const Sidebar = ({ currentView, setView }) => {
  const { isPremium, settings, trialDaysLeft } = useSettings();
  const { subscription_tier } = settings;
  const navItems = [
    { id: 'today', icon: <Home size={22} />, label: 'Today' },
    { id: 'groups', icon: <Users size={22} />, label: 'Groups' },
    { id: 'stats', icon: <BarChart2 size={22} />, label: 'Stats' },
    { id: 'focus', icon: <Timer size={22} />, label: 'Focus' },
    { id: 'reports', icon: <FileText size={22} />, label: 'Reports' },
    { id: 'settings', icon: <Settings size={22} />, label: 'Settings' },
  ];

  return (
    <aside className="ios-card hidden md:flex flex-col h-[calc(100vh-40px)] w-72 m-5 p-6 fixed left-0 top-0 z-50">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-10 h-10 bg-[var(--primary-green)] rounded-xl flex items-center justify-center shadow-lg">
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
                ? 'bg-white shadow-sm text-[var(--primary-green)] font-semibold dark:bg-white/10' 
                : 'text-[var(--text-muted)] hover:bg-white/5'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </motion.button>
        ))}
      </nav>

      <div className="mt-auto space-y-4">
        {/* Profile Card Summary */}
        <div 
          onClick={() => setView('settings')}
          className="ios-card bg-white/5 p-4 flex items-center gap-3 cursor-pointer tap-effect border border-white/5"
        >
          <div className="w-10 h-10 rounded-full border-2 border-[#16A34A] overflow-hidden bg-[#0B0F0C] flex items-center justify-center">
             <User className="text-[#6B7280]" size={20} />
          </div>
          <div className="flex-1 min-w-0 text-left">
             <p className="text-xs font-black text-[#E5E7EB] truncate uppercase tracking-widest">Elite Member</p>
             <p className="text-[8px] font-bold text-[#6B7280] uppercase tracking-widest">Active Status</p>
          </div>
        </div>

        <div className="ios-card bg-white/5 p-4 rounded-3xl border-dashed border-2 border-white/5">
          <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
            {subscription_tier !== 'free' ? `${subscription_tier} Member` : 'Free Trial'}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold">
              {subscription_tier !== 'free' ? 'Elite Access' : `${trialDaysLeft} Days Left`}
            </span>
            <Crown size={14} className={isPremium ? "text-yellow-500" : "text-[#6B7280]"} />
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
