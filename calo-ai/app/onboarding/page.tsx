'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Target, Scale, Ruler, User as UserIcon, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const router = useRouter();
  const [data, setData] = useState({
    language: 'english',
    dob: '1998-05-24',
    gender: 'male',
    age: '26',
    weight: '70',
    height: '175',
    goal: 'lose',
  });

  const nextStep = () => {
    if (step < 6) setStep(step + 1);
    else finish();
  };

  const finish = async () => {
    const w = parseFloat(data.weight);
    const h = parseFloat(data.height);
    const a = parseFloat(data.age);
    let bmr = (10 * w) + (6.25 * h) - (5 * a);
    bmr = data.gender === 'male' ? bmr + 5 : bmr - 161;
    
    let tdee = bmr * 1.2;
    if (data.goal === 'lose') tdee -= 500;
    if (data.goal === 'gain') tdee += 500;

    const calorieTarget = Math.round(tdee);
    localStorage.setItem('calo_target', calorieTarget.toString());
    localStorage.setItem('calo_profile', JSON.stringify(data));

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await supabase.from('users').upsert({
          id: session.user.id,
          age: a,
          weight: w,
          height: h,
          gender: data.gender,
          goal: data.goal,
          calorie_target: calorieTarget,
        });
      }
    } catch (e) {
      console.log("Supabase save failed");
    }

    router.push('/');
  };

  const languages = [
    { id: 'english', label: 'English', sub: 'Global' },
    { id: 'hindi', label: 'हिन्दी', sub: 'India' },
    { id: 'spanish', label: 'Español', sub: 'Spain' },
    { id: 'french', label: 'Français', sub: 'France' },
    { id: 'bengali', label: 'বাংলা', sub: 'Bangladesh' },
    { id: 'arabic', label: 'العربية', sub: 'Middle East', rtl: true }
  ];

  return (
    <main className={`min-h-screen bg-[#020617] text-slate-200 relative overflow-hidden flex flex-col ${data.language === 'arabic' ? 'rtl' : ''}`}>
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] opacity-20 animate-pulse" />
      <div className="absolute bottom-[-5%] left-[-10%] w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] opacity-20" />

      <div className="px-8 pt-16 flex items-center justify-between z-10 sticky top-0 bg-[#020617]/50 backdrop-blur-md pb-4">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Sparkles size={20} className="text-white" />
           </div>
           <span className="font-black text-white uppercase tracking-[0.3em] text-[10px]">Calo AI</span>
        </div>
        <div className="flex gap-2">
          {[1,2,3,4,5,6].map(s => (
            <div key={s} className={`h-1.5 rounded-full transition-all duration-500 ${step >= s ? 'w-6 bg-emerald-500' : 'w-2 bg-white/5'}`} />
          ))}
        </div>
      </div>

      <div className="flex-1 px-8 pt-12 flex flex-col z-10 no-scrollbar overflow-y-auto">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="stepL" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} className="space-y-10">
               <div className="text-center">
                  <h2 className="text-5xl font-black text-white leading-tight mb-4">Choose your <span className="text-neon">Voice.</span></h2>
                  <p className="text-gray-500 font-bold text-lg">Pick the language you vibe with most.</p>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  {languages.map(lang => (
                    <button 
                      key={lang.id} 
                      onClick={() => setData({...data, language: lang.id})}
                      className={`p-6 rounded-[2.5rem] text-left border-2 transition-all active:scale-95 ${data.language === lang.id ? 'bg-emerald-500/10 border-emerald-500' : 'bg-white/5 border-white/5'}`}
                    >
                       <span className="block font-black text-white text-lg">{lang.label}</span>
                       <span className={`text-[8px] font-black uppercase mt-1 tracking-widest ${data.language === lang.id ? 'text-emerald-400' : 'text-gray-500'}`}>{lang.sub}</span>
                    </button>
                  ))}
               </div>
            </motion.div>
          )}

          {step === 2 && (
             <motion.div key="stepD" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-10">
               <div className="text-center">
                  <h2 className="text-5xl font-black text-white leading-tight mb-4">When's the <span className="text-gold">Big Day?</span></h2>
                  <p className="text-gray-500 font-bold text-lg">Your DOB unlocks daily horoscope vibes.</p>
               </div>
               <div className="bg-white/5 p-10 rounded-[3rem] border border-white/10 shadow-inner flex flex-col items-center">
                  <input 
                    type="date" 
                    value={data.dob}
                    onChange={(e) => setData({...data, dob: e.target.value})}
                    className="bg-transparent text-4xl font-black text-white outline-none w-full text-center"
                  />
                  <div className="mt-8 flex items-center justify-center gap-2 text-gold">
                    <Sparkles size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest leading-none">Your Zodiac is and will be {getZodiacSign(data.dob)?.name}</span>
                  </div>
               </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="stepG" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-10">
              <div className="text-center">
                <h2 className="text-5xl font-black text-white leading-tight mb-4">Base Stats, <span className="text-emerald-400">Champ!</span></h2>
                <p className="text-gray-500 font-bold text-lg">Pick your gender for precise calculations.</p>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <SelectButton active={data.gender === 'male'} onClick={() => setData({...data, gender: 'male'})} label="Male" />
                <SelectButton active={data.gender === 'female'} onClick={() => setData({...data, gender: 'female'})} label="Female" />
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="stepS" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-10">
               <div className="text-center">
                  <h2 className="text-5xl font-black text-white leading-tight mb-4">The <span className="text-neon">Specs.</span></h2>
                  <p className="text-gray-500 font-bold text-lg text-center">Help Alisha calculate your daily burn.</p>
               </div>
               <div className="space-y-4">
                  <InputBox icon={UserIcon} placeholder="Age" unit="Yrs" value={data.age} onChange={(v: string) => setData({...data, age: v})} />
                  <InputBox icon={Scale} placeholder="Weight" unit="Kg" value={data.weight} onChange={(v: string) => setData({...data, weight: v})} />
                  <InputBox icon={Ruler} placeholder="Height" unit="Cm" value={data.height} onChange={(v: string) => setData({...data, height: v})} />
               </div>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div key="stepM" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
              <div className="text-center">
                <h2 className="text-5xl font-black text-white leading-tight mb-4">What's the <span className="text-rose-500">Mission?</span></h2>
                <p className="text-gray-500 font-bold text-lg">Select your primary transformation goal.</p>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <SelectButton active={data.goal === 'lose'} onClick={() => setData({...data, goal: 'lose'})} label="Shred Weight" sublabel="Fat loss and definition" />
                <SelectButton active={data.goal === 'maintain'} onClick={() => setData({...data, goal: 'maintain'})} label="Stay Elite" sublabel="Maintain current performance" />
                <SelectButton active={data.goal === 'gain'} onClick={() => setData({...data, goal: 'gain'})} label="Bulk & Power" sublabel="Muscle gain and strength" />
              </div>
            </motion.div>
          )}

          {step === 6 && (
             <motion.div key="stepR" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="flex-1 flex flex-col items-center justify-center text-center space-y-12">
               <div className="w-40 h-40 bg-emerald-500 rounded-[4rem] flex items-center justify-center shadow-[0_0_50px_rgba(74,222,128,0.3)] border-4 border-white/10 relative">
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 8, ease: "linear" }} className="absolute inset-0 border-4 border-dashed border-white/20 rounded-[4rem]" />
                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="text-white relative z-10">
                     <Sparkles size={64} />
                  </motion.div>
               </div>
               <div>
                  <h2 className="text-5xl font-black text-white leading-tight mb-6">Born to <span className="text-neon">Win.</span></h2>
                  <p className="text-gray-500 font-bold text-xl leading-relaxed">Alisha has calibrated your engine.<br/>Time to start the streak!</p>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-8 pb-16 flex flex-col gap-4 bg-gradient-to-t from-[#020617] via-[#020617] to-transparent">
        <button onClick={nextStep} className="w-full btn-dopamine py-6 text-xl flex items-center justify-center gap-3 active:scale-95 transition-all">
          {step === 6 ? "ENTER CALO AI" : "NEXT STEP"}
          <ChevronRight size={24} />
        </button>
        <p className="text-center text-[10px] font-black text-gray-700 uppercase tracking-widest">Premium AI Experience • Step {step}/6</p>
      </div>
    </main>
  );
}

