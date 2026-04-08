import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, Zap, Target } from 'lucide-react';

const FoodScanner = ({ onClose }) => {
  const [isScanning, setIsScanning] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsScanning(false);
      setStats({
        name: 'Organic Avocado Toast',
        calories: 320,
        protein: '12g',
        fats: '22g',
        vibe: 'Great for Focus 🧠'
      });
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center p-6">
      {/* Viewfinder Area */}
      <div className="relative w-full aspect-[9/16] rounded-[40px] overflow-hidden border-4 border-white/10 shadow-2xl">
        {/* Placeholder "Camera View" */}
        <img 
          src="https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=1000&auto=format&fit=crop" 
          className="w-full h-full object-cover opacity-60 grayscale-[0.5]"
          alt="Food"
        />
        
        {/* Scanning Animation */}
        {isScanning && (
          <motion.div 
            initial={{ top: '0%' }}
            animate={{ top: '100%' }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 right-0 h-1 bg-[#4ADE80] shadow-[0_0_20px_#4ADE80] z-20"
          />
        )}

        {/* HUD Elements */}
        <div className="absolute inset-0 p-8 flex flex-col justify-between pointer-events-none">
          <div className="flex justify-between">
             <div className="w-10 h-10 border-t-4 border-l-4 border-[#4ADE80] rounded-tl-xl" />
             <div className="w-10 h-10 border-t-4 border-r-4 border-[#4ADE80] rounded-tr-xl" />
          </div>

          <div className="flex flex-col items-center gap-4">
             {isScanning ? (
                <div className="bg-[#4ADE80]/20 backdrop-blur-md px-6 py-2 rounded-full border border-[#4ADE80]/40 flex items-center gap-2">
                   <Zap size={16} className="text-[#4ADE80] animate-pulse" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-[#4ADE80]">AI Scanning...</span>
                </div>
             ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-black/60 backdrop-blur-xl p-6 rounded-3xl border border-white/20 w-full"
                >
                  <h3 className="text-[#4ADE80] font-black text-xl mb-1">{stats.name}</h3>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                     <div>
                        <p className="text-[8px] font-black uppercase text-white/40 tracking-widest">Calories</p>
                        <p className="text-lg font-black text-white">{stats.calories}</p>
                     </div>
                     <div>
                        <p className="text-[8px] font-black uppercase text-white/40 tracking-widest">Benefit</p>
                        <p className="text-lg font-black text-white">{stats.vibe}</p>
                     </div>
                  </div>
                </motion.div>
             )}
          </div>

          <div className="flex justify-between">
             <div className="w-10 h-10 border-b-4 border-l-4 border-[#4ADE80] rounded-bl-xl" />
             <div className="w-10 h-10 border-b-4 border-r-4 border-[#4ADE80] rounded-br-xl" />
          </div>
        </div>
      </div>

      <button 
        onClick={onClose}
        className="mt-8 w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-white tap-effect border border-white/10"
      >
        <X size={32} />
      </button>
    </div>
  );
};

export default FoodScanner;
