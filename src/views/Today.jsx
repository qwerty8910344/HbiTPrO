import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Plus } from 'lucide-react';
import HabitCard from '../components/habits/HabitCard';
import { format, addDays, startOfToday, isSameDay } from 'date-fns';

const TodayView = () => {
  const [selectedDate, setSelectedDate] = useState(startOfToday());
  const [habits, setHabits] = useState([
    { id: 1, title: 'Drink water', icon: '💧', color: 'var(--habit-blue)', current: 2500, total: 3000, unit: 'ml', streak: 366, completed: false },
    { id: 2, title: 'Yoga', icon: '🧘‍♀️', color: 'var(--habit-peach)', current: 25, total: 30, unit: 'min', streak: 365, completed: false },
    { id: 3, title: 'Drink Less Beverage', icon: '🥤', color: 'var(--habit-purple)', current: 1, total: 1, unit: 'drink', streak: 366, completed: true },
    { id: 4, title: 'Eat Breakfast', icon: '🍳', color: 'var(--habit-yellow)', current: 1, total: 1, unit: '', streak: 366, completed: true },
    { id: 5, title: 'Walk', icon: '🚶‍♀️', color: 'var(--habit-green)', current: 10000, total: 10000, unit: 'steps', streak: 366, completed: true },
    { id: 6, title: 'Run', icon: '🏃‍♀️', color: 'var(--habit-orange)', current: 3, total: 3, unit: 'km', streak: 366, completed: true },
    { id: 7, title: 'Meditation', icon: '🧘', color: 'var(--habit-gold)', current: 30, total: 30, unit: 'min', streak: 366, completed: true },
  ]);

  const handleToggle = (id) => {
    setHabits(prev => prev.map(h => h.id === id ? { ...h, completed: !h.completed } : h));
  };

  const handleUpdate = (id, newVal) => {
    setHabits(prev => prev.map(h => h.id === id ? { ...h, current: newVal } : h));
  };

  // Weekly Calendar Logic
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startOfToday(), i - 4));

  return (
    <div className="flex flex-col gap-6">
      {/* HEADER AREA */}
      <header className="flex items-center justify-between">
        <div className="relative group cursor-pointer tap-effect">
          <span className="text-pink-500 font-bold bg-white/60 px-4 py-2 rounded-full flex items-center gap-1 shadow-sm">
            All <ChevronDown size={16} />
          </span>
        </div>
        
        <h1 className="text-2xl font-bold tracking-tight">Today</h1>
        
        <button className="relative tap-effect">
           <span className="text-3xl">😊</span>
           <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-white rounded-full" />
        </button>
      </header>

      {/* WEEKLY CALENDAR */}
      <section className="flex justify-between items-center px-1">
        {weekDays.map((day, idx) => {
          const isSelected = isSameDay(day, selectedDate);
          const isToday = isSameDay(day, startOfToday());
          
          return (
            <button 
              key={idx}
              onClick={() => setSelectedDate(day)}
              className="flex flex-col items-center gap-3 tap-effect"
            >
              <span className="text-xs font-bold text-[#8E8E93] uppercase tracking-wide">
                {format(day, 'eee').substring(0, 2)}
              </span>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-all ${
                isSelected 
                  ? 'bg-transparent border-2 border-[var(--primary-pink)] text-black' 
                  : 'text-black/30'
              }`}>
                {format(day, 'd')}
                {isToday && !isSelected && <div className="absolute -top-1 w-1 h-1 bg-[var(--primary-pink)] rounded-full" />}
              </div>
              {isToday && isSelected && <div className="w-1.5 h-1.5 bg-[var(--primary-pink)] rounded-full -mt-1 shadow-sm" />}
            </button>
          );
        })}
      </section>

      {/* HABITS LIST */}
      <section className="flex flex-col gap-3">
        <AnimatePresence>
          {habits.map(habit => (
            <HabitCard 
              key={habit.id} 
              habit={habit} 
              onToggle={handleToggle}
              onUpdate={handleUpdate}
            />
          ))}
        </AnimatePresence>
      </section>

      {/* FLOATING ACTION BUTTON */}
      <motion.button 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-28 left-6 w-14 h-14 bg-red-400 text-white rounded-full shadow-2xl flex items-center justify-center z-40 border-4 border-white/40"
      >
        <Plus size={32} strokeWidth={3} />
      </motion.button>
    </div>
  );
};

export default TodayView;
