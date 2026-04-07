import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Plus, Sun, Moon } from 'lucide-react';
import HabitCard from '../components/habits/HabitCard';
import { format, addDays, startOfToday, isSameDay } from 'date-fns';

const TodayView = () => {
  const [selectedDate, setSelectedDate] = useState(startOfToday());
  const [category, setCategory] = useState('All');
  const [showDropdown, setShowDropdown] = useState(false);
  
  const categories = ['All', 'Mindset', 'Health', 'Productivity', 'Self-Care'];

  const [habits, setHabits] = useState([
    { id: 1, title: 'Drink water', icon: '💧', color: 'var(--habit-blue)', current: 2500, total: 3000, unit: 'ml', streak: 366, completed: false, category: 'Health' },
    { id: 2, title: 'Yoga', icon: '🧘‍♀️', color: 'var(--habit-peach)', current: 25, total: 30, unit: 'min', streak: 365, completed: false, category: 'Health' },
    { id: 3, title: 'Drink Less Beverage', icon: '🥤', color: 'var(--habit-purple)', current: 1, total: 1, unit: 'drink', streak: 366, completed: true, category: 'Health' },
    { id: 4, title: 'Eat Breakfast', icon: '🍳', color: 'var(--habit-yellow)', current: 1, total: 1, unit: '', streak: 366, completed: true, category: 'Self-Care' },
    { id: 5, title: 'Walk', icon: '🏃‍♀️', color: 'var(--habit-green)', current: 10000, total: 10000, unit: 'steps', streak: 366, completed: true, category: 'Health' },
    { id: 6, title: 'Run', icon: '🏃‍♀️', color: 'var(--habit-orange)', current: 3, total: 3, unit: 'km', streak: 366, completed: true, category: 'Health' },
    { id: 7, title: 'Meditation', icon: '🧘', color: 'var(--habit-gold)', current: 30, total: 30, unit: 'min', streak: 366, completed: true, category: 'Mindset' },
  ]);

  const handleToggle = (id) => {
    setHabits(prev => prev.map(h => h.id === id ? { ...h, completed: !h.completed } : h));
  };

  const handleUpdate = (id, newVal) => {
    setHabits(prev => prev.map(h => h.id === id ? { ...h, current: newVal } : h));
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
        
        <button className="relative tap-effect group">
           <div className="w-12 h-12 rounded-full border-4 border-white shadow-lg overflow-hidden group-hover:scale-110 transition-transform">
             <img src="https://i.pravatar.cc/150?u=a2" alt="Dot" className="w-full h-full object-cover" />
           </div>
           <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-400 border-2 border-white rounded-full flex items-center justify-center">
              <Sun size={12} fill="white" className="text-white" />
           </div>
        </button>
      </header>

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

      {/* FLOATING ACTION BUTTON (SS POSITIONED RIGHT) */}
      <motion.button 
        whileHover={{ scale: 1.15, rotate: 90 }}
        whileTap={{ scale: 0.85 }}
        className="fixed bottom-28 right-8 w-16 h-16 bg-red-400 text-white rounded-full shadow-2xl flex items-center justify-center z-[100] border-4 border-white/60 shadow-red-500/20"
      >
        <Plus size={36} strokeWidth={4} />
      </motion.button>
    </div>
  );
};

export default TodayView;