function SelectButton({ active, onClick, label, sublabel }: any) {
  return (
    <button onClick={onClick} className={`p-8 rounded-[3rem] text-left transition-all border-2 flex flex-col gap-2 relative overflow-hidden group active:scale-[0.98] ${active ? 'bg-emerald-500/10 border-emerald-500 shadow-[0_0_20px_rgba(74,222,128,0.2)]' : 'bg-white/5 border-white/5'}`}>
      <div className="flex justify-between items-center w-full relative z-10">
        <span className={`text-2xl font-black ${active ? 'text-white' : 'text-gray-400'}`}>{label}</span>
        {active && <div className="w-4 h-4 bg-emerald-500 rounded-full shadow-[0_0_10px_#4ade80]" />}
      </div>
      {sublabel && <span className={`text-[10px] font-black uppercase tracking-[0.1em] relative z-10 ${active ? 'text-emerald-400' : 'text-gray-600'}`}>{sublabel}</span>}
      <div className={`absolute bottom-0 right-0 w-32 h-32 blur-3xl rounded-full transition-all duration-700 ${active ? 'bg-emerald-500/20 translate-x-10 translate-y-10' : 'bg-transparent'}`} />
    </button>
  );
}

function InputBox({ icon: Icon, placeholder, unit, value, onChange }: any) {
  return (
    <div className="bg-white/5 p-8 rounded-[3rem] flex items-center gap-6 border-2 border-transparent focus-within:border-emerald-500/30 transition-all shadow-inner group">
      <div className="p-4 bg-white/5 rounded-2xl group-focus-within:bg-emerald-500/10 transition-colors"><Icon size={24} className="text-gray-500 group-focus-within:text-emerald-400 transition-colors" /></div>
      <div className="flex-1 flex flex-col">
         <span className="text-[8px] font-black uppercase tracking-[0.3em] text-gray-600 mb-1">{placeholder}</span>
         <input type="number" value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-transparent text-3xl font-black text-white outline-none placeholder:text-gray-800" />
      </div>
      <span className="font-black text-gray-700 uppercase tracking-widest text-xs">{unit}</span>
    </div>
  );
}

