import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Heart, Share2 } from 'lucide-react';

const quotes = [
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain", emoji: "🚀" },
  { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Aristotle", emoji: "💎" },
  { text: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier", emoji: "🌟" },
  { text: "Motivation is what gets you started. Habit is what keeps you going.", author: "Jim Ryun", emoji: "🔥" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs", emoji: "❤️" },
  { text: "Your habits shape your identity, and your identity shapes your habits.", author: "James Clear", emoji: "🧬" },
  { text: "Small daily improvements are the key to staggering long-term results.", author: "Unknown", emoji: "📈" },
];

const MotivationView = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const next = () => { setDirection(1); setCurrent((c) => (c + 1) % quotes.length); };
  const prev = () => { setDirection(-1); setCurrent((c) => (c - 1 + quotes.length) % quotes.length); };

  const quote = quotes[current];

  const variants = {
    enter: (dir) => ({ x: dir > 0 ? 200 : -200, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? -200 : 200, opacity: 0 }),
  };

  return (
    <div className="flex flex-col gap-6 items-center">
      <header className="flex flex-col items-center text-center">
        <h1 className="text-[32px] font-black tracking-tight mt-4 text-[#E5E7EB]">Daily Vibe</h1>
        <p className="text-[#6B7280] font-medium text-lg italic">Fuel your fire</p>
      </header>

      {/* Quote Card */}
      <div className="w-full relative" style={{ minHeight: '320px' }}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="ios-card bg-[#111827] p-8 flex flex-col items-center gap-6 text-center absolute inset-0 border border-[#16A34A]/10"
          >
            <span className="text-[80px]">{quote.emoji}</span>
            <p className="text-xl font-bold leading-relaxed text-[#E5E7EB] italic">
              "{quote.text}"
            </p>
            <p className="text-sm font-black uppercase tracking-widest text-[#4ADE80]">
              — {quote.author}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-8">
        <button onClick={prev} className="w-14 h-14 rounded-full bg-[#111827] text-[#6B7280] flex items-center justify-center shadow-lg border border-white/5 tap-effect">
          <ChevronLeft size={24} strokeWidth={3} />
        </button>

        <div className="flex gap-2">
          {quotes.map((_, i) => (
            <div key={i} className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-[#4ADE80] w-6' : 'bg-white/10'}`} />
          ))}
        </div>

        <button onClick={next} className="w-14 h-14 rounded-full bg-[#111827] text-[#6B7280] flex items-center justify-center shadow-lg border border-white/5 tap-effect">
          <ChevronRight size={24} strokeWidth={3} />
        </button>
      </div>

      {/* Action Row */}
      <div className="flex gap-4">
        <button className="flex items-center gap-2 px-6 py-3 bg-[#16A34A]/10 text-[#4ADE80] rounded-full font-black text-xs uppercase tracking-widest tap-effect border border-[#16A34A]/20">
          <Heart size={16} /> Save
        </button>
        <button className="flex items-center gap-2 px-6 py-3 bg-white/5 text-[#E5E7EB] rounded-full font-black text-xs uppercase tracking-widest tap-effect border border-white/5">
          <Share2 size={16} /> Share
        </button>
      </div>
    </div>
  );
};

export default MotivationView;
