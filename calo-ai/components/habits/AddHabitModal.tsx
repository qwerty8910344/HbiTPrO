'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BellOff, Timer, Clock, Palette } from 'lucide-react';

const EMOJIS = ['💧', '🏃‍♀️', '🧘‍♀️', '🍎', '💤', '📚', '💰', '🏋️', '🧠', '🌿'];
const COLORS = ['#4ADE80', '#F97316', '#2563EB', '#A855F7', '#EC4899', '#EF4444'];
const FREQUENCIES = ['Daily', 'Weekly', 'Custom'];
const DAYS = [
  { id: 'sun', label: 'S' }, { id: 'mon', label: 'M' }, { id: 'tue', label: 'T' },
  { id: 'wed', label: 'W' }, { id: 'thu', label: 'T' }, { id: 'fri', label: 'F' }, { id: 'sat', label: 'S' }
];

interface AddHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (habit: any) => void;
}

const AddHabitModal = ({ isOpen, onClose, onAdd }: AddHabitModalProps) => {
  const [title, setTitle] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('💧');
  const [customEmoji, setCustomEmoji] = useState('');
  const [selectedColor, setSelectedColor] = useState('#4ADE80');
  const [frequency, setFrequency] = useState('Daily');
  const [scheduleDays, setScheduleDays] = useState<string[]>([]);
  
  const [reminderType, setReminderType] = useState('none');
  const [reminderValue, setReminderValue] = useState('');

  const toggleDay = (dayId: string) => {
    if (scheduleDays.includes(dayId)) {
      setScheduleDays(scheduleDays.filter(d => d !== dayId));
    } else {
      setScheduleDays([...scheduleDays, dayId]);
    }
  };

  const handleCreate = () => {
    if (!title.trim()) return;
    const finalEmoji = customEmoji.trim() || selectedEmoji;
    
    onAdd({
      title,
      icon: finalEmoji,
      color: selectedColor,
      current: 0,
      total: 1,
      unit: 'times',
      streak: 0,
      completed: false,
      category: 'Health',
      schedule_type: frequency.toLowerCase(),
      schedule_days: frequency === 'Custom' ? scheduleDays : [],
      reminder_type: reminderType,
      reminder_value: reminderValue
    });

    // Reset
    setTitle('');
    setCustomEmoji('');
    setFrequency('Daily');
    setScheduleDays([]);
    setReminderType('none');
    setReminderValue('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[150]"
          />

          <motion.div 
            initial={{ y: '100%' }} 
            animate={{ y: 0 }} 
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 max-w-xl mx-auto h-[90vh] bg-[#020617] rounded-t-[3.5rem] border-t border-white/10 shadow-[0_-20px_80px_rgba(0,0,0,0.8)] z-[160] overflow-hidden flex flex-col"
          >
            {/* Drag Bar */}
            <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mt-4 mb-6" />

            <div className="flex justify-between items-center px-8 mb-8">
              <h2 className="text-3xl font-black tracking-tight text-white">Create habit</h2>
              <button onClick={onClose} className="p-3 bg-white/5 rounded-2xl text-gray-400 active:scale-90 transition-transform">
                <X size={24} strokeWidth={3} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-8 pb-32 no-scrollbar space-y-10">
              
              {/* Identity Section */}
              <div className="space-y-6">
                <div className="flex flex-wrap gap-4">
                  {EMOJIS.slice(0, 7).map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => { setSelectedEmoji(emoji); setCustomEmoji(''); }}
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl transition-all tap-effect relative ${
                        selectedEmoji === emoji && !customEmoji 
                          ? 'bg-emerald-500 scale-110 shadow-[0_0_20px_rgba(16,185,129,0.4)] border-2 border-emerald-300/40' 
                          : 'bg-white/5 border border-white/5 hover:bg-white/10'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                  <div className="flex items-center gap-3 bg-white/5 p-2 rounded-2xl border border-white/5 min-w-[120px]">
                     <div className="w-10 h-10 rounded-xl bg-black/40 flex items-center justify-center text-xl">{customEmoji || '🎨'}</div>
                     <input
                       type="text"
                       placeholder="..."
                       value={customEmoji}
                       onChange={(e) => setCustomEmoji(e.target.value)}
                       className="w-12 bg-transparent text-white font-black text-center outline-none"
                       maxLength={2}
                     />
                  </div>
                </div>

                <div className="flex gap-3">
                   {COLORS.map(c => (
                     <button 
                       key={c}
                       onClick={() => setSelectedColor(c)}
                       className={`w-8 h-8 rounded-full border-4 transition-all ${selectedColor === c ? 'border-white scale-125' : 'border-transparent opacity-60'}`}
                       style={{ backgroundColor: c }}
                     />
                   ))}
                </div>
              </div>

              {/* Input Section */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">HABIT NAME</label>
                <input 
                  type="text"
                  placeholder="e.g. Read for 30 mins"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-white/5 px-8 py-5 rounded-3xl font-bold text-xl text-white outline-none placeholder:text-gray-700 border border-white/5 focus:border-emerald-500/30 transition-all"
                />
              </div>

              {/* Schedule Section */}
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">COMMITMENT</label>
                <div className="flex gap-2 p-2 bg-white/5 rounded-3xl border border-white/5">
                  {FREQUENCIES.map((freq) => (
                    <button
                      key={freq}
                      onClick={() => setFrequency(freq)}
                      className={`flex-1 py-4 rounded-2xl font-black text-xs tracking-widest transition-all ${
                        frequency === freq 
                          ? 'bg-emerald-500 text-white shadow-xl' 
                          : 'text-gray-500 hover:text-white'
                      }`}
                    >
                      {freq.toUpperCase()}
                    </button>
                  ))}
                </div>
                
                <AnimatePresence>
                  {frequency === 'Custom' && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="flex justify-between gap-2 p-5 bg-white/5 rounded-3xl border border-white/5">
                        {DAYS.map(day => (
                          <button
                            key={day.id}
                            onClick={() => toggleDay(day.id)}
                            className={`w-12 h-12 rounded-2xl font-black text-sm transition-all border ${
                              scheduleDays.includes(day.id) 
                                ? 'bg-emerald-500 border-emerald-400 text-white' 
                                : 'bg-black/40 border-white/5 text-gray-600'
                            }`}
                          >
                            {day.label}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Notification Section */}
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">ALERTS</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'none', icon: BellOff, label: 'SILENT' },
                    { id: 'interval', icon: Timer, label: 'REPEAT' },
                    { id: 'time', icon: Clock, label: 'EXACT' }
                  ].map(type => (
                    <button 
                      key={type.id}
                      onClick={() => setReminderType(type.id)} 
                      className={`py-6 rounded-3xl flex flex-col items-center gap-3 border-2 transition-all ${
                        reminderType === type.id 
                          ? 'bg-emerald-500 border-emerald-400 text-white shadow-xl' 
                          : 'bg-white/5 border-white/5 text-gray-600'
                      }`}
                    >
                      <type.icon size={24} /> 
                      <span className="text-[9px] font-black tracking-widest">{type.label}</span>
                    </button>
                  ))}
                </div>

                <AnimatePresence>
                  {reminderType === 'interval' && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="bg-white/5 p-6 rounded-3xl flex items-center justify-between border border-white/5">
                         <span className="text-sm font-black text-gray-400 uppercase tracking-widest">Every...</span>
                         <div className="flex items-center gap-3">
                           <input type="number" min="1" max="24" value={reminderValue} onChange={(e) => setReminderValue(e.target.value)} placeholder="1" className="w-20 bg-black/40 py-3 rounded-2xl text-center font-black text-white outline-none border border-white/10" />
                           <span className="text-[9px] font-black text-gray-600 tracking-widest uppercase">HOURS</span>
                         </div>
                      </div>
                    </motion.div>
                  )}
                  {reminderType === 'time' && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="bg-white/5 p-6 rounded-3xl flex items-center justify-between border border-white/5">
                         <span className="text-sm font-black text-gray-400 uppercase tracking-widest">Exactly at...</span>
                         <input type="time" value={reminderValue} onChange={(e) => setReminderValue(e.target.value)} className="bg-black/40 px-6 py-3 rounded-2xl text-center font-black text-white outline-none border border-white/10" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Bottom Button */}
            <div className="p-8 bg-gradient-to-t from-[#020617] via-[#020617] to-transparent sticky bottom-0">
              <button 
                onClick={handleCreate}
                className="w-full py-6 rounded-[2.5rem] bg-emerald-500 text-white font-black text-xl tracking-widest shadow-[0_20px_50px_rgba(16,185,129,0.3)] active:scale-95 transition-all border-b-4 border-emerald-700"
              >
                UNLEASH HABIT
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AddHabitModal;
