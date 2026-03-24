import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { supabase } from '../lib/supabase';

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-dark flex">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} user={user} />
      
      <div className="flex-1 flex flex-col md:ml-64 min-w-0">
        <Navbar toggleSidebar={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
          <Outlet context={{ user }} />
        </main>
      </div>
    </div>
  );
}
