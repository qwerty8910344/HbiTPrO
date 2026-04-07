import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Plus, Sun, Moon, Target } from 'lucide-react';
import HabitCard from '../components/habits/HabitCard';
import AddHabitModal from '../components/habits/AddHabitModal';
import AdhdHabitCard from '../components/habits/AdhdHabitCard';
import { format, addDays, startOfToday, isSameDay } from 'date-fns';
import { supabase } from '../lib/supabase';

const TodayView = () => {
  const [selectedDate, setSelectedDate] = useState(startOfToday());
  const [category, setCategory] = useState('All');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isAdhdMode, setIsAdhdMode] = useState(false);
  
  const categories = ['All', 'Mindset', 'Health', 'Productivity', 'Self-Care'];

  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch from Supabase
  useEffect(() => {
    fetchHabits();
  }, [selectedDate]); // Refetch if date filtering is needed in future

  const fetchHabits = async () => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) return;
      
      const { data, error } = await supabase
        .from('habits')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setHabits(data || []);
    } catch (err) {
      console.error("Error fetching habits:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id) => {
    // Optimistic UI
    const habit = habits.find(h => h.id === id);
    const newCurrent = habit.current >= habit.total ? habit.current : habit.current + 1;
    const isCompleted = newCurrent >= habit.total;
    const newStreak = isCompleted && !habit.completed ? habit.streak + 1 : habit.streak;

    setHabits(prev => prev.map(h => h.id === id ? { ...h, current: newCurrent, completed: isCompleted, streak: newStreak } : h));

    // Supabase Sync
    await supabase.from('habits').update({ current: newCurrent, completed: isCompleted, streak: newStreak }).eq('id', id);
  };

  const handleUpdate = async (id, changes) => {
    // changes object e.g. { memo: "...", mood: "..." }
    setHabits(prev => prev.map(h => h.id === id ? { ...h, ...changes } : h));
    await supabase.from('habits').update(changes).eq('id', id);
  };

  const handleAddHabit = async (newHabit) => {
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) return;
    
    // Remove local 'id' so Supabase generates a UUID, but save everything else
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
            className="text-red-500 font-black text-sm bg-white/60 backdrop-blur-md px-5 py-2.5 rounded-full flex items-center gap-2 shadow-sm border border-white/20 tap-effect"
          >
            {category} <ChevronDown size={18} strokeWidth={3} />
          </button>
          
          <AnimatePresence>
            {showDropdown && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 mt-2 w-40 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 overflow-hidden"
              >
                {categories.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => { setCategory(cat); setShowDropdown(false); }}
                    className={`w-full text-left px-5 py-3 text-sm font-bold transition-all ${category === cat ? 'bg-red-400 text-white' : 'hover:bg-red-400/10'}`}
                  >
                    {cat}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div className="flex flex-col items-center">
           <h3 className="text-[22px] font-black tracking-tighter text-black/90">Good Morning, Dot</h3>
        </div>
        
        <div className="flex items-center gap-2">
          {/* ADHD Mode Toggle */}
          <button 
            onClick={() => setIsAdhdMode(!isAdhdMode)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all tap-effect shadow-md border-2 ${
              isAdhdMode 
                ? 'bg-black text-white border-black' 
                : 'bg-white/80 text-black/60 border-white backdrop-blur-md'
            }`}
          >
            <Target size={22} strokeWidth={3} />
          </button>

          <button className="relative tap-effect group">
             <div className="w-12 h-12 rounded-full border-4 border-white shadow-lg overflow-hidden group-hover:scale-110 transition-transform">
               <img src="https://i.pravatar.cc/150?u=a2" alt="Dot" className="w-full h-full object-cover" />
             </div>
             <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-400 border-2 border-white rounded-full flex items-center justify-center">
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
              className="ios-card bg-white/50 backdrop-blur-md p-4 py-8 flex flex-col items-center gap-4 text-center border-dashed border-2 border-white/60 shadow-xl"
            >
               <h1 className="text-4xl font-black tracking-tighter leading-none text-black/80">Build Habits</h1>
               <p className="text-xl font-bold text-[#8E8E93]">Plan your goals</p>
               
               <div className="mt-2 flex items-center gap-2 bg-red-400/10 text-red-400 px-6 py-2 rounded-full font-black text-sm uppercase tracking-widest shadow-inner border border-red-400/20">
                  You have <span className="w-7 h-7 bg-red-400 text-white rounded-full flex items-center justify-center text-xs">{habitsLeft}</span> habits left for today
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
                    <span className="text-[10px] font-black text-[#8E8E93] uppercase tracking-[0.2em]">
                      {dayName}
                    </span>
                    <div className={`w-11 h-11 rounded-full flex items-center justify-center font-black text-[17px] transition-all relative border-2 ${
                      isSelected 
                        ? 'bg-red-400 text-white border-white shadow-lg scale-110' 
                        : 'bg-white text-red-300 border-red-50'
                    }`}>
                      {format(day, 'd')}
                      {isToday && !isSelected && <div className="absolute -top-1 w-2 h-2 bg-red-500 border-2 border-white rounded-full" />}
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

      {/* FLOATING ACTION BUTTON (SS POSITIONED RIGHT) */}
      {!isAdhdMode && (
        <motion.button 
          onClick={() => setShowAddModal(true)}
          whileHover={{ scale: 1.15, rotate: 90 }}
          whileTap={{ scale: 0.85 }}
          className="fixed bottom-28 right-8 w-16 h-16 bg-gradient-to-tr from-[#FF69B4] to-[#FFD700] text-white rounded-full shadow-[0_12px_40px_rgba(255,105,180,0.5)] flex items-center justify-center z-[100] border-4 border-white/60 tap-effect"
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
