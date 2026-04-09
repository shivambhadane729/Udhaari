import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ReceiptText, Users, LogOut, Wallet } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Sidebar = () => {
  const { logout, user } = useAuth();

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: ReceiptText, label: 'Expenses', path: '/expenses' },
    { icon: Users, label: 'Groups', path: '/groups' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 glass border-r border-white/5 flex flex-col p-4 z-50">
      <div className="flex items-center gap-3 px-2 mb-10">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
          <Wallet className="text-white" size={24} />
        </div>
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
          Udhaari
        </span>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                isActive 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "text-zinc-400 hover:bg-white/5 hover:text-white"
              )
            }
          >
            <item.icon size={20} className={cn("transition-colors")} />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto space-y-4">
        <div className="px-4 py-3 rounded-xl bg-white/5 border border-white/5">
          <div className="text-xs text-zinc-500 mb-1">Logged in as</div>
          <div className="text-sm font-medium truncate">{user?.email}</div>
        </div>
        
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-zinc-400 hover:bg-accent/10 hover:text-accent transition-all duration-200"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
