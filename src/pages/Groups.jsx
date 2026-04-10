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
    <div className="flex min-h-screen bg-surface">
      <Sidebar />
      <main className="ml-64 flex-1 p-10 max-w-6xl mx-auto w-full">
        <header className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-medium text-zinc-900 tracking-tight">Shared Accounts</h1>
            <p className="text-zinc-500 mt-1">Collaborative expense management</p>
          </div>
          <button className="btn-primary flex items-center gap-2">
            <Plus size={18} />
            Create Group
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Group List */}
          <section className="lg:col-span-12 xl:col-span-5 space-y-4">
            
            {groups.map(group => (
              <motion.div
                key={group.id}
                layout
                onClick={() => setActiveGroup(group)}
                className={`bg-white border rounded-lg p-5 flex items-center justify-between cursor-pointer transition-all duration-200 ${
                  activeGroup?.id === group.id 
                  ? 'border-primary shadow-minimal ring-1 ring-primary' 
                  : 'border-zinc-200 hover:shadow-minimal text-zinc-900'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="text-2xl w-12 h-12 flex items-center justify-center bg-surface-bright rounded-md">
                    {group.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-base text-zinc-900">{group.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-sm text-zinc-500">{group.members.length} members</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-zinc-500 mb-1">Your Balance</p>
                  <p className={`text-sm font-medium ${group.balance >= 0 ? 'text-secondary' : 'text-accent'}`}>
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
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="bg-white border border-zinc-200 rounded-lg p-8 h-full flex flex-col shadow-minimal"
                >
                  <div className="flex justify-between items-start mb-10">
                    <div className="flex items-center gap-4">
                      <span className="text-4xl">{activeGroup.icon}</span>
                      <div>
                        <h2 className="text-2xl font-medium text-zinc-900">{activeGroup.name}</h2>
                        <div className="flex items-center gap-4 mt-2">
                          <button className="text-sm text-primary font-medium hover:text-primary-dark transition-colors flex items-center gap-1.5">
                            <UserPlus size={16} /> Add members
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button className="btn-secondary py-2 px-4 text-sm flex items-center gap-2 border-zinc-200">
                        <MessageSquare size={18} />
                      </button>
                      <button className="btn-primary py-2 px-5 text-sm flex items-center gap-2">
                        <Split size={18} /> Add Expense
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 space-y-8">
                    {/* Visual Progress/Stats */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-surface rounded-lg p-5 border border-zinc-200 text-zinc-900">
                        <p className="text-sm text-zinc-500 mb-2">Total Group Spend</p>
                        <p className="text-2xl font-medium">{formatCurrency(activeGroup.totalSpent)}</p>
                        <div className="w-full h-1 bg-zinc-200 rounded-full mt-3 overflow-hidden">
                          <div className="h-full bg-primary w-2/3" />
                        </div>
                      </div>
                      <div className="bg-surface rounded-lg p-5 border border-zinc-200">
                        <p className="text-sm text-zinc-500 mb-2">Settled</p>
                        <p className="text-2xl font-medium text-secondary">85%</p>
                        <div className="w-full h-1 bg-zinc-200 rounded-full mt-3 overflow-hidden">
                          <div className="h-full bg-secondary w-[85%]" />
                        </div>
                      </div>
                    </div>

                    {/* Compact Members List */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {activeGroup.members.map(member => (
                        <div key={member} className="flex items-center justify-between p-3 rounded-lg border border-zinc-200 hover:bg-zinc-50 transition-colors group px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-xs font-medium text-primary">
                              {member[0]}
                            </div>
                            <span className="text-sm font-medium text-zinc-800">{member}</span>
                          </div>
                          <ChevronRight size={16} className="text-zinc-400 group-hover:text-primary transition-colors" />
                        </div>
                      ))}
                    </div>

                    <div className="pt-6 mt-auto">
                       <button className="w-full py-3 rounded-lg border border-zinc-200 bg-white flex items-center justify-center gap-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-all">
                          View details
                          <ArrowRight size={16} className="text-primary" />
                       </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="h-[400px] flex flex-col items-center justify-center rounded-lg border border-dashed border-zinc-300 bg-surface text-center px-6">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border border-zinc-200">
                    <Split size={24} className="text-primary" />
                  </div>
                  <h3 className="text-lg font-medium text-zinc-900 mb-1">Select a group</h3>
                  <p className="text-sm text-zinc-500">Choose a circle to view shared expenses and settlements.</p>
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
