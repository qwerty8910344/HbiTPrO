import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Moon, Lightbulb, Zap, Rocket, User, Bell, Lock, HelpCircle, LogOut, Globe, Camera, Calendar, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useSettings } from '../context/SettingsContext';
import { useSound } from '../hooks/useSound';
import { t } from '../lib/i18n';
import PricingModal from '../components/ui/PricingModal';

const SettingsView = () => {
  const [userEmail, setUserEmail] = useState('');
  const [loggingOut, setLoggingOut] = useState(false);
  
  const { settings, updateSetting, isPremium, trialDaysLeft } = useSettings();
  const { playTick } = useSound();
  const [showPricing, setShowPricing] = useState(false);
  const { adhd_mode, dark_mode, face_id, language: lang, dob, subscription_tier, subscription_status } = settings;
  const languages = ['English', 'Hindi', 'Spanish', 'French', 'Bengali', 'Arabic'];

  const cycleLanguage = () => {
    const currentIndex = languages.indexOf(lang);
    const nextIndex = (currentIndex + 1) % languages.length;
    handleUpdate('language', languages[nextIndex]);
  };

  const [uploading, setUploading] = useState(false);

  const handleUpdate = (key, value) => {
    playTick();
    updateSetting(key, value);
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData?.session) return;

      const user = sessionData.session.user;
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      const filePath = fileName;

      // Upload to 'avatars' bucket
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Save to settings
      await updateSetting('avatar_url', publicUrl);
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Failed to upload image. Make sure the "avatars" bucket is public.');
    } finally {
      setUploading(false);
    }
  };

  const handleSelectPlan = async (tier) => {
    handleUpdate('subscription_tier', tier);
    handleUpdate('subscription_status', 'active');
    handleUpdate('subscription_end_date', new Date(Date.now() + (tier === 'yearly' ? 365 : 30) * 24 * 60 * 60 * 1000).toISOString());
    setShowPricing(false);
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
        {/* AVATAR UPLOAD SECTION */}
        <div className="relative group">
           <div className="w-24 h-24 rounded-full border-4 border-[#16A34A] shadow-xl overflow-hidden relative bg-[#111827]">
              {settings.avatar_url ? (
                <img src={settings.avatar_url} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#6B7280]">
                   <User size={48} />
                </div>
              )}
              {uploading && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                   <Loader2 size={24} className="text-[#4ADE80] animate-spin" />
                </div>
              )}
           </div>
           <label className="absolute bottom-0 right-0 w-8 h-8 bg-[#16A34A] text-white rounded-full flex items-center justify-center shadow-lg border-2 border-[#0B0F0C] cursor-pointer tap-effect hover:scale-110 transition-transform">
              <Camera size={14} />
              <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} disabled={uploading} />
           </label>
        </div>

        <h1 className="text-[32px] font-black tracking-tight mt-4 text-[var(--text-main)]">{t('settings', lang)}</h1>
        <div className="flex flex-col items-center gap-1">
          <span className="text-[var(--text-muted)] font-black text-[10px] uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full border border-white/5">Member Since 2024</span>
          <span className="text-[var(--text-main)] font-bold text-sm mt-1">{userEmail || 'achiever@elite.com'}</span>
        </div>
      </header>

      {/* Subscription Plans Card */}
      <div 
        onClick={() => !isPremium && setShowPricing(true)}
        className={`ios-card p-6 relative overflow-hidden flex flex-col gap-4 border transition-all tap-effect ${
          isPremium ? 'bg-gradient-to-tr from-[#16A34A]/20 to-[#0B0F0C] border-[#16A34A]/30' : 'bg-[#111827] border-white/5'
        }`}
      >
         <div className="absolute top-0 right-0 w-32 h-32 bg-[#16A34A]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
         
         <div className="flex justify-between items-start">
            <div>
               <h3 className="text-xl font-black tracking-tight text-white">
                 {subscription_tier !== 'free' ? `${subscription_tier.charAt(0).toUpperCase() + subscription_tier.slice(1)} Elite` : 'Upgrade to Elite'}
               </h3>
               <p className="text-xs text-[var(--text-muted)] font-bold mt-1">
                 {subscription_tier !== 'free' ? 'Lifetime mastery in progress' : 'Unlock full productivity potential'}
               </p>
            </div>
            {isPremium && (
               <div className="bg-[#16A34A] text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full text-white shadow-lg">
                  Active
               </div>
            )}
         </div>

         <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
            {subscription_tier === 'free' ? (
              <>
                 <div className="flex justify-between items-center mb-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#4ADE80]">Free Trial Active</p>
                    <p className="text-[10px] font-black text-[#6B7280]">{trialDaysLeft} / 14 Days</p>
                 </div>
                 <div className="w-full h-1.5 bg-black/30 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(trialDaysLeft / 14) * 100}%` }}
                      className="h-full bg-[#16A34A]"
                    />
                 </div>
                 <p className="text-[9px] text-[var(--text-muted)] mt-2 font-bold uppercase tracking-widest">Ending soon. Lock in Elite features now.</p>
              </>
            ) : (
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-[#16A34A]/10 rounded-xl flex items-center justify-center text-[#4ADE80]">
                    <Crown size={20} />
                 </div>
                 <div>
                    <p className="text-xs font-black text-white uppercase tracking-widest">Next Billing Cycle</p>
                    <p className="text-lg font-black text-[#4ADE80]">
                       {subscription_tier === 'monthly' ? '$9 / Month' : '$79 / Year'}
                    </p>
                 </div>
              </div>
            )}
         </div>

         {!isPremium && (
           <button className="w-full py-4 rounded-2xl bg-[#16A34A] text-white font-black text-sm uppercase tracking-widest shadow-lg shadow-[#16A34A]/20">
              Pick Your Plan
           </button>
         )}
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
         <p className="text-[10px] font-black uppercase text-[#6B7280] tracking-[0.3em]">HabitPro v1.0.4 {isPremium ? 'Elite' : 'Basic'}</p>
         <p className="text-[8px] font-bold text-[#6B7280]/60 tracking-widest mt-1">Crafted for Excellence</p>
      </div>

      <PricingModal 
        isOpen={showPricing} 
        onClose={() => setShowPricing(false)} 
        onSelect={handleSelectPlan}
      />
    </div>
  );
};

const ChevronRight = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m9 18 6-6-6-6"/>
  </svg>
);

export default SettingsView;
