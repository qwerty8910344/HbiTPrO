import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const EMOJIS = ['💧', '🏃‍♀️', '🧘‍♀️', '🍎', '💤', '📚', '💰', '🏋️'];
const FREQUENCIES = ['Daily', 'Weekly', 'Custom'];

const AddHabitModal = ({ isOpen, onClose, onAdd }) => {
  const [title, setTitle] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('💧');
  const [frequency, setFrequency] = useState('Daily');

  if (!isOpen) return null;

  const handleCreate = () => {
    if (!title.trim()) return;
    onAdd({
      id: Date.now(),
      title,
      icon: selectedEmoji,
      color: 'var(--habit-green)',
      current: 0,
      total: 1,
      unit: 'times',
      streak: 0,
      completed: false,
      category: 'Health'
    });
    setTitle('');
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
            className="fixed bottom-0 left-0 right-0 max-w-[430px] m-auto h-[65vh] bg-[#111827]/95 backdrop-blur-[40px] rounded-t-[40px] border-t border-white/6 shadow-[0_-10px_60px_rgba(0,0,0,0.4)] z-[160] overflow-hidden flex flex-col pt-2"
          >
            {/* Drag Handle */}
            <div className="w-16 h-1.5 bg-white/10 rounded-full mx-auto mb-4" />

            <div className="flex justify-between items-center px-8 mb-6">
              <h2 className="text-3xl font-black tracking-tight text-[#4ADE80]">New Habit</h2>
              <button onClick={onClose} className="p-2 bg-white/5 rounded-full tap-effect text-[#6B7280]">
                <X size={20} strokeWidth={3} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-8 pb-32 no-scrollbar flex flex-col gap-6">
              
              {/* Emoji Picker */}
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-[#6B7280] mb-3 block">Choose Icon</label>
                <div className="flex flex-wrap gap-3">
                  {EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => setSelectedEmoji(emoji)}
                      className={`w-14 h-14 rounded-full flex items-center justify-center text-3xl transition-all tap-effect shadow-sm relative ${
                        selectedEmoji === emoji 
                          ? 'bg-gradient-to-br from-[#16A34A] to-[#4ADE80] shadow-lg scale-110 border-2 border-[#4ADE80]/40' 
                          : 'bg-white/5 border border-white/10 hover:bg-white/10'
                      }`}
                    >
                      {emoji}
                      {selectedEmoji === emoji && (
                         <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
                      )}
                    </button>
                  ))}
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
                <label className="text-xs font-black uppercase tracking-widest text-[#6B7280] mb-3 block">Frequency</label>
                <div className="flex gap-2 p-1.5 bg-white/5 rounded-full shadow-[inset_0_2px_8px_rgba(0,0,0,0.2)] border border-white/6">
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
              </div>

            </div>

            {/* Sticky Bottom CTA */}
            <div className="absolute bottom-0 left-0 right-0 p-6 pt-10 bg-gradient-to-t from-[#111827] via-[#111827]/80 to-transparent pb-[max(24px,env(safe-area-inset-bottom))]">
              <button 
                onClick={handleCreate}
                className="w-full py-4 rounded-full bg-gradient-to-r from-[#16A34A] to-[#4ADE80] text-white font-black text-lg tracking-wide shadow-[0_10px_30px_rgba(22,163,74,0.4)] tap-effect border border-white/10"
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
