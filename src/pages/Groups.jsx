import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { formatCurrency } from '../utils/engine';
import { 
  Plus, 
  ChevronRight, 
  UserPlus, 
  Split,
  MessageSquare,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Groups = () => {
  const [activeGroup, setActiveGroup] = useState(null);
  
  const [groups] = useState([
    { 
      id: 1, 
      name: 'Shimla Trip 2024', 
      members: ['You', 'Rahul', 'Sneha'], 
      totalSpent: 12000, 
      balance: 1500, 
      icon: '🏔️'
    },
    { 
      id: 2, 
      name: 'Modern Apartment 204', 
      members: ['You', 'Amit', 'Sumi'], 
      totalSpent: 45000, 
      balance: -800,
      icon: '🏠'
    },
  ]);

  return (
    <div className="flex min-h-screen bg-background text-zinc-100">
      <Sidebar />
      <main className="ml-64 flex-1 p-12 max-w-7xl mx-auto w-full">
        <header className="mb-14 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">Shared Accounts</h1>
            <p className="text-zinc-500 mt-2 font-medium">Collaborative expense management</p>
          </div>
          <button className="btn-primary flex items-center gap-2 group px-8">
            <Plus size={18} />
            Create Group
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Group List */}
          <section className="lg:col-span-12 xl:col-span-5 space-y-4">
            <div className="flex items-center justify-between px-2 mb-6">
               <h2 className="text-xs font-bold text-zinc-600 uppercase tracking-[0.2em]">Your Circles</h2>
               <span className="text-xs text-primary font-bold">{groups.length} Groups</span>
            </div>
            
            {groups.map(group => (
              <motion.div
                key={group.id}
                layout
                whileHover={{ x: 4 }}
                onClick={() => setActiveGroup(group)}
                className={`bg-surface-container border p-6 rounded-[2rem] flex items-center justify-between cursor-pointer transition-all duration-300 ${
                  activeGroup?.id === group.id 
                  ? 'border-primary ring-1 ring-primary/20 bg-surface-bright shadow-glow-primary' 
                  : 'border-white/[0.03] hover:border-white/10'
                }`}
              >
                <div className="flex items-center gap-6">
                  <div className="text-4xl w-16 h-16 flex items-center justify-center bg-white/[0.03] rounded-3xl">
                    {group.icon}
                  </div>
                  <div>
                    <h3 className="font-black text-xl text-white">{group.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex -space-x-2">
                        {group.members.slice(0, 3).map((m, i) => (
                           <div key={i} className="w-6 h-6 rounded-full bg-zinc-800 border-2 border-surface flex items-center justify-center text-[8px] font-bold">
                             {m[0]}
                           </div>
                        ))}
                      </div>
                      <p className="text-xs text-zinc-500 font-bold ml-1">{group.members.length} People</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-black mb-1">Your Status</p>
                  <p className={`text-lg font-black ${group.balance >= 0 ? 'text-secondary' : 'text-accent'}`}>
                    {group.balance >= 0 ? '+' : ''}{formatCurrency(group.balance).split('.')[0]}
                  </p>
                </div>
              </motion.div>
            ))}
          </section>

          {/* Group Details */}
          <section className="lg:col-span-12 xl:col-span-7">
            <AnimatePresence mode="wait">
              {activeGroup ? (
                <motion.div
                  key={activeGroup.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="bg-surface-container border border-white/[0.03] rounded-[2.5rem] p-10 h-full flex flex-col shadow-2xl"
                >
                  <div className="flex justify-between items-start mb-12">
                    <div className="flex items-center gap-6">
                      <span className="text-5xl">{activeGroup.icon}</span>
                      <div>
                        <h2 className="text-3xl font-black">{activeGroup.name}</h2>
                        <div className="flex items-center gap-4 mt-2">
                          <button className="text-[10px] uppercase font-black text-primary hover:tracking-widest transition-all flex items-center gap-1.5">
                            <UserPlus size={14} /> Invite People
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button className="p-4 rounded-2xl bg-white/[0.03] hover:bg-white/10 text-zinc-400 transition-colors">
                        <MessageSquare size={22} />
                      </button>
                      <button className="btn-primary py-4 px-8 text-sm flex items-center gap-3">
                        <Split size={18} /> Add Shared Expense
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 space-y-10">
                    {/* Visual Progress/Stats */}
                    <div className="grid grid-cols-2 gap-6">
                      <div className="bg-surface-bright rounded-3xl p-6 border border-white/5">
                        <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-3">Group Spend</p>
                        <p className="text-3xl font-black">{formatCurrency(activeGroup.totalSpent)}</p>
                        <div className="w-full h-1.5 bg-zinc-800 rounded-full mt-4 overflow-hidden">
                          <div className="h-full bg-primary w-2/3" />
                        </div>
                      </div>
                      <div className="bg-surface-bright rounded-3xl p-6 border border-white/5">
                        <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-3">Settlement Rate</p>
                        <p className="text-3xl font-black text-secondary">85%</p>
                        <div className="w-full h-1.5 bg-zinc-800 rounded-full mt-4 overflow-hidden">
                          <div className="h-full bg-secondary w-[85%]" />
                        </div>
                      </div>
                    </div>

                    {/* Compact Members List */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {activeGroup.members.map(member => (
                        <div key={member} className="flex items-center justify-between p-4 rounded-[1.5rem] bg-white/[0.02] border border-white/[0.03] hover:bg-white/[0.04] transition-colors group px-6">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-zinc-800 flex items-center justify-center text-xs font-black text-primary">
                              {member[0]}
                            </div>
                            <span className="font-bold text-sm text-zinc-300">{member}</span>
                          </div>
                          <ChevronRight size={16} className="text-zinc-700 group-hover:text-primary transition-all" />
                        </div>
                      ))}
                    </div>

                    <div className="pt-6 border-t border-white/5">
                       <button className="w-full h-16 rounded-[1.5rem] bg-surface-bright border border-white/5 flex items-center justify-center gap-3 text-sm font-black hover:bg-white/[0.05] transition-all">
                          View Detailed Statement
                          <ArrowRight size={18} className="text-primary" />
                       </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="h-[500px] flex flex-col items-center justify-center border-l-2 border-zinc-900 mx-auto max-w-sm text-center">
                  <div className="w-20 h-20 bg-zinc-900 rounded-[2rem] flex items-center justify-center mb-6">
                    <Split size={32} className="text-zinc-700" />
                  </div>
                  <h3 className="text-xl font-black mb-2 opacity-50">Nothing Selected</h3>
                  <p className="text-sm text-zinc-500 font-medium">Choose a circle to manage settlements and group activity</p>
                </div>
              )}
            </AnimatePresence>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Groups;
