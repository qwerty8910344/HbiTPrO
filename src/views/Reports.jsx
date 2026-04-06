import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Filter, Share2, Award } from 'lucide-react';

const ReportsView = () => {
  const habits = [
    { title: 'Drink water', icon: '💧', color: 'var(--habit-blue)', progress: [1, 1, 1, 1, 1, 1, 1], badge: true },
    { title: 'Yoga', icon: '🧘‍♀️', color: 'var(--habit-peach)', progress: [1, 1, 1, 1, 1, 1, 1], badge: true },
    { title: 'Drink Less Beverage', icon: '🥤', color: 'var(--habit-purple)', progress: [1, 0, 1, 1, 0, 1, 1], badge: false },
    { title: 'Eat Breakfast', icon: '🍳', color: 'var(--habit-yellow)', progress: [1, 1, 1, 1, 1, 1, 1], badge: true },
    { title: 'Walk', icon: '🚶‍♀️', color: 'var(--habit-green)', progress: [1, 1, 1, 1, 1, 1, 1], badge: true },
    { title: 'Run', icon: '🏃‍♀️', color: 'var(--habit-orange)', progress: [1, 1, 1, 1, 1, 1, 1], badge: true },
    { title: 'Meditation', icon: '🧘', color: 'var(--habit-gold)', progress: [1, 1, 1, 1, 1, 1, 1], badge: true },
    { title: 'Save money', icon: '💰', color: 'var(--habit-peach)', progress: [1, 1, 1, 1, 1, 1, 1], badge: true },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <header className="flex flex-col items-center text-center">
        <h1 className="text-[32px] font-black tracking-tight mt-4">Habit Reports</h1>
        <p className="text-[#8E8E93] font-medium text-lg">Review your progress</p>
      </header>

      {/* Main Report Card */}
      <div className="ios-card bg-white p-4 relative">
        {/* Navigation Tabs */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4">
             <span className="font-bold border-b-2 border-red-400 pb-1">Weekly</span>
             <span className="text-[#8E8E93] font-medium">Monthly</span>
             <span className="text-[#8E8E93] font-medium">Yearly</span>
          </div>
          <div className="flex gap-2">
             <button className="p-2 bg-red-400/10 text-red-400 rounded-full"><Filter size={18} /></button>
             <button className="p-2 bg-red-400/10 text-red-400 rounded-full"><Share2 size={18} /></button>
          </div>
        </div>

        {/* Tracker Header */}
        <div className="flex justify-center items-center gap-2 mb-4">
           <span className="text-2xl">☀️</span>
           <h2 className="text-3xl font-bold text-red-400" style={{ fontFamily: 'Dancing Script, cursive' }}>Habit Tracker</h2>
           <span className="text-2xl">🌙</span>
        </div>

        {/* Grid Area */}
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-separate border-spacing-y-3">
             <thead>
                <tr className="text-[#8E8E93] text-[10px] font-black uppercase text-center">
                   <th className="w-1/3"></th>
                   {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <th key={d}>{d}</th>)}
                   <th></th>
                </tr>
             </thead>
             <tbody>
                {habits.map((habit, i) => (
                   <tr key={i} className="items-center">
                      <td className="flex items-center gap-1 py-1">
                         <span className="text-sm">{habit.icon}</span>
                         <span className="text-[11px] font-bold tracking-tight truncate">{habit.title}</span>
                      </td>
                      {habit.progress.map((p, j) => (
                         <td key={j} className="text-center">
                            <div className={`status-dot m-auto shadow-sm ${p ? 'active' : ''}`} style={{ backgroundColor: p ? habit.color : 'rgba(0,0,0,0.05)' }} />
                         </td>
                      ))}
                      <td className="text-right">
                         {habit.badge && <Award size={16} className="text-blue-400 ml-auto" />}
                      </td>
                   </tr>
                ))}
                <tr>
                   <td className="text-[11px] font-bold text-[#8E8E93] uppercase">BestDay</td>
                   {Array.from({ length: 7 }).map((_, i) => (
                      <td key={i} className="text-center">
                         <span className="text-lg">🏅</span>
                      </td>
                   ))}
                </tr>
             </tbody>
          </table>
        </div>

        {/* Footer Stats */}
        <div className="grid grid-cols-4 gap-2 border-t pt-4 mt-4">
           <div className="flex flex-col items-center">
              <span className="text-2xl font-black text-red-400">100<span className="text-sm">%</span></span>
              <span className="text-[10px] font-bold text-[#8E8E93] uppercase">Met</span>
           </div>
           <div className="flex flex-col items-center">
              <span className="text-2xl font-black text-blue-400">7<span className="text-sm">d</span></span>
              <span className="text-[10px] font-bold text-[#8E8E93] uppercase">BestDay</span>
           </div>
           <div className="flex flex-col items-center">
              <span className="text-2xl font-black text-emerald-400">56</span>
              <span className="text-[10px] font-bold text-[#8E8E93] uppercase">TotalDone</span>
           </div>
           <div className="flex flex-col items-center">
              <span className="text-2xl font-black text-orange-400">7<span className="text-sm">d</span></span>
              <span className="text-[10px] font-bold text-[#8E8E93] uppercase">BestStreak</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsView;
