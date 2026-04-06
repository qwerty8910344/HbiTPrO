import React from 'react';
import { motion } from 'framer-motion';
import { Plus, ChevronRight, ThumbsUp, MessageCircle } from 'lucide-react';

const GroupsView = () => {
  const groups = [
    {
      title: 'Meditation',
      icon: '🧘',
      members: [
        { name: 'Save6666', avatar: 'https://i.pravatar.cc/150?u=a1', progress: 100 },
        { name: 'Dot', avatar: 'https://i.pravatar.cc/150?u=a2', progress: 100, liked: true },
      ]
    },
    {
      title: 'Workout Squad',
      icon: '🏃‍♀️',
      members: [
        { name: 'Alex', avatar: 'https://i.pravatar.cc/150?u=a3', progress: 80 },
        { name: 'Jordan', avatar: 'https://i.pravatar.cc/150?u=a4', progress: 60 },
        { name: 'Dot', avatar: 'https://i.pravatar.cc/150?u=a2', progress: 95 },
      ]
    }
  ];

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col items-center text-center">
        <h1 className="text-[32px] font-black tracking-tight mt-4">Shared Habits</h1>
        <p className="text-[#8E8E93] font-medium text-lg">Build with friends</p>
      </header>

      {/* Group Header */}
      <div className="flex justify-between items-center px-4">
         <h2 className="text-xl font-bold">Group</h2>
         <button className="p-2 bg-red-400 text-white rounded-full shadow-lg tap-effect"><Plus size={18} /></button>
      </div>

      {/* Group Cards */}
      <div className="flex flex-col gap-6">
         {groups.map((group, i) => (
            <div key={i} className="ios-card bg-white p-0 overflow-hidden">
               {/* Group Title Bar */}
               <div className="p-4 flex justify-between items-center border-b border-gray-50 bg-gray-50/50">
                  <div className="flex items-center gap-2">
                     <span className="text-xl">{group.icon}</span>
                     <span className="font-bold text-lg">{group.title}</span>
                  </div>
                  <ChevronRight size={20} className="text-[#8E8E93]" />
               </div>

               {/* Member List */}
               <div className="p-5 flex flex-col gap-5">
                  {group.members.map((member, j) => (
                     <div key={j} className="flex items-center gap-4">
                        <img src={member.avatar} alt={member.name} className="w-12 h-12 rounded-full border-2 border-white shadow-sm" />
                        <div className="flex-1 flex flex-col gap-1">
                           <div className="flex justify-between items-center">
                              <span className="font-bold text-sm tracking-tight">{member.name}</span>
                              <span className="text-[10px] font-black text-[#8E8E93]">{member.progress}%</span>
                           </div>
                           <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                              <motion.div 
                                 initial={{ width: 0 }}
                                 animate={{ width: `${member.progress}%` }}
                                 className="h-full bg-red-400 rounded-full shadow-sm"
                              />
                           </div>
                        </div>
                        <button className={`p-2 rounded-full transition-all tap-effect ${member.liked ? 'text-blue-500 bg-blue-50' : 'text-[#8E8E93] hover:bg-gray-100'}`}>
                           <ThumbsUp size={18} fill={member.liked ? "currentColor" : "none"} />
                        </button>
                     </div>
                  ))}
               </div>
            </div>
         ))}
      </div>

      {/* Empty Group State / CTA */}
      <div className="ios-card-glass p-8 text-center flex flex-col items-center gap-3 mt-4 border-dashed border-2 border-red-200">
         <div className="w-12 h-12 rounded-full bg-red-400/10 flex items-center justify-center text-red-400">
            <Plus size={24} />
         </div>
         <h3 className="font-bold">Create New Group</h3>
         <p className="text-xs text-[#8E8E93] font-medium font-inter">Invite your friends and compete together for a better you.</p>
      </div>
    </div>
  );
};

export default GroupsView;
