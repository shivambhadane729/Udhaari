import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { formatCurrency } from '../utils/engine';
import { 
  Plus, 
  Search, 
  Filter, 
  ShoppingBag, 
  Coffee, 
  Car, 
  Home, 
  MoreHorizontal,
  Trash2
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
      <main className="ml-64 flex-1 p-8">
        <header className="mb-10 flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-1">Personal Expenses</h1>
            <p className="text-zinc-500">Track your individual spending</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={18} />
            Add Expense
          </button>
        </header>

        {/* Filters */}
        <div className="flex gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input className="input pl-10" placeholder="Search transactions..." />
          </div>
          <button className="btn-secondary flex items-center gap-2">
            <Filter size={18} />
            Filters
          </button>
        </div>

        {/* Expense List */}
        <div className="space-y-3">
          <AnimatePresence>
            {expenses.map((expense) => {
              const category = CATEGORIES.find(c => c.name === expense.category) || CATEGORIES[0];
              return (
                <motion.div
                  key={expense.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="glass-card py-4 flex items-center justify-between group"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${category.bg} ${category.color}`}>
                      <category.icon size={22} />
                    </div>
                    <div>
                      <h3 className="font-semibold">{expense.title}</h3>
                      <p className="text-zinc-500 text-sm">{expense.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="text-lg font-bold">{formatCurrency(expense.amount)}</span>
                    <button 
                      onClick={() => deleteExpense(expense.id)}
                      className="p-2 text-zinc-600 hover:text-accent opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Add Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="glass-card w-full max-w-md border-white/10"
            >
              <h2 className="text-xl font-bold mb-6">New Expense</h2>
              <form onSubmit={handleAdd} className="space-y-4">
                <div>
                  <label className="block text-sm text-zinc-400 mb-1.5">Description</label>
                  <input 
                    required 
                    className="input" 
                    placeholder="e.g. Starbucks Coffee"
                    value={newExpense.title}
                    onChange={e => setNewExpense({...newExpense, title: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-zinc-400 mb-1.5">Amount (₹)</label>
                    <input 
                      required 
                      type="number" 
                      className="input" 
                      placeholder="0.00"
                      value={newExpense.amount}
                      onChange={e => setNewExpense({...newExpense, amount: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-zinc-400 mb-1.5">Category</label>
                    <select 
                      className="input"
                      value={newExpense.category}
                      onChange={e => setNewExpense({...newExpense, category: e.target.value})}
                    >
                      {CATEGORIES.map(c => (
                        <option key={c.name} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button 
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary flex-1">
                    Add Transaction
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
