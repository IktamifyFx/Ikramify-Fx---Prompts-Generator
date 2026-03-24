import React from 'react';
import { NavLink } from 'react-router';
import { Sparkles, History, TrendingUp, Settings, LogOut, LogIn } from 'lucide-react';
import { cn } from '../lib/utils';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { toast } from 'sonner';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  user: any;
}

export function Sidebar({ isOpen, setIsOpen, user }: SidebarProps) {
  const handleLogout = async () => {
    if (!isSupabaseConfigured()) return;
    await supabase.auth.signOut();
    toast.success('Logged out successfully');
  };

  const navItems = [
    { to: '/', icon: Sparkles, label: 'Generator' },
    { to: '/history', icon: History, label: 'History' },
    { to: '/trending', icon: TrendingUp, label: 'Trending' },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={cn(
        "fixed top-0 left-0 z-50 h-screen w-64 bg-card border-r border-border transition-transform duration-300 ease-in-out md:translate-x-0 flex flex-col",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-neon flex items-center justify-center text-darker font-bold box-glow">
            IF
          </div>
          <span className="text-xl font-bold tracking-wider text-glow text-white">IkramiFy FX</span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                isActive 
                  ? "bg-neon-dim text-neon border border-neon/30 box-glow" 
                  : "text-gray-400 hover:text-white hover:bg-border"
              )}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          {user ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 px-4 py-2">
                <div className="w-8 h-8 rounded-full bg-border flex items-center justify-center text-sm">
                  {user.email?.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-sm font-medium truncate">{user.email}</span>
                  <span className="text-xs text-neon">Pro Member</span>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2 text-gray-400 hover:text-red-400 transition-colors"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <NavLink 
              to="/auth"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-neon text-darker font-medium rounded-lg hover:bg-neon/90 transition-colors box-glow"
            >
              <LogIn size={18} />
              <span>Login / Sign Up</span>
            </NavLink>
          )}
        </div>
      </aside>
    </>
  );
}
