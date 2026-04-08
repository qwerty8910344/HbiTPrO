import React from 'react';
import { motion } from 'framer-motion';
import { Stars, Sparkles, Zap, ChevronLeft } from 'lucide-react';
import { getZodiacSign, getDailyHoroscope } from '../lib/ZodiacEngine';
import { useSettings } from '../context/SettingsContext';
import { t } from '../lib/i18n';

const HoroscopeView = ({ dob, onClose }) => {
  const { settings } = useSettings();
  const lang = settings.language || 'English';
  const sign = getZodiacSign(dob);
  const horoscope = getDailyHoroscope(sign?.name);

  if (!sign) return null;

  return (
    <div className="fixed inset-0 z-[150] bg-[#0B0F0C] p-6 flex flex-col pt-16">
      <button onClick={onClose} className="absolute top-6 left-6 text-white/50 flex items-center gap-2 tap-effect">
         <ChevronLeft size={20} /> Back
      </button>

      <header className="flex flex-col items-center text-center gap-4 mb-10">
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#16A34A] to-[#4ADE80] flex items-center justify-center text-5xl shadow-[0_0_50px_rgba(22,163,74,0.3)]">
           {sign.icon}
        </div>
        <div>
          <h1 className="text-3xl font-black text-white">{sign.name}</h1>
          <p className="text-[#4ADE80] font-black text-xs uppercase tracking-[0.3em] mt-1">{t('your_horoscope', lang)}</p>
        </div>
      </header>

      <div className="flex flex-col gap-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="ios-card bg-[#111827] p-8 relative overflow-hidden flex flex-col gap-4 border border-[#16A34A]/20"
        >
           <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#16A34A]/20 rounded-full blur-3xl" />
           <p className="text-lg font-bold text-white leading-relaxed italic">
             "{sign.vibe}"
           </p>
           <div className="flex items-center gap-2 text-[#6B7280] font-black text-[10px] uppercase tracking-widest mt-2">
              <Sparkles size={14} className="text-[#4ADE80]" />
              Elite Daily Vibe
           </div>
        </motion.div>

        <div className="grid grid-cols-2 gap-4">
           <div className="ios-card bg-[#111827] p-6 flex flex-col items-center gap-2 border border-white/5">
              <Zap size={24} className="text-yellow-400" />
              <div className="text-center">
                 <p className="text-[10px] font-black uppercase text-[#6B7280] tracking-widest">Lucky No.</p>
                 <p className="text-2xl font-black text-white">{horoscope.number}</p>
              </div>
           </div>
           <div className="ios-card bg-[#111827] p-6 flex flex-col items-center gap-2 border border-white/5">
              <Stars size={24} className="text-indigo-400" />
              <div className="text-center">
                 <p className="text-[10px] font-black uppercase text-[#6B7280] tracking-widest">Alignment</p>
                 <p className="text-2xl font-black text-white">{horoscope.score}%</p>
              </div>
           </div>
        </div>

        <div className="ios-card bg-[#16A34A]/5 p-6 border border-[#16A34A]/20 flex items-center justify-between">
           <div>
              <p className="text-[10px] font-black uppercase text-[#4ADE80] tracking-widest">Lucky Color</p>
              <p className="text-xl font-black text-white">{horoscope.color}</p>
           </div>
           <div className={`w-12 h-12 rounded-full border-2 border-white/10 shadow-lg`} style={{ 
             backgroundColor: horoscope.color.includes('Green') ? '#16A34A' : 
                              horoscope.color.includes('Gold') ? '#FFD700' :
                              horoscope.color.includes('Blue') ? '#00A3FF' : '#FF4B4B'
           }} />
        </div>
      </div>
    </div>
  );
};

export default HoroscopeView;
