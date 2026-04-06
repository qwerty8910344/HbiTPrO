import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, CheckCircle2, Trophy, MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';

const TrackingView = () => {
  const habitIcons = ['💧', '🧗', '🥤', '🥪', '🚶‍♀️', '🏃‍♀️'];
  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  
  // Mock calendar for Dec 2025
  const calendarDays = [
    { d: 24, active: true }, { d: 25, active: true }, { d: 26, active: true }, { d: 27, active: true }, { d: 28, active: true }, { d: 29, active: true }, { d: 30, active: true },
    { d: 1, active: true }, { d: 2, active: true }, { d: 3, active: true }, { d: 4, active: true }, { d: 5, active: true }, { d: 6, active: true }, { d: 7, active: true },
    { d: 8, active: true }, { d: 9, active: true }, { d: 10, active: true }, { d: 11, active: true }, { d: 12, active: true }, { d: 13, active: true }, { d: 14, active: true },
    { d: 15, active: true }, { d: 16, active: true }, { d: 17, active: true }, { d: 18, active: true }, { d: 19, active: true }, { d: 20, active: true }, { d: 21, active: true },
    { d: 22, active: true }, { d: 23, active: true }, { d: 24, active: true }, { d: 25, active: true }, { d: 26, active: true }, { d: 27, active: true }, { d: 28, active: true },
    { d: 29, active: true }, { d: 30, active: true }, { d: 31, active: true, selected: true },
  ];

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col items-center text-center">
        <h1 className="text-[32px] font-black tracking-tight mt-4">Track Habits</h1>
        <p className="text-[#8E8E93] font-medium text-lg">Useful stats & charts</p>
      </header>

      {/* Habit Selector Strip */}
      <div className="flex justify-between items-center bg-white/40 p-3 rounded-[20px] shadow-sm">
         <div className="p-2 bg-red-400 text-white rounded-full"><MoreHorizontal size={18} /></div>
         {habitIcons.map((icon, i) => (
            <span key={i} className={`text-2xl tap-effect ${i === 0 ? 'opacity-100' : 'opacity-40'}`}>{icon}</span>
         ))}
         <div className="p-2 bg-red-400 text-white rounded-full"><ChevronRight size={18} /></div>
      </div>

      {/* Monthly Calendar Card */}
      <div className="ios-card bg-white p-6">
         <div className="flex justify-between items-center mb-4">
            <ChevronLeft size={20} className="text-[#8E8E93]" />
            <h3 className="font-black text-lg">2025/12</h3>
            <ChevronRight size={20} className="text-[#8E8E93]" />
         </div>

         <div className="grid grid-cols-7 gap-y-4 text-center">
            {weekDays.map(d => <span key={d} className="text-[10px] font-black p-1">{d}</span>)}
            {calendarDays.map((day, i) => (
               <div key={i} className="flex flex-col items-center relative">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-sm ${
                    day.selected ? 'bg-black text-white' : 'border border-red-200 text-red-400 opacity-60'
                  }`}>
                    {day.d}
                  </div>
                  {day.active && <span className="absolute -top-1 -right-0.5 text-[8px]">👑</span>}
                  {day.selected && <div className="absolute -bottom-1.5 w-1 h-1 bg-black rounded-full" />}
               </div>
            ))}
         </div>
      </div>

      {/* Yearly Status Heatmap */}
      <div className="ios-card bg-white p-4">
         <div className="flex justify-between items-center mb-3">
            <span className="font-black text-sm uppercase">Yearly Status</span>
            <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded-full font-bold">2025 v</span>
         </div>
         <div className="grid grid-cols-20 gap-1">
            {Array.from({ length: 80 }).map((_, i) => (
               <div key={i} className={`h-2.5 rounded-sm ${i < 50 ? 'bg-red-200' : 'bg-gray-100'}`} />
            ))}
         </div>
      </div>

      {/* Summary Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
         <div className="ios-card bg-white p-4 flex flex-col gap-2">
            <div className="p-2 bg-blue-100 text-blue-400 w-fit rounded-lg"><Calendar size={20} /></div>
            <div className="flex items-baseline gap-1">
               <span className="text-2xl font-black">8</span>
               <span className="text-xs font-bold text-[#8E8E93]">Days</span>
            </div>
            <p className="text-[10px] font-bold text-[#8E8E93] uppercase">success in January</p>
         </div>
         <div className="ios-card bg-white p-4 flex flex-col gap-2">
            <div className="p-2 bg-emerald-100 text-emerald-400 w-fit rounded-lg"><CheckCircle2 size={20} /></div>
            <div className="flex items-baseline gap-1">
               <span className="text-2xl font-black">365</span>
               <span className="text-xs font-bold text-[#8E8E93]">Days</span>
            </div>
            <p className="text-[10px] font-bold text-[#8E8E93] uppercase">Total Success</p>
         </div>
      </div>
    </div>
  );
};

export default TrackingView;
