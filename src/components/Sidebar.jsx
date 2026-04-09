import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ReceiptText, Users, LogOut, Wallet, Sparkles } from 'lucide-react';
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
    <aside className="fixed left-0 top-0 h-screen w-64 bg-surface border-r border-white/5 flex flex-col p-6 z-50">
      <div className="flex items-center gap-3 px-2 mb-10 group cursor-default">
        <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center shadow-glow-primary transition-transform group-hover:scale-110 duration-500">
          <Wallet className="text-primary" size={26} />
        </div>
        <div>
          <span className="text-xl font-bold tracking-tight block">Udhaari</span>
          <span className="text-[10px] uppercase tracking-widest text-primary font-bold">Intelligent</span>
        </div>
      </div>

      <nav className="flex-1 space-y-1.5">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 relative group overflow-hidden",
                isActive 
                  ? "bg-primary/10 text-primary shadow-sm" 
                  : "text-zinc-500 hover:bg-white/[0.03] hover:text-zinc-200"
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon size={22} className={cn("transition-transform duration-300", isActive && "scale-110")} />
                <span className="font-semibold">{item.label}</span>
                {isActive && (
                  <div className="absolute left-0 w-1 h-6 bg-primary rounded-r-full" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-white/5 space-y-4">
        <div className="px-4 py-4 rounded-3xl bg-surface-container border border-white/5 relative overflow-hidden group">
          <div className="absolute -right-2 -top-2 text-primary/10 transition-transform group-hover:scale-125 duration-700">
            <Sparkles size={48} />
          </div>
          <div className="text-[10px] uppercase font-bold text-zinc-600 mb-1">Active Account</div>
          <div className="text-sm font-semibold truncate text-zinc-300">{user?.email}</div>
        </div>
        
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3.5 w-full rounded-2xl text-zinc-500 hover:bg-accent/10 hover:text-accent transition-all duration-300 group"
        >
          <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold">Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
