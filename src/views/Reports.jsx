import React from 'react';
import { motion } from 'framer-motion';
import { Filter, Share2, Award, ThumbsUp, Star } from 'lucide-react';

const ReportsView = () => {
  const habits = [
    { title: 'Drink water', icon: '💧', color: 'var(--habit-blue)', progress: [1, 1, 1, 1, 1, 1, 1], badge: 'thumb' },
    { title: 'Yoga', icon: '🧘‍♀️', color: 'var(--habit-peach)', progress: [1, 1, 1, 1, 1, 1, 1], badge: 'perfect' },
    { title: 'Drink Less Beverage', icon: '🥤', color: 'var(--habit-purple)', progress: [1, 0, 1, 1, 0, 1, 1], badge: null },
    { title: 'Eat Breakfast', icon: '🍳', color: 'var(--habit-yellow)', progress: [1, 1, 1, 1, 1, 1, 1], badge: 'perfect' },
    { title: 'Walk', icon: '🏃‍♀️', color: 'var(--habit-green)', progress: [1, 1, 1, 1, 1, 1, 1], badge: 'thumb' },
    { title: 'Run', icon: '🏃‍♀️', color: 'var(--habit-orange)', progress: [1, 1, 1, 1, 1, 1, 1], badge: 'perfect' },
    { title: 'Meditation', icon: '🧘', color: 'var(--habit-gold)', progress: [1, 1, 1, 1, 1, 1, 1], badge: 'perfect' },
    { title: 'Save money', icon: '💰', color: 'var(--habit-peach)', progress: [1, 1, 1, 1, 1, 1, 1], badge: 'thumb' },
  ];

  const renderBadge = (type) => {
    if (type === 'perfect') return <div className="w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center text-[10px] text-white shadow-sm font-black">WIN</div>;
    if (type === 'thumb') return <div className="w-6 h-6 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center shadow-sm"><ThumbsUp size={12} fill="currentColor" /></div>;
    return null;
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <header className="flex flex-col items-center text-center">
        <h1 className="text-[32px] font-black tracking-tighter mt-4">Habit Reports</h1>
        <p className="text-[#8E8E93] font-bold text-lg italic">Review your progress</p>
      </header>

      {/* Main Report Card */}
      <div className="ios-card bg-white p-5 relative overflow-hidden shadow-2xl">
        {/* Navigation Tabs */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex gap-6">
             <span className="font-black text-sm border-b-4 border-red-400 pb-1 uppercase tracking-widest text-red-500">Weekly</span>
             <span className="text-[#8E8E93] font-black text-sm uppercase tracking-widest opacity-40">Monthly</span>
             <span className="text-[#8E8E93] font-black text-sm uppercase tracking-widest opacity-40">Yearly</span>
          </div>
          <div className="flex gap-2">
             <button className="p-2.5 bg-red-400 text-white rounded-2xl shadow-lg tap-effect"><Filter size={18} strokeWidth={3} /></button>
             <button className="p-2.5 bg-red-400 text-white rounded-2xl shadow-lg tap-effect"><Share2 size={18} strokeWidth={3} /></button>
          </div>
        </div>

        {/* Tracker Header Art */}
        <div className="flex justify-center items-center gap-4 mb-2">
           <span className="text-4xl animate-pulse">☀️</span>
           <h2 className="text-5xl font-bold text-red-400" style={{ fontFamily: 'Dancing Script, cursive', letterSpacing: '-2px' }}>Habit Tracker</h2>
           <span className="text-4xl">🌙</span>
        </div>
        
        <div className="text-center mb-8">
           <span className="bg-yellow-100 text-yellow-700 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-inner">
              📅 12/28 ~ 01/03
           </span>
        </div>

        {/* Grid Area */}
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-separate border-spacing-y-4">
             <thead>
                <tr className="text-[#8E8E93] text-[10px] font-black uppercase text-center tracking-widest">
                   <th className="w-1/3"></th>
                   {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <th key={d} className="pb-2">{d}</th>)}
                   <th></th>
                </tr>
             </thead>
             <tbody>
                {habits.map((habit, i) => (
                   <tr key={i} className="items-center">
                      <td className="flex items-center gap-2 py-0">
                         <span className="text-xl">{habit.icon}</span>
                         <span className="text-[11px] font-black tracking-tight truncate opacity-80">{habit.title}</span>
                      </td>
                      {habit.progress.map((p, j) => (
                         <td key={j} className="text-center">
                            <div className={`w-4 h-4 m-auto rounded-full shadow-sm ${p ? '' : 'bg-gray-100 border border-gray-200'}`} style={{ backgroundColor: p ? habit.color : '' }} />
                         </td>
                      ))}
                      <td className="text-right pl-2">
                         <div className="flex justify-end">{renderBadge(habit.badge)}</div>
                      </td>
                   </tr>
                ))}
                <tr>
                   <td className="text-[10px] font-black text-[#8E8E93] uppercase tracking-widest">BestDay</td>
                   {Array.from({ length: 7 }).map((_, i) => (
                      <td key={i} className="text-center pt-2">
                         <span className="text-xl drop-shadow-sm">🏅</span>
                      </td>
                   ))}
                </tr>
             </tbody>
          </table>
        </div>

        {/* Footer Stats Grid */}
        <div className="grid grid-cols-4 gap-2 border-t-2 border-dashed border-gray-100 pt-6 mt-8">
           <div className="flex flex-col items-center">
              <span className="text-[28px] font-black text-red-500 leading-none">100<span className="text-xs">%</span></span>
              <span className="text-[9px] font-black text-[#8E8E93] uppercase tracking-[0.2em] mt-1">Met</span>
           </div>
           <div className="flex flex-col items-center">
              <span className="text-[28px] font-black text-blue-500 leading-none">7<span className="text-xs">d</span></span>
              <span className="text-[9px] font-black text-[#8E8E93] uppercase tracking-[0.2em] mt-1">BestDay</span>
           </div>
           <div className="flex flex-col items-center">
              <span className="text-[28px] font-black text-emerald-500 leading-none">56</span>
              <span className="text-[9px] font-black text-[#8E8E93] uppercase tracking-[0.2em] mt-1">TotalDone</span>
           </div>
           <div className="flex flex-col items-center">
              <span className="text-[28px] font-black text-orange-500 leading-none">7<span className="text-xs">d</span></span>
              <span className="text-[9px] font-black text-[#8E8E93] uppercase tracking-[0.2em] mt-1">BestStreak</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsView;
