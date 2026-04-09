import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { calculateNetSpend, formatCurrency } from '../utils/engine';
import { useAuth } from '../contexts/AuthContext';
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownRight, 
  Plus,
  Zap,
  ShieldCheck,
  Info
} from 'lucide-react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const Dashboard = () => {
  const { user } = useAuth();
  
  // Mock data for initial UI check
  const [personalExpenses] = useState([
    { id: 1, amount: 2500, category: 'Food', date: '2024-04-01' },
    { id: 2, amount: 1200, category: 'Transport', date: '2024-04-02' },
  ]);

  const [groupExpenses] = useState([
    { 
      id: 1, 
      amount: 4000, 
      paidBy: user?.uid || 'user1', 
      splits: [
        { userId: user?.uid || 'user1', amount: 1000 },
        { userId: 'other1', amount: 3000 },
      ]
    }
  ]);

  const stats = calculateNetSpend(personalExpenses, groupExpenses, user?.uid || 'user1');

  const chartData = [
    { name: 'Personal', value: stats.personal, color: '#a3b3ff' },
    { name: 'Groups', value: stats.groupShare, color: '#c2efd0' },
  ];

  return (
    <div className="flex min-h-screen bg-background text-zinc-100 selection:bg-primary/20">
      <Sidebar />
      <main className="ml-64 flex-1 p-12 max-w-7xl mx-auto w-full">
        <header className="mb-14 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-[0.2em] mb-3">
              <Zap size={14} />
              Live Insights
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight">Overview</h1>
          </div>
          <div className="flex gap-4">
            <button className="btn-secondary group">
              <span className="flex items-center gap-2">
                <Plus size={18} className="text-zinc-500 group-hover:text-white transition-colors" />
                Personal
              </span>
            </button>
            <button className="btn-primary flex items-center gap-2 px-8">
              <Plus size={18} />
              New Shared
            </button>
          </div>
        </header>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-8 glass-card border-white/[0.03] relative overflow-hidden flex flex-col justify-between"
          >
            <div className="relative z-10 w-full">
              <div className="flex justify-between items-start mb-10 text-zinc-400">
                <span className="font-semibold text-sm">True Net Outflow</span>
                <span className="p-2 rounded-full bg-white/5"><ShieldCheck size={20} className="text-primary" /></span>
              </div>
              
              <div className="mb-12">
                <h2 className="text-7xl font-black tracking-tighter text-white mb-2">
                  {formatCurrency(stats.netSpend)}
                </h2>
                <div className="flex items-center gap-2 text-zinc-500 font-medium">
                  <span className="text-secondary flex items-center gap-0.5">
                    <ArrowDownRight size={16} /> 12%
                  </span>
                  than last month
                </div>
              </div>

              <div className="grid grid-cols-3 gap-8 pt-8 border-t border-white/[0.05]">
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-2">Gross Paid</p>
                  <p className="text-xl font-bold">{formatCurrency(stats.grossPaid)}</p>
                </div>
                <div>
                  <p className="text-[10px] text-secondary/60 uppercase tracking-widest font-bold mb-2">To Receive</p>
                  <p className="text-xl font-bold text-secondary">{formatCurrency(stats.owedToMe)}</p>
                </div>
                <div>
                  <p className="text-[10px] text-accent/60 uppercase tracking-widest font-bold mb-2">You Owe</p>
                  <p className="text-xl font-bold text-accent">{formatCurrency(stats.iOweOthers)}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Snitch/Insight Section */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            <div className="metric-card h-full flex flex-col items-center justify-center text-center">
              <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest mb-6">Split Analysis</p>
              <div className="w-full h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      innerRadius={55}
                      outerRadius={75}
                      paddingAngle={10}
                      dataKey="value"
                      stroke="none"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#121214', border: 'none', borderRadius: '16px', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)' }}
                      itemStyle={{ color: '#fff', fontSize: '12px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 mt-6">
                <div className="flex items-center gap-3 text-sm font-semibold">
                   <div className="w-2 h-2 rounded-full bg-primary" />
                   <span>Personal (72%)</span>
                </div>
                <div className="flex items-center gap-3 text-sm font-semibold">
                   <div className="w-2 h-2 rounded-full bg-secondary" />
                   <span>Groups (28%)</span>
                </div>
              </div>
            </div>
            
            {/* UI Snitch Pattern (Contextual Tip) */}
            <motion.div 
               whileHover={{ x: 5 }}
               className="bg-primary/10 border border-primary/20 rounded-3xl p-6 flex gap-4"
            >
              <div className="p-2 h-fit bg-primary/20 rounded-xl text-primary">
                <Info size={18} />
              </div>
              <div>
                <p className="font-bold text-sm mb-1">Financial Snitch</p>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  You are owed <strong>{formatCurrency(stats.owedToMe)}</strong>. Settling up now would reduce your net outflow by 30%.
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Action Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <SmallStatCard 
            title="Avg. Daily" 
            value={formatCurrency(stats.netSpend / 30)} 
            icon={TrendingDown}
            color="text-accent"
          />
          <SmallStatCard 
            title="Projected" 
            value={formatCurrency(stats.netSpend * 1.1)} 
            icon={TrendingUp}
            color="text-secondary"
          />
          <SmallStatCard 
            title="Groups" 
            value="4 Active" 
            icon={ArrowUpRight}
            color="text-primary"
          />
        </section>
      </main>
    </div>
  );
};

const SmallStatCard = ({ title, value, icon: Icon, color }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="metric-card flex flex-col justify-between h-32"
  >
    <div className="flex justify-between items-start">
      <p className="text-zinc-500 font-bold text-[10px] uppercase tracking-widest">{title}</p>
      <Icon size={16} className={color} />
    </div>
    <p className="text-2xl font-black">{value}</p>
  </motion.div>
);

export default Dashboard;
