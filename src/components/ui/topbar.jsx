import React from 'react';
import { LucideSparkles, LucideSearch, LucideUser } from 'lucide-react';

export function Topbar() {
  return (
    <header className="w-full flex items-center justify-between px-6 py-4 bg-white/80 shadow-sm sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <LucideSparkles className="h-7 w-7 text-primary" />
        <span className="text-2xl font-extrabold text-primary tracking-tight">CrowdSpark</span>
      </div>
      <form className="flex items-center gap-2 bg-gray-100 rounded px-3 py-1 max-w-xs w-full">
        <LucideSearch className="h-5 w-5 text-gray-400" />
        <input
          className="bg-transparent outline-none border-0 text-sm w-full"
          placeholder="Search..."
        />
      </form>
      <div className="flex items-center gap-4">
        <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="avatar" className="h-9 w-9 rounded-full border-2 border-primary object-cover" />
      </div>
    </header>
  );
} 