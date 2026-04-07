import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, CheckCircle2, ChevronLeft, ChevronRight, MoreHorizontal, ChevronDown } from 'lucide-react';

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
        <h1 className="text-[32px] font-black tracking-tighter mt-4">Track Habits</h1>
        <p className="text-[#8E8E93] font-bold text-lg italic tracking-tight">Useful stats & charts</p>
      </header>

      {/* Habit Selector Strip with Dropdown */}
      <div className="flex justify-between items-center bg-white/60 backdrop-blur-md p-1.5 rounded-[22px] shadow-sm border border-white/40">
         <div className="p-2.5 bg-red-400 text-white rounded-2xl shadow-lg"><MoreHorizontal size={18} strokeWidth={3} /></div>
         <div className="flex items-center gap-1 bg-white/40 px-4 py-2 rounded-2xl shadow-inner border border-white/20 tap-effect">
            <span className="text-xl">🧘‍♀️</span>
            <span className="font-extrabold text-sm tracking-tight text-black/80">Yoga</span>
            <ChevronDown size={16} strokeWidth={3} className="text-red-400" />
         </div>
         <div className="p-2.5 bg-red-400 text-white rounded-2xl shadow-lg"><Plus size={18} strokeWidth={3} /></div>
      </div>
      
      {/* Horizontal Emoji Strip */}
      <div className="flex justify-between px-6 opacity-40">
         {habitIcons.map((icon, i) => (
            <span key={i} className="text-2xl">{icon}</span>
         ))}
      </div>

      {/* Monthly Calendar Card */}
      <div className="ios-card bg-white p-6 shadow-2xl relative overflow-hidden">
         <div className="flex justify-between items-center mb-6">
            <ChevronLeft size={24} strokeWidth={3} className="text-red-400 opacity-20" />
            <h3 className="font-extrabold text-xl tracking-tighter">2025/12</h3>
            <ChevronRight size={24} strokeWidth={3} className="text-red-400 opacity-20" />
         </div>

         <div className="grid grid-cols-7 gap-y-6 text-center">
            {weekDays.map(d => <span key={d} className="text-[10px] font-black p-1 text-[#8E8E93] tracking-widest">{d}</span>)}
            {calendarDays.map((day, i) => (
               <div key={i} className="flex flex-col items-center relative">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-[15px] font-bold transition-all ${
                    day.selected ? 'bg-black text-white shadow-xl scale-110' : 'border-2 border-red-50 text-red-400/60'
                  }`}>
                    {day.d}
                  </div>
                  {day.active && <span className="absolute -top-2 -right-0 text-[13px] drop-shadow-sm">👑</span>}
                  {day.selected && <div className="absolute -bottom-2 w-1.5 h-1.5 bg-black rounded-full shadow-sm" />}
               </div>
            ))}
         </div>
      </div>

      {/* Yearly Status Heatmap */}
      <div className="ios-card bg-white p-5 shadow-xl">
         <div className="flex justify-between items-center mb-4">
            <span className="font-black text-[10px] uppercase tracking-[0.3em] text-[#8E8E93]">Yearly Status</span>
            <span className="text-[10px] bg-red-400/10 text-red-400 px-3 py-1 rounded-full font-black uppercase tracking-widest shadow-inner">2025 v</span>
         </div>
         <div className="grid grid-cols-20 gap-1.5">
            {Array.from({ length: 80 }).map((_, i) => (
               <div key={i} className={`h-2.5 rounded-sm shadow-sm transition-all ${i < 50 ? 'bg-red-300' : 'bg-gray-100'}`} />
            ))}
         </div>
      </div>

      {/* Summary Stats Grid */}
      <div className="grid grid-cols-2 gap-4 pb-4">
         <div className="ios-card bg-white p-5 flex flex-col gap-3 shadow-lg hover:scale-[1.02] transition-all">
            <div className="p-2.5 bg-blue-100 text-blue-500 w-fit rounded-2xl shadow-inner"><Calendar size={24} strokeWidth={3} /></div>
            <div>
               <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black tracking-tighter">8</span>
                  <span className="text-xs font-black text-[#8E8E93] uppercase">Days</span>
               </div>
               <p className="text-[9px] font-black text-[#8E8E93] uppercase tracking-[0.2em] mt-1">success in January</p>
            </div>
         </div>
         <div className="ios-card bg-white p-5 flex flex-col gap-3 shadow-lg hover:scale-[1.02] transition-all">
            <div className="p-2.5 bg-emerald-100 text-emerald-500 w-fit rounded-2xl shadow-inner"><CheckCircle2 size={24} strokeWidth={3} /></div>
            <div>
               <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black tracking-tighter">365</span>
                  <span className="text-xs font-black text-[#8E8E93] uppercase">Days</span>
               </div>
               <p className="text-[9px] font-black text-[#8E8E93] uppercase tracking-[0.2em] mt-1">Total Success</p>
            </div>
         </div>
      </div>
    </div>
  );
};

const Plus = ({ size, className, strokeWidth }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

export default TrackingView;
