import React from 'react';
import { motion } from 'framer-motion';
import { Check, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';

const AdhdHabitCard = ({ habit, onComplete }) => {
  if (!habit) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center h-[60vh] gap-6 text-center ios-card-glass my-auto p-12"
      >
        <span className="text-[100px] mb-4">🏆</span>
        <h2 className="text-4xl font-black tracking-tighter text-[#4ADE80] leading-none">You Won Today!</h2>
        <p className="text-xl font-bold text-[#6B7280]">All habits complete. You are free.</p>
      </motion.div>
    );
  }

  const { id, title, icon, color, streak, total, current, unit } = habit;
  const isTargetMet = total ? current >= total : false;
  const progress = total ? (current / total) * 100 : 0;

  const handleTap = (e) => {
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
      initial={{ opacity: 0, scale: 0.9, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="flex flex-col items-center justify-between h-[65vh] w-full rounded-[40px] p-8 shadow-2xl relative overflow-hidden"
      style={{ backgroundColor: color }}
    >
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#4ADE80]/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Top Banner */}
      <div className="w-full flex justify-center z-10">
        <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-4 py-2 rounded-full shadow-sm border border-white/10">
          <Flame size={18} className="text-orange-400 fill-orange-400" />
          <span className="font-black text-sm uppercase tracking-widest text-white/70">{streak} Day Streak</span>
        </div>
      </div>

      {/* Center Focus Area */}
      <div className="flex flex-col items-center justify-center flex-1 gap-6 z-10 w-full text-center">
        <motion.div 
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="w-40 h-40 bg-white/10 backdrop-blur-xl rounded-[40px] flex items-center justify-center text-[80px] shadow-inner border-[3px] border-white/15"
        >
          {icon}
        </motion.div>
        
        <h1 className="text-4xl font-extrabold tracking-tighter text-white/90 px-4 leading-tight">
          {title}
        </h1>
        
        <div className="text-lg font-black uppercase tracking-widest text-white/40">
          {total ? `${current}/${total} ${unit}` : 'Daily Goal'}
        </div>

        {/* Big Progress Bar */}
        {total > 1 && (
          <div className="w-2/3 h-4 bg-black/20 rounded-full overflow-hidden shadow-inner p-[2px] mt-2">
            <motion.div 
              className="h-full bg-[#4ADE80]/70 rounded-full shadow-sm"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        )}
      </div>

      {/* Massive Action Button */}
      <button 
        onClick={handleTap}
        className="z-10 w-full bg-gradient-to-r from-[#16A34A] to-[#4ADE80] text-white hover:opacity-90 transition-all rounded-[28px] py-6 flex items-center justify-center gap-3 shadow-[0_20px_50px_rgba(22,163,74,0.3)] tap-effect border border-white/10"
      >
        <span className="text-2xl font-black tracking-widest uppercase">Do It Now</span>
        <Check size={28} strokeWidth={4} />
      </button>

    </motion.div>
  );
};

export default AdhdHabitCard;
