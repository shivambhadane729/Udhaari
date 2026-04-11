import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { formatCurrency } from '../utils/engine';
import { useEcosystem } from '../hooks/useEcosystem';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const Groups = () => {
  const { accounts, transactions, loading } = useEcosystem();
  const [activeGroup, setActiveGroup] = useState(null);
  
  // Keep mock groups for now until Group persistence is fully phased in
  const [groups] = useState([
    { 
      id: 1, 
      name: 'Shimla Trip 2024', 
      members: ['You', 'Rahul', 'Sneha'], 
      totalSpent: 12000, 
      balance: 1500, 
      icon: 'mountain_flag'
    },
    { 
      id: 2, 
      name: 'Modern Apartment 204', 
      members: ['You', 'Amit', 'Sumi'], 
      totalSpent: 45000, 
      balance: -800,
      icon: 'home'
    },
  ]);

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
       <Loader2 className="animate-spin text-secondary" size={40} />
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background font-body text-primary">
      <Sidebar />
      <main className="ml-72 flex-1 p-16 max-w-7xl mx-auto w-full">
        
        {/* Monolithic Header */}
        <header className="mb-20 flex items-end justify-between border-b border-slate-200 pb-10">
          <div>
            <span className="text-secondary tracking-[0.4em] text-[10px] font-bold mb-4 uppercase inline-block">Shared Ecosystems / Collective Status</span>
            <h1 className="text-monolith text-6xl uppercase tracking-tighter">GROUP MONOLITHS</h1>
          </div>
          <button className="btn-primary h-14 flex items-center gap-3">
             <span className="material-symbols-outlined text-base">group_add</span>
             NEW MONOLITH
          </button>
        </header>

        <div className="grid grid-cols-12 gap-12">
          {/* Group List */}
          <section className="col-span-12 xl:col-span-5 space-y-4">
            {groups.map(group => (
              <motion.div
                key={group.id}
                layout
                onClick={() => setActiveGroup(group)}
                className={`p-8 cursor-pointer border transition-all duration-500 rounded-xl shadow-sm ${
                  activeGroup?.id === group.id 
                  ? 'bg-secondary text-white border-secondary shadow-2xl shadow-secondary/20' 
                  : 'bg-white border-slate-100 text-primary hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-8">
                    <div className={`w-14 h-14 flex items-center justify-center rounded-xl ${activeGroup?.id === group.id ? 'bg-white text-secondary' : 'bg-slate-100 text-secondary'}`}>
                      <span className="material-symbols-outlined text-3xl">{group.icon}</span>
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm uppercase tracking-tight">{group.name}</h3>
                      <p className={`text-[10px] font-bold uppercase tracking-[0.2em] mt-2 ${activeGroup?.id === group.id ? 'opacity-60' : 'text-slate-500'}`}>{group.members.length} ENTITIES ACTIVE</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${activeGroup?.id === group.id ? 'opacity-60' : 'text-slate-500'}`}>BALANCE</p>
                    <p className={`text-xl font-bold tracking-tighter ${group.balance >= 0 ? (activeGroup?.id === group.id ? 'text-[#010413]' : 'text-white') : 'text-accent'}`}>
                      {group.balance >= 0 ? '+' : ''}{formatCurrency(group.balance).split('.')[0]}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </section>

          {/* Group Details */}
          <section className="col-span-12 xl:col-span-7">
            <AnimatePresence mode="wait">
              {activeGroup ? (
                <motion.div
                  key={activeGroup.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="glass-card relative border-white/5 overflow-hidden min-h-[600px] flex flex-col pt-16"
                >
                  <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full blur-[80px] -mr-32 -mt-32" />
                  
                  <div className="flex justify-between items-start mb-16 relative z-10 px-4">
                    <div className="flex items-center gap-8">
                      <div className="w-20 h-20 bg-white/5 flex items-center justify-center text-secondary">
                        <span className="material-symbols-outlined text-5xl">{activeGroup.icon}</span>
                      </div>
                      <div>
                        <h2 className="text-monolith text-4xl uppercase tracking-tighter">{activeGroup.name}</h2>
                        <button className="text-[10px] font-bold text-secondary uppercase tracking-[0.3em] hover:underline flex items-center gap-2 mt-4 transition-all">
                          <span className="material-symbols-outlined text-base">person_add</span> SYNC ENTITIES
                        </button>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <button className="btn-secondary !w-14 !h-14 !p-0 flex items-center justify-center border-white/10">
                        <span className="material-symbols-outlined">message</span>
                      </button>
                      <button className="btn-primary h-14 px-8 flex items-center gap-3">
                        <span className="material-symbols-outlined text-base">receipt_long</span> ADD EXPENSE
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 space-y-12 relative z-10 px-4">
                    {/* Progress Stats */}
                    <div className="grid grid-cols-2 gap-10">
                      <div className="bg-slate-50 p-8 border border-slate-100 rounded-2xl">
                        <p className="text-[10px] font-bold text-slate-500 mb-6 uppercase tracking-widest">AGGREGATE SPEND / MTD</p>
                        <p className="text-4xl font-bold tracking-tighter text-primary">{formatCurrency(activeGroup.totalSpent)}</p>
                        <div className="w-full h-[1px] bg-slate-200 mt-8 overflow-hidden">
                          <div className="h-full bg-primary w-2/3" />
                        </div>
                      </div>
                      <div className="bg-slate-50 p-8 border border-slate-100 rounded-2xl">
                        <p className="text-[10px] font-bold text-slate-500 mb-6 uppercase tracking-widest">SETTLEMENT RATIO</p>
                        <p className="text-4xl font-bold tracking-tighter text-secondary">85%</p>
                        <div className="w-full h-[1px] bg-slate-200 mt-8 overflow-hidden">
                          <div className="h-full bg-secondary w-[85%]" />
                        </div>
                      </div>
                    </div>

                    {/* Entities Grid */}
                    <div className="space-y-6">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">PARTICIPATING ENTITIES</p>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {activeGroup.members.map(member => (
                          <div key={member} className="flex items-center justify-between p-6 bg-white/5 border border-white/5 hover:bg-white hover:text-[#010413] transition-all duration-300 group">
                            <div className="flex items-center gap-6">
                              <div className="w-8 h-8 bg-white/10 flex items-center justify-center text-[10px] font-bold group-hover:bg-[#010413] group-hover:text-white transition-colors">
                                {member[0]}
                              </div>
                              <span className="text-xs font-bold uppercase tracking-widest">{member}</span>
                            </div>
                            <span className="material-symbols-outlined text-lg opacity-20 group-hover:opacity-100 transition-opacity">arrow_forward</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-10 mt-auto">
                       <button className="w-full h-16 border border-slate-200 bg-transparent text-[10px] font-bold uppercase tracking-[0.4em] text-slate-500 hover:text-secondary hover:border-secondary transition-all flex items-center justify-center gap-4 rounded-xl">
                          VIEW TRANSACTION PROTOCOL
                          <span className="material-symbols-outlined text-lg">database</span>
                       </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="h-full min-h-[500px] flex flex-col items-center justify-center bg-white/5 border border-dashed border-white/5 text-center px-12 opacity-50">
                  <div className="w-20 h-20 border border-white/10 flex items-center justify-center mb-10 transition-transform duration-1000 animate-pulse">
                    <span className="material-symbols-outlined text-5xl text-secondary">hub</span>
                  </div>
                  <h3 className="text-monolith text-2xl uppercase tracking-widest mb-4">SELECT ECOSYSTEM</h3>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest max-w-xs leading-[2.5] italic">Choose a verified group monolith to visualize aggregate data and shared liquidity streams.</p>
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
