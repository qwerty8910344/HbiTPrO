'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, Star, Zap, Info, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { getZodiacSign, getDailyHoroscope } from '@/lib/zodiac';

export default function HoroscopePage() {
  const { settings } = useApp();
  
  const sign = useMemo(() => getZodiacSign(settings.dob), [settings.dob]);
  const horoscope = useMemo(() => sign ? getDailyHoroscope(sign.name) : null, [sign]);

  if (!settings.dob) {
    return (
      <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center px-8 text-center">
        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-8 border border-white/10">
           <Star size={48} className="text-blue-500 animate-pulse" />
        </div>
        <h1 className="text-3xl font-black mb-4">Cosmic Alignment Needed</h1>
        <p className="text-gray-500 font-bold mb-8">Please set your date of birth in settings to unlock your personalized daily horoscope.</p>
        <Link href="/profile" className="w-full py-5 bg-white text-black font-black uppercase tracking-widest rounded-3xl active:scale-95 transition-transform">
           Set Date of Birth
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white pb-32">
      {/* Dynamic Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-20%] w-[500px] h-[500px] bg-blue-600/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[10%] left-[-20%] w-[400px] h-[400px] bg-purple-600/10 blur-[120px] rounded-full" />
      </div>

      {/* Header */}
      <div className="relative z-10 px-6 py-8 flex justify-between items-center mb-6">
        <Link href="/" className="p-3 bg-white/5 rounded-2xl border border-white/10">
          <ArrowLeft size={24} />
        </Link>
        <div className="text-center">
          <h1 className="text-xl font-black uppercase tracking-[0.4em]">Daily Horoscope</h1>
          <div className="flex items-center justify-center gap-1.5 mt-1">
             <ShieldCheck size={12} className="text-emerald-500" />
             <span className="text-[10px] font-black text-emerald-500 tracking-widest uppercase">98% Accuracy Achieved</span>
          </div>
        </div>
        <button className="p-3 bg-white/5 rounded-2xl border border-white/10">
          <Zap size={24} className="text-orange-500 fill-orange-500" />
        </button>
      </div>

      <main className="relative z-10 px-6">
        {/* Zodiac Card */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-3xl rounded-[3.5rem] border border-white/10 p-10 shadow-2xl relative overflow-hidden mb-8"
        >
          <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
             <Star size={120} />
          </div>

          {/* Celestial Orbit Animation Skill */}
          <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
            <svg width="400" height="400" viewBox="0 0 400 400" className="animate-[spin_60s_linear_infinity]">
               <circle cx="200" cy="200" r="150" stroke="rgba(59,130,246,0.2)" strokeWidth="1" fill="none" strokeDasharray="10 10" />
               <circle cx="200" cy="200" r="100" stroke="rgba(168,85,247,0.2)" strokeWidth="1" fill="none" strokeDasharray="5 5" />
               <motion.circle 
                 cx="350" cy="200" r="4" fill="#60a5fa"
                 animate={{ opacity: [0.3, 1, 0.3] }}
                 transition={{ duration: 4, repeat: Infinity }}
               />
               <motion.circle 
                 cx="200" cy="50" r="3" fill="#a855f7"
                 animate={{ opacity: [0.3, 1, 0.3] }}
                 transition={{ duration: 3, repeat: Infinity, delay: 1 }}
               />
               <motion.circle 
                 cx="100" cy="200" r="2" fill="#ffffff"
                 animate={{ opacity: [0.3, 1, 0.3] }}
                 transition={{ duration: 5, repeat: Infinity, delay: 2 }}
               />
            </svg>
          </div>

          <div className="flex flex-col items-center text-center relative z-10">
            <motion.div 
              whileHover={{ rotate: 15, scale: 1.1 }}
              className="w-32 h-32 bg-white/5 rounded-[2.5rem] border-2 border-white/10 flex items-center justify-center text-8xl mb-6 shadow-inner backdrop-blur-md"
            >
               {sign?.icon}
            </motion.div>
            <h2 className="text-4xl font-black tracking-tighter mb-2">{sign?.name}</h2>
            <p className="text-blue-400 font-black text-[10px] uppercase tracking-[0.4em] mb-10">Ascendant Mastery</p>
            
            <div className="space-y-6">
              <p className="text-2xl font-bold leading-tight italic text-blue-100/90">
                "{horoscope?.vibe}"
              </p>
              
              <div className="pt-6 border-t border-white/5 flex justify-center gap-12">
                 <div className="flex flex-col items-center">
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Lucky No.</span>
                    <span className="text-2xl font-black text-white">{horoscope?.luckyNumber}</span>
                 </div>
                 <div className="flex flex-col items-center">
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Color</span>
                    <span className="text-2xl font-black text-emerald-400">{horoscope?.luckyColor}</span>
                 </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Accuracy Badge Card */}
        <div className="grid grid-cols-2 gap-4 mb-8">
           <div className="bg-white/5 backdrop-blur-2xl border border-white/5 p-6 rounded-[2.5rem] flex flex-col items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                 <Sparkles size={20} className="text-emerald-500" />
              </div>
              <div className="text-center">
                 <p className="text-[9px] font-black text-emerald-500 tracking-widest uppercase mb-1">PREDICTION ACCURACY</p>
                 <p className="text-2xl font-black">{horoscope?.accuracy}%</p>
              </div>
           </div>
           <div className="bg-white/5 backdrop-blur-2xl border border-white/5 p-6 rounded-[2.5rem] flex flex-col items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-500/10 flex items-center justify-center">
                 <Zap size={20} className="text-orange-500" />
              </div>
              <div className="text-center">
                 <p className="text-[9px] font-black text-orange-500 tracking-widest uppercase mb-1">ENERGY LEVEL</p>
                 <p className="text-2xl font-black">{horoscope?.energyLevel}%</p>
              </div>
           </div>
        </div>

        {/* Advice Section */}
        <div className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 backdrop-blur-xl border border-white/10 p-8 rounded-[3rem] mb-10">
           <div className="flex items-center gap-3 mb-4">
              <Info size={20} className="text-blue-400" />
              <h3 className="text-sm font-black uppercase tracking-widest">Cosmic Advice</h3>
           </div>
           <p className="text-gray-400 font-bold leading-relaxed">
              Your celestial path is clear today. Focus on consistency. The alignment suggests that small habits started today will have 10x the impact. Avoid impulsive dining choices as your digestive energy is sensitive.
           </p>
        </div>
      </main>
    </div>
  );
}
