import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Flame, Brain } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { subDays, format, differenceInDays } from 'date-fns';

const TrackingView = () => {
  const [heatmapData, setHeatmapData] = useState([]);
  const [totalHabits, setTotalHabits] = useState(0);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) return;
      
      // Fetch the last ~140 days (20 weeks) of habit completions
      const pastDate = format(subDays(new Date(), 140), 'yyyy-MM-dd');
      
      const { data, error } = await supabase
        .from('habit_logs')
        .select('completed_date')
        .eq('user_id', sessionData.session.user.id)
        .gte('completed_date', pastDate);

      if (error) throw error;
      
      setTotalHabits(data.length);

      // Create a map of date -> count
      const counts = {};
      data.forEach(log => {
         counts[log.completed_date] = (counts[log.completed_date] || 0) + 1;
      });

      // Build 20 weeks of data
      const weeks = 20;
      const matrix = Array.from({ length: weeks }, (_, wi) =>
        Array.from({ length: 7 }, (_, di) => {
           // We map the absolute grid cell index back into a date string
           // 140 days = 20 * 7. Cell (wi, di) represents a day in the past.
           const daysAgo = (weeks - 1 - wi) * 7 + (6 - di);
           const cellDate = format(subDays(new Date(), daysAgo), 'yyyy-MM-dd');
           const val = counts[cellDate] || 0;
           
           if (val === 0) return 0;
           if (val <= 1) return 1;
           if (val <= 3) return 2;
           if (val <= 5) return 3;
           return 4;
        })
      );
      setHeatmapData(matrix);
    } catch (err) {
      console.error(err);
      // Fallback empty matrix
      setHeatmapData(Array.from({ length: 20 }, () => Array.from({ length: 7 }, () => 0)));
    }
  };

  const [activePalette, setActivePalette] = useState('green');

  const colorPalettes = {
    green: ['bg-white/[0.03]', 'bg-[#16A34A]/20', 'bg-[#16A34A]/45', 'bg-[#16A34A]/75', 'bg-[#4ADE80]'],
    blue: ['bg-white/[0.03]', 'bg-[#3B82F6]/20', 'bg-[#3B82F6]/45', 'bg-[#3B82F6]/75', 'bg-[#60A5FA]'],
    purple: ['bg-white/[0.03]', 'bg-[#8B5CF6]/20', 'bg-[#8B5CF6]/45', 'bg-[#8B5CF6]/75', 'bg-[#A78BFA]'],
    rose: ['bg-white/[0.03]', 'bg-[#F43F5E]/20', 'bg-[#F43F5E]/45', 'bg-[#F43F5E]/75', 'bg-[#FB7185]'],
    orange: ['bg-white/[0.03]', 'bg-[#F97316]/20', 'bg-[#F97316]/45', 'bg-[#F97316]/75', 'bg-[#FB923C]'],
  };

  const intensityColors = colorPalettes[activePalette];

  const dayLabels = ['', 'Mon', '', 'Wed', '', 'Fri', ''];
  const monthLabels = ['Jan', '', '', '', 'Feb', '', '', '', 'Mar', '', '', '', 'Apr', '', '', '', 'May', '', '', ''];

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col items-center text-center">
        <h1 className="text-[32px] font-black tracking-tight mt-4 text-[#E5E7EB]">Analytics</h1>
        <p className="text-[#6B7280] font-medium text-lg italic">Track your progress</p>
      </header>

      {/* Progress Ring */}
      <div className="ios-card bg-[#111827] p-8 flex flex-col items-center gap-4">
        <div className="relative">
          <svg width="180" height="180">
            <circle cx="90" cy="90" r="78" stroke="rgba(255,255,255,0.05)" strokeWidth="12" fill="none" />
            <circle
              cx="90" cy="90" r="78"
              stroke="url(#progress-grad)"
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 78}`}
              strokeDashoffset={`${2 * Math.PI * 78 * (1 - 0.78)}`}
              transform="rotate(-90 90 90)"
            />
            <defs>
              <linearGradient id="progress-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#16A34A" />
                <stop offset="100%" stopColor="#4ADE80" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-black text-[#E5E7EB]">78%</span>
            <span className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest">overall</span>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="ios-card bg-[#111827] p-3 flex flex-col items-center gap-1">
          <TrendingUp size={18} className="text-[#4ADE80]" />
          <span className="text-xl font-black text-[#E5E7EB]">156</span>
          <span className="text-[8px] font-black uppercase text-[#6B7280] tracking-wider">Completed</span>
        </div>
        <div className="ios-card bg-[#111827] p-3 flex flex-col items-center gap-1">
          <Flame size={18} className="text-orange-400" />
          <span className="text-xl font-black text-[#E5E7EB]">21</span>
          <span className="text-[8px] font-black uppercase text-[#6B7280] tracking-wider">Best Streak</span>
        </div>
        <div className="ios-card bg-[#111827] p-3 flex flex-col items-center gap-1">
          <Brain size={18} className="text-purple-400" />
          <span className="text-xl font-black text-[#E5E7EB]">4.2</span>
          <span className="text-[8px] font-black uppercase text-[#6B7280] tracking-wider">Avg Mood</span>
        </div>
      </div>

      {/* Mini Chart */}
      <div className="ios-card bg-[#111827] p-5">
        <h3 className="text-sm font-black uppercase tracking-widest text-[#6B7280] mb-4">7-Day Trend</h3>
        <div className="flex items-end gap-2 h-36">
          {[65, 80, 45, 90, 70, 85, 95].map((val, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${val}%` }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 rounded-xl bg-gradient-to-t from-[#16A34A] to-[#4ADE80] relative group"
            >
              <div className="absolute -top-5 w-full text-center text-[9px] font-black text-[#6B7280] opacity-0 group-hover:opacity-100 transition-opacity">
                {val}%
              </div>
            </motion.div>
          ))}
        </div>
        <div className="flex justify-between mt-3">
          {['M','T','W','T','F','S','S'].map((d, i) => (
            <span key={i} className="text-[9px] font-black text-[#6B7280] uppercase flex-1 text-center">{d}</span>
          ))}
        </div>
      </div>

      {/* GitHub-Style Contribution Heatmap */}
      <div className="ios-card bg-[#111827] p-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-black uppercase tracking-widest text-[#6B7280]">Contribution Graph</h3>
          <span className="text-[10px] font-bold text-[#E5E7EB] opacity-60">{totalHabits} habits tracking period</span>
        </div>
        
        <div className="flex items-center gap-2 mb-4">
          {Object.keys(colorPalettes).map((key) => (
             <button
                key={key}
                onClick={() => setActivePalette(key)}
                className={`w-6 h-6 rounded-full tap-effect ring-2 ring-offset-2 ring-offset-[#111827] transition-all ${
                   activePalette === key ? 'ring-white' : 'ring-transparent opacity-50 hover:opacity-100'
                } ${colorPalettes[key][4]}`}
             />
          ))}
        </div>
        
        <div className="overflow-x-auto no-scrollbar">
          {/* Month labels */}
          <div className="flex ml-8 mb-1">
            {monthLabels.map((m, i) => (
              <span key={i} className="text-[9px] font-bold text-[#6B7280] min-w-[16px] text-center">{m}</span>
            ))}
          </div>
          
          <div className="flex gap-0">
            {/* Day labels */}
            <div className="flex flex-col gap-[3px] mr-1.5 pt-0">
              {dayLabels.map((d, i) => (
                <span key={i} className="text-[9px] font-bold text-[#6B7280] h-[14px] flex items-center justify-end w-6">{d}</span>
              ))}
            </div>
            
            {/* Grid */}
            <div className="flex gap-[3px]">
              {heatmapData.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-[3px]">
                  {week.map((level, di) => (
                    <div
                      key={di}
                      className={`w-[14px] h-[14px] rounded-[3px] ${intensityColors[level]} border border-white/[0.03] transition-colors hover:border-[#4ADE80]/40 cursor-pointer`}
                      title={`Level ${level}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-end gap-1.5 mt-4">
          <span className="text-[9px] font-bold text-[#6B7280] mr-1">Less</span>
          {intensityColors.map((color, i) => (
            <div key={i} className={`w-[12px] h-[12px] rounded-[2px] ${color} border border-white/[0.03]`} />
          ))}
          <span className="text-[9px] font-bold text-[#6B7280] ml-1">More</span>
        </div>
      </div>
    </div>
  );
};

export default TrackingView;
