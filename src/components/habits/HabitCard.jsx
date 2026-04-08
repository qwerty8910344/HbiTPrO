import React, { useState } from 'react';
import { Check, Flame, Plus, MessageSquare, Save, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { supabase } from '../../lib/supabase';

const MOODS = ['😡', '😞', '😐', '🙂', '🤩'];

const HabitCard = ({ habit, groups = [], onToggle, onUpdate }) => {
  const { id, title, icon, color, current, total, unit, streak, completed, memo, mood } = habit;
  const [isExpanded, setIsExpanded] = useState(false);
  const [localMemo, setLocalMemo] = useState(memo || '');
  const [localMood, setLocalMood] = useState(mood || '');
  const [showSharePicker, setShowSharePicker] = useState(false);
  const [shareMessage, setShareMessage] = useState('');
  
  const progress = total ? (current / total) * 100 : (completed ? 100 : 0);
  const isTargetMet = total ? current >= total : completed;

  const handleComplete = (e) => {
    e.stopPropagation();
    if (!isTargetMet) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#16A34A', '#4ADE80', '#FFD700']
      });
    }
    onToggle(id);
  };

  const handleSaveMemo = (e) => {
    e.stopPropagation();
    onUpdate(id, { memo: localMemo, mood: localMood });
    setIsExpanded(false);
  };

  const handleShare = async (e, groupId) => {
    e.stopPropagation();
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) return;
      
      const { error } = await supabase.from('shared_habits').insert({
        group_id: groupId,
        habit_id: id,
        user_id: sessionData.session.user.id
      });
      
      if (error && error.code !== '23505') throw error;
      
      setShareMessage('Shared!');
      setTimeout(() => { setShareMessage(''); setShowSharePicker(false); }, 1500);
    } catch (err) {
      console.error(err);
      setShareMessage('Error');
      setTimeout(() => setShareMessage(''), 2000);
    }
  };

  return (
    <motion.div 
      layout
      className="ios-card-vibrant relative overflow-hidden group mb-2 shadow-md cursor-pointer"
      style={{ backgroundColor: color }}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {/* Glossy Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />

      {/* Main Row */}
      <div className="flex items-center gap-4 relative z-10 w-full">
        {/* Icon Area */}
        <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-3xl shadow-inner border border-white/10">
          {localMood || icon}
        </div>

        {/* Info Area */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <h3 className="font-extrabold text-[17px] tracking-tight truncate pr-2 text-white/90">{title}</h3>
            <div className="flex items-center gap-1 text-white/60 font-black text-[10px] uppercase tracking-wider bg-white/10 px-2 py-0.5 rounded-full">
               <Flame size={12} className="text-orange-400 fill-orange-400" />
               {streak} Days
            </div>
          </div>
          
          <div className="mt-1.5 flex flex-col gap-1.5">
            <div className="flex justify-between items-end">
              <p className="font-black text-[10px] uppercase tracking-widest text-white/40">
                 {total ? `${current}/${total} ${unit}` : 'Daily Goal'}
              </p>
              {isTargetMet && <span className="text-[10px] font-black text-[#4ADE80] bg-[#4ADE80]/10 px-2 rounded-md">MET</span>}
            </div>
            
            <div className="h-2 w-full bg-black/20 rounded-full overflow-hidden shadow-inner p-[1px]">
              <motion.div 
                className="h-full bg-[#4ADE80]/70 rounded-full shadow-sm"
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
              ? 'bg-[#4ADE80] text-white border-2 border-[#4ADE80]/60' 
              : 'bg-white/10 text-white/50 border border-white/10 hover:bg-white/20'
          }`}
        >
          {isTargetMet ? <Check size={26} strokeWidth={3.5} /> : <Plus size={26} strokeWidth={3.5} />}
        </button>
      </div>

      {/* Share Button Floating (Top Right) */}
      <div className="absolute top-2 right-2 z-20">
        <button 
          onClick={(e) => { e.stopPropagation(); setShowSharePicker(!showSharePicker); }}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white/50 backdrop-blur-md transition-all tap-effect"
        >
          <Share2 size={14} strokeWidth={3} />
        </button>
        
        <AnimatePresence>
          {showSharePicker && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute top-full right-0 mt-2 w-48 bg-[var(--card-dark)] backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden flex flex-col p-1"
            >
              <div className="px-3 py-2 border-b border-white/5 flex justify-between items-center">
                 <span className="text-[10px] font-black uppercase text-white/40 tracking-wider">Share to...</span>
                 {shareMessage && <span className="text-[10px] font-black text-[#4ADE80]">{shareMessage}</span>}
              </div>
              <div className="flex flex-col gap-1 max-h-40 overflow-y-auto no-scrollbar p-1">
                {groups?.length > 0 ? (
                  groups.map(g => (
                    <button 
                      key={g.id}
                      onClick={(e) => handleShare(e, g.id)}
                      className="flex items-center gap-2 px-2 py-2 text-sm font-bold text-white/70 hover:bg-white/5 rounded-xl transition-colors text-left"
                    >
                      <span>{g.icon}</span> <span className="truncate">{g.name}</span>
                    </button>
                  ))
                ) : (
                  <div className="text-xs text-white/40 p-2 text-center font-medium">No groups yet</div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Expanded / Journal Mode */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="pt-4 mt-4 border-t border-white/10"
          >
            <div className="flex justify-between items-center mb-3">
               <label className="text-xs font-black uppercase tracking-widest text-white/40 flex items-center gap-1">
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
               className="w-full bg-black/20 border border-white/10 rounded-2xl p-3 text-sm font-medium text-white placeholder:text-white/30 outline-none focus:bg-black/30 shadow-inner resize-none h-20"
            />

            <div className="flex justify-end mt-2">
               <button 
                  onClick={handleSaveMemo}
                  className="bg-[#16A34A] text-white px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-1 shadow-md tap-effect"
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
