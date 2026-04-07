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
      color: 'var(--habit-blue)', // Defaulting to vibrant blue for now
      current: 0,
      total: 1, // Defaulting to 1 target
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
          {/* Dimmed Background Overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#0c0f10]/40 backdrop-blur-sm z-[150]"
          />

          {/* Modal Container (Bottom 60%) */}
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300, mass: 0.8 }}
            className="fixed bottom-0 left-0 right-0 max-w-[430px] m-auto h-[65vh] bg-white/70 backdrop-blur-[40px] rounded-t-[40px] border-t border-white/60 shadow-[0_-10px_60px_rgba(0,0,0,0.1)] z-[160] overflow-hidden flex flex-col pt-2"
          >
            {/* Minimal Drag Handle */}
            <div className="w-16 h-1.5 bg-[#8E8E93]/30 rounded-full mx-auto mb-4" />

            <div className="flex justify-between items-center px-8 mb-6">
              <h2 className="text-3xl font-black tracking-tight" style={{ color: '#a12b76' }}>New Habit</h2>
              <button onClick={onClose} className="p-2 bg-black/5 rounded-full tap-effect text-[#595c5d]">
                <X size={20} strokeWidth={3} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-8 pb-32 no-scrollbar flex flex-col gap-6">
              
              {/* Emoji Picker - 3D Glass Bubbles */}
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-[#9b9d9e] mb-3 block">Choose Icon</label>
                <div className="flex flex-wrap gap-3">
                  {EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => setSelectedEmoji(emoji)}
                      className={`w-14 h-14 rounded-full flex items-center justify-center text-3xl transition-all tap-effect shadow-sm relative ${
                        selectedEmoji === emoji 
                          ? 'bg-gradient-to-br from-[#c69eff] to-[#fd77c4] shadow-lg scale-110 border-2 border-white' 
                          : 'bg-white/40 border border-white/40 hover:bg-white/60'
                      }`}
                    >
                      {emoji}
                      {/* Glass bubble Inner shadow effect via pseudo-element if selected */}
                      {selectedEmoji === emoji && (
                         <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/20 to-transparent pointer-events-none" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Habit Name - Sunken Input */}
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-[#9b9d9e] mb-3 block">Habit Name</label>
                <input 
                  type="text"
                  placeholder="E.g., Morning Meditation"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#dadddf]/30 px-6 py-4 rounded-[20px] font-bold text-lg text-black outline-none placeholder:text-[#9b9d9e] shadow-[inset_0_2px_8px_rgba(0,0,0,0.04)]"
                />
              </div>

              {/* Frequency Selector */}
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-[#9b9d9e] mb-3 block">Frequency</label>
                <div className="flex gap-2 p-1.5 bg-[#dadddf]/30 rounded-full shadow-[inset_0_2px_8px_rgba(0,0,0,0.04)]">
                  {FREQUENCIES.map((freq) => (
                    <button
                      key={freq}
                      onClick={() => setFrequency(freq)}
                      className={`flex-1 py-3 px-4 rounded-full font-black text-sm tracking-wide transition-all tap-effect ${
                        frequency === freq 
                          ? 'bg-white text-[#a12b76] shadow-sm' 
                          : 'text-[#595c5d] hover:text-black'
                      }`}
                    >
                      {freq}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Sticky Fixed Bottom CTA */}
            <div className="absolute bottom-0 left-0 right-0 p-6 pt-10 bg-gradient-to-t from-white/90 via-white/70 to-transparent pb-[max(24px,env(safe-area-inset-bottom))]">
              <button 
                onClick={handleCreate}
                className="w-full py-4 rounded-full bg-gradient-to-r from-[#FF69B4] to-[#FFD700] text-white font-black text-lg tracking-wide shadow-[0_10px_30px_rgba(255,105,180,0.4)] tap-effect border border-white/40"
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
