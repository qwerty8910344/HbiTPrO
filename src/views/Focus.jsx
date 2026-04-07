import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Wind, Music, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FocusView = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [selectedDuration, setSelectedDuration] = useState(25);
  const [selectedSound, setSelectedSound] = useState('');
  const [isMuted, setIsMuted] = useState(false);

  const sounds = [
    { id: 'cafe', label: 'Cafe', icon: '☕' },
    { id: 'forest', label: 'Forest', icon: '🌲' },
    { id: 'ocean', label: 'Ocean', icon: '🌊' },
    { id: 'fire', label: 'Fire', icon: '🔥' },
  ];

  const durations = [15, 25, 30, 45];

  useEffect(() => {
    let interval;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const progress = 1 - (timeLeft / (selectedDuration * 60));
  const circumference = 2 * Math.PI * 120;
  const dashOffset = circumference * (1 - progress);

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(selectedDuration * 60);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <header className="flex flex-col items-center text-center">
        <h1 className="text-[32px] font-black tracking-tight mt-4 text-[#E5E7EB]">Deep Focus</h1>
        <p className="text-[#6B7280] font-medium text-lg italic">Eliminate distractions</p>
      </header>

      {/* Duration Picker */}
      <div className="flex gap-2 p-1.5 bg-[#111827] rounded-full shadow-inner border border-white/5">
        {durations.map(d => (
          <button
            key={d}
            onClick={() => { setSelectedDuration(d); setTimeLeft(d * 60); setIsRunning(false); }}
            className={`py-3 px-5 rounded-full font-black text-sm tracking-wide transition-all tap-effect ${
              selectedDuration === d
                ? 'bg-[#16A34A] text-white shadow-sm'
                : 'text-[#6B7280] hover:text-[#E5E7EB]'
            }`}
          >
            {d}m
          </button>
        ))}
      </div>

      {/* Circular Timer */}
      <div className="relative flex items-center justify-center my-6">
        <svg width="260" height="260" className="rotate-[-90deg]">
          <circle cx="130" cy="130" r="120" stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="none" />
          <circle
            cx="130" cy="130" r="120"
            stroke="url(#green-gradient)"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
          />
          <defs>
            <linearGradient id="green-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#16A34A" />
              <stop offset="100%" stopColor="#4ADE80" />
            </linearGradient>
          </defs>
        </svg>
        
        <div className="absolute flex flex-col items-center">
          <span className="text-7xl font-black tracking-tighter text-[#E5E7EB] tabular-nums">
            {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
          </span>
          <span className="text-xs font-black uppercase tracking-[0.3em] text-[#6B7280] mt-2">
            {isRunning ? 'Focusing...' : 'Ready'}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-6">
        <button onClick={handleReset} className="w-14 h-14 rounded-full bg-[#111827] text-[#6B7280] flex items-center justify-center shadow-lg border border-white/5 tap-effect">
          <RotateCcw size={24} strokeWidth={2.5} />
        </button>
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={() => setIsRunning(!isRunning)}
          className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#16A34A] to-[#4ADE80] text-white flex items-center justify-center shadow-[0_12px_40px_rgba(22,163,74,0.4)] border-4 border-[#0B0F0C]/60 tap-effect"
        >
          {isRunning ? <Pause size={36} strokeWidth={3} /> : <Play size={36} strokeWidth={3} className="ml-1" />}
        </motion.button>
        <button onClick={() => setIsMuted(!isMuted)} className={`w-14 h-14 rounded-full bg-[#111827] flex items-center justify-center shadow-lg border border-white/5 tap-effect transition-colors ${isMuted ? 'text-red-400' : 'text-[#6B7280]'}`}>
          {isMuted ? <VolumeX size={24} strokeWidth={2.5} /> : <Volume2 size={24} strokeWidth={2.5} />}
        </button>
      </div>

      {/* Ambient Sound Picker */}
      <div className="flex gap-4 w-full px-4">
        {sounds.map(s => (
          <button
            key={s.id}
            onClick={() => setSelectedSound(selectedSound === s.id ? '' : s.id)}
            className={`flex-1 flex flex-col items-center gap-2 py-4 rounded-2xl transition-all tap-effect border ${
              selectedSound === s.id
                ? 'bg-[#16A34A]/10 border-[#16A34A]/30 text-[#4ADE80] shadow-md'
                : 'bg-[#111827] border-white/5 text-[#6B7280]'
            }`}
          >
            <span className="text-2xl">{s.icon}</span>
            <span className="text-[10px] font-black uppercase tracking-widest">{s.label}</span>
          </button>
        ))}
      </div>

      {/* Productivity Stats */}
      <div className="grid grid-cols-2 gap-4 w-full">
         <div className="ios-card bg-[#111827] p-5 flex flex-col gap-1 items-center">
            <Wind size={20} className="text-blue-400" />
            <span className="text-2xl font-black text-[#E5E7EB]">4</span>
            <span className="text-[10px] font-black uppercase text-[#6B7280]">Today's Sessions</span>
         </div>
         <div className="ios-card bg-[#111827] p-5 flex flex-col gap-1 items-center">
            <Sparkles size={20} className="text-[#4ADE80]" />
            <span className="text-2xl font-black text-[#E5E7EB]">120</span>
            <span className="text-[10px] font-black uppercase text-[#6B7280]">Total Minutes</span>
         </div>
      </div>
    </div>
  );
};

export default FocusView;
