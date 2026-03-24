import React from 'react';
import { Menu, Bell } from 'lucide-react';

interface NavbarProps {
  toggleSidebar: () => void;
}

export function Navbar({ toggleSidebar }: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 w-full bg-dark/80 backdrop-blur-md border-b border-border h-16 flex items-center justify-between px-4 md:px-8">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
        >
          <Menu size={24} />
        </button>
        <div className="md:hidden flex items-center gap-2">
          <span className="text-lg font-bold text-glow text-white">IkramiFy FX</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-gray-400 hover:text-neon transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-neon rounded-full box-glow"></span>
        </button>
      </div>
    </header>
  );
}
