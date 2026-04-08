'use client';

import { useState, useRef } from 'react';
import { Camera, Upload, X, Loader2, Sparkles, CheckCircle2, Plus } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { triggerXp } from '@/components/XpNotification';
import { caloClient } from '@/lib/supabase';
import confetti from 'canvas-confetti';

export default function ScanPage() {
  const { settings, addXP } = useApp();
  const [image, setImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [showReward, setShowReward] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        if (loadEvent.target?.result) {
          setImage(loadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const startScan = async () => {
    if (!image) return;
    setIsScanning(true);
    
    try {
      const response = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image }),
      });
      
      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setScanResult({
        food_items: data.food_items,
        calories: data.calories,
        macros: { p: data.protein, c: data.carbs, f: data.fat, fi: data.fiber },
        score: data.score,
        advice: data.advice,
        image_url: image
      });
    } catch (err) {
      alert("Failed to scan: " + err);
    } finally {
      setIsScanning(false);
    }
  };

  const logMeal = async () => {
    if (!scanResult) return;
    
    // Dopamine Hit Trigger + Confetti Skill
    setShowReward(true);
    addXP(15);
    triggerXp(15, 'Meal Logged');
    confetti({
      particleCount: 100,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#2563eb', '#60a5fa', '#ffffff']
    });
    setTimeout(() => setShowReward(false), 500);

    try {
      // Save logic (LocalStorage + Supabase)
      const history = JSON.parse(localStorage.getItem('calo_history') || '[]');
      localStorage.setItem('calo_history', JSON.stringify([{...scanResult, created_at: new Date().toISOString()}, ...history]));

      const { data: { session } } = await caloClient.auth.getSession();
      if (session) {
        await caloClient.from('meals').insert({
          user_id: session.user.id,
          food_items: scanResult.food_items,
          calories: scanResult.calories,
          protein: scanResult.macros.p,
          carbs: scanResult.macros.c,
          fat: scanResult.macros.f,
          fiber: scanResult.macros.fi,
          meal_score: scanResult.score,
          advice: scanResult.advice,
          image_url: scanResult.image_url
        });
      }
      
      setTimeout(() => resetBatch(), 300);
    } catch (err) {
      console.error("Save error:", err);
      setTimeout(() => resetBatch(), 300);
    }
  };

  const resetBatch = () => {
    setImage(null);
    setScanResult(null);
  };

  return (
    <main className="min-h-screen bg-[#020617] text-white relative flex flex-col items-center">
      {/* Reward Flash Overlay */}
      {showReward && <div className="reward-flash-overlay" />}

      {/* Header */}
      <div className="w-full px-6 pt-12 pb-6 flex justify-between items-center z-10 sticky top-0 bg-[#020617]/50 backdrop-blur-md">
        <button onClick={resetBatch} className="p-3 bg-white/5 rounded-2xl backdrop-blur-md border border-white/5 active:scale-90 transition-transform">
          <X size={20} />
        </button>
        <span className="font-black uppercase tracking-[0.3em] text-[10px] text-[var(--ai)] drop-shadow-[0_0_8px_rgba(37,99,235,0.4)]">AI SMART SCANNER</span>
        <div className="w-10 h-10 rounded-2xl bg-white/5" />
      </div>

      {image ? (
        <div className="flex-1 w-full relative group overflow-hidden">
          <img src={image} className="w-full h-full object-cover grayscale-[0.2]" alt="To scan" />
          
          {/* Trust Blue Scan Line */}
          {isScanning && (
            <motion.div 
              initial={{ top: '0%' }}
              animate={{ top: '100%' }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute left-0 right-0 h-1 bg-[var(--ai)] shadow-[0_0_30px_#2563eb] z-20"
            />
          )}

          <AnimatePresence>
            {!isScanning && !scanResult && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="absolute bottom-12 left-0 right-0 px-8 flex justify-center"
              >
                <button 
                  onClick={startScan}
                  className="w-full btn-dopamine text-xl flex items-center justify-center gap-3"
                >
                  <Sparkles size={24} />
                  CALCULATE MACROS
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center px-12 text-center gap-10">
          <div className="w-32 h-32 bg-[var(--ai)]/10 rounded-[3rem] flex items-center justify-center border-2 border-dashed border-[var(--ai)]/30 relative animate-pulse">
             <Camera size={48} className="text-[var(--ai)]" />
             <div className="absolute -top-2 -right-2 bg-[var(--action)] p-2.5 rounded-full shadow-lg shadow-orange-500/20">
                <Plus size={16} className="text-white" />
             </div>
          </div>
          <div>
            <h2 className="text-3xl font-black mb-3 leading-tight text-white">Snap & Track <br/><span className="text-neon">Instantly.</span></h2>
            <p className="text-gray-500 font-bold text-sm">Our AI detects your meal profile in seconds with 98% accuracy.</p>
          </div>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="px-12 py-5 bg-white text-gray-950 rounded-full font-black flex items-center gap-3 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]"
          >
            <Upload size={20} />
            GALLERY
          </button>
          <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
        </div>
      )}

      {/* Result Overlay */}
      <AnimatePresence>
        {scanResult && (
          <motion.div 
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            className="absolute inset-0 z-50 bg-[#020617] flex flex-col"
          >
            <div className="p-8 pb-32 flex-1 overflow-y-auto no-scrollbar">
              <div className="flex justify-between items-start mb-8 mt-8">
                <div>
                   <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--primary)] bg-[var(--primary)]/10 px-4 py-2 rounded-full mb-4 inline-block italic">Analysis Complete</span>
                   <h2 className="text-4xl font-black text-white leading-tight">It's a Go! 🥗</h2>
                </div>
                <button onClick={resetBatch} className="p-3 bg-white/5 rounded-2xl border border-white/5"><X size={20} /></button>
              </div>

              <div className="ios-card bg-emerald-500/10 border-emerald-500/20 mb-8 flex justify-between items-center group overflow-hidden">
                 <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-shimmer" />
                 <div>
                    <span className="text-6xl font-black text-neon drop-shadow-[0_0_15px_rgba(74,222,128,0.5)]">{scanResult.calories}</span>
                    <span className="text-[10px] font-black text-emerald-400 ml-2 uppercase tracking-[0.2em]">KCAL</span>
                 </div>
                 <div className="bg-white/5 p-4 rounded-3xl border border-white/10 text-center min-w-[80px]">
                    <span className="block text-[8px] font-black uppercase text-gray-500 mb-1">Score</span>
                    <span className="text-xl font-black text-neon">{scanResult.score}/10</span>
                 </div>
              </div>

              <div className="space-y-6">
                 <div className="grid grid-cols-2 gap-4">
                    <MacroStat label="Protein" value={scanResult.macros.p} unit="g" color="text-neon" />
                    <MacroStat label="Carbs" value={scanResult.macros.c} unit="g" color="text-action" />
                    <MacroStat label="Fats" value={scanResult.macros.f} unit="g" color="text-rose-500" />
                    <MacroStat label="Fiber" value={scanResult.macros.fi} unit="g" color="text-blue-500" />
                 </div>
              </div>

              <div className="mt-10">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-6">Components Found</h3>
                <div className="grid grid-cols-1 gap-3">
                  {scanResult.food_items.map((item: string) => (
                    <div key={item} className="p-5 bg-white/5 rounded-3xl font-black text-white flex items-center gap-4 border border-white/5 shadow-inner">
                      <div className="w-8 h-8 bg-emerald-500/20 rounded-xl flex items-center justify-center text-neon">
                        <CheckCircle2 size={16} />
                      </div>
                      <span className="uppercase text-xs tracking-widest">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="absolute bottom-0 inset-x-0 p-8 pt-12 bg-gradient-to-t from-[#020617] via-[#020617] to-transparent">
               <button onClick={logMeal} className="w-full btn-dopamine flex items-center justify-center gap-3 group">
                  LOG TO DASHBOARD
                  <motion.div animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                     <ChevronRight size={20} />
                  </motion.div>
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!scanResult && <Navigation />}
    </main>
  );
}

function MacroStat({ label, value, unit, color }: { label: string, value: number, unit: string, color: string }) {
  return (
    <div className="ios-card bg-white/5 border-white/5 flex flex-col gap-1 p-5">
       <span className="block text-[8px] font-black uppercase text-gray-500 tracking-widest">{label}</span>
       <span className={`text-xl font-extrabold ${color}`}>{value}{unit}</span>
    </div>
  );
}

function ChevronRight({ size, className = "" }: { size: number, className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m9 18 6-6-6-6"/>
    </svg>
  );
}
