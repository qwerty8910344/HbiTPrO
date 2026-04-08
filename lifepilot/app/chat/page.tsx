'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User, Brain, Apple, Flame, ChevronLeft } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface Message {
  role: 'alisha' | 'user';
  content: string;
  id: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'alisha', 
      content: "Namaste! Main Alisha hoon, aapki AI Nutrition Coach. Aaj kya khaya aapne? 😊", 
      id: '1' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return;
    
    const userMsg: Message = { role: 'user', content: text, id: Date.now().toString() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });
      
      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setMessages(prev => [...prev, { 
        role: 'alisha', 
        content: data.content, 
        id: (Date.now() + 1).toString() 
      }]);
    } catch (err) {
      setMessages(prev => [...prev, { 
        role: 'alisha', 
        content: "Oops! Thoda connection issue hai. Phir se koshish karein? 😊", 
        id: (Date.now() + 1).toString() 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const quickActions = [
    { label: "Summarize my day", icon: Flame },
    { label: "What should I eat?", icon: Apple },
    { label: "Improve my diet", icon: Brain },
  ];

  return (
    <main className="min-h-screen bg-[#020617] flex flex-col relative text-slate-200">
      {/* Header */}
      <div className="bg-[#0f172a]/80 backdrop-blur-xl px-6 pt-12 pb-6 border-b border-white/5 flex items-center gap-4 z-10 sticky top-0 shadow-2xl">
        <Link href="/" className="p-3 bg-white/5 rounded-2xl border border-white/5 active:scale-90 transition-transform">
           <ChevronLeft size={20} className="text-gray-400" />
        </Link>
        <div className="relative group">
           <div className="w-14 h-14 rounded-[1.5rem] bg-[var(--ai)] overflow-hidden border-2 border-white/10 group-hover:scale-105 transition-transform duration-500 shadow-lg shadow-blue-500/20">
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop" alt="Alisha" className="grayscale-[0.2] group-hover:grayscale-0 transition-all" />
           </div>
           <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-[#020617] rounded-full shadow-[0_0_8px_#10b981]"></div>
        </div>
        <div>
          <h1 className="text-xl font-black text-white leading-tight">Alisha AI</h1>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--ai)] drop-shadow-[0_0_8px_rgba(37,99,235,0.4)]">Master Nutrition Coach</p>
        </div>
      </div>

      {/* Chat History */}
      <div className="flex-1 p-6 space-y-8 overflow-y-auto pb-48 no-scrollbar">
        {messages.map((msg) => (
          <motion.div 
            key={msg.id}
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} items-end gap-3`}
          >
            {msg.role === 'alisha' && (
              <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-1 shadow-inner">
                 <Sparkles size={16} className="text-[var(--ai)]" />
              </div>
            )}
            <div className={`max-w-[85%] p-5 rounded-[2rem] text-sm font-bold shadow-2xl relative overflow-hidden ${
              msg.role === 'user' 
                ? 'bg-emerald-500 text-white rounded-br-none shadow-emerald-500/10' 
                : 'bg-[#1e293b]/60 text-slate-100 border border-white/5 backdrop-blur-md rounded-bl-none italic'
            }`}>
              {msg.role === 'alisha' && <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none"><Brain size={48} /></div>}
              <p className="relative z-10 leading-relaxed">{msg.content}</p>
            </div>
          </motion.div>
        ))}
        {isTyping && (
          <div className="flex justify-start items-center gap-3">
             <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                <Sparkles size={16} className="text-[var(--ai)] animate-pulse" />
             </div>
             <div className="bg-[#1e293b]/40 px-6 py-4 rounded-[2rem] border border-white/5 flex gap-1.5 backdrop-blur-md">
                <div className="w-1.5 h-1.5 bg-blue-500/40 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-blue-500/60 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1.5 h-1.5 bg-blue-500/80 rounded-full animate-bounce [animation-delay:0.4s]"></div>
             </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input Area */}
      <div className="fixed bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-[#020617] via-[#020617] to-transparent z-50">
        <AnimatePresence>
          {messages.length < 5 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex gap-3 overflow-x-auto pb-4 no-scrollbar mb-4"
            >
              {quickActions.map((action) => (
                <button 
                  key={action.label}
                  onClick={() => handleSend(action.label)}
                  className="whitespace-nowrap px-6 py-4 bg-white/5 border border-white/10 rounded-[2rem] font-black text-[10px] uppercase tracking-widest text-gray-400 flex items-center gap-3 shadow-2xl active:bg-white/10 transition-all backdrop-blur-md"
                >
                  <action.icon size={16} className="text-[var(--ai)]" />
                  {action.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="flex items-center gap-4 bg-white/5 p-2 rounded-[2.5rem] border border-white/10 backdrop-blur-2xl shadow-[0_0_30px_rgba(0,0,0,0.3)]">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Pucho kuch bhi Alisha se..."
            className="flex-1 bg-transparent px-6 py-4 text-sm font-bold text-white outline-none placeholder:text-gray-600 w-full"
          />
          <button 
            onClick={() => handleSend()}
            disabled={!input.trim()}
            className="p-5 bg-[var(--ai)] text-white rounded-full shadow-2xl shadow-blue-500/20 active:scale-90 transition-all disabled:opacity-20 disabled:grayscale group"
          >
            <Send size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
        <p className="text-center text-[8px] font-black tracking-widest text-gray-700 uppercase mt-4">AI Chat is monitoring your habit streak</p>
      </div>

      <Navigation />
    </main>
  );
}
