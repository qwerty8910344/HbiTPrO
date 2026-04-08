'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, Star, Plus, ShieldCheck, Flame, 
  Target, Info, ArrowRight, Camera, 
  LayoutGrid, Sparkles, User, Settings
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import XpNotification, { triggerXp } from '@/components/XpNotification';
import { useApp } from '@/context/AppContext';
import { getZodiacSign, getDailyHoroscope } from '@/lib/zodiac';
import Link from 'next/link';

export default function LifePilotDashboard() {
  const { settings, updateSetting, addXP } = useApp();
  const [streak, setStreak] = useState(5);
  const [habitsCount, setHabitsCount] = useState(0);
  const [caloriesConsumed, setCaloriesConsumed] = useState(0);

  // Load stats
  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('calo_history') || '[]');
    const todayKcal = history.reduce((acc: number, meal: any) => acc + (meal.calories || 0), 0);
    setCaloriesConsumed(todayKcal);
    
    // In a real app we'd fetch habits count here
    setHabitsCount(4); 
  }, [settings.xp]); // Update when XP changes for demo

  const sign = useMemo(() => getZodiacSign(settings.dob), [settings.dob]);
  const horoscope = useMemo(() => sign ? getDailyHoroscope(sign.name) : null, [sign]);

  // Gamification: XP Progress
  const nextLevelXP = settings.level * 100;
  const xpPercentage = (settings.xp / nextLevelXP) * 100;

  return (
    <main className="min-h-screen bg-[#020617] text-white pb-32 overflow-x-hidden no-scrollbar">
      <XpNotification />

      {/* 1. Header & XP Bar */}
      <header className="px-6 pt-12 pb-8 sticky top-0 z-50 bg-[#020617]/80 backdrop-blur-3xl border-b border-white/5">
        <div className="flex justify-between items-center mb-6">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-[0_0_20px_#10b98140]">
                 <Zap size={20} className="text-white" fill="white" />
              </div>
              <div>
                 <h1 className="text-lg font-black tracking-tighter leading-none">LifePilot <span className="text-emerald-500">Elite</span></h1>
                 <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500">AI Personal Assistant</p>
              </div>
           </div>
           <div className="flex gap-2">
              <Link href="/profile" className="p-2.5 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                 <User size={20} className="text-gray-400" />
              </Link>
           </div>
        </div>

        {/* XP Bar */}
        <div className="bg-black/40 p-1.5 rounded-full border border-white/5 shadow-inner">
           <div className="flex justify-between items-center mb-2 px-3">
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic">Level {settings.level}</span>
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">{settings.xp} / {nextLevelXP} XP</span>
           </div>
           <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden shadow-inner p-[1px]">
              <motion.div 
                className="h-full bg-emerald-500 rounded-full shadow-[0_0_15px_#10b981]"
                initial={{ width: 0 }}
                animate={{ width: `${xpPercentage}%` }}
                transition={{ duration: 1.5, ease: "circOut" }}
              />
           </div>
        </div>
      </header>

      {/* 2. Welcome & LifePilot Nudge */}
      <section className="px-6 py-8">
         <motion.div 
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           className="bg-gradient-to-br from-emerald-600/10 via-blue-600/5 to-transparent rounded-[3rem] p-8 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden"
         >
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
               <Sparkles size={80} className="text-emerald-400" />
            </div>
            
            <div className="relative z-10">
               <h2 className="text-3xl font-black tracking-tighter mb-2">Hello, Pioneer.</h2>
               <div className="flex items-center gap-2 mb-6">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em]">Life Alignment: 92% Perfect</p>
               </div>

               {/* The Smart Nudge (Behavioral Psychology) */}
               <div className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-3xl p-5 mb-2 group active:scale-95 transition-transform">
                  <div className="flex items-center gap-3 mb-2">
                     <Flame size={16} className="text-orange-500" />
                     <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest">Urgent Realignment</span>
                  </div>
                  <p className="text-sm font-bold leading-relaxed mb-4 text-gray-200">
                    Your {streak}-day momentum is at risk. Aries energy is peaking—finish your workout now to unlock +20 XP. Do not break the chain! 🔥
                  </p>
                  <Link href="/habits" className="flex items-center gap-2 text-white font-black text-[10px] uppercase tracking-widest">
                     Take Action Now <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
               </div>
            </div>
         </motion.div>
      </section>

      {/* 3. The Three Pillars Dashboard */}
      <section className="px-6 space-y-6">
         
         {/* Pillar 1: Habit Hub (Discipline) */}
         <Link href="/habits" className="block">
           <div className="bg-[#0f172a]/60 backdrop-blur-2xl rounded-[3rem] p-8 border border-white/5 hover:border-emerald-500/30 transition-all group">
              <div className="flex justify-between items-start mb-6">
                 <div>
                    <h3 className="text-2xl font-black tracking-tight group-hover:text-emerald-400 transition-colors">Habit Hub</h3>
                    <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Building Momentum</p>
                 </div>
                 <div className="p-4 bg-white/5 rounded-3xl text-emerald-500 border border-white/5 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                    <LayoutGrid size={24} />
                 </div>
              </div>
              <div className="flex gap-4">
                 <div className="flex-1 bg-black/40 p-5 rounded-[2rem] border border-white/5 text-center">
                    <p className="text-2xl font-black">{habitsCount}</p>
                    <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Pending</p>
                 </div>
                 <div className="flex-1 bg-emerald-500/10 p-5 rounded-[2rem] border border-emerald-500/20 text-center">
                    <p className="text-2xl font-black text-emerald-400">{streak}</p>
                    <p className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Streak 🔥</p>
                 </div>
              </div>
           </div>
         </Link>

         {/* Pillar 2: Fuel AI (Optimal Nutrition) */}
         <div className="bg-[#0f172a]/60 backdrop-blur-2xl rounded-[3rem] p-8 border border-white/5 relative overflow-hidden group">
            <div className="flex justify-between items-start mb-10">
               <div>
                  <h3 className="text-2xl font-black tracking-tight group-hover:text-blue-400 transition-colors">Fuel AI</h3>
                  <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Optimal Performance</p>
               </div>
               <Link href="/scan" className="p-5 bg-blue-500 text-white rounded-[2rem] shadow-[0_15px_40px_rgba(37,99,235,0.4)] active:scale-90 transition-transform">
                  <Camera size={28} />
               </Link>
            </div>

            <div className="flex items-center gap-8 px-4">
               <div className="relative w-24 h-24">
                  <svg className="w-full h-full -rotate-90">
                     <circle cx="48" cy="48" r="40" stroke="rgba(255,255,255,0.05)" strokeWidth="10" fill="none" />
                     <motion.circle 
                       cx="48" cy="48" r="40" stroke="#3b82f6" strokeWidth="10" fill="none" 
                       strokeDasharray="251"
                       animate={{ strokeDashoffset: 251 - (251 * (caloriesConsumed / settings.target_calories)) }}
                       transition={{ duration: 1.5 }}
                     />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                     <span className="text-xl font-black">{caloriesConsumed}</span>
                  </div>
               </div>
               <div className="flex-1 space-y-4">
                  <div>
                    <p className="text-[9px] font-black text-gray-500 tracking-widest uppercase mb-1">Target Remaining</p>
                    <p className="text-2xl font-black">{settings.target_calories - caloriesConsumed} <span className="text-sm font-bold text-gray-700">kcal</span></p>
                  </div>
                  <div className="flex gap-2">
                     <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 w-[65%]" />
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* Pillar 3: Cosmic Guide (Astrology Insight) */}
         <Link href="/horoscope" className="block">
           <div className="bg-gradient-to-br from-indigo-600/10 to-purple-600/10 backdrop-blur-2xl rounded-[3rem] p-8 border border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-30 transition-opacity">
                 <ShieldCheck size={100} className="text-indigo-400" />
              </div>
              
              <div className="flex justify-between items-start mb-6">
                 <div>
                    <h3 className="text-2xl font-black tracking-tight group-hover:text-indigo-300 transition-colors">Cosmic Guide</h3>
                    <div className="flex items-center gap-1.5 mt-1">
                       <ShieldCheck size={12} className="text-emerald-500" />
                       <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">98.5% Accuracy Badge</p>
                    </div>
                 </div>
                 <div className="w-14 h-14 bg-white/5 rounded-3xl flex items-center justify-center text-4xl border border-white/10 group-hover:border-indigo-500/40 transition-all">
                    {sign?.icon || '✨'}
                 </div>
              </div>

              <div className="bg-black/40 border border-white/5 rounded-[2.5rem] p-6 relative z-10">
                 <p className="text-sm font-bold text-indigo-100 leading-relaxed mb-1">
                   {horoscope?.vibe || "Loading cosmic alignment..."}
                 </p>
                 <span className="text-[10px] font-black text-indigo-400/60 tracking-widest uppercase">Tap for deeper insight</span>
              </div>
           </div>
         </Link>

      </section>

      <Navigation />
    </main>
  );
}
