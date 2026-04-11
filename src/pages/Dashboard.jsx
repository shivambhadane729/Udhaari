import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { formatCurrency } from '../utils/engine';
import { useAuth } from '../contexts/AuthContext';
import { useEcosystem } from '../contexts/EcosystemContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const { accounts, transactions, loading, addTransaction, updateAccountBalance } = useEcosystem();
  
  const [isAdding, setIsAdding] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [newExpense, setNewExpense] = useState({ title: '', amount: '', category: 'Food', accountId: '' });
  const [editAmount, setEditAmount] = useState('');

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!newExpense.accountId) return alert('Select an account');
    try {
      await addTransaction({
        ...newExpense,
        amount: parseFloat(newExpense.amount),
        date: new Date().toISOString().split('T')[0]
      });
      setIsAdding(false);
      setNewExpense({ title: '', amount: '', category: 'Food', accountId: '' });
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUpdateBalance = async (e) => {
    e.preventDefault();
    await updateAccountBalance(editingAccount.id, editAmount);
    setEditingAccount(null);
  };

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
       <Loader2 className="animate-spin text-secondary" size={40} />
    </div>
  );

  const totalBalance = accounts.reduce((acc, curr) => acc + curr.balance, 0);

  return (
    <div className="flex min-h-screen bg-background font-body text-primary">
      <Sidebar />
      <main className="ml-72 flex-1 p-16 max-w-7xl mx-auto w-full">
        
        {/* Monolithic Header */}
        <header className="mb-20 flex items-end justify-between border-b border-slate-200 pb-10">
          <div>
            <span className="text-secondary tracking-[0.4em] text-[10px] font-bold mb-4 uppercase inline-block">Ecosystem / Live Status</span>
            <h1 className="text-monolith text-6xl uppercase tracking-tighter">OBSIDIAN HUB</h1>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => setIsAdding(true)}
              className="btn-primary h-14 flex items-center gap-3"
            >
               <span className="material-symbols-outlined text-base">add</span>
               ENTRY
            </button>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-12">
          
          {/* Main Content Area */}
          <section className="col-span-12 lg:col-span-8 space-y-12">
            
            {/* Total Liquidity */}
            <div className="glass-card relative overflow-hidden group border-slate-100">
               <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-[100px] -mr-48 -mt-48 transition-transform duration-1000 group-hover:scale-125" />
               <div className="relative z-10">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-10 block">AGGREGATE LIQUIDITY / GLOBAL</span>
                  <h2 className="text-monolith text-8xl tracking-tighter mb-8">
                     {formatCurrency(totalBalance)}
                  </h2>
                  <div className="flex items-center gap-4">
                     <div className="h-1 flex-1 bg-slate-100 overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: '65%' }}
                          className="h-full bg-white transition-all duration-1000"
                        />
                     </div>
                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Reserve</span>
                  </div>
               </div>
            </div>

            {/* Multiple Accounts Grid */}
            <div className="grid sm:grid-cols-3 gap-6">
               {accounts.map(acc => (
                 <div key={acc.id} className="metric-card bg-surface group hover:border-secondary/20 transition-all shadow-sm">
                    <div className="flex justify-between items-start mb-10">
                       <span className="material-symbols-outlined text-secondary text-3xl">{acc.icon}</span>
                       <button 
                        onClick={() => { setEditingAccount(acc); setEditAmount(acc.balance); }}
                        className="opacity-0 group-hover:opacity-100 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-secondary transition-all"
                       >
                         Edit
                       </button>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{acc.name}</p>
                    <p className="text-2xl font-bold tracking-tight text-primary">{formatCurrency(acc.balance)}</p>
                 </div>
               ))}
            </div>

            {/* Activity Stream */}
            <div className="glass-card !p-0 border-slate-100 overflow-hidden shadow-sm">
               <div className="px-10 py-6 bg-slate-50 flex justify-between items-center text-[10px] font-bold tracking-widest uppercase text-slate-500">
                  <span>LEDGER STREAM</span>
                  <span className="text-secondary">SYNCED</span>
               </div>
               <div className="divide-y divide-slate-100">
                  {transactions.slice(0, 5).map(trans => (
                    <div key={trans.id} className="px-10 py-6 flex items-center justify-between group hover:bg-slate-50 transition-all">
                       <div className="flex items-center gap-6">
                          <div className="w-12 h-12 bg-slate-100 flex items-center justify-center rounded-xl">
                             <span className="material-symbols-outlined text-xl text-secondary">payments</span>
                          </div>
                          <div>
                             <p className="text-sm font-bold uppercase tracking-tight text-primary">{trans.title}</p>
                             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                                {accounts.find(a => a.id === trans.accountId)?.name || 'UNKNOWN'}
                             </p>
                          </div>
                       </div>
                       <span className="text-sm font-bold tracking-tight text-primary">-{formatCurrency(trans.amount)}</span>
                    </div>
                  ))}
                  {transactions.length === 0 && (
                     <div className="p-20 text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        NO TRANSACTION DATA DETECTED
                     </div>
                  )}
               </div>
            </div>
          </section>

          {/* Quick Insights */}
          <aside className="col-span-12 lg:col-span-4 space-y-12">
             <div className="metric-card bg-secondary text-white border-none group relative overflow-hidden shadow-lg shadow-secondary/10">
                <div className="relative z-10">
                   <h4 className="text-monolith text-xl uppercase tracking-widest mb-4 text-white">PROTOCOL ALERT</h4>
                   <p className="text-xs opacity-80 leading-relaxed mb-10 font-bold uppercase tracking-tight">
                      System health at 98%. Aggregate accounts successfully mapped to Firebase core.
                   </p>
                   <button className="text-[10px] font-bold uppercase tracking-[0.2em] bg-white text-secondary px-8 py-4 hover:bg-slate-100 transition-all shadow-xl">
                      VIEW REPORT
                   </button>
                </div>
                <span className="material-symbols-outlined absolute -bottom-10 -right-10 text-white/10 text-[15rem] group-hover:scale-110 transition-transform duration-1000">security</span>
             </div>

             <div className="metric-card p-10 bg-slate-50 border-slate-100 text-[10px] font-bold tracking-[0.3em] uppercase text-slate-500 space-y-6">
                <div className="flex justify-between items-center">
                   <span>DATA CLOUD</span>
                   <span className="text-primary font-bold">FIRESTORE / ACTIVE</span>
                </div>
                <div className="flex justify-between items-center">
                   <span>SECURE HUB</span>
                   <span className="text-primary font-bold">AES-256</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                   <span>LATENCY</span>
                   <span className="text-secondary tracking-normal">0.02ms</span>
                </div>
             </div>
          </aside>
        </div>

        {/* MODALS */}
        <AnimatePresence>
          {isAdding && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-slate-900/40 backdrop-blur-md">
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="glass-card max-w-xl w-full"
              >
                <h3 className="text-monolith text-3xl mb-8 uppercase text-center">INITIALIZE ENTRY</h3>
                <form onSubmit={handleAddExpense} className="space-y-8">
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-3">SOURCE ACCOUNT</label>
                      <select 
                        required
                        className="input h-14 bg-white/5"
                        value={newExpense.accountId}
                        onChange={e => setNewExpense({...newExpense, accountId: e.target.value})}
                      >
                        <option value="">SELECT SOURCE</option>
                        {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name.toUpperCase()}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-3">AMOUNT (₹)</label>
                      <input 
                        required
                        type="number"
                        className="input h-14 bg-white/5"
                        placeholder="0.00"
                        value={newExpense.amount}
                        onChange={e => setNewExpense({...newExpense, amount: e.target.value})}
                      />
                    </div>
                  </div>
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
                  <div className="flex gap-4 pt-10">
                    <button type="button" onClick={() => setIsAdding(false)} className="btn-secondary flex-1">Abort</button>
                    <button type="submit" className="btn-primary flex-1">Commit</button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}

          {editingAccount && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-slate-900/40 backdrop-blur-md">
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="glass-card max-w-md w-full"
              >
                <h3 className="text-monolith text-2xl mb-8 uppercase text-center">SYNC {editingAccount.name}</h3>
                <form onSubmit={handleUpdateBalance} className="space-y-8">
                  <div>
                    <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-3">CURRENT BALANCE (₹)</label>
                    <input 
                      required
                      type="number"
                      className="input h-14 bg-white/5"
                      value={editAmount}
                      onChange={e => setEditAmount(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-4">
                    <button type="button" onClick={() => setEditingAccount(null)} className="btn-secondary flex-1">Close</button>
                    <button type="submit" className="btn-primary flex-1">Update</button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
};

export default Dashboard;
