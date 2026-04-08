'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, Flame, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';

interface AdhdHabitCardProps {
  habit: any;
  onComplete: (id: string) => void;
}

const AdhdHabitCard = ({ habit, onComplete }: AdhdHabitCardProps) => {
  if (!habit) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center h-[65vh] gap-8 text-center bg-[#020617]/40 backdrop-blur-3xl rounded-[4rem] border border-white/5 p-12 shadow-2xl"
      >
        <div className="w-32 h-32 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20 shadow-[0_0_50px_rgba(16,185,129,0.1)]">
           <Trophy size={64} className="text-emerald-500" />
        </div>
        <div>
          <h2 className="text-4xl font-black tracking-tighter text-white leading-tight mb-2">VICTORY ACHIEVED</h2>
          <p className="text-lg font-bold text-gray-500 uppercase tracking-widest">All habits complete. You are free.</p>
        </div>
      </motion.div>
    );
  }

  const { id, title, icon, color, streak, total, current, unit } = habit;
  const isTargetMet = total ? current >= total : false;
  const progress = total ? (current / total) * 100 : 0;

  const handleTap = (e: React.MouseEvent) => {
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#16A34A', '#4ADE80', '#FFD700']
    });
    onComplete(id);
  };

  return (
    <motion.div 
      key={id}
      initial={{ opacity: 0, scale: 0.95, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="flex flex-col items-center justify-between h-[68vh] w-full rounded-[4.5rem] p-10 shadow-[0_40px_100px_rgba(0,0,0,0.6)] relative overflow-hidden border border-white/10"
      style={{ backgroundColor: `${color}40` }}
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-gradient-to-tr from-black/60 to-transparent pointer-events-none" />
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Top Banner */}
      <div className="w-full flex justify-center z-10">
        <div className="flex items-center gap-3 bg-white/5 backdrop-blur-2xl px-6 py-3 rounded-full shadow-2xl border border-white/10">
          <Flame size={20} className="text-orange-500 fill-orange-500" />
          <span className="font-black text-xs uppercase tracking-[0.3em] text-white/80">{streak} DAY STREAK</span>
        </div>
      </div>

      {/* Center Focus Area */}
      <div className="flex flex-col items-center justify-center flex-1 gap-8 z-10 w-full text-center">
        <motion.div 
          animate={{ 
            scale: [1, 1.05, 1],
            rotate: [0, 2, -2, 0]
          }}
          transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
          className="w-48 h-48 bg-[#020617]/60 backdrop-blur-3xl rounded-[3.5rem] flex items-center justify-center text-[90px] shadow-[inset_0_2px_20px_rgba(255,255,255,0.05)] border-2 border-white/10"
        >
          {icon}
        </motion.div>
        
        <div className="space-y-3">
          <h1 className="text-4xl font-black tracking-tighter text-white leading-[1.1]">
            {title}
          </h1>
          <div className="text-xs font-black uppercase tracking-[0.4em] text-white/30">
            {total ? `${current} / ${total} ${unit}` : 'DAILY MISSION'}
          </div>
        </div>

        {/* Big Progress Bar */}
        {total > 1 && (
          <div className="w-full h-4 bg-black/40 rounded-full overflow-hidden shadow-inner p-[2px] border border-white/5">
            <motion.div 
              className="h-full bg-emerald-500 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.5)]"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ duration: 1, ease: "circOut" }}
            />
          </div>
        )}
      </div>

      {/* Massive Action Button */}
      <button 
        onClick={handleTap}
        className="z-10 w-full bg-emerald-500 text-white hover:bg-emerald-400 transition-all rounded-[2.5rem] py-7 flex items-center justify-center gap-4 shadow-[0_25px_60px_rgba(16,185,129,0.4)] active:scale-95 border-b-4 border-emerald-700 font-black text-xl tracking-widest uppercase"
      >
        <span>EXECUTE NOW</span>
        <Check size={28} strokeWidth={4} />
      </button>

    </motion.div>
  );
};

export default AdhdHabitCard;
