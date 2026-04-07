import React, { useState } from 'react';
import { Check, Flame, Plus, MessageSquare, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const MOODS = ['😡', '😞', '😐', '🙂', '🤩'];

const HabitCard = ({ habit, onToggle, onUpdate }) => {
  const { id, title, icon, color, current, total, unit, streak, completed, memo, mood } = habit;
  const [isExpanded, setIsExpanded] = useState(false);
  const [localMemo, setLocalMemo] = useState(memo || '');
  const [localMood, setLocalMood] = useState(mood || '');
  
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

  const handleSaveMemo = (e) => {
    e.stopPropagation();
    onUpdate(id, { memo: localMemo, mood: localMood });
    setIsExpanded(false);
  };

  return (
    <motion.div 
      layout
      className="ios-card-vibrant relative overflow-hidden group mb-2 shadow-md cursor-pointer"
      style={{ backgroundColor: color }}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {/* Glossy Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />

      {/* Main Row */}
      <div className="flex items-center gap-4 relative z-10 w-full">
        {/* Icon Area */}
        <div className="w-14 h-14 rounded-2xl bg-white/30 backdrop-blur-md flex items-center justify-center text-3xl shadow-inner border border-white/20">
          {localMood || icon}
        </div>

        {/* Info Area */}
        <div className="flex-1 min-w-0">
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
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-lg tap-effect ${
            isTargetMet 
              ? 'bg-emerald-400 text-white border-2 border-white/60' 
              : 'bg-white/80 text-black/50 border border-white/20 hover:bg-white'
          }`}
        >
          {isTargetMet ? <Check size={26} strokeWidth={3.5} /> : <Plus size={26} strokeWidth={3.5} />}
        </button>
      </div>

      {/* Selection Glow for Active Habits */}
      {!isTargetMet && !isExpanded && (
         <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-white/5 blur-3xl rounded-full pointer-events-none" />
      )}

      {/* Expanded / Journal Mode */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="pt-4 mt-4 border-t border-black/5"
          >
            <div className="flex justify-between items-center mb-3">
               <label className="text-xs font-black uppercase tracking-widest text-black/40 flex items-center gap-1">
                  <MessageSquare size={14} /> Daily Memo
               </label>
               <div className="flex gap-2">
                  {MOODS.map(m => (
                    <button 
                      key={m} 
                      onClick={() => setLocalMood(m)}
                      className={`text-xl transition-transform tap-effect ${localMood === m ? 'scale-125 drop-shadow-md' : 'opacity-80 grayscale hover:grayscale-0'}`}
                    >
                      {m}
                    </button>
                  ))}
               </div>
            </div>
            
            <textarea 
               value={localMemo}
               onChange={(e) => setLocalMemo(e.target.value)}
               placeholder="How did this habit feel today?"
               className="w-full bg-white/40 border border-white/40 rounded-2xl p-3 text-sm font-medium text-black placeholder:text-black/30 outline-none focus:bg-white/60 shadow-inner resize-none h-20"
            />

            <div className="flex justify-end mt-2">
               <button 
                  onClick={handleSaveMemo}
                  className="bg-black text-white px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-1 shadow-md tap-effect"
               >
                  <Save size={14} /> Save Log
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default HabitCard;
