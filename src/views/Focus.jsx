import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, Wind, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FocusView = () => {
  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const [isActive, setIsActive] = useState(false);
  const [sound, setSound] = useState('Silent');
  const [audio] = useState(new Audio());

  const SOUND_URLS = {
    'Silent': '',
    'Tick': 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
    'Cafe': 'https://assets.mixkit.co/active_storage/sfx/120/120-preview.mp3',
    'Fire': 'https://assets.mixkit.co/active_storage/sfx/2458/2458-preview.mp3',
    'Forest': 'https://assets.mixkit.co/active_storage/sfx/2459/2459-preview.mp3',
    'Ocean': 'https://assets.mixkit.co/active_storage/sfx/2464/2464-preview.mp3',
    'Storm': 'https://assets.mixkit.co/active_storage/sfx/124/124-preview.mp3',
    'Water': 'https://assets.mixkit.co/active_storage/sfx/2381/2381-preview.mp3',
  };

  const sounds = Object.keys(SOUND_URLS);

  // Handle ambient sound playback
  useEffect(() => {
    if (sound === 'Silent' || !isActive) {
      audio.pause();
    } else {
      audio.src = SOUND_URLS[sound];
      audio.loop = true;
      audio.volume = 0.5;
      audio.play().catch(e => console.log('Audio playback prevented:', e));
    }
  }, [sound, isActive]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(30 * 60);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progress = (timeLeft / (30 * 60)) * 100;

  return (
    <div className="flex flex-col items-center gap-12">
      <header className="flex flex-col items-center text-center">
        <h1 className="text-[32px] font-black tracking-tight mt-4">Focus Timer</h1>
        <p className="text-[#8E8E93] font-medium text-lg italic">"Deep work leads to great results"</p>
      </header>

      {/* Main Circular Timer */}
      <div className="relative w-80 h-80 flex items-center justify-center">
         {/* Background Circle */}
         <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle 
               cx="50%" cy="50%" r="48%" 
               className="fill-none stroke-white/40 stroke-[8px]" 
            />
            <motion.circle 
               cx="50%" cy="50%" r="48%" 
               className="fill-none stroke-red-400 stroke-[8px]" 
               strokeLinecap="round"
               initial={{ strokeDasharray: "301.59, 301.59" }}
               animate={{ strokeDashoffset: `${301.59 - (progress / 100) * 301.59}` }}
               transition={{ duration: 1, ease: 'linear' }}
               style={{ strokeDasharray: 301.59 }}
            />
         </svg>

         <motion.div 
            animate={{ scale: isActive ? [1, 1.02, 1] : 1 }}
            transition={{ duration: 4, repeat: Infinity }}
            className="flex flex-col items-center gap-2 z-10"
         >
            <span className="text-[72px] font-black tracking-tighter leading-none">
               {formatTime(timeLeft)}
            </span>
            <span className="text-xs font-black uppercase tracking-[0.2em] text-[#8E8E93]">
               {isActive ? 'In Focus' : 'Ready'}
            </span>
         </motion.div>
      </div>

      {/* Timer Controls */}
      <div className="flex items-center gap-8">
         <button 
            onClick={resetTimer}
            className="w-14 h-14 ios-card-glass rounded-full flex items-center justify-center text-[#8E8E93] tap-effect"
         >
            <RotateCcw size={24} strokeWidth={2.5} />
         </button>

         <button 
            onClick={toggleTimer}
            className={`w-24 h-24 rounded-full flex items-center justify-center shadow-2xl tap-effect ${
               isActive ? 'bg-white text-red-400' : 'bg-red-400 text-white'
            }`}
         >
            {isActive ? <Pause size={48} fill="currentColor" /> : <Play size={48} fill="currentColor" className="ml-2" />}
         </button>

         <button className="w-14 h-14 ios-card-glass rounded-full flex items-center justify-center text-[#8E8E93] tap-effect">
            <Volume2 size={24} strokeWidth={2.5} />
         </button>
      </div>

      {/* Sound Options List */}
      <div className="w-full flex flex-col gap-4">
         <div className="flex items-center gap-2 px-2">
            <Music size={18} className="text-red-400" />
            <h3 className="font-bold uppercase text-[10px] tracking-widest text-[#8E8E93]">Ambient Sound</h3>
         </div>
         <div className="flex overflow-x-auto gap-3 no-scrollbar py-2">
            {sounds.map((s, i) => (
               <button
                  key={i}
                  onClick={() => setSound(s)}
                  className={`flex-shrink-0 px-6 py-3 rounded-2xl font-bold text-xs transition-all tap-effect ${
                     sound === s ? 'bg-black text-white' : 'bg-white/60 text-[#8E8E93]'
                  }`}
               >
                  {s}
               </button>
            ))}
         </div>
      </div>

      {/* Productivity Stats */}
      <div className="grid grid-cols-2 gap-4 w-full">
         <div className="ios-card bg-white p-5 flex flex-col gap-1 items-center">
            <Wind size={20} className="text-blue-400" />
            <span className="text-2xl font-black">4</span>
            <span className="text-[10px] font-black uppercase text-[#8E8E93]">Today's Sessions</span>
         </div>
         <div className="ios-card bg-white p-5 flex flex-col gap-1 items-center">
            <Sparkles size={20} className="text-yellow-400" />
            <span className="text-2xl font-black">120</span>
            <span className="text-[10px] font-black uppercase text-[#8E8E93]">Total Minutes</span>
         </div>
      </div>
    </div>
  );
};

export default FocusView;
