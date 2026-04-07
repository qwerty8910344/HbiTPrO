import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Plus, Sun, Moon, Target } from 'lucide-react';
import HabitCard from '../components/habits/HabitCard';
import AddHabitModal from '../components/habits/AddHabitModal';
import AdhdHabitCard from '../components/habits/AdhdHabitCard';
import { format, addDays, startOfToday, isSameDay } from 'date-fns';
import { supabase } from '../lib/supabase';
import { useSettings } from '../context/SettingsContext';
import { useSound } from '../hooks/useSound';

const TodayView = () => {
  const [selectedDate, setSelectedDate] = useState(startOfToday());
  const [category, setCategory] = useState('All');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const { settings, updateSetting } = useSettings();
  const isAdhdMode = settings?.adhd_mode || false;
  const { playTick, playChime } = useSound();
  
  const categories = ['All', 'Mindset', 'Health', 'Productivity', 'Self-Care'];

  const [habits, setHabits] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');

  // Time-based greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  // Fetch from Supabase
  useEffect(() => {
    fetchHabits();
  }, [selectedDate]);

  const fetchHabits = async () => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) return;
      
      const email = sessionData.session.user.email || '';
      setUserName(email.split('@')[0]);
      
      const [habitsData, groupsData] = await Promise.all([
        supabase.from('habits').select('*').order('created_at', { ascending: false }),
        supabase.from('groups').select('*').order('created_at', { ascending: false })
      ]);
        
      if (habitsData.error) throw habitsData.error;
      if (groupsData.error) throw groupsData.error;
      
      setHabits(habitsData.data || []);
      setGroups(groupsData.data || []);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id) => {
    const habit = habits.find(h => h.id === id);
    const newCurrent = habit.current >= habit.total ? habit.current : habit.current + 1;
    const isCompleted = newCurrent >= habit.total;
    const newStreak = isCompleted && !habit.completed ? habit.streak + 1 : habit.streak;

    // Optimistic UI
    setHabits(prev => prev.map(h => h.id === id ? { ...h, current: newCurrent, completed: isCompleted, streak: newStreak } : h));
    
    // Save to DB
    await supabase.from('habits').update({ current: newCurrent, completed: isCompleted, streak: newStreak }).eq('id', id);

    // Audio Feedback
    if (!isCompleted || habit.completed) {
      playTick();
    }

    // If completely newly finished, log it to history
    if (isCompleted && !habit.completed) {
      playChime();
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData?.session) {
        // Try inserting (unique constraint prevents double logging per day)
        await supabase.from('habit_logs').insert({
          habit_id: id,
          user_id: sessionData.session.user.id
        }).select();
      }
    }
  };

  const handleUpdate = async (id, changes) => {
    setHabits(prev => prev.map(h => h.id === id ? { ...h, ...changes } : h));
    await supabase.from('habits').update(changes).eq('id', id);
  };

  const handleAddHabit = async (newHabit) => {
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) return;
    
    const { id, ...habitToInsert } = newHabit;
    habitToInsert.user_id = sessionData.session.user.id;

    try {
      const { data, error } = await supabase.from('habits').insert(habitToInsert).select().single();
      if (error) throw error;
      setHabits(prev => [data, ...prev]);
    } catch (err) {
      console.error("Error adding habit:", err);
    }
  };

  const filteredHabits = category === 'All' 
    ? habits 
    : habits.filter(h => h.category === category);

  const habitsLeft = habits.filter(h => !h.completed).length;

  // Weekly Calendar Logic
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startOfToday(), i - 4));

  return (
    <div className="flex flex-col gap-6 relative">
      {/* HEADER AREA */}
      <header className="flex items-center justify-between z-50">
        <div className="relative">
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="text-[#4ADE80] font-black text-sm bg-[#111827] px-5 py-2.5 rounded-full flex items-center gap-2 shadow-sm border border-[#16A34A]/20 tap-effect"
          >
            {category} <ChevronDown size={18} strokeWidth={3} />
          </button>
          
          <AnimatePresence>
            {showDropdown && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 mt-2 w-40 bg-[#111827]/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden z-50"
              >
                {categories.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => { setCategory(cat); setShowDropdown(false); }}
                    className={`w-full text-left px-5 py-3 text-sm font-bold transition-all ${category === cat ? 'bg-[#16A34A] text-white' : 'text-[#E5E7EB] hover:bg-[#16A34A]/10'}`}
                  >
                    {cat}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div className="flex flex-col items-center">
           <h3 className="text-[22px] font-black tracking-tighter text-[#E5E7EB]">{greeting}, {userName || 'Pro'}</h3>
        </div>
        
        <div className="flex items-center gap-2">
          {/* ADHD Mode Toggle (Context Controlled) */}
          <button 
            onClick={() => updateSetting('adhd_mode', !isAdhdMode)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all tap-effect shadow-md border-2 ${
              isAdhdMode ? 'bg-[#16A34A] border-[#16A34A] shadow-[#16A34A]/20' : 'bg-[#111827] border-white/5 shadow-black/20'
            }`}
          >
            <Target size={22} className={isAdhdMode ? 'text-white' : 'text-[#6B7280]'} />
          </button>

          <button className="relative tap-effect group">
             <div className="w-12 h-12 rounded-full border-4 border-[#111827] shadow-lg overflow-hidden group-hover:scale-110 transition-transform">
               <img src="https://i.pravatar.cc/150?u=a2" alt="User" className="w-full h-full object-cover" />
             </div>
             <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#4ADE80] border-2 border-[#0B0F0C] rounded-full flex items-center justify-center">
                <Sun size={12} fill="white" className="text-white" />
             </div>
          </button>
        </div>
      </header>

      {isAdhdMode ? (
        <AnimatePresence mode="wait">
          <motion.div
            key="adhd-mode"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex-1 flex flex-col pt-4"
          >
            <AdhdHabitCard 
              habit={filteredHabits.find(h => !h.completed)} 
              onComplete={handleToggle} 
            />
          </motion.div>
        </AnimatePresence>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key="standard-mode"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-6"
          >
            {/* SUMMARY STATUS CARD */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="ios-card bg-[#111827] p-4 py-8 flex flex-col items-center gap-4 text-center border-dashed border-2 border-[#16A34A]/20 shadow-xl"
            >
               <h1 className="text-4xl font-black tracking-tighter leading-none text-[#E5E7EB]">Build Habits</h1>
               <p className="text-xl font-bold text-[#6B7280]">Plan your goals</p>
               
               <div className="mt-2 flex items-center gap-2 bg-[#16A34A]/10 text-[#4ADE80] px-6 py-2 rounded-full font-black text-sm uppercase tracking-widest shadow-inner border border-[#16A34A]/20">
                  You have <span className="w-7 h-7 bg-[#16A34A] text-white rounded-full flex items-center justify-center text-xs">{habitsLeft}</span> habits left for today
               </div>
            </motion.div>

            {/* WEEKLY CALENDAR STRIP */}
            <section className="flex justify-between items-center px-1 overflow-x-auto no-scrollbar py-2">
              {weekDays.map((day, idx) => {
                const isSelected = isSameDay(day, selectedDate);
                const isToday = isSameDay(day, startOfToday());
                const dayName = format(day, 'eee').substring(0, 2);
                
                return (
                  <button 
                    key={idx}
                    onClick={() => setSelectedDate(day)}
                    className="flex flex-col items-center gap-4 tap-effect flex-shrink-0 min-w-[50px]"
                  >
                    <span className="text-[10px] font-black text-[#6B7280] uppercase tracking-[0.2em]">
                      {dayName}
                    </span>
                    <div className={`w-11 h-11 rounded-full flex items-center justify-center font-black text-[17px] transition-all relative border-2 ${
                      isSelected 
                        ? 'bg-[#16A34A] text-white border-[#4ADE80] shadow-lg shadow-[#16A34A]/30 scale-110' 
                        : 'bg-[#111827] text-[#6B7280] border-[#111827]/50'
                    }`}>
                      {format(day, 'd')}
                      {isToday && !isSelected && <div className="absolute -top-1 w-2 h-2 bg-[#4ADE80] border-2 border-[#0B0F0C] rounded-full" />}
                      {isToday && isSelected && <span className="absolute -top-3 text-[14px]">👑</span>}
                    </div>
                  </button>
                );
              })}
            </section>

            {/* HABITS LIST AREA */}
            <section className="flex flex-col gap-4">
              <AnimatePresence mode="popLayout">
                {filteredHabits.map(habit => (
                  <motion.div
                    layout
                    key={habit.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <HabitCard 
                      habit={habit} 
                      groups={groups}
                      onToggle={handleToggle}
                      onUpdate={handleUpdate}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </section>
          </motion.div>
        </AnimatePresence>
      )}

      {/* FLOATING ACTION BUTTON */}
      {!isAdhdMode && (
        <motion.button 
          onClick={() => setShowAddModal(true)}
          whileHover={{ scale: 1.15, rotate: 90 }}
          whileTap={{ scale: 0.85 }}
          className="fixed bottom-28 right-8 w-16 h-16 bg-gradient-to-tr from-[#16A34A] to-[#4ADE80] text-white rounded-full shadow-[0_12px_40px_rgba(22,163,74,0.5)] flex items-center justify-center z-[100] border-4 border-[#0B0F0C]/60 tap-effect"
        >
          <Plus size={36} strokeWidth={4} />
        </motion.button>
      )}

      {/* Add Habit Modal */}
      <AddHabitModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)} 
        onAdd={handleAddHabit}
      />
    </div>
  );
};

export default TodayView;
