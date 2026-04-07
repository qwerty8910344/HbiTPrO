import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Heart, Share2, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import allQuotes from '../data/quotes.json';

const emojis = ["🚀", "💎", "🌟", "🔥", "❤️", "🧬", "📈", "💡", "🧠", "✨", "🎯"];

const MotivationView = () => {
  const [currentQuote, setCurrentQuote] = useState({ text: "Loading...", author: "", emoji: "🚀" });
  const [direction, setDirection] = useState(0);
  const [saved, setSaved] = useState(new Set());
  
  useEffect(() => {
    getRandomQuote();
  }, []);

  const getRandomQuote = () => {
    const randomIdx = Math.floor(Math.random() * allQuotes.length);
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    const q = allQuotes[randomIdx];
    setCurrentQuote({ text: q.text, author: q.author || "Unknown", emoji: randomEmoji });
  };

  const handleSave = () => {
    if (saved.has(currentQuote.text)) return;
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 }, colors: ['#4ADE80', '#16A34A'] });
    setSaved(prev => new Set(prev).add(currentQuote.text));
  };

  const handleShare = async () => {
    const text = `"${currentQuote.text}" - ${currentQuote.author}`;
    if (navigator.share) {
      try { await navigator.share({ title: 'HabitPro Motivation', text }); } catch (e) {}
    } else {
      navigator.clipboard.writeText(text);
      alert('Quote copied to clipboard!');
    }
  };

  const next = () => { setDirection(1); getRandomQuote(); };
  const prev = () => { setDirection(-1); getRandomQuote(); };

  const quote = currentQuote;

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
            key={currentQuote.text}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="ios-card bg-[#111827] p-8 flex flex-col items-center gap-6 text-center absolute inset-0 border border-[#16A34A]/10"
          >
            <div className="absolute top-4 right-4 z-10 text-white">
              <button 
                onClick={handleSave} 
                className={`p-3 rounded-full transition-all tap-effect shadow-md border ${
                  saved.has(currentQuote.text) 
                    ? 'bg-[#16A34A] text-white border-[#4ADE80]' 
                    : 'bg-[#111827] text-[#6B7280] border-white/10 hover:border-[#4ADE80]/30 hover:text-[#4ADE80]'
                }`}
              >
                {saved.has(currentQuote.text) ? <Check size={20} className="drop-shadow-sm"/> : <Heart size={20} />}
              </button>
            </div>
            <span className="text-[80px]">{quote.emoji}</span>
            <p className="text-xl font-bold leading-relaxed text-[#E5E7EB] italic">
              "{quote.text}"
            </p>
            <p className="text-sm font-black uppercase tracking-widest text-[#4ADE80] mb-2">
              — {quote.author}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-8 mt-2">
        <button onClick={prev} className="w-14 h-14 rounded-full bg-[#111827] text-[#6B7280] flex items-center justify-center shadow-lg border border-white/5 tap-effect">
          <ChevronLeft size={24} strokeWidth={3} />
        </button>

        <button 
          onClick={handleShare}
          className="flex items-center gap-2 px-6 py-3 bg-[#111827] text-[#E5E7EB] rounded-full font-black text-xs uppercase tracking-widest tap-effect border border-white/5 shadow-lg"
        >
          <Share2 size={16} /> Share
        </button>

        <button onClick={next} className="w-14 h-14 rounded-full bg-[#111827] text-[#6B7280] flex items-center justify-center shadow-lg border border-white/5 tap-effect">
          <ChevronRight size={24} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
};

export default MotivationView;
