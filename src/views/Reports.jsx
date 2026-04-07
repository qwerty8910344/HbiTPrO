import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Flame, Target } from 'lucide-react';

const habits = [
  { name: 'Meditation', emoji: '🧘‍♀️', color: '#3B1E5F', days: [true, true, false, true, true, false, true], rate: 71 },
  { name: 'Exercise', emoji: '🏃‍♀️', color: '#1E3A5F', days: [true, false, true, true, false, true, true], rate: 71 },
  { name: 'Reading', emoji: '📚', color: '#5F4D1E', days: [true, true, true, false, true, true, false], rate: 71 },
  { name: 'Hydration', emoji: '💧', color: '#1E5F2E', days: [true, true, true, true, true, true, false], rate: 85 },
];

const ReportsView = () => {
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col items-center text-center">
        <h1 className="text-[32px] font-black tracking-tight mt-4 text-[#E5E7EB]">Weekly Report</h1>
        <p className="text-[#6B7280] font-medium text-lg italic">Your performance breakdown</p>
      </header>

      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-3">
        <div className="ios-card bg-[#111827] p-4 flex flex-col items-center gap-1 text-center">
          <Trophy size={24} className="text-[#4ADE80]" />
          <span className="text-2xl font-black text-[#E5E7EB]">85%</span>
          <span className="text-[9px] font-black uppercase text-[#6B7280] tracking-widest">Success</span>
        </div>
        <div className="ios-card bg-[#111827] p-4 flex flex-col items-center gap-1 text-center">
          <Flame size={24} className="text-orange-400" />
          <span className="text-2xl font-black text-[#E5E7EB]">12</span>
          <span className="text-[9px] font-black uppercase text-[#6B7280] tracking-widest">Streak</span>
        </div>
        <div className="ios-card bg-[#111827] p-4 flex flex-col items-center gap-1 text-center">
          <Target size={24} className="text-blue-400" />
          <span className="text-2xl font-black text-[#E5E7EB]">28</span>
          <span className="text-[9px] font-black uppercase text-[#6B7280] tracking-widest">Total</span>
        </div>
      </div>

      {/* Weekly Habit Table */}
      <div className="ios-card bg-[#111827] p-4">
        <h3 className="text-sm font-black uppercase tracking-widest text-[#6B7280] mb-4">This Week</h3>
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-separate border-spacing-y-4">
             <thead>
                <tr className="text-[#6B7280] text-[10px] font-black uppercase text-center tracking-widest">
                   <th className="w-1/3"></th>
                   {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <th key={i} className="pb-2">{d}</th>)}
                   <th></th>
                </tr>
             </thead>
             <tbody>
                {habits.map((habit, i) => (
                   <tr key={i}>
                     <td className="pr-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{habit.emoji}</span>
                          <span className="font-bold text-sm text-[#E5E7EB] truncate">{habit.name}</span>
                        </div>
                     </td>
                     {habit.days.map((done, di) => (
                        <td key={di} className="text-center">
                           <div className={`w-7 h-7 rounded-lg mx-auto flex items-center justify-center text-xs font-black ${
                              done ? 'bg-[#16A34A] text-white' : 'bg-white/5 text-[#6B7280]/40'
                           }`}>
                             {done ? '✓' : '·'}
                           </div>
                        </td>
                     ))}
                     <td className="text-right">
                        <span className="text-xs font-black text-[#4ADE80]">{habit.rate}%</span>
                     </td>
                   </tr>
                ))}
             </tbody>
          </table>
        </div>
      </div>

      {/* Insight Card */}
      <div className="ios-card bg-[#111827] p-6 flex flex-col gap-3 text-center border border-[#16A34A]/20">
         <span className="text-4xl">🏆</span>
         <h3 className="text-xl font-black text-[#E5E7EB]">Great Week!</h3>
         <p className="text-sm text-[#6B7280] leading-relaxed">You completed 85% of your habits this week. Your best day was <span className="text-[#4ADE80] font-bold">Thursday</span>.</p>
      </div>
    </div>
  );
};

export default ReportsView;
