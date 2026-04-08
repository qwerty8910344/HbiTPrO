'use client';

import React, { useState } from 'react';
import { Check, Flame, Plus, MessageSquare, Save, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { habitClient } from '@/lib/supabase';

const MOODS = ['😡', '😞', '😐', '🙂', '🤩'];

interface HabitCardProps {
  habit: any;
  groups?: any[];
  onToggle: (id: string) => void;
  onUpdate: (id: string, changes: any) => void;
}

const HabitCard = ({ habit, groups = [], onToggle, onUpdate }: HabitCardProps) => {
  const { id, title, icon, color, current, total, unit, streak, completed, memo, mood } = habit;
  const [isExpanded, setIsExpanded] = useState(false);
  const [localMemo, setLocalMemo] = useState(memo || '');
  const [localMood, setLocalMood] = useState(mood || '');
  const [showSharePicker, setShowSharePicker] = useState(false);
  const [shareMessage, setShareMessage] = useState('');
  
  const progress = total ? (current / total) * 100 : (completed ? 100 : 0);
  const isTargetMet = total ? current >= total : completed;

  const handleComplete = (e: React.MouseEvent) => {
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

  const handleSaveMemo = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdate(id, { memo: localMemo, mood: localMood });
    setIsExpanded(false);
  };

  const handleShare = async (e: React.MouseEvent, groupId: string) => {
    e.stopPropagation();
    try {
      const { data: sessionData } = await habitClient.auth.getSession();
      if (!sessionData.session) return;
      
      const { error } = await habitClient.from('shared_habits').insert({
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
      className="relative overflow-hidden group mb-4 shadow-2xl cursor-pointer rounded-[2rem] border border-white/5 backdrop-blur-xl transition-all hover:border-white/10"
      style={{ backgroundColor: isTargetMet ? `${color}20` : `${color}40` }}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {/* Glossy Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />

      {/* Main Content */}
      <div className="p-5 flex items-center gap-4 relative z-10 w-full">
        {/* Icon Area */}
        <div className="w-14 h-14 rounded-3xl bg-[#020617]/40 flex items-center justify-center text-3xl shadow-inner border border-white/5">
          {localMood || icon}
        </div>

        {/* Info Area */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-extrabold text-lg tracking-tight truncate pr-2 text-white">{title}</h3>
            <div className="flex items-center gap-1.5 text-white/80 font-black text-[9px] uppercase tracking-widest bg-black/30 px-3 py-1 rounded-full border border-white/5">
               <Flame size={12} className="text-orange-500 fill-orange-500" />
               {streak} <span className="opacity-50">STREAK</span>
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-end">
              <p className="font-black text-[9px] uppercase tracking-[0.2em] text-white/40">
                 {total ? `${current}/${total} ${unit}` : 'Daily Goal'}
              </p>
              {isTargetMet && (
                <div className="flex items-center gap-1">
                  <span className="text-[9px] font-black text-[#4ADE80] uppercase tracking-widest">Target Met</span>
                  <div className="w-1 h-1 bg-[#4ADE80] rounded-full animate-pulse shadow-[0_0_8px_#4ade80]" />
                </div>
              )}
            </div>
            
            <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden shadow-inner p-[1px] border border-white/5">
              <motion.div 
                className="h-full bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progress, 100)}%` }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button 
          onClick={handleComplete}
          className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-2xl tap-effect z-10 border-2 ${
            isTargetMet 
              ? 'bg-emerald-500 text-white border-emerald-400/50 shadow-emerald-500/20' 
              : 'bg-white/5 text-white/50 border-white/10 hover:bg-white/10'
          }`}
        >
          {isTargetMet ? <Check size={28} strokeWidth={4} /> : <Plus size={28} strokeWidth={4} />}
        </button>
      </div>

      {/* Share Button Floating (Top Right) */}
      <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={(e) => { e.stopPropagation(); setShowSharePicker(!showSharePicker); }}
          className="w-8 h-8 flex items-center justify-center rounded-xl bg-black/40 hover:bg-black/60 text-white/50 backdrop-blur-md transition-all tap-effect border border-white/5"
        >
          <Share2 size={14} strokeWidth={3} />
        </button>
        
        <AnimatePresence>
          {showSharePicker && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, x: 10 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute top-full right-0 mt-3 w-48 bg-[#0f172a] backdrop-blur-2xl rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden flex flex-col p-2 z-[100]"
            >
              <div className="px-4 py-2 border-b border-white/5 flex justify-between items-center mb-1">
                 <span className="text-[9px] font-black uppercase text-white/30 tracking-widest">Share with</span>
                 {shareMessage && <span className="text-[9px] font-black text-emerald-400">{shareMessage}</span>}
              </div>
              <div className="flex flex-col gap-1 max-h-48 overflow-y-auto no-scrollbar">
                {groups?.length > 0 ? (
                  groups.map(g => (
                    <button 
                      key={g.id}
                      onClick={(e) => handleShare(e, g.id)}
                      className="flex items-center gap-3 px-3 py-3 text-xs font-bold text-white/70 hover:bg-white/5 rounded-2xl transition-colors text-left"
                    >
                      <span className="text-lg">{g.icon}</span> <span className="truncate">{g.name}</span>
                    </button>
                  ))
                ) : (
                  <div className="text-[10px] text-white/20 p-4 text-center font-black uppercase tracking-widest">No group found</div>
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
            className="px-5 pb-6 border-t border-white/5 bg-black/10 pt-5"
          >
            <div className="flex justify-between items-center mb-4">
               <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 flex items-center gap-2">
                  <MessageSquare size={14} /> Reflection
               </label>
               <div className="flex gap-2">
                  {MOODS.map(m => (
                    <button 
                      key={m} 
                      onClick={() => setLocalMood(m)}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all tap-effect border ${localMood === m ? 'bg-white/10 border-white/20 scale-110 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]' : 'border-transparent opacity-40 grayscale hover:opacity-100 hover:grayscale-0'}`}
                    >
                      {m}
                    </button>
                  ))}
               </div>
            </div>
            
            <textarea 
               value={localMemo}
               onChange={(e) => setLocalMemo(e.target.value)}
               placeholder="Write a quick memo..."
               className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-sm font-bold text-white placeholder:text-white/20 outline-none focus:border-white/10 shadow-inner resize-none h-24 transition-all"
            />

            <div className="flex justify-end mt-4">
               <button 
                  onClick={handleSaveMemo}
                  className="bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-white/10 transition-all tap-effect shadow-xl"
               >
                  <Save size={14} /> Commit Changes
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default HabitCard;
