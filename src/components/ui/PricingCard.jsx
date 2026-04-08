import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Check, Rocket } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { t } from '../../lib/i18n';

const PricingCard = () => {
  const [billing, setBilling] = useState('monthly'); // 'monthly' or 'yearly'
  const { settings } = useSettings();
  const lang = settings.language || 'English';

  const plan = {
    monthly: { price: '9.99', period: '/mo' },
    yearly: { price: '79.99', period: '/yr', discount: 'Save 30%' }
  };

  const features = [
    'Unlimited Habits',
    'Unlimited Squads',
    'Advanced Heatmaps',
    'Custom Icon Uploads',
    'Priority Cloud Sync'
  ];

  return (
    <div className="ios-card bg-[#111827] p-8 flex flex-col gap-6 border-2 border-[#16A34A]/30 relative overflow-hidden">
      {/* Glow Effect */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#16A34A]/10 blur-[60px] rounded-full" />
      
      <div className="flex flex-col items-center text-center gap-2">
        <div className="p-3 bg-[#16A34A]/20 text-[#4ADE80] rounded-2xl mb-2">
          <Zap size={28} fill="currentColor" />
        </div>
        <h2 className="text-2xl font-black text-[#E5E7EB]">{t('upgrade_elite', lang)}</h2>
        <p className="text-sm text-[#6B7280] font-medium max-w-[200px]">{t('elite_subtitle', lang)}</p>
      </div>

      {/* Toggle */}
      <div className="flex p-1 bg-white/5 rounded-full border border-white/5">
        <button 
          onClick={() => setBilling('monthly')}
          className={`flex-1 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
            billing === 'monthly' ? 'bg-[#16A34A] text-white shadow-lg' : 'text-[#6B7280]'
          }`}
        >
          {t('monthly', lang)}
        </button>
        <button 
          onClick={() => setBilling('yearly')}
          className={`flex-1 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all relative ${
            billing === 'yearly' ? 'bg-[#16A34A] text-white shadow-lg' : 'text-[#6B7280]'
          }`}
        >
          {t('yearly', lang)}
          {billing !== 'yearly' && (
             <span className="absolute -top-1 -right-1 px-2 py-0.5 bg-orange-500 text-[8px] rounded-full text-white">-30%</span>
          )}
        </button>
      </div>

      <div className="flex justify-center items-baseline gap-1">
        <span className="text-4xl font-black text-[#E5E7EB]">${plan[billing].price}</span>
        <span className="text-sm font-bold text-[#6B7280]">{plan[billing].period}</span>
      </div>

      <div className="flex flex-col gap-3 my-2">
        {features.map((f, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-[#16A34A]/20 flex items-center justify-center text-[#4ADE80]">
              <Check size={12} strokeWidth={4} />
            </div>
            <span className="text-xs font-bold text-[#9CA3AF]">{f}</span>
          </div>
        ))}
      </div>

      <button className="w-full py-4 rounded-full bg-gradient-to-r from-[#16A34A] to-[#4ADE80] text-[#0B0F0C] font-black text-sm uppercase tracking-[0.2em] shadow-[0_15px_40px_rgba(22,163,74,0.3)] tap-effect flex items-center justify-center gap-2">
        <Rocket size={18} />
        {t('get_started', lang)}
      </button>

      <p className="text-[10px] text-center text-[#4B5563] font-medium italic">Cancel anytime. No questions asked.</p>
    </div>
  );
};

export default PricingCard;
