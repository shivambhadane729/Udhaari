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
    { name: 'Personal', value: stats.personal, color: '#1a73e8' },
    { name: 'Groups', value: stats.groupShare, color: '#188038' },
  ];

  return (
    <div className="flex min-h-screen bg-surface font-sans">
      <Sidebar />
      <main className="ml-64 flex-1 p-10 max-w-6xl mx-auto w-full">
        <header className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-medium text-zinc-900 tracking-tight">Overview</h1>
            <p className="text-zinc-500 mt-1">Your financial summary</p>
          </div>
          <div className="flex gap-3">
            <button className="btn-secondary flex items-center gap-2">
              <Plus size={18} />
              Personal
            </button>
            <button className="btn-primary flex items-center gap-2">
              <Plus size={18} />
              New Shared
            </button>
          </div>
        </header>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-8 glass-card border-transparent relative overflow-hidden flex flex-col justify-between"
          >
            <div className="relative z-10 w-full">
              <div className="flex justify-between items-start mb-6 text-zinc-600">
                <span className="font-medium text-sm">True Net Outflow</span>
                <span className="p-2 rounded-full bg-zinc-100 text-zinc-500"><ShieldCheck size={20} /></span>
              </div>
              
              <div className="mb-10">
                <h2 className="text-5xl font-normal tracking-tight text-zinc-900 mb-2">
                  {formatCurrency(stats.netSpend)}
                </h2>
                <div className="flex items-center gap-2 text-sm text-zinc-500">
                  <span className="text-secondary flex items-center gap-1 font-medium bg-secondary-container px-2 py-0.5 rounded-sm">
                    <ArrowDownRight size={14} /> 12%
                  </span>
                  vs last month
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-zinc-200">
                <div>
                  <p className="text-xs text-zinc-500 font-medium mb-1">Gross Paid</p>
                  <p className="text-xl font-medium text-zinc-900">{formatCurrency(stats.grossPaid)}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 font-medium mb-1">To Receive</p>
                  <p className="text-xl font-medium text-secondary">{formatCurrency(stats.owedToMe)}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 font-medium mb-1">You Owe</p>
                  <p className="text-xl font-medium text-accent">{formatCurrency(stats.iOweOthers)}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Snitch/Insight Section */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="metric-card h-full flex flex-col items-center justify-center text-center">
              <p className="text-zinc-600 font-medium text-sm mb-4">Split Analysis</p>
              <div className="w-full h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      innerRadius={45}
                      outerRadius={60}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#fff', border: '1px solid #e8eaed', borderRadius: '4px', boxShadow: '0 1px 3px 0 rgba(60,64,67,.3)' }}
                      itemStyle={{ color: '#202124', fontSize: '13px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-1.5 mt-4 w-full px-4">
                <div className="flex items-center justify-between text-sm text-zinc-600">
                   <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-primary" />
                     <span>Personal</span>
                   </div>
                   <span className="font-medium text-zinc-900">72%</span>
                </div>
                <div className="flex items-center justify-between text-sm text-zinc-600">
                   <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-secondary" />
                     <span>Groups</span>
                   </div>
                   <span className="font-medium text-zinc-900">28%</span>
                </div>
              </div>
            </div>
            
            {/* UI Snitch Pattern (Contextual Tip) */}
            <motion.div 
               className="bg-primary-container/50 border border-primary/20 rounded-lg p-5 flex gap-4"
            >
              <div className="text-primary mt-0.5">
                <Info size={18} />
              </div>
              <div>
                <p className="font-medium text-sm text-zinc-900 mb-1">Financial insight</p>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  You are owed <strong>{formatCurrency(stats.owedToMe)}</strong>. Settling up now would reduce your net outflow by 30%.
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Action Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SmallStatCard 
            title="Avg. Daily" 
            value={formatCurrency(stats.netSpend / 30)} 
            icon={TrendingDown}
            color="text-secondary"
          />
          <SmallStatCard 
            title="Projected" 
            value={formatCurrency(stats.netSpend * 1.1)} 
            icon={TrendingUp}
            color="text-accent"
          />
          <SmallStatCard 
            title="Active Groups" 
            value="4 Teams" 
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
    className="metric-card flex flex-col justify-between h-28"
  >
    <div className="flex justify-between items-start">
      <p className="text-zinc-600 font-medium text-sm">{title}</p>
      <Icon size={18} className={color} />
    </div>
    <p className="text-2xl font-medium text-zinc-900">{value}</p>
  </motion.div>
);

export default Dashboard;
