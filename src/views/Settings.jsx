import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Moon, Lightbulb, Zap, Rocket, User, Bell, Lock, HelpCircle, LogOut, Globe } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useSettings } from '../context/SettingsContext';
import { useSound } from '../hooks/useSound';
import { t } from '../lib/i18n';

const SettingsView = () => {
  const [userEmail, setUserEmail] = useState('');
  const [loggingOut, setLoggingOut] = useState(false);
  
  const { settings, updateSetting } = useSettings();
  const { playTick } = useSound();
  const { adhd_mode, dark_mode, face_id, language: lang, dob } = settings;
  const languages = ['English', 'Hindi', 'Spanish', 'French', 'Bengali', 'Arabic'];

  const cycleLanguage = () => {
    const currentIndex = languages.indexOf(lang);
    const nextIndex = (currentIndex + 1) % languages.length;
    handleUpdate('language', languages[nextIndex]);
  };

  const handleUpdate = (key, value) => {
    playTick();
    updateSetting(key, value);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setUserEmail(session.user.email);
    });
  }, []);

  const handleSignOut = async () => {
    setLoggingOut(true);
    await supabase.auth.signOut();
  };

  return (
    <div className="flex flex-col gap-8 pb-10">
      <header className="flex flex-col items-center text-center">
        <h1 className="text-[32px] font-black tracking-tight mt-4 text-[var(--text-main)]">{t('settings', lang)}</h1>
        <div className="flex flex-col items-center gap-1">
          <span className="text-[var(--text-muted)] font-black text-[10px] uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full border border-white/5">Member Since 2024</span>
          <span className="text-[var(--text-main)] font-bold text-sm mt-1">{userEmail || 'achiever@elite.com'}</span>
        </div>
      </header>

      {/* Subscription Plans Card */}
      <div className="ios-card bg-[#111827] text-[var(--text-main)] p-6 relative overflow-hidden flex flex-col gap-4 border border-[#16A34A]/20">
         <div className="absolute top-0 right-0 w-32 h-32 bg-[#16A34A]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
         <h3 className="text-xl font-bold tracking-tight">{t('premium_plan', lang)}</h3>
         <p className="text-sm text-[var(--text-muted)] leading-relaxed">{t('premium_desc', lang)}</p>
         <div className="bg-[#16A34A]/10 p-4 rounded-2xl border border-[#16A34A]/20">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#4ADE80]/60 mb-1">{t('active_plan', lang)}</p>
            <p className="text-2xl font-black text-[#4ADE80]">$29.99 <span className="text-sm font-bold text-[var(--text-muted)]">/ {t('lifetime', lang)}</span></p>
         </div>
      </div>

      {/* Accessibility & Design Modes */}
      <div className="ios-card p-0 overflow-hidden flex flex-col divide-y divide-white/5 shadow-lg">
         <div className="p-5 flex items-center justify-between tap-effect cursor-pointer" onClick={() => handleUpdate('adhd_mode', !adhd_mode)}>
            <div className="flex items-center gap-3">
               <div className="p-2 bg-yellow-500/10 text-yellow-500 rounded-xl"><Lightbulb size={20} /></div>
               <span className="font-bold tracking-tight text-[var(--text-main)]">{t('adhd_mode', lang)}</span>
            </div>
            <div className={`w-12 h-6 rounded-full relative shadow-inner transition-colors ${adhd_mode ? 'bg-[#16A34A]' : 'bg-white/10'}`}>
               <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${adhd_mode ? 'right-1' : 'left-1'}`} />
            </div>
         </div>
         <div className="p-5 flex items-center justify-between tap-effect cursor-pointer" onClick={() => handleUpdate('dark_mode', !dark_mode)}>
            <div className="flex items-center gap-3">
               <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl"><Moon size={20} /></div>
               <span className="font-bold tracking-tight text-[var(--text-main)]">{t('dark_mode', lang)}</span>
            </div>
            <div className={`w-12 h-6 rounded-full relative shadow-inner transition-colors ${dark_mode ? 'bg-[#16A34A]' : 'bg-white/10'}`}>
               <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${dark_mode ? 'right-1' : 'left-1'}`} />
            </div>
         </div>
         <div className="p-5 flex items-center justify-between tap-effect cursor-pointer" onClick={() => alert("Notification settings coming soon")}>
            <div className="flex items-center gap-3">
               <div className="p-2 bg-[#16A34A]/10 text-[#4ADE80] rounded-xl"><Bell size={20} /></div>
               <span className="font-bold tracking-tight text-[var(--text-main)]">{t('reminders', lang)}</span>
            </div>
            <ChevronRight size={18} className="text-[var(--text-muted)]" />
         </div>
         <div className="p-5 flex items-center justify-between tap-effect cursor-pointer" onClick={() => handleUpdate('face_id', !face_id)}>
            <div className="flex items-center gap-3">
               <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl"><ShieldCheck size={20} /></div>
               <span className="font-bold tracking-tight text-[var(--text-main)]">{t('security', lang)}</span>
            </div>
            <div className={`w-12 h-6 rounded-full relative shadow-inner transition-colors ${face_id ? 'bg-[#16A34A]' : 'bg-white/10'}`}>
               <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${face_id ? 'right-1' : 'left-1'}`} />
            </div>
         </div>
         <div className="p-5 flex items-center justify-between tap-effect border-t border-white/5 cursor-pointer" onClick={cycleLanguage}>
            <div className="flex items-center gap-3">
               <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl"><Globe size={20} /></div>
               <span className="font-bold tracking-tight text-[var(--text-main)]">{t('language', lang)}</span>
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#4ADE80] bg-[#16A34A]/20 px-3 py-1 rounded-full">{lang}</span>
         </div>
         <div className="p-5 flex items-center justify-between tap-effect border-t border-white/5">
            <div className="flex items-center gap-3">
               <div className="p-2 bg-pink-500/10 text-pink-400 rounded-xl"><Calendar size={20} /></div>
               <span className="font-bold tracking-tight text-[var(--text-main)]">{t('set_dob', lang)}</span>
            </div>
            <input 
              type="date" 
              value={dob || ''} 
              onChange={(e) => handleUpdate('dob', e.target.value)}
              className="bg-transparent text-[#4ADE80] font-black text-xs outline-none text-right"
            />
         </div>
      </div>

      {/* Sign Out Button */}
      <button 
        onClick={handleSignOut}
        disabled={loggingOut}
        className="ios-card bg-[#111827] p-5 flex items-center justify-center gap-3 tap-effect shadow-lg hover:bg-red-500/5 transition-colors border border-red-500/20"
      >
        <LogOut size={20} className="text-red-400" />
        <span className="font-black text-red-400 uppercase tracking-widest text-sm">
          {loggingOut ? 'Signing Out...' : 'Sign Out'}
        </span>
      </button>

      {/* Help & Support */}
      <div className="ios-card-glass p-6 text-center flex flex-col items-center gap-4 border-dashed border-2 border-[#16A34A]/20 mt-2 hover:bg-[#16A34A]/5 transition-colors cursor-pointer" onClick={() => alert("Connecting to Support...")}>
         <HelpCircle size={32} className="text-[#6B7280] opacity-40" />
         <h3 className="font-extrabold text-[#E5E7EB]">Need Help?</h3>
         <p className="text-xs text-[#6B7280] font-bold leading-relaxed">Check our guides or chat with our experts to find your flow.</p>
         <button className="px-8 py-3 bg-[#16A34A] text-white rounded-full font-black text-xs tap-effect shadow-md">Support Center</button>
      </div>

      {/* App Version Info */}
      <div className="text-center pb-10">
         <p className="text-[10px] font-black uppercase text-[#6B7280] tracking-[0.3em]">HabitPro v1.0.4 Premium</p>
         <p className="text-[8px] font-bold text-[#6B7280]/60 tracking-widest mt-1">Crafted for Excellence</p>
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