function getZodiacSign(dob: string) {
  const date = new Date(dob);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const signs = [
    { name: 'Capricorn', icon: '♑', color: 'text-gray-500' },
    { name: 'Aquarius', icon: '♒', color: 'text-blue-400' },
    { name: 'Pisces', icon: '♓', color: 'text-emerald-300' },
    { name: 'Aries', icon: '♈', color: 'text-rose-500' },
    { name: 'Taurus', icon: '♉', color: 'text-emerald-500' },
    { name: 'Gemini', icon: '♊', color: 'text-yellow-400' },
    { name: 'Cancer', icon: '♋', color: 'text-blue-500' },
    { name: 'Leo', icon: '♌', color: 'text-orange-500' },
    { name: 'Virgo', icon: '♍', color: 'text-gray-400' },
    { name: 'Libra', icon: '♎', color: 'text-emerald-400' },
    { name: 'Scorpio', icon: '♏', color: 'text-rose-700' },
    { name: 'Sagittarius', icon: '♐', color: 'text-purple-500' }
  ];
  const boundaries = [20, 19, 21, 20, 21, 21, 23, 23, 23, 23, 22, 22];
  let res = month - (day < boundaries[month - 1] ? 1 : 0);
  if (res < 0) res = 11;
  return signs[res % 12];
}
