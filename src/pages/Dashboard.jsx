import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { calculateNetSpend, formatCurrency } from '../utils/engine';
import { useAuth } from '../contexts/AuthContext';
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownRight, 
  Plus,
  CreditCard,
  Users
} from 'lucide-react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const Dashboard = () => {
  const { user } = useAuth();
  
  // Mock data for initial UI check
  const [personalExpenses] = useState([
    { id: 1, amount: 1500, category: 'Food', date: '2024-04-01' },
    { id: 2, amount: 2000, category: 'Transport', date: '2024-04-02' },
  ]);

  const [groupExpenses] = useState([
    { 
      id: 1, 
      amount: 4000, 
      paidBy: user?.uid || 'user1', 
      splits: [
        { userId: user?.uid || 'user1', amount: 1000 },
        { userId: 'other1', amount: 1500 },
        { userId: 'other2', amount: 1500 },
      ]
    },
    { 
      id: 2, 
      amount: 3000, 
      paidBy: 'other1', 
      splits: [
        { userId: user?.uid || 'user1', amount: 1000 },
        { userId: 'other1', amount: 1000 },
        { userId: 'other2', amount: 1000 },
      ]
    }
  ]);

  const stats = calculateNetSpend(personalExpenses, groupExpenses, user?.uid || 'user1');

  const chartData = [
    { name: 'Personal', value: stats.personal, color: '#6366f1' },
    { name: 'Groups', value: stats.groupShare, color: '#10b981' },
  ];

  return (
    <div className="flex min-h-screen bg-background text-zinc-100">
      <Sidebar />
      <main className="ml-64 flex-1 p-8">
        <header className="mb-10 flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-1">Financial Intelligence</h1>
            <p className="text-zinc-500">Welcome back, {user?.email?.split('@')[0]}</p>
          </div>
          <div className="flex gap-3">
            <button className="btn-secondary flex items-center gap-2">
              <Plus size={18} />
              Personal
            </button>
            <button className="btn-primary flex items-center gap-2">
              <Users size={18} />
              New Group
            </button>
          </div>
        </header>

        {/* Hero Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-2 glass-card bg-gradient-to-br from-primary/20 to-transparent border-primary/20 overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Wallet size={120} />
            </div>
            <div className="relative z-10">
              <p className="text-zinc-400 font-medium mb-1">True Net Spend</p>
              <h2 className="text-5xl font-bold tracking-tight mb-6">
                {formatCurrency(stats.netSpend)}
              </h2>
              <div className="flex gap-8">
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Gross Paid</p>
                  <p className="text-lg font-semibold">{formatCurrency(stats.grossPaid)}</p>
                </div>
                <div>
                  <p className="text-xs text-secondary/60 uppercase tracking-wider mb-1">Owed to me</p>
                  <p className="text-lg font-semibold text-secondary">{formatCurrency(stats.owedToMe)}</p>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="glass-card flex flex-col justify-center items-center">
            <p className="text-zinc-400 font-medium mb-4">Spend Breakdown</p>
            <div className="w-full h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#161618', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex gap-6 mt-4">
              {chartData.map(item => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-zinc-400">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Secondary Stats */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Money Owed" 
            value={formatCurrency(stats.iOweOthers)} 
            icon={TrendingDown}
            color="text-accent"
            trend={-12}
          />
          <StatCard 
            title="Money to Receive" 
            value={formatCurrency(stats.owedToMe)} 
            icon={TrendingUp}
            color="text-secondary"
            trend={+24}
          />
          <StatCard 
            title="Monthly Savings" 
            value="Coming Soon" 
            icon={CreditCard}
            color="text-primary"
          />
          <StatCard 
            title="Active Groups" 
            value="4" 
            icon={Users}
            color="text-zinc-400"
          />
        </section>
      </main>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color, trend }) => (
  <motion.div 
    whileHover={{ y: -4 }}
    className="glass-card p-5"
  >
    <div className="flex justify-between items-start mb-4">
      <div className={cn("p-2 rounded-lg bg-white/5", color)}>
        <Icon size={20} />
      </div>
      {trend && (
        <span className={cn(
          "flex items-center text-xs font-medium",
          trend > 0 ? "text-secondary" : "text-accent"
        )}>
          {trend > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {Math.abs(trend)}%
        </span>
      )}
    </div>
    <p className="text-zinc-500 text-sm mb-1">{title}</p>
    <p className="text-xl font-bold">{value}</p>
  </motion.div>
);

function cn(...inputs) {
  return inputs.filter(Boolean).join(' ');
}

import { Wallet } from 'lucide-react';
export default Dashboard;
