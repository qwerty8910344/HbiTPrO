import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Plus, Copy, UserPlus, Crown, Check, LogIn } from 'lucide-react';
import { supabase } from '../lib/supabase';

const GroupsView = () => {
  const [groups, setGroups] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupIcon, setGroupIcon] = useState('🏋️');
  const [joinCode, setJoinCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);

  const groupIcons = ['🏋️', '📚', '🧘', '💼', '🎯', '🔥', '💪', '🌟'];

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) return;
      const userId = sessionData.session.user.id;

      const { data: memberData } = await supabase
        .from('group_members')
        .select('group_id')
        .eq('user_id', userId);

      const groupIds = memberData?.map(m => m.group_id) || [];

      if (groupIds.length > 0) {
        const { data } = await supabase
          .from('groups')
          .select('*, group_members(count)')
          .in('id', groupIds);
        setGroups(data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) return;
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) return;
      const userId = sessionData.session.user.id;

      const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();

      const { data: group, error } = await supabase
        .from('groups')
        .insert({ name: groupName, icon: groupIcon, invite_code: inviteCode, created_by: userId })
        .select()
        .single();
      if (error) throw error;

      await supabase.from('group_members').insert({ group_id: group.id, user_id: userId });

      setGroups(prev => [group, ...prev]);
      setGroupName('');
      setShowCreate(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleJoinGroup = async () => {
    if (!joinCode.trim()) return;
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) return;
      const userId = sessionData.session.user.id;

      const { data: group } = await supabase
        .from('groups')
        .select('*')
        .eq('invite_code', joinCode.toUpperCase())
        .single();

      if (!group) { alert('Invalid invite code'); return; }

      await supabase.from('group_members').insert({ group_id: group.id, user_id: userId });

      setGroups(prev => [group, ...prev]);
      setJoinCode('');
      setShowJoin(false);
    } catch (err) {
      console.error(err);
    }
  };

  const copyInviteCode = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col items-center text-center">
        <h1 className="text-[32px] font-black tracking-tight mt-4 text-[#E5E7EB]">Squads</h1>
        <p className="text-[#6B7280] font-medium text-lg italic">Track together, grow together</p>
      </header>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => { setShowCreate(!showCreate); setShowJoin(false); }}
          className="flex-1 ios-card bg-[#111827] p-4 flex items-center justify-center gap-2 tap-effect border border-[#16A34A]/20"
        >
          <Plus size={20} className="text-[#4ADE80]" />
          <span className="font-black text-sm text-[#4ADE80] uppercase tracking-widest">Create</span>
        </button>
        <button
          onClick={() => { setShowJoin(!showJoin); setShowCreate(false); }}
          className="flex-1 ios-card bg-[#111827] p-4 flex items-center justify-center gap-2 tap-effect border border-white/5"
        >
          <LogIn size={20} className="text-[#E5E7EB]" />
          <span className="font-black text-sm text-[#E5E7EB] uppercase tracking-widest">Join</span>
        </button>
      </div>

      {/* Create Group Expansion */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="ios-card bg-[#111827] p-6 flex flex-col gap-4"
          >
            <div>
              <label className="text-xs font-black uppercase tracking-widest text-[#6B7280] mb-3 block">Squad Icon</label>
              <div className="flex gap-2">
                {groupIcons.map(ic => (
                  <button
                    key={ic}
                    onClick={() => setGroupIcon(ic)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-all tap-effect ${
                      groupIcon === ic ? 'bg-[#16A34A]/20 scale-110 border-2 border-[#16A34A]/40' : 'bg-white/5 border border-white/10'
                    }`}
                  >
                    {ic}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-black uppercase tracking-widest text-[#6B7280] mb-3 block">Squad Name</label>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Enter squad name..."
                className="w-full bg-white/5 px-5 py-4 rounded-[20px] font-bold text-[#E5E7EB] outline-none placeholder:text-[#6B7280] border border-white/6 focus:border-[#16A34A]/40"
              />
            </div>

            <button
              onClick={handleCreateGroup}
              className="w-full py-4 rounded-full bg-gradient-to-r from-[#16A34A] to-[#4ADE80] text-white font-black text-sm uppercase tracking-widest shadow-[0_10px_30px_rgba(22,163,74,0.3)] tap-effect"
            >
              Create Squad
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Join Group Expansion */}
      <AnimatePresence>
        {showJoin && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="ios-card bg-[#111827] p-6 flex flex-col gap-4"
          >
            <div>
              <label className="text-xs font-black uppercase tracking-widest text-[#6B7280] mb-3 block">Invite Code</label>
              <input
                type="text"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                placeholder="Enter 6-digit code..."
                className="w-full bg-white/5 px-5 py-4 rounded-[20px] font-bold text-[#E5E7EB] outline-none placeholder:text-[#6B7280] text-center text-2xl tracking-[0.5em] uppercase border border-white/6 focus:border-[#16A34A]/40"
                maxLength={6}
              />
            </div>

            <button
              onClick={handleJoinGroup}
              className="w-full py-4 rounded-full bg-gradient-to-r from-[#16A34A] to-[#4ADE80] text-white font-black text-sm uppercase tracking-widest shadow-[0_10px_30px_rgba(22,163,74,0.3)] tap-effect"
            >
              Join Squad
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Groups List */}
      <section className="flex flex-col gap-4">
        {groups.length === 0 && !loading ? (
          <div className="ios-card-glass p-8 text-center flex flex-col items-center gap-3 border-dashed border-2 border-[#16A34A]/20">
            <Users size={40} className="text-[#6B7280] opacity-30" />
            <p className="text-sm font-bold text-[#6B7280]">No squads yet. Create or join one!</p>
          </div>
        ) : (
          groups.map((group) => (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="ios-card bg-[#111827] p-5 flex items-center gap-4"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#16A34A]/10 flex items-center justify-center text-3xl shadow-inner border border-[#16A34A]/20">
                {group.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-extrabold text-lg tracking-tight text-[#E5E7EB]">{group.name}</h3>
                <p className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest mt-0.5">
                  {group.group_members?.[0]?.count || 1} members
                </p>
              </div>
              <button
                onClick={() => copyInviteCode(group.invite_code, group.id)}
                className="flex items-center gap-1 px-3 py-2 text-[10px] font-black uppercase tracking-wider bg-[#16A34A]/10 text-[#4ADE80] rounded-full tap-effect border border-[#16A34A]/20"
              >
                {copiedId === group.id ? <Check size={14} /> : <Copy size={14} />}
                {copiedId === group.id ? 'Copied!' : group.invite_code}
              </button>
            </motion.div>
          ))
        )}
      </section>
    </div>
  );
};

export default GroupsView;
