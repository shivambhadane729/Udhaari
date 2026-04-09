import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { formatCurrency } from '../utils/engine';
import { 
  Plus, 
  Search, 
  ShoppingBag, 
  Coffee, 
  Car, 
  Home, 
  Trash2,
  Calendar,
  Tag
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = [
  { name: 'Food', icon: Coffee, color: 'text-orange-400', bg: 'bg-orange-400/10' },
  { name: 'Shopping', icon: ShoppingBag, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  { name: 'Transport', icon: Car, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  { name: 'Rent', icon: Home, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
];

const Expenses = () => {
  const [expenses, setExpenses] = useState([
    { id: 1, title: 'Starbucks Coffee', amount: 450, category: 'Food', date: '2024-04-08' },
    { id: 2, title: 'Uber Ride', amount: 320, category: 'Transport', date: '2024-04-07' },
    { id: 3, title: 'Monthly Rent', amount: 15000, category: 'Rent', date: '2024-04-01' },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newExpense, setNewExpense] = useState({ title: '', amount: '', category: 'Food' });

  const handleAdd = (e) => {
    e.preventDefault();
    const expense = {
      ...newExpense,
      id: Date.now(),
      amount: parseFloat(newExpense.amount),
      date: new Date().toISOString().split('T')[0]
    };
    setExpenses([expense, ...expenses]);
    setShowAddModal(false);
    setNewExpense({ title: '', amount: '', category: 'Food' });
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  return (
    <div className="flex min-h-screen bg-background text-zinc-100">
      <Sidebar />
      <main className="ml-64 flex-1 p-12 max-w-7xl mx-auto w-full">
        <header className="mb-14 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">Personal Spending</h1>
            <p className="text-zinc-500 mt-2 font-medium">Individual transactions tracking</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center gap-2 group"
          >
            <div className="bg-white/20 p-1 rounded-lg group-hover:rotate-90 transition-transform">
              <Plus size={18} />
            </div>
            New Transaction
          </button>
        </header>

        {/* Filters */}
        <div className="flex gap-4 mb-12">
          <div className="relative flex-1 max-w-xl group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-primary transition-colors" size={20} />
            <input className="input pl-14 h-14" placeholder="Search your history..." />
          </div>
          <button className="btn-secondary h-14 px-8 font-bold flex items-center gap-2">
            Recent Only
          </button>
        </div>

        {/* Expense List */}
        <div className="space-y-4">
          <AnimatePresence initial={false}>
            {expenses.map((expense) => {
              const category = CATEGORIES.find(c => c.name === expense.category) || CATEGORIES[0];
              return (
                <motion.div
                  key={expense.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-surface-container border border-white/[0.03] p-5 rounded-[2rem] flex items-center justify-between group hover:border-white/10 transition-all hover:shadow-2xl"
                >
                  <div className="flex items-center gap-6">
                    <div className={`w-14 h-14 flex items-center justify-center rounded-3xl ${category.bg} ${category.color}`}>
                      <category.icon size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-zinc-100">{expense.title}</h3>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="flex items-center gap-1.5 text-xs font-bold text-zinc-500 uppercase tracking-widest">
                          <Tag size={12} /> {expense.category}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs font-bold text-zinc-500 uppercase tracking-widest">
                          <Calendar size={12} /> {expense.date}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-10">
                    <span className="text-2xl font-black text-white">{formatCurrency(expense.amount)}</span>
                    <button 
                      onClick={() => deleteExpense(expense.id)}
                      className="p-3 text-zinc-700 hover:text-accent bg-white/[0.02] hover:bg-accent/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-100 scale-90"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Add Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="glass-card w-full max-w-xl border-white/5 bg-surface"
            >
              <div className="mb-8">
                <h2 className="text-3xl font-black mb-2">New Expense</h2>
                <p className="text-zinc-500 font-medium">Add a personal transaction to your history</p>
              </div>

              <form onSubmit={handleAdd} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-zinc-500 uppercase tracking-widest mb-3">What for?</label>
                  <input 
                    required 
                    className="input h-14" 
                    placeholder="e.g. Weekly Groceries"
                    value={newExpense.title}
                    onChange={e => setNewExpense({...newExpense, title: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-zinc-500 uppercase tracking-widest mb-3">How Much? (₹)</label>
                    <input 
                      required 
                      type="number" 
                      className="input h-14" 
                      placeholder="0.00"
                      value={newExpense.amount}
                      onChange={e => setNewExpense({...newExpense, amount: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-zinc-500 uppercase tracking-widest mb-3">Category</label>
                    <div className="relative">
                      <select 
                        className="input h-14 appearance-none"
                        value={newExpense.category}
                        onChange={e => setNewExpense({...newExpense, category: e.target.value})}
                      >
                        {CATEGORIES.map(c => (
                          <option key={c.name} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                      <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                        <Plus size={18} className="rotate-45" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 pt-6">
                  <button 
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="btn-secondary flex-1 h-14"
                  >
                    Discard
                  </button>
                  <button type="submit" className="btn-primary flex-1 h-14">
                    Track Expense
                  </button>
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
