import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { formatCurrency } from '../utils/engine';
import { useEcosystem } from '../contexts/EcosystemContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const CATEGORIES = [
  { name: 'Housing', icon: 'home_work' },
  { name: 'Subscription', icon: 'subscriptions' },
  { name: 'Travel', icon: 'flight' },
  { name: 'Food', icon: 'lunch_dining' },
  { name: 'Health', icon: 'medical_services' },
  { name: 'Other', icon: 'category' },
];

const Expenses = () => {
  const { accounts, transactions, loading, addTransaction } = useEcosystem();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newExpense, setNewExpense] = useState({ title: '', amount: '', category: 'Food', accountId: '' });
  const [searchQuery, setSearchQuery] = useState('');

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await addTransaction({
        ...newExpense,
        amount: parseFloat(newExpense.amount),
        date: new Date().toISOString().split('T')[0]
      });
      setShowAddModal(false);
      setNewExpense({ title: '', amount: '', category: 'Food', accountId: '' });
    } catch (err) {
      alert(err.message);
    }
  };

  const filteredTransactions = transactions.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <span className="text-secondary tracking-[0.4em] text-[10px] font-bold mb-4 uppercase inline-block">System Ledger / Transactional</span>
            <h1 className="text-monolith text-6xl uppercase tracking-tighter">LEDGER ARCHIVE</h1>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="btn-primary h-14 flex items-center gap-3"
          >
             <span className="material-symbols-outlined text-base">add</span>
             NEW ENTRY
          </button>
        </header>

        {/* Search */}
        <div className="relative mb-12">
           <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-slate-400">search</span>
           <input 
              className="input h-16 pl-16 bg-slate-50 border-slate-200 font-bold uppercase tracking-widest text-xs" 
              placeholder="FILTER LEDGER BY IDENTITY..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
           />
        </div>

        {/* Ledger Table */}
        <div className="glass-card !p-0 border-slate-100 overflow-hidden shadow-sm">
           <div className="px-10 py-6 bg-slate-50 flex justify-between items-center text-[10px] font-bold tracking-[0.3em] uppercase text-slate-500">
              <div className="flex gap-20">
                <span>IDENTITY / ORIGIN</span>
                <span>CHRONOLOGICAL</span>
              </div>
              <span>LIQUIDITY</span>
           </div>
           
           <div className="divide-y divide-slate-100">
              {filteredTransactions.map(trans => {
                const category = CATEGORIES.find(c => c.name === trans.category) || CATEGORIES[CATEGORIES.length - 1];
                const account = accounts.find(a => a.id === trans.accountId);
                return (
                  <div key={trans.id} className="px-10 py-8 flex items-center justify-between group hover:bg-slate-50 transition-all">
                    <div className="flex items-center gap-10">
                       <div className="w-14 h-14 bg-slate-100 flex items-center justify-center rounded-xl group-hover:bg-secondary group-hover:text-white transition-colors">
                          <span className="material-symbols-outlined text-2xl">{category.icon}</span>
                       </div>
                       <div>
                          <h3 className="text-sm font-bold uppercase tracking-tight mb-2">{trans.title}</h3>
                          <div className="flex items-center gap-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                             <span className="text-secondary">{trans.category}</span>
                             <span>/</span>
                             <span>{account?.name || 'UNKNOWN'}</span>
                             <span>/</span>
                             <span>{trans.date}</span>
                          </div>
                       </div>
                    </div>
                    <span className="text-xl font-bold tracking-tighter text-primary">-{formatCurrency(trans.amount)}</span>
                  </div>
                );
              })}
              {filteredTransactions.length === 0 && (
                 <div className="p-32 text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    NO CORRESPONDING DATA RECOVERED
                 </div>
              )}
           </div>
        </div>

        {/* Add Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-slate-900/40 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="glass-card max-w-2xl w-full"
            >
              <h3 className="text-monolith text-3xl mb-10 uppercase text-center tracking-widest">INITIALIZE ENTRY</h3>
              <form onSubmit={handleAdd} className="space-y-8">
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-3">SOURCE ACCOUNT</label>
                    <select 
                      required
                      className="input h-14 bg-slate-50"
                      value={newExpense.accountId}
                      onChange={e => setNewExpense({...newExpense, accountId: e.target.value})}
                    >
                      <option value="">SELECT SOURCE</option>
                      {accounts.map(acc => <option key={acc.id} value={acc.id} className="text-primary">{acc.name.toUpperCase()}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-3">LIQUIDITY (₹)</label>
                    <input 
                      required
                      type="number"
                      className="input h-14 bg-slate-50"
                      placeholder="0.00"
                      value={newExpense.amount}
                      onChange={e => setNewExpense({...newExpense, amount: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-8">
                   <div>
                      <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-3">ENTRY DESCRIPTION</label>
                      <input 
                        required
                        className="input h-14 bg-white/5"
                        placeholder="e.g. LOGISTICS / AWS"
                        value={newExpense.title}
                        onChange={e => setNewExpense({...newExpense, title: e.target.value})}
                      />
                   </div>
                   <div>
                      <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-3">CATEGORY / TAG</label>
                      <select 
                        required
                        className="input h-14 bg-white/5"
                        value={newExpense.category}
                        onChange={e => setNewExpense({...newExpense, category: e.target.value})}
                      >
                        {CATEGORIES.map(c => <option key={c.name} value={c.name}>{c.name.toUpperCase()}</option>)}
                      </select>
                   </div>
                </div>
                <div className="flex gap-4 pt-10">
                  <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary flex-1">Abort</button>
                  <button type="submit" className="btn-primary flex-1">Commit Entry</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Expenses;
