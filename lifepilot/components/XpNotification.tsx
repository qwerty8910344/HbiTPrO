'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Star, Trophy } from 'lucide-react';

interface XpEvent {
  id: string;
  amount: number;
  message: string;
}

export default function XpNotification() {
  const [events, setEvents] = useState<XpEvent[]>([]);

  // Listen for custom 'xp-earned' events
  useEffect(() => {
    const handleXpEarned = (e: any) => {
      const newEvent = {
        id: Date.now().toString(),
        amount: e.detail.amount,
        message: e.detail.message || 'XP Earned!'
      };
      setEvents(prev => [...prev, newEvent]);
      
      // Auto-remove after 3 seconds
      setTimeout(() => {
        setEvents(prev => prev.filter(ev => ev.id !== newEvent.id));
      }, 3000);
    };

    window.addEventListener('xp-earned', handleXpEarned);
    return () => window.removeEventListener('xp-earned', handleXpEarned);
  }, []);

  return (
    <div className="fixed top-24 left-0 right-0 z-[200] flex flex-col items-center gap-2 pointer-events-none">
      <AnimatePresence>
        {events.map((event) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: -20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, y: -10 }}
            className="bg-emerald-500 text-white px-6 py-3 rounded-full shadow-[0_10px_30px_rgba(16,185,129,0.4)] flex items-center gap-3 border border-emerald-400/50"
          >
            <div className="bg-white/20 p-1.5 rounded-full">
              <Zap size={16} fill="white" />
            </div>
            <span className="font-black text-sm uppercase tracking-widest">+{event.amount} XP</span>
            <span className="text-[10px] font-black opacity-60 uppercase tracking-widest">{event.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// Helper to trigger XP notification
export const triggerXp = (amount: number, message: string) => {
  const event = new CustomEvent('xp-earned', { detail: { amount, message } });
  window.dispatchEvent(event);
};
