'use client';

import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, ArrowLeft, Info, Trophy, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const DURATIONS = [15, 25, 30, 45, 60];
const SOUNDS = [
  { id: 'cafe', label: 'Cafe', icon: '☕' },
  { id: 'forest', label: 'Forest', icon: '🌲' },
  { id: 'ocean', label: 'Ocean', icon: '🌊' },
  { id: 'fire', label: 'Fire', icon: '🔥' },
];

export default function FocusPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [selectedDuration, setSelectedDuration] = useState(25);
  const [selectedSound, setSelectedSound] = useState('');
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      // Logic for session complete could go here
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const progress = 1 - (timeLeft / (selectedDuration * 60));
  const circumference = 2 * Math.PI * 135;
  const dashOffset = circumference * (1 - progress);

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(selectedDuration * 60);
  };

  const handleDurationChange = (d: number) => {
    setSelectedDuration(d);
    setTimeLeft(d * 60);
    setIsRunning(false);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center">
      {/* Header */}
      <div className="w-full px-6 py-8 flex justify-between items-center relative z-20">
        <Link href="/" className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <div className="text-center">
          <h1 className="text-xl font-black uppercase tracking-[0.3em]">Deep Focus</h1>
          <p className="text-[10px] font-black text-emerald-500 tracking-[0.4em] uppercase opacity-70">Momentum Engine</p>
        </div>
        <button className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors">
          <Info size={24} />
        </button>
      </div>

      <main className="flex-1 w-full flex flex-col items-center justify-center -mt-10 px-6">
        
        {/* Progress Ring */}
        <div className="relative flex items-center justify-center mb-10 group">
          <div className="absolute w-[320px] h-[320px] bg-emerald-500/5 blur-[80px] rounded-full animate-pulse pointer-events-none" />
          
          <svg width="300" height="300" className="rotate-[-90deg]">
            <circle cx="150" cy="150" r="135" stroke="rgba(255,255,255,0.03)" strokeWidth="6" fill="none" />
            <motion.circle
              cx="150" cy="150" r="135"
              stroke="url(#gradient)"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#34D399" />
              </linearGradient>
            </defs>
          </svg>
          
          <div className="absolute flex flex-col items-center text-center">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-500 mb-2">
               {isRunning ? 'IN FLOW' : 'PAUSED'}
            </span>
            <span className="text-7xl font-black tracking-tighter tabular-nums drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
              {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
            </span>
            <div className="flex gap-2 mt-4">
              <div className={`w-1.5 h-1.5 rounded-full ${isRunning ? 'bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]' : 'bg-gray-700'}`} />
              <div className="w-1.5 h-1.5 rounded-full bg-gray-700" />
              <div className="w-1.5 h-1.5 rounded-full bg-gray-700" />
            </div>
          </div>
        </div>

        {/* Duration Picker */}
        <div className="flex gap-2 p-2 bg-white/5 rounded-3xl border border-white/5 mb-10 w-full overflow-x-auto no-scrollbar">
          {DURATIONS.map(d => (
            <button
              key={d}
              onClick={() => handleDurationChange(d)}
              className={`flex-1 min-w-[60px] py-4 rounded-2xl font-black text-xs tracking-widest transition-all ${
                selectedDuration === d
                  ? 'bg-emerald-500 text-white shadow-[0_10px_25px_rgba(16,185,129,0.3)]'
                  : 'text-gray-500 hover:text-white'
              }`}
            >
              {d}M
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-8 mb-10">
          <button 
            onClick={handleReset} 
            className="w-16 h-16 rounded-[2rem] bg-white/5 text-gray-500 flex items-center justify-center hover:bg-white/10 border border-white/5 active:scale-90 transition-all"
          >
            <RotateCcw size={28} />
          </button>
          
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsRunning(!isRunning)}
            className="w-24 h-24 rounded-[3rem] bg-emerald-500 text-white flex items-center justify-center shadow-[0_20px_50px_rgba(16,185,129,0.4)] border-b-4 border-emerald-700 active:translate-y-1 active:border-b-0 transition-all"
          >
            {isRunning ? <Pause size={44} strokeWidth={3} /> : <Play size={44} strokeWidth={3} className="ml-2" />}
          </motion.button>
          
          <button 
            onClick={() => setIsMuted(!isMuted)} 
            className={`w-16 h-16 rounded-[2rem] bg-white/5 flex items-center justify-center border border-white/5 active:scale-90 transition-all ${isMuted ? 'text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)]' : 'text-gray-500'}`}
          >
            {isMuted ? <VolumeX size={28} /> : <Volume2 size={28} />}
          </button>
        </div>

        {/* Ambient Sounds */}
        <div className="w-full space-y-4 mb-32">
          <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-600 block px-2 text-center">SOUNDSCAPE</label>
          <div className="grid grid-cols-4 gap-4">
            {SOUNDS.map(s => (
              <button
                key={s.id}
                onClick={() => setSelectedSound(selectedSound === s.id ? '' : s.id)}
                className={`flex flex-col items-center gap-3 py-6 rounded-[2.5rem] transition-all border ${
                  selectedSound === s.id
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-500 shadow-[0_10px_30px_rgba(16,185,129,0.1)]'
                    : 'bg-white/5 border-white/5 text-gray-600 hover:border-white/10'
                }`}
              >
                <span className="text-3xl">{s.icon}</span>
                <span className="text-[9px] font-black uppercase tracking-widest">{s.label}</span>
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* Stats Floatie */}
      <div className="fixed bottom-10 left-6 right-6 flex gap-4 pointer-events-none">
        <div className="flex-1 bg-white/5 backdrop-blur-3xl border border-white/5 p-5 rounded-[2.5rem] flex items-center gap-4">
           <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center">
              <Zap size={20} className="text-orange-500" />
           </div>
           <div>
              <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">SESSIONS</p>
              <p className="text-xl font-black">12</p>
           </div>
        </div>
        <div className="flex-1 bg-white/5 backdrop-blur-3xl border border-white/5 p-5 rounded-[2.5rem] flex items-center gap-4">
           <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
              <Trophy size={20} className="text-emerald-500" />
           </div>
           <div>
              <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">FOCUS TIME</p>
              <p className="text-xl font-black">420m</p>
           </div>
        </div>
      </div>
    </div>
  );
}
