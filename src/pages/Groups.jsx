import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { formatCurrency } from '../utils/engine';
import { useAuth } from '../contexts/AuthContext';
import { 
  Plus, 
  Users as UsersIcon, 
  ChevronRight, 
  UserPlus, 
  Split,
  MessageSquare,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Groups = () => {
  const { user } = useAuth();
  const [activeGroup, setActiveGroup] = useState(null);
  
  const [groups, setGroups] = useState([
    { 
      id: 1, 
      name: 'Shimla Trip', 
      members: ['You', 'Rahul', 'Sneha'], 
      totalSpent: 12000, 
      balance: 1500, // + means someone owes you, - means you owe
      icon: '🏔️'
    },
    { 
      id: 2, 
      name: 'Flat 204', 
      members: ['You', 'Amit', 'Sumi'], 
      totalSpent: 45000, 
      balance: -800,
      icon: '🏠'
    },
  ]);

  return (
    <div className="flex min-h-screen bg-background text-zinc-100">
      <Sidebar />
      <main className="ml-64 flex-1 p-8">
        <header className="mb-10 flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-1">Group Finances</h1>
            <p className="text-zinc-500">Split bills with friends effortlessly</p>
          </div>
          <button className="btn-primary flex items-center gap-2">
            <Plus size={18} />
            Create Group
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Group List */}
          <section className="space-y-4">
            <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-widest px-1">Your Groups</h2>
            {groups.map(group => (
              <motion.div
                key={group.id}
                whileHover={{ scale: 1.01 }}
                onClick={() => setActiveGroup(group)}
                className={`glass-card p-5 flex items-center justify-between cursor-pointer border-l-4 transition-all ${
                  activeGroup?.id === group.id ? 'border-primary bg-primary/5' : 'border-transparent'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="text-3xl">{group.icon}</div>
                  <div>
                    <h3 className="font-bold text-lg">{group.name}</h3>
                    <p className="text-sm text-zinc-500">{group.members.length} members • {group.members.join(', ')}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-zinc-500 mb-1">Your Balance</p>
                  <p className={`font-bold ${group.balance >= 0 ? 'text-secondary' : 'text-accent'}`}>
                    {group.balance >= 0 ? '+' : ''}{formatCurrency(group.balance)}
                  </p>
                </div>
              </motion.div>
            ))}
          </section>

          {/* Group Details / Placeholder */}
          <section className="h-[calc(100vh-200px)]">
            <AnimatePresence mode="wait">
              {activeGroup ? (
                <motion.div
                  key={activeGroup.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="glass-card h-full flex flex-col p-8"
                >
                  <div className="flex justify-between items-start mb-8">
                    <div className="flex items-center gap-4">
                      <span className="text-4xl">{activeGroup.icon}</span>
                      <div>
                        <h2 className="text-2xl font-bold">{activeGroup.name}</h2>
                        <button className="text-xs text-primary hover:underline flex items-center gap-1 mt-1">
                          <UserPlus size={12} /> Invite Members
                        </button>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400">
                        <MessageSquare size={20} />
                      </button>
                      <button className="btn-primary py-2 px-4 text-sm flex items-center gap-2">
                        <Split size={16} /> Add Expense
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-6 pr-2">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-surface-lighter rounded-2xl p-4 border border-white/5">
                        <p className="text-xs text-zinc-500 uppercase mb-1">Total Spent</p>
                        <p className="text-xl font-bold">{formatCurrency(activeGroup.totalSpent)}</p>
                      </div>
                      <div className="bg-surface-lighter rounded-2xl p-4 border border-white/5">
                        <p className="text-xs text-zinc-500 uppercase mb-1">Settled Up</p>
                        <p className="text-xl font-bold text-secondary">85%</p>
                      </div>
                    </div>

                    {/* Members List */}
                    <div>
                      <h3 className="text-xs font-semibold text-zinc-500 uppercase mb-3">Members</h3>
                      <div className="grid grid-cols-1 gap-2">
                        {activeGroup.members.map(member => (
                          <div key={member} className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-indigo-400 flex items-center justify-center text-xs font-bold">
                                {member[0]}
                              </div>
                              <span className="font-medium text-sm">{member}</span>
                            </div>
                            <span className="text-xs text-zinc-500">
                              {member === 'You' ? (activeGroup.balance > 0 ? 'Owed' : 'Owes') : 'Settled'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Placeholder for Expenses */}
                    <div>
                      <h3 className="text-xs font-semibold text-zinc-500 uppercase mb-3">Recent Activity</h3>
                      <div className="space-y-3">
                        {[1, 2].map(i => (
                          <div key={i} className="flex items-start gap-4 p-4 rounded-xl border border-white/5 bg-white/2 cursor-default">
                             <div className="p-2 rounded-lg bg-zinc-800">
                               <CheckCircle2 size={16} className="text-zinc-600" />
                             </div>
                             <div>
                               <p className="text-sm font-medium">Expense {i} added</p>
                               <span className="text-xs text-zinc-500">2 days ago</span>
                             </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <button className="mt-8 btn-secondary w-full py-3 flex items-center justify-center gap-2">
                    View Full Statement
                    <ChevronRight size={18} />
                  </button>
                </motion.div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center glass-card opacity-50 border-dashed border-2">
                  <UsersIcon size={64} className="mb-4 text-zinc-700" />
                  <p className="text-zinc-500 text-lg">Select a group to see details</p>
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
