import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Sidebar = () => {
  const { logout, user } = useAuth();

  const navItems = [
    { icon: 'grid_view', label: 'Ecosystem', path: '/dashboard' },
    { icon: 'finance', label: 'Transactions', path: '/expenses' },
    { icon: 'groups_3', label: 'Monoliths', path: '/groups' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-72 bg-surface text-primary border-r border-slate-200 flex flex-col p-8 z-50">
      <div className="flex items-center gap-4 px-2 mb-20 group cursor-default">
        <div className="w-10 h-10 bg-primary text-white rounded-none flex items-center justify-center transition-all duration-300 group-hover:scale-110">
          <span className="material-symbols-outlined text-2xl font-bold">account_balance_wallet</span>
        </div>
        <div>
          <span className="text-xl font-extrabold tracking-tighter block font-headline uppercase">UDHAARI / OBSIDIAN</span>
        </div>
      </div>

      <nav className="flex-1 space-y-3">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-5 px-6 py-5 rounded-none transition-all duration-300 group font-headline text-xs uppercase tracking-[0.2em]",
                isActive 
                  ? "bg-secondary text-white shadow-2xl shadow-secondary/20" 
                  : "text-slate-500 hover:text-secondary hover:bg-secondary/5"
              )
            }
          >
            <span className="material-symbols-outlined text-2xl">{item.icon}</span>
            <span className="font-bold">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto pt-10 border-t border-slate-200 space-y-8">
        <div className="px-6 py-5 bg-slate-100 flex flex-col gap-2">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">AUTHORIZED OPERATOR</span>
          <span className="text-xs font-bold truncate tracking-tight uppercase">{user?.email?.split('@')[0] || 'ENTITY'}</span>
        </div>
        
        <button
          onClick={logout}
          className="flex items-center gap-5 px-6 py-5 w-full text-slate-500 hover:text-accent hover:bg-accent/5 transition-all duration-300 font-headline text-xs font-bold uppercase tracking-[0.2em]"
        >
          <span className="material-symbols-outlined text-2xl">logout</span>
          <span>Terminate</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
