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
  { name: 'Food', icon: Coffee, color: 'text-orange-600', bg: 'bg-orange-50' },
  { name: 'Shopping', icon: ShoppingBag, color: 'text-purple-600', bg: 'bg-purple-50' },
  { name: 'Transport', icon: Car, color: 'text-blue-600', bg: 'bg-blue-50' },
  { name: 'Rent', icon: Home, color: 'text-emerald-600', bg: 'bg-emerald-50' },
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
    <div className="flex min-h-screen bg-surface">
      <Sidebar />
      <main className="ml-64 flex-1 p-10 max-w-5xl mx-auto w-full">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-medium tracking-tight text-zinc-900">Personal Spending</h1>
            <p className="text-zinc-500 mt-1">Individual transactions tracking</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={18} />
            New Transaction
          </button>
        </header>

        {/* Filters */}
        <div className="flex gap-4 mb-8">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-primary transition-colors" size={20} />
            <input className="input pl-12 h-12 text-sm" placeholder="Search your history..." />
          </div>
          <button className="btn-secondary h-12 px-6 font-medium flex items-center gap-2 border-zinc-200 bg-white">
            Recent Only
          </button>
        </div>

        {/* Expense List */}
        <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden shadow-sm">
          <AnimatePresence initial={false}>
            {expenses.map((expense, index) => {
              const category = CATEGORIES.find(c => c.name === expense.category) || CATEGORIES[0];
              return (
                <motion.div
                  key={expense.id}
                  layout
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`p-4 flex items-center justify-between group hover:bg-zinc-50 transition-colors ${index !== expenses.length - 1 ? 'border-b border-zinc-100' : ''}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 flex items-center justify-center rounded-full ${category.bg} ${category.color}`}>
                      <category.icon size={20} />
                    </div>
                    <div>
                      <h3 className="text-base font-medium text-zinc-900">{expense.title}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1.5 text-xs text-zinc-500">
                          <Tag size={12} /> {expense.category}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-zinc-500">
                          <Calendar size={12} /> {expense.date}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="text-lg font-medium text-zinc-900">{formatCurrency(expense.amount)}</span>
                    <button 
                      onClick={() => deleteExpense(expense.id)}
                      className="p-2 text-zinc-400 hover:text-accent hover:bg-accent/10 rounded-md opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          {expenses.length === 0 && (
            <div className="p-12 text-center text-zinc-500">
               No expenses found. Track a new transaction above.
            </div>
          )}
        </div>

        {/* Add Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-lg p-8 border border-zinc-200"
            >
              <div className="mb-6">
                <h2 className="text-2xl font-medium text-zinc-900 mb-1">New Expense</h2>
                <p className="text-zinc-500 text-sm">Add a personal transaction to your history</p>
              </div>

              <form onSubmit={handleAdd} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1.5">What for?</label>
                  <input 
                    required 
                    className="input" 
                    placeholder="e.g. Weekly Groceries"
                    value={newExpense.title}
                    onChange={e => setNewExpense({...newExpense, title: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1.5">Amount (₹)</label>
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
                    <label className="block text-sm font-medium text-zinc-700 mb-1.5">Category</label>
                    <div className="relative">
                      <select 
                        className="input appearance-none bg-white font-medium"
                        value={newExpense.category}
                        onChange={e => setNewExpense({...newExpense, category: e.target.value})}
                      >
                        {CATEGORIES.map(c => (
                          <option key={c.name} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 pt-6">
                  <button 
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="btn-secondary flex-1 border-zinc-200"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary flex-1">
                    Save Expense
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
