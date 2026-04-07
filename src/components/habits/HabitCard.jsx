import React from 'react';
import { Check, Flame, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

const HabitCard = ({ habit, onToggle, onUpdate }) => {
  const { id, title, icon, color, current, total, unit, streak, completed } = habit;
  
  const progress = total ? (current / total) * 100 : (completed ? 100 : 0);
  const isTargetMet = total ? current >= total : completed;

  const handleComplete = (e) => {
    e.stopPropagation();
    if (!isTargetMet) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.7 },
        colors: [color, '#ffffff', '#FFD700']
      });
    }
    onToggle(id);
  };

  return (
    <motion.div 
      layout
      whileTap={{ scale: 0.97 }}
      className="ios-card-vibrant flex items-center gap-4 relative overflow-hidden group mb-1"
      style={{ backgroundColor: color }}
    >
      {/* Glossy Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />

      {/* Icon Area */}
      <div className="w-14 h-14 rounded-2xl bg-white/30 backdrop-blur-md flex items-center justify-center text-3xl shadow-inner border border-white/20 z-10">
        {icon}
      </div>

      {/* Info Area */}
      <div className="flex-1 min-w-0 z-10">
        <div className="flex justify-between items-start">
          <h3 className="font-extrabold text-[17px] tracking-tight truncate pr-2 text-black/80">{title}</h3>
          <div className="flex items-center gap-1 text-black/60 font-black text-[10px] uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
             <Flame size={12} className="text-orange-500 fill-orange-500" />
             {streak} Days
          </div>
        </div>
        
        <div className="mt-1.5 flex flex-col gap-1.5">
          <div className="flex justify-between items-end">
            <p className="font-black text-[10px] uppercase tracking-widest text-black/40">
               {total ? `${current}/${total} ${unit}` : 'Daily Goal'}
            </p>
            {isTargetMet && <span className="text-[10px] font-black text-black/60 bg-white/30 px-2 rounded-md">MET</span>}
          </div>
          
          <div className="h-2 w-full bg-black/10 rounded-full overflow-hidden shadow-inner p-[1px]">
            <motion.div 
              className="h-full bg-white/60 rounded-full shadow-sm"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button 
        onClick={handleComplete}
        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-lg tap-effect z-10 ${
          isTargetMet 
            ? 'bg-emerald-400 text-white border-2 border-white/60' 
            : 'bg-white/80 text-black/50 border border-white/20 hover:bg-white'
        }`}
      >
        {isTargetMet ? <Check size={26} strokeWidth={3.5} /> : <Plus size={26} strokeWidth={3.5} />}
      </button>

      {/* Selection Glow for Active Habits */}
      {!isTargetMet && (
         <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-white/5 blur-3xl rounded-full" />
      )}
    </motion.div>
  );
};

export default HabitCard;
