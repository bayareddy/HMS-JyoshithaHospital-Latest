import React from 'react';
import { Search, Bell, Plus, Menu, X } from 'lucide-react';

interface TopbarProps {
  title: string;
  onOpenModal: () => void;
  onSearch: (query: string) => void;
  onMenuClick?: () => void;
}

export function Topbar({ title, onOpenModal, onSearch, onMenuClick }: TopbarProps) {
  return (
    <div className="h-14 sm:h-[56px] bg-surface border-b border-border-subtle flex items-center gap-2 sm:gap-3 px-3 sm:px-5 shrink-0">
      {/* Mobile menu button */}
      <button 
        onClick={onMenuClick}
        className="lg:hidden p-2 -ml-1 rounded-md hover:bg-surface2 touch-manipulation"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5 text-gray-600" />
      </button>
      
      <h2 className="text-sm sm:text-[16px] font-medium flex-1 capitalize truncate">{title.replace('-', ' ')}</h2>
      
      {/* Search - hidden on small mobile */}
      <div className="relative hidden md:block">
        <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-[13px] h-[13px] text-gray-400 pointer-events-none" />
        <input 
          type="text" 
          placeholder="Search patients, doctors..." 
          onChange={(e) => onSearch(e.target.value)}
          className="bg-surface2 border border-border-subtle rounded-md py-[7px] pr-2.5 pl-7 text-[12px] text-gray-900 w-[160px] lg:w-[200px] outline-none focus:border-accent transition-colors"
        />
      </div>

      <button className="w-9 h-9 sm:w-[34px] sm:h-[34px] border border-border-subtle rounded-md bg-surface cursor-pointer flex items-center justify-center relative hover:bg-surface2 transition-colors touch-manipulation">
        <Bell className="w-[15px] h-[15px] text-gray-500" />
        <div className="absolute top-1.5 right-1.5 sm:top-[5px] sm:right-[5px] w-1.5 h-1.5 sm:w-[7px] sm:h-[7px] bg-danger rounded-full border-[1.5px] border-surface"></div>
      </button>

      <button 
        onClick={onOpenModal}
        className="px-2.5 sm:px-3.5 py-2 sm:py-[7px] bg-accent text-white border-none rounded-md text-[11px] sm:text-[12px] cursor-pointer flex items-center gap-1 font-medium hover:bg-accent-dark transition-colors touch-manipulation"
      >
        <Plus className="w-[13px] h-[13px]" />
        <span className="hidden sm:inline">New Patient</span>
        <span className="sm:hidden">Add</span>
      </button>
    </div>
  );
}
