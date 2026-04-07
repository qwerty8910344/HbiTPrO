import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, MoreHorizontal, CheckCircle2, ChevronRight, Activity, TrendingUp } from 'lucide-react';

const TrackingView = () => {
  const habitIcons = ['💧', '🧗', '🥤', '🥪', '🚶‍♀️', '🏃‍♀️'];
  
  return (
    <div className="flex flex-col gap-8 pb-10">
      <header className="flex flex-col items-center text-center px-4">
        <h1 className="text-4xl font-extrabold tracking-tighter mt-4" style={{ color: '#a12b76' }}>Progress</h1>
        <p className="text-[#a12b76]/60 font-bold text-lg italic tracking-tight">The Kinetic Reward</p>
      </header>

      {/* 3D Circular Progress Overview */}
      <section className="px-5">
        <div className="relative bg-[#ffffff] rounded-[40px] p-8 shadow-[0_20px_50px_rgba(161,43,118,0.08)] flex flex-col items-center border border-white">
          <div className="relative w-48 h-48 flex items-center justify-center">
            {/* Outer Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#55fe7e] to-[#006a29] blur-xl opacity-40 rounded-full" />
            
            {/* SVG Ring */}
            <svg className="w-full h-full transform -rotate-90 relative z-10" viewBox="0 0 100 100">
              {/* Background Track with Inner Shadow logic */}
              <circle cx="50" cy="50" r="40" stroke="#f5f6f7" strokeWidth="12" fill="none" />
              {/* Progress Sweep */}
              <circle 
                cx="50" cy="50" r="40" 
                stroke="url(#progressGradient)" 
                strokeWidth="12" 
                fill="none" 
                strokeLinecap="round" 
                strokeDasharray="251.2" 
                strokeDashoffset="60" 
                className="drop-shadow-md"
              />
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#55fe7e" />
                  <stop offset="100%" stopColor="#006a29" />
                </linearGradient>
              </defs>
            </svg>

            {/* Inner Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
              <span className="text-5xl font-black tracking-tighter" style={{ color: '#006a29' }}>76<span className="text-2xl text-[#006a29]/50">%</span></span>
              <span className="text-xs font-black uppercase tracking-widest text-[#006a29]/60 mt-1">Met Today</span>
            </div>

            {/* 3D Glass Bubble Decorator */}
            <div className="absolute -bottom-2 -right-2 w-14 h-14 bg-gradient-to-br from-[#c69eff] to-[#b98ff5] rounded-full shadow-[0_10px_20px_rgba(198,158,255,0.4)] flex items-center justify-center border-2 border-white tap-effect z-30">
               <span className="text-2xl drop-shadow-md">⚡</span>
            </div>
          </div>

          <div className="flex gap-6 mt-8 w-full justify-between px-2">
             <div className="flex flex-col">
                <span className="text-2xl font-black text-[#a12b76]">12</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#a12b76]/50">Completed</span>
             </div>
             <div className="flex flex-col text-right">
                <span className="text-2xl font-black text-[#fd77c4]">4</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#a12b76]/50">Remaining</span>
             </div>
          </div>
        </div>
      </section>

      {/* High-Fidelity SVG Line Chart */}
      <section className="px-5">
         <div className="bg-[#f5f6f7]/60 backdrop-blur-xl rounded-[32px] p-6 border border-white shadow-[0_10px_40px_rgba(0,0,0,0.03)]">
            <div className="flex justify-between items-center mb-6">
               <div className="flex items-center gap-2">
                  <div className="p-2 bg-white rounded-xl shadow-sm">
                     <TrendingUp size={18} className="text-[#fd77c4]" />
                  </div>
                  <h3 className="font-extrabold text-[#2c2f30] text-lg">Consistency</h3>
               </div>
               <span className="text-xs font-black bg-white px-3 py-1 rounded-full text-[#a12b76] shadow-sm">Weekly</span>
            </div>

            <div className="relative h-32 w-full mt-4">
              {/* Chart Glow Underneath */}
              <svg className="absolute inset-0 w-full h-full blur-md opacity-50" preserveAspectRatio="none" viewBox="0 0 100 40">
                 <path d="M0,35 Q20,10 40,25 T80,5 T100,20" fill="none" stroke="#fd77c4" strokeWidth="3" />
              </svg>
              {/* Sharp Chart Line */}
              <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 40">
                 <path d="M0,35 Q20,10 40,25 T80,5 T100,20" fill="none" stroke="#a12b76" strokeWidth="2.5" strokeLinecap="round" />
                 
                 {/* Data Points */}
                 <circle cx="20" cy="18" r="2" fill="#fd77c4" />
                 <circle cx="60" cy="15" r="2" fill="#fd77c4" />
                 <circle cx="80" cy="5" r="3" fill="#ffffff" stroke="#a12b76" strokeWidth="1.5" />
              </svg>
              {/* X-Axis Labels */}
              <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-[9px] font-black uppercase text-[#9b9d9e] tracking-widest">
                 <span>Mon</span><span>Wed</span><span>Fri</span><span>Sun</span>
              </div>
            </div>
         </div>
      </section>

      {/* Golden Streak Elite Card */}
      <section className="px-5">
         <div className="relative bg-gradient-to-br from-[#24004d] to-[#4a2081] rounded-[32px] p-6 shadow-[0_15px_40px_rgba(36,0,77,0.3)] overflow-hidden">
            {/* Ghost Border Core Glow */}
            <div className="absolute inset-0 border border-white/15 rounded-[32px] pointer-events-none" />
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#c69eff] blur-[50px] opacity-40 rounded-full" />
            
            <div className="relative z-10 flex items-center justify-between">
               <div>
                  <h4 className="text-white font-extrabold text-xl tracking-tight mb-1">Elite Tier</h4>
                  <p className="text-[#c69eff] font-bold text-sm">Top 5% Consistency</p>
               </div>
               {/* 3D Glass Crown Bubble */}
               <div className="w-16 h-16 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center shadow-[inset_0_4px_10px_rgba(255,255,255,0.2)]">
                  <span className="text-3xl drop-shadow-lg">👑</span>
               </div>
            </div>

            <div className="relative z-10 mt-6 flex items-baseline gap-2">
               <span className="text-5xl font-black text-white tracking-tighter">120</span>
               <span className="text-sm font-black uppercase tracking-widest text-[#c69eff]">Day Streak</span>
            </div>
         </div>
      </section>

      {/* Minimal Heatmap Grid */}
      <section className="px-5 pb-4">
         <div className="bg-[#ffffff] rounded-[32px] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-white">
            <h3 className="font-extrabold text-[#2c2f30] text-lg mb-4">Activity Heatmap</h3>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(12px,1fr))] gap-2">
               {Array.from({ length: 42 }).map((_, idx) => {
                  // Simulate distribution logic
                  const intensity = Math.random();
                  const bgClass = intensity > 0.8 ? 'bg-[#006a29]' : intensity > 0.5 ? 'bg-[#55fe7e]' : intensity > 0.2 ? 'bg-[#cfffce]' : 'bg-[#eff1f2]';
                  return (
                     <div key={idx} className={`aspect-square rounded-[4px] ${bgClass} transition-colors duration-500`} />
                  )
               })}
            </div>
         </div>
      </section>

    </div>
  );
};

export default TrackingView;
