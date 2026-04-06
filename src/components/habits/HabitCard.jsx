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
        particleCount: 80,
        spread: 60,
        origin: { y: 0.8 },
        colors: [color, '#ffffff']
      });
    }
    onToggle(id);
  };

  return (
    <motion.div 
      layout
      whileTap={{ scale: 0.98 }}
      className="ios-card flex items-center gap-4 relative overflow-hidden group"
      style={{ backgroundColor: color || 'var(--card-white)' }}
    >
      {/* Icon Area */}
      <div className="w-14 h-14 rounded-2xl bg-white/40 flex items-center justify-center text-3xl shadow-sm">
        {icon}
      </div>

      {/* Info Area */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-lg tracking-tight truncate pr-2">{title}</h3>
          <div className="flex items-center gap-1 text-[var(--text-main)] font-bold text-xs opacity-80">
             <Flame size={14} className="text-orange-500" />
             {streak} Days
          </div>
        </div>
        
        <div className="mt-1 flex flex-col gap-1.5">
          <p className="caption font-bold uppercase tracking-wider text-[11px] opacity-60">
            {total ? `${current}/${total} ${unit}` : 'Daily Goal'}
          </p>
          
          {total && (
            <div className="h-1.5 w-full bg-black/5 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-black/20 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progress, 100)}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Action Button */}
      <button 
        onClick={handleComplete}
        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-sm ${
          isTargetMet 
            ? 'bg-green-400 text-white' 
            : 'bg-white/60 hover:bg-white text-black/40'
        }`}
      >
        {isTargetMet ? <Check size={24} strokeWidth={3} /> : <Plus size={24} strokeWidth={3} />}
      </button>

      {/* Streak Glow (Subtle) */}
      {streak > 300 && (
         <div className="absolute -right-4 -top-4 w-12 h-12 bg-yellow-400/20 blur-2xl rounded-full" />
      )}
    </motion.div>
  );
};

export default HabitCard;
