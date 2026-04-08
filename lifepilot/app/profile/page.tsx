import { User, Settings, Bell, Globe, Shield, LogOut, ChevronRight, Edit2, Target, Award, Zap, Calendar } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { motion } from 'framer-motion';
import { useApp } from '@/context/AppContext';

export default function ProfilePage() {
  const { settings, updateSetting } = useApp();

  return (
    <main className="min-h-screen bg-[#020617] pb-32 text-slate-200 no-scrollbar">
      {/* Header */}
      <div className="bg-[#0f172a]/80 px-8 pt-20 pb-16 rounded-b-[4rem] relative overflow-hidden shadow-2xl border-b border-white/5 backdrop-blur-3xl">
         <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] opacity-20" />
         <div className="relative z-10 flex flex-col items-center text-center">
            <div className="relative mb-8 group">
               <div className="w-32 h-32 rounded-[3.5rem] bg-white/5 p-1 border-2 border-white/10 shadow-2xl relative z-10 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop" 
                    alt="Profile" 
                    className="w-full h-full object-cover grayscale-[0.2] transition-all duration-500 group-hover:grayscale-0 group-hover:scale-110" 
                  />
               </div>
               <button className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-3.5 rounded-2xl shadow-lg border-4 border-[#0f172a] hover:scale-110 transition-transform active:scale-95 z-20">
                  <Edit2 size={16} fill="white" />
               </button>
            </div>
            <h1 className="text-3xl font-black text-white mb-2">Life Pioneer</h1>
            <p className="text-emerald-400 font-black text-xs uppercase tracking-[0.3em] drop-shadow-[0_0_8px_rgba(74,222,128,0.4)]">
               LEVEL {settings.level} COMMANDER • {settings.xp} XP
            </p>
         </div>
      </div>

      {/* Stats Cards */}
      <div className="px-6 -mt-10 flex gap-4 z-20 relative">
         <StatCard icon={Target} label="Daily Kcal" value={`${settings.target_calories}`} color="text-neon" />
         <StatCard icon={Zap} label="Life level" value={settings.level} color="text-emerald-500" />
      </div>

      {/* Settings Sections */}
      <div className="px-6 mt-12 space-y-10">
         <section>
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-600 mb-6 px-4">Life Alignment</h2>
            <div className="bg-white/5 rounded-[3rem] border border-white/5 shadow-inner overflow-hidden backdrop-blur-md">
               {/* Language Selection */}
               <SettingsItem icon={Globe} label="Language" sub={settings.language}>
                  <select 
                    value={settings.language} 
                    onChange={(e) => updateSetting('language', e.target.value)}
                    className="bg-transparent text-xs font-black text-white outline-none uppercase tracking-widest text-right"
                  >
                     <option value="English" className="bg-[#020617]">English</option>
                     <option value="Hindi" className="bg-[#020617]">Hindi</option>
                     <option value="Spanish" className="bg-[#020617]">Spanish</option>
                  </select>
               </SettingsItem>

               {/* DOB Setting (Vital for Astrology) */}
               <SettingsItem icon={Calendar} label="Date of Birth" sub={settings.dob || 'Not Set'}>
                  <input 
                    type="date" 
                    value={settings.dob || ''} 
                    onChange={(e) => updateSetting('dob', e.target.value)}
                    className="bg-transparent text-xs font-black text-white outline-none uppercase tracking-widest text-right [color-scheme:dark]"
                  />
               </SettingsItem>

               <SettingsItem icon={Target} label="Daily Goal" sub={`${settings.target_calories} kcal`}>
                  <div className="flex items-center gap-2">
                     <button onClick={() => updateSetting('target_calories', settings.target_calories - 100)} className="text-gray-500 p-1">-</button>
                     <button onClick={() => updateSetting('target_calories', settings.target_calories + 100)} className="text-gray-500 p-1">+</button>
                  </div>
               </SettingsItem>
            </div>
         </section>

         <section>
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-600 mb-6 px-4">System Preferences</h2>
            <div className="bg-white/5 rounded-[3rem] border border-white/5 shadow-inner overflow-hidden backdrop-blur-md">
               <SettingsItem icon={Zap} label="ADHD Focus Mode" sub={settings.adhd_mode ? 'Enabled' : 'Disabled'}>
                  <button 
                    onClick={() => updateSetting('adhd_mode', !settings.adhd_mode)}
                    className={`w-10 h-6 rounded-full relative transition-colors ${settings.adhd_mode ? 'bg-emerald-500' : 'bg-gray-700'}`}
                  >
                     <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.adhd_mode ? 'right-1' : 'left-1'}`} />
                  </button>
               </SettingsItem>
               <SettingsItem icon={Bell} label="Smart Nudges" sub="Active" />
               <SettingsItem icon={Shield} label="Privacy & Security" />
            </div>
         </section>

         <button className="w-full bg-rose-500/10 text-rose-500 py-6 rounded-[3rem] font-black flex items-center justify-center gap-3 active:scale-95 transition-all mb-8 border border-rose-500/20 shadow-lg">
            <LogOut size={24} />
            TERMINATE SESSION
         </button>
      </div>

      <Navigation />
    </main>
  );
}

function StatCard({ icon: Icon, label, value, color }: any) {
  return (
    <div className="flex-1 bg-[#1e293b]/60 p-6 rounded-[2.5rem] shadow-2xl border border-white/5 backdrop-blur-2xl flex flex-col items-center gap-2 group hover:bg-white/5 transition-all">
       <div className={`p-3 bg-white/5 rounded-2xl ${color} bg-opacity-10 mb-1 group-hover:scale-110 transition-transform`}>
          <Icon size={20} />
       </div>
       <span className="text-[8px] font-black uppercase tracking-widest text-gray-500">{label}</span>
       <span className="text-xl font-black text-white">{value}</span>
    </div>
  );
}

function SettingsItem({ icon: Icon, label, sub, children }: any) {
  return (
    <div className="w-full p-6 flex items-center justify-between group border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
       <div className="flex items-center gap-5">
          <div className="p-4 bg-white/5 text-gray-500 rounded-2xl transition-all">
             <Icon size={22} />
          </div>
          <div className="text-left">
             <p className="font-extrabold text-white text-base">{label}</p>
             {sub && <p className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.2em] mt-1 italic">{sub}</p>}
          </div>
       </div>
       <div>
          {children || <ChevronRight size={18} className="text-gray-600" />}
       </div>
    </div>
  );
}
