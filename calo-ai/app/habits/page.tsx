'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, LayoutGrid, Calendar, Settings2, Zap, ArrowLeft } from 'lucide-react';
import { habitClient } from '@/lib/supabase';
import { useApp } from '@/context/AppContext';
import HabitCard from '@/components/habits/HabitCard';
import AddHabitModal from '@/components/habits/AddHabitModal';
import AdhdHabitCard from '@/components/habits/AdhdHabitCard';
import { triggerXp } from '@/components/XpNotification';
import confetti from 'canvas-confetti';
import Link from 'next/link';

const CATEGORIES = ['All', 'Health', 'Finance', 'Growth', 'Spirit'];

export default function HabitsPage() {
  const { settings, updateSetting, addXP } = useApp();
  const [habits, setHabits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      const { data: { session } } = await habitClient.auth.getSession();
      if (!session) return;

      const { data, error } = await habitClient
        .from('habits')
        .select('*')
        .eq('user_id', session.user.id);

      if (error) throw error;
      setHabits(data || []);
    } catch (err) {
      console.error('Error fetching habits:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleHabit = async (id: string) => {
    const habit = habits.find(h => h.id === id);
    if (!habit) return;

    const newCompleted = !habit.completed;
    const newCurrent = newCompleted ? habit.total : 0;

    // XP Reward + Confetti Skill
    if (newCompleted) {
      addXP(10);
      triggerXp(10, 'Habit Completed');
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#34d399', '#fcd34d', '#ffffff']
      });
    }

    // Optimistic Update
    setHabits(habits.map(h => 
      h.id === id ? { ...h, completed: newCompleted, current: newCurrent } : h
    ));

    try {
      await habitClient
        .from('habits')
        .update({ completed: newCompleted, current: newCurrent })
        .eq('id', id);
    } catch (err) {
      console.error('Failed to toggle habit:', err);
      fetchHabits(); // Revert on error
    }
  };

  const updateHabit = async (id: string, updates: any) => {
    setHabits(habits.map(h => h.id === id ? { ...h, ...updates } : h));
    try {
      await habitClient.from('habits').update(updates).eq('id', id);
    } catch (err) {
      console.error('Failed to update habit:', err);
    }
  };

  const addHabit = async (newHabit: any) => {
    try {
      const { data: { session } } = await habitClient.auth.getSession();
      if (!session) return;

      const { data, error } = await habitClient
        .from('habits')
        .insert({ ...newHabit, user_id: session.user.id })
        .select()
        .single();

      if (error) throw error;
      setHabits([data, ...habits]);
    } catch (err) {
      console.error('Failed to add habit:', err);
    }
  };

  const filteredHabits = habits.filter(h => 
    selectedCategory === 'All' || h.category === selectedCategory
  );

  const incompleteHabits = habits.filter(h => !h.completed);
  const currentAdhdHabit = incompleteHabits[0];

  return (
    <div className="min-h-screen bg-[#020617] text-white pb-32">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 px-6 py-6">
        <div className="flex justify-between items-center mb-6">
          <Link href="/" className="p-2 -ml-2 hover:bg-white/5 rounded-xl transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <div className="flex gap-2">
            <button 
              onClick={() => updateSetting('adhd_mode', !settings.adhd_mode)}
              className={`p-3 rounded-2xl transition-all ${settings.adhd_mode ? 'bg-orange-500 text-white shadow-[0_0_20px_rgba(249,115,22,0.4)]' : 'bg-white/5 text-gray-500 border border-white/5'}`}
            >
              <Zap size={20} fill={settings.adhd_mode ? 'currentColor' : 'none'} />
            </button>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="p-3 bg-emerald-500 text-white rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.4)] active:scale-90 transition-transform"
            >
              <Plus size={20} strokeWidth={3} />
            </button>
          </div>
        </div>

        <div className="flex gap-4 overflow-x-auto no-scrollbar py-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap border ${
                selectedCategory === cat 
                  ? 'bg-white text-black border-white' 
                  : 'bg-white/5 text-gray-500 border-white/5 hover:border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <main className="px-6 py-8">
        <AnimatePresence mode="wait">
          {settings.adhd_mode ? (
            <div key="adhd-mode" className="flex flex-col items-center justify-center pt-8">
               <AdhdHabitCard 
                 habit={currentAdhdHabit} 
                 onComplete={(id) => toggleHabit(id)} 
               />
               <p className="mt-8 text-[10px] font-black uppercase tracking-[0.4em] text-gray-600">
                 {incompleteHabits.length} Tasks Remaining in Momentum
               </p>
            </div>
          ) : (
            <motion.div 
              key="list-mode"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex justify-between items-center mb-6">
                 <h2 className="text-sm font-black uppercase tracking-[0.3em] text-gray-500">
                    Active Habits <span className="text-white/20 ml-2">/ {filteredHabits.length}</span>
                 </h2>
                 <div className="flex gap-3">
                    <LayoutGrid size={18} className="text-emerald-500" />
                    <Calendar size={18} className="text-gray-700" />
                 </div>
              </div>

              {loading ? (
                <div className="flex flex-col gap-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-24 bg-white/5 rounded-[2rem] border border-white/5 animate-pulse" />
                  ))}
                </div>
              ) : filteredHabits.length > 0 ? (
                filteredHabits.map(habit => (
                  <HabitCard 
                    key={habit.id} 
                    habit={habit} 
                    onToggle={toggleHabit}
                    onUpdate={updateHabit}
                  />
                ))
              ) : (
                <div className="text-center py-20 bg-white/5 rounded-[3rem] border border-dashed border-white/10">
                   <p className="text-gray-500 font-bold">No habits found in this category.</p>
                   <button 
                     onClick={() => setIsAddModalOpen(true)}
                     className="mt-4 text-emerald-500 font-black text-xs uppercase tracking-widest"
                   >
                     + Create One
                   </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <AddHabitModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAdd={addHabit}
      />
    </div>
  );
}
