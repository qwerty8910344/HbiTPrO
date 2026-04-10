import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Zap, Crown, Star } from 'lucide-react';

const PricingModal = ({ isOpen, onClose, onSelect }) => {
  if (!isOpen) return null;

  const plans = [
    {
      id: 'monthly',
      name: 'Monthly Elite',
      price: '$9',
      period: 'per month',
      description: 'Ideal for focus sprints and shorter goals.',
      features: ['Full Calo AI access', 'Deep Focus settings', 'Unlimited habits', 'Priority support'],
      color: 'bg-[#111827]',
      border: 'border-white/10'
    },
    {
      id: 'yearly',
      name: 'Yearly Legend',
      price: '$79',
      period: 'per year',
      description: 'The ultimate path to long-term mastery.',
      features: ['Everything in Monthly', '27% Discount included', 'Exclusive 3D themes', 'Early access features'],
      color: 'bg-gradient-to-br from-[#16A34A] to-[#111827]',
      border: 'border-[#4ADE80]/30',
      popular: true
    }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-[420px] bg-[#0B0F0C] rounded-[40px] border border-white/10 shadow-2xl overflow-hidden flex flex-col pt-8"
        >
          {/* Header */}
          <div className="px-8 mb-8 text-center relative">
             <button onClick={onClose} className="absolute top-0 right-8 p-2 bg-white/5 rounded-full tap-effect text-[#6B7280]">
               <X size={18} strokeWidth={3} />
             </button>
             <div className="w-16 h-16 bg-gradient-to-tr from-[#16A34A] to-[#4ADE80] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(22,163,74,0.3)]">
                <Crown size={32} className="text-white fill-white/20" />
             </div>
             <h2 className="text-3xl font-black text-white tracking-tight">Upgrade to Elite</h2>
             <p className="text-[#6B7280] text-sm mt-2 font-medium">14-day free trial included with all plans</p>
          </div>

          {/* Pricing Cards */}
          <div className="flex-1 overflow-y-auto px-6 pb-24 space-y-4 no-scrollbar">
             {plans.map((plan) => (
                <motion.div 
                   key={plan.id}
                   whileHover={{ scale: 1.02 }}
                   className={`p-6 rounded-[32px] border ${plan.border} ${plan.color} relative overflow-hidden tap-effect cursor-pointer group`}
                   onClick={() => onSelect(plan.id)}
                >
                   {plan.popular && (
                      <div className="absolute top-0 right-0 bg-[#4ADE80] text-[#0B0F0C] text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-bl-2xl flex items-center gap-1">
                         <Star size={10} fill="currentColor" /> Best Value
                      </div>
                   )}
                   
                   <div className="flex justify-between items-start mb-4">
                      <div>
                         <h4 className="text-xl font-black text-white">{plan.name}</h4>
                         <p className="text-[#6B7280] text-xs font-bold leading-relaxed pr-8">{plan.description}</p>
                      </div>
                      <div className="text-right">
                         <p className="text-3xl font-black text-[#4ADE80]">{plan.price}</p>
                         <p className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest">{plan.period}</p>
                      </div>
                   </div>

                   <div className="space-y-2 mb-6">
                      {plan.features.map((feature, idx) => (
                         <div key={idx} className="flex items-center gap-2 text-xs font-bold text-white/70">
                            <Check size={14} className="text-[#4ADE80]" strokeWidth={3} />
                            {feature}
                         </div>
                      ))}
                   </div>

                   <button className="w-full py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-sm uppercase tracking-widest group-hover:bg-[#16A34A] group-hover:border-[#4ADE80] group-hover:text-white transition-all">
                      Start 14-Day Free Trial
                   </button>
                </motion.div>
             ))}
          </div>

          {/* Bottom Banner */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#0B0F0C] via-[#0B0F0C]/90 to-transparent">
             <p className="text-[10px] text-center text-[#6B7280] font-bold">Secure checkout with Stripe. Cancel anytime.</p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PricingModal;
