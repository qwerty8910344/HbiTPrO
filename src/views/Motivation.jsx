import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, Share2, Sparkles, RefreshCw } from 'lucide-react';

const quotes = [
  { text: "Your daily routine is your destiny in motion.", author: "HabitPro" },
  { text: "Focus is the art of saying no to everything else.", author: "Anonymous" },
  { text: "Small habits lead to big transformations.", author: "James Clear" },
  { text: "Discipline is choosing between what you want now and what you want most.", author: "Abraham Lincoln" },
  { text: "Consistency is more important than intensity.", author: "HabitPro" },
  { text: "You don't rise to the level of your goals, you fall to the level of your systems.", author: "James Clear" },
];

const MotivationView = () => {
  const [index, setIndex] = useState(0);

  const nextQuote = () => setIndex((prev) => (prev + 1) % quotes.length);

  return (
    <div className="flex flex-col gap-8 h-full min-h-[70vh]">
      <header className="flex flex-col items-center text-center">
        <h1 className="text-[32px] font-black tracking-tight mt-4">Motivation</h1>
        <p className="text-[#8E8E93] font-medium text-lg italic">Swipe to find your fire</p>
      </header>

      {/* Quote Card Swiper */}
      <div className="flex-1 relative flex items-center justify-center p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 100, rotate: 10 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            exit={{ opacity: 0, x: -100, rotate: -10 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="ios-card bg-red-400 text-white p-10 h-full w-full max-w-[350px] shadow-2xl flex flex-col items-center justify-center text-center gap-8 relative overflow-hidden"
          >
             {/* Decorative Background Elements */}
             <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2" />
             <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

             <Quote size={48} fill="currentColor" className="opacity-20 translate-y-4" />
             
             <div className="flex flex-col gap-6 z-10">
                <h2 className="text-3xl font-black italic tracking-tighter leading-tight drop-shadow-lg">
                   "{quotes[index].text}"
                </h2>
                <div className="flex flex-col items-center gap-1">
                   <div className="h-0.5 w-12 bg-white/40 rounded-full" />
                   <p className="text-xs font-black uppercase tracking-[0.2em] opacity-80">{quotes[index].author}</p>
                </div>
             </div>

             <Sparkles size={24} className="opacity-40 animate-pulse mt-4" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Action Controls */}
      <div className="flex items-center justify-center gap-6 pb-10">
         <button className="p-4 ios-card-glass rounded-full text-red-500 tap-effect"><Share2 size={24} strokeWidth={2.5} /></button>
         <button 
            onClick={nextQuote}
            className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center shadow-xl tap-effect"
         >
            <RefreshCw size={32} strokeWidth={3} />
         </button>
         <button className="p-4 ios-card-glass rounded-full text-yellow-500 tap-effect"><Sparkles size={24} strokeWidth={2.5} /></button>
      </div>
    </div>
  );
};

export default MotivationView;
