import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Calendar, Zap, Camera, Star, Check } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { t } from '../../lib/i18n';
import FoodScanner from '../ui/FoodScanner';
import HoroscopeView from '../../views/Horoscope';

const Onboarding = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [dob, setDob] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const [showHoroscope, setShowHoroscope] = useState(false);
  const { settings, updateSetting } = useSettings();
  const lang = settings.language || 'English';

  const languages = [
    { name: 'English', native: 'English' },
    { name: 'Hindi', native: 'हिन्दी' },
    { name: 'Bengali', native: 'বাংলা' },
    { name: 'Spanish', native: 'Español' },
    { name: 'French', native: 'Français' },
    { name: 'Arabic', native: 'العربية' }
  ];

  const handleLanguageSelect = (l) => {
    updateSetting('language', l);
    setStep(2);
  };

  const handleDobSubmit = () => {
    if (dob) {
      updateSetting('dob', dob);
      setStep(3);
    }
  };

  const steps = {
    1: (
      <div className="flex flex-col gap-8 items-center text-center">
        <div className="p-4 bg-[#16A34A]/10 text-[#4ADE80] rounded-3xl animate-bounce">
          <Globe size={48} />
        </div>
        <div>
          <h1 className="text-3xl font-black text-white mb-2">Welcome to Elite</h1>
          <p className="text-[#6B7280] font-medium">Select your preferred language</p>
        </div>
        <div className="grid grid-cols-2 gap-3 w-full">
          {languages.map(l => (
            <button
              key={l.name}
              onClick={() => handleLanguageSelect(l.name)}
              className="ios-card bg-[#111827] p-5 flex flex-col items-center gap-1 border border-white/5 tap-effect"
            >
              <span className="text-white font-bold">{l.native}</span>
              <span className="text-[10px] uppercase font-black text-[#6B7280] tracking-widest">{l.name}</span>
            </button>
          ))}
        </div>
      </div>
    ),
    2: (
      <div className="flex flex-col gap-8 items-center text-center">
        <div className="p-4 bg-indigo-500/10 text-indigo-400 rounded-3xl">
          <Calendar size={48} />
        </div>
        <div>
          <h1 className="text-3xl font-black text-white mb-2">{t('set_dob', lang)}</h1>
          <p className="text-[#6B7280] font-medium leading-relaxed">We use your birth date to align your daily elite horoscope vibes.</p>
        </div>
        <input 
          type="date" 
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          className="w-full bg-[#111827] border-2 border-[#16A34A]/20 rounded-2xl p-4 text-white font-bold outline-none focus:border-[#4ADE80] transition-colors"
        />
        <button
          onClick={handleDobSubmit}
          disabled={!dob}
          className="w-full py-4 rounded-full bg-[#4ADE80] text-[#0B0F0C] font-black text-sm uppercase tracking-widest shadow-lg tap-effect disabled:opacity-50"
        >
          Continue
        </button>
      </div>
    ),
    3: (
      <div className="flex flex-col gap-8 items-center text-center">
        <div className="p-4 bg-yellow-500/10 text-yellow-400 rounded-3xl">
          <Star size={48} fill="currentColor" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-white mb-2">Elite Setup Complete</h1>
          <p className="text-[#6B7280] font-medium uppercase tracking-[0.2em] text-[10px]">What would you like to do first?</p>
        </div>
        
        <div className="flex flex-col gap-4 w-full">
           <button 
             onClick={() => setShowScanner(true)}
             className="ios-card bg-[var(--card-dark)] p-6 flex items-center gap-4 text-left border border-[#16A34A]/20 tap-effect"
           >
              <div className="p-3 bg-blue-500/10 text-blue-400 rounded-2xl"><Camera size={24} /></div>
              <div>
                 <p className="text-white font-black text-lg">{t('scan_food', lang)}</p>
                 <p className="text-[#6B7280] text-xs font-medium">AI Nutritional Analysis</p>
              </div>
           </button>

           <button 
             onClick={onComplete}
             className="ios-card bg-[var(--card-dark)] p-6 flex items-center gap-4 text-left border border-white/5 tap-effect"
           >
              <div className="p-3 bg-[#16A34A]/10 text-[#4ADE80] rounded-2xl"><Zap size={24} /></div>
              <div>
                 <p className="text-white font-black text-lg">Add Habits</p>
                 <p className="text-[#6B7280] text-xs font-medium">Start your elite journey</p>
              </div>
           </button>

           <button 
             onClick={() => setShowHoroscope(true)}
             className="ios-card bg-[var(--card-dark)] p-6 flex items-center gap-4 text-left border border-indigo-500/20 tap-effect"
           >
              <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-2xl"><Star size={24} /></div>
              <div>
                 <p className="text-white font-black text-lg">{t('your_horoscope', lang)}</p>
                 <p className="text-[#6B7280] text-xs font-medium">Personalized daily vibe</p>
              </div>
           </button>
        </div>
      </div>
    )
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#0B0F0C] p-8 flex flex-col justify-center overflow-y-auto">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="max-w-md mx-auto w-full"
        >
          {steps[step]}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {showScanner && <FoodScanner onClose={() => setShowScanner(false)} />}
        {showHoroscope && <HoroscopeView dob={dob} onClose={() => setShowHoroscope(false)} />}
      </AnimatePresence>
    </div>
  );
};

export default Onboarding;
