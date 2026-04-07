import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BellOff, Timer, Clock } from 'lucide-react';

const EMOJIS = ['💧', '🏃‍♀️', '🧘‍♀️', '🍎', '💤', '📚', '💰', '🏋️'];
const FREQUENCIES = ['Daily', 'Weekly', 'Custom'];
const DAYS = [
  { id: 'sun', label: 'S' }, { id: 'mon', label: 'M' }, { id: 'tue', label: 'T' },
  { id: 'wed', label: 'W' }, { id: 'thu', label: 'T' }, { id: 'fri', label: 'F' }, { id: 'sat', label: 'S' }
];

const AddHabitModal = ({ isOpen, onClose, onAdd }) => {
  const [title, setTitle] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('💧');
  const [customEmoji, setCustomEmoji] = useState('');
  const [frequency, setFrequency] = useState('Daily');
  const [scheduleDays, setScheduleDays] = useState([]);
  
  const [reminderType, setReminderType] = useState('none');
  const [reminderValue, setReminderValue] = useState('');

  if (!isOpen) return null;

  const toggleDay = (dayId) => {
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
      id: Date.now(),
      title,
      icon: finalEmoji,
      color: 'var(--habit-green)',
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
          {/* Dimmed Background */}
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150]"
          />

          {/* Modal */}
          <motion.div 
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300, mass: 0.8 }}
            className="fixed bottom-0 left-0 right-0 max-w-[430px] m-auto h-[85vh] bg-[#111827]/95 backdrop-blur-[40px] rounded-t-[40px] border-t border-white/6 shadow-[0_-10px_60px_rgba(0,0,0,0.4)] z-[160] overflow-hidden flex flex-col pt-2"
          >
            {/* Drag Handle */}
            <div className="w-16 h-1.5 bg-white/10 rounded-full mx-auto mb-4" />

            <div className="flex justify-between items-center px-8 mb-6 shrink-0">
              <h2 className="text-3xl font-black tracking-tight text-[#4ADE80]">New Habit</h2>
              <button onClick={onClose} className="p-2 bg-white/5 rounded-full tap-effect text-[#6B7280]">
                <X size={20} strokeWidth={3} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-8 pb-32 no-scrollbar flex flex-col gap-8">
              
              {/* Emoji Picker */}
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-[#6B7280] mb-3 block">Choose Icon</label>
                <div className="flex flex-wrap gap-3 mb-3">
                  {EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => { setSelectedEmoji(emoji); setCustomEmoji(''); }}
                      className={`w-14 h-14 rounded-full flex items-center justify-center text-3xl transition-all tap-effect shadow-sm relative ${
                        selectedEmoji === emoji && !customEmoji 
                          ? 'bg-gradient-to-br from-[#16A34A] to-[#4ADE80] shadow-lg scale-110 border-2 border-[#4ADE80]/40' 
                          : 'bg-white/5 border border-white/10 hover:bg-white/10'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-3 bg-white/5 p-3 rounded-[20px] shadow-inner border border-white/5">
                   <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-xl">{customEmoji || '🎨'}</div>
                   <input
                     type="text"
                     placeholder="Or type a custom emoji..."
                     value={customEmoji}
                     onChange={(e) => setCustomEmoji(e.target.value)}
                     className="flex-1 bg-transparent text-[#E5E7EB] outline-none placeholder:text-[#6B7280]"
                     maxLength={2}
                   />
                </div>
              </div>

              {/* Habit Name */}
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-[#6B7280] mb-3 block">Habit Name</label>
                <input 
                  type="text"
                  placeholder="E.g., Morning Meditation"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-white/5 px-6 py-4 rounded-[20px] font-bold text-lg text-[#E5E7EB] outline-none placeholder:text-[#6B7280] shadow-[inset_0_2px_8px_rgba(0,0,0,0.2)] border border-white/6 focus:border-[#16A34A]/40"
                />
              </div>

              {/* Frequency Selector */}
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-[#6B7280] mb-3 block">Schedule</label>
                <div className="flex gap-2 p-1.5 bg-white/5 rounded-full shadow-[inset_0_2px_8px_rgba(0,0,0,0.2)] border border-white/6 mb-4">
                  {FREQUENCIES.map((freq) => (
                    <button
                      key={freq}
                      onClick={() => setFrequency(freq)}
                      className={`flex-1 py-3 px-4 rounded-full font-black text-sm tracking-wide transition-all tap-effect ${
                        frequency === freq 
                          ? 'bg-[#16A34A] text-white shadow-sm' 
                          : 'text-[#6B7280] hover:text-[#E5E7EB]'
                      }`}
                    >
                      {freq}
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
                      <div className="flex justify-between gap-2 p-4 bg-white/5 rounded-[20px] border border-white/10">
                        {DAYS.map(day => (
                          <button
                            key={day.id}
                            onClick={() => toggleDay(day.id)}
                            className={`w-10 h-10 rounded-full font-bold transition-colors ${
                              scheduleDays.includes(day.id) 
                                ? 'bg-[#4ADE80] text-[#111827]' 
                                : 'bg-white/10 text-[#6B7280]'
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

              {/* Reminders */}
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-[#6B7280] mb-3 block">Reminders</label>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <button onClick={() => setReminderType('none')} className={`py-4 rounded-2xl flex flex-col items-center gap-2 border transition-colors ${reminderType === 'none' ? 'bg-[#16A34A] border-[#4ADE80] text-white' : 'bg-white/5 border-white/5 text-[#6B7280]'}`}>
                    <BellOff size={20} /> <span className="text-[10px] font-bold uppercase tracking-wider">None</span>
                  </button>
                  <button onClick={() => setReminderType('interval')} className={`py-4 rounded-2xl flex flex-col items-center gap-2 border transition-colors ${reminderType === 'interval' ? 'bg-[#16A34A] border-[#4ADE80] text-white' : 'bg-white/5 border-white/5 text-[#6B7280]'}`}>
                    <Timer size={20} /> <span className="text-[10px] font-bold uppercase tracking-wider">Interval</span>
                  </button>
                  <button onClick={() => setReminderType('time')} className={`py-4 rounded-2xl flex flex-col items-center gap-2 border transition-colors ${reminderType === 'time' ? 'bg-[#16A34A] border-[#4ADE80] text-white' : 'bg-white/5 border-white/5 text-[#6B7280]'}`}>
                    <Clock size={20} /> <span className="text-[10px] font-bold uppercase tracking-wider">Specific</span>
                  </button>
                </div>

                <AnimatePresence>
                  {reminderType === 'interval' && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="bg-white/5 p-4 rounded-[20px] flex items-center justify-between border border-white/10">
                         <span className="text-sm font-bold text-[#E5E7EB]">Remind me every</span>
                         <div className="flex items-center gap-2">
                           <input type="number" min="1" max="24" value={reminderValue} onChange={(e) => setReminderValue(e.target.value)} placeholder="1" className="w-16 bg-white/10 px-3 py-2 rounded-xl text-center font-bold text-white outline-none" />
                           <span className="text-sm font-bold text-[#6B7280]">hours</span>
                         </div>
                      </div>
                    </motion.div>
                  )}
                  {reminderType === 'time' && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="bg-white/5 p-4 rounded-[20px] flex items-center justify-between border border-white/10">
                         <span className="text-sm font-bold text-[#E5E7EB]">Alert exactly at</span>
                         <input type="time" value={reminderValue} onChange={(e) => setReminderValue(e.target.value)} className="bg-white/10 px-3 py-2 rounded-xl text-center font-bold text-white outline-none" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>

            {/* Sticky Bottom CTA */}
            <div className="absolute bottom-0 left-0 right-0 p-6 pt-10 bg-gradient-to-t from-[#111827] via-[#111827]/95 to-transparent pb-[max(24px,env(safe-area-inset-bottom))]">
              <button 
                onClick={handleCreate}
                className="w-full py-4 rounded-full bg-gradient-to-r from-[#16A34A] to-[#4ADE80] text-[#111827] font-black text-lg tracking-wide shadow-[0_10px_30px_rgba(22,163,74,0.4)] tap-effect border border-[#4ADE80]/50"
              >
                Create Habit
              </button>
            </div>
            
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AddHabitModal;
