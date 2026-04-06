import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Moon, Lightbulb, Zap, Rocket, User, Bell, Lock, HelpCircle } from 'lucide-react';

const SettingsView = () => {
  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col items-center text-center">
        <h1 className="text-[32px] font-black tracking-tight mt-4">Settings</h1>
        <p className="text-[#8E8E93] font-medium text-lg italic">Customize your experience</p>
      </header>

      {/* User Profile Card */}
      <div className="ios-card bg-white p-5 flex items-center gap-4">
         <img src="https://i.pravatar.cc/150?u=a2" alt="Dot" className="w-16 h-16 rounded-full border-4 border-white shadow-lg" />
         <div className="flex-1">
            <h3 className="font-bold text-xl tracking-tight">Dot</h3>
            <p className="text-xs font-bold text-red-400 uppercase tracking-widest">Premium Member</p>
         </div>
         <div className="p-3 bg-red-400/10 text-red-400 rounded-2xl"><Rocket size={24} /></div>
      </div>

      {/* Subscription Plans Card */}
      <div className="ios-card bg-black text-white p-6 relative overflow-hidden flex flex-col gap-4">
         <div className="absolute top-0 right-0 w-32 h-32 bg-red-400/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
         <h3 className="text-xl font-bold tracking-tight">Family Premium</h3>
         <p className="text-sm text-gray-400 leading-relaxed font-inter">Unlocked unlimited habits, advanced stats, widgets and multi-device sync for your entire family.</p>
         <div className="bg-red-400/20 p-4 rounded-2xl border border-red-400/30">
            <p className="text-xs font-black uppercase tracking-[0.2em] opacity-80 mb-1">Active Plan</p>
            <p className="text-2xl font-black">₹1299 <span className="text-sm font-bold opacity-60">/ Lifetime</span></p>
         </div>
      </div>

      {/* Accessibility & Design Modes */}
      <div className="ios-card bg-white p-0 overflow-hidden flex flex-col divide-y divide-gray-50 shadow-lg">
         <div className="p-5 flex items-center justify-between tap-effect">
            <div className="flex items-center gap-3">
               <div className="p-2 bg-yellow-100 text-yellow-600 rounded-xl"><Lightbulb size={20} /></div>
               <span className="font-bold tracking-tight">ADHD Friendly Mode</span>
            </div>
            <div className="w-12 h-6 bg-red-400 rounded-full relative shadow-inner">
               <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
            </div>
         </div>
         <div className="p-5 flex items-center justify-between tap-effect">
            <div className="flex items-center gap-3">
               <div className="p-2 bg-blue-100 text-blue-600 rounded-xl"><Moon size={20} /></div>
               <span className="font-bold tracking-tight">Dark Mode</span>
            </div>
            <div className="w-12 h-6 bg-gray-200 rounded-full relative shadow-inner">
               <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
            </div>
         </div>
         <div className="p-5 flex items-center justify-between tap-effect">
            <div className="flex items-center gap-3">
               <div className="p-2 bg-red-100 text-red-600 rounded-xl"><Bell size={20} /></div>
               <span className="font-bold tracking-tight">Smart Reminders</span>
            </div>
            <ChevronRight size={18} className="text-[#8E8E93]" />
         </div>
         <div className="p-5 flex items-center justify-between tap-effect">
            <div className="flex items-center gap-3">
               <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl"><ShieldCheck size={20} /></div>
               <span className="font-bold tracking-tight">Face ID / Security</span>
            </div>
            <div className="w-12 h-6 bg-red-400 rounded-full relative shadow-inner">
               <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
            </div>
         </div>
      </div>

      {/* Help & Support */}
      <div className="ios-card-glass p-6 text-center flex flex-col items-center gap-4 border-dashed border-2 border-red-200 mt-2">
         <HelpCircle size={32} className="text-[#8E8E93] opacity-40" />
         <h3 className="font-extrabold">Need Help?</h3>
         <p className="text-xs text-[#8E8E93] font-bold font-inter leading-relaxed">Check our guides or chat with our experts to find your flow.</p>
         <button className="px-8 py-3 bg-red-400 text-white rounded-full font-black text-xs tap-effect shadow-md">Support Center</button>
      </div>

      {/* App Version Info */}
      <div className="text-center pb-10">
         <p className="text-[10px] font-black uppercase text-[#8E8E93] tracking-[0.3em]">HabitPro v1.0.4 Premium</p>
         <p className="text-[8px] font-bold text-[#8E8E93]/60 tracking-widest mt-1">Crafted for Excellence</p>
      </div>
    </div>
  );
};

const ChevronRight = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m9 18 6-6-6-6"/>
  </svg>
);

export default SettingsView;
