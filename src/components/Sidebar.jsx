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
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-zinc-200 flex flex-col p-6 z-50">
      <div className="flex items-center gap-3 px-2 mb-10 group cursor-default">
        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 duration-200">
          <Wallet className="text-primary" size={24} />
        </div>
        <div>
          <span className="text-xl font-bold tracking-tight text-zinc-900 block">Udhaari</span>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group font-medium",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon size={20} className={cn("transition-transform duration-200", isActive && "scale-105")} />
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-zinc-200 space-y-4">
        <div className="px-4 py-3 rounded-lg bg-surface flex flex-col">
          <span className="text-xs font-semibold text-zinc-500 mb-0.5">Signed in as</span>
          <span className="text-sm font-medium truncate text-zinc-900">{user?.email || 'User'}</span>
        </div>
        
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-zinc-600 hover:bg-zinc-100 hover:text-accent font-medium transition-all duration-200 group"
        >
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
