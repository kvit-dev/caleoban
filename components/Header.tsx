'use client';

import { useState } from 'react';
import { format, startOfWeek, endOfWeek } from 'date-fns';
import { uk } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react'; 
import ProfileDropdown from "./ProfileDropdown";
import { Task } from '@/lib/tasks';

interface HeaderProps {
  currentDate: Date;
  onNavigate: (offset: number) => void;
  view: 'month' | 'week';
  setView: (view: 'month' | 'week') => void;
  user: any;
  onAuthClick: () => void;
  tasks: Task[];
  isQuietMode: boolean;
  setIsQuietMode: (val: boolean) => void;
}

export default function Header({ 
  currentDate, onNavigate, view, setView, user, onAuthClick, tasks, isQuietMode, setIsQuietMode 
}: HeaderProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const dateLabel = view === 'month' 
    ? format(currentDate, 'LLLL yyyy', { locale: uk })
    : `${format(startOfWeek(currentDate, { weekStartsOn: 1 }), 'd')} - ${format(endOfWeek(currentDate, { weekStartsOn: 1 }), 'd MMMM yyyy', { locale: uk })}`;

  return (
    <header className="flex flex-wrap lg:flex-nowrap justify-between items-center mb-6 md:mb-10 bg-white dark:bg-slate-900 p-4 md:p-5 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
      
      <div className="order-1 flex items-center gap-3 md:gap-6 lg:flex-1">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg text-sm md:text-base">C</div>
          <h1 className="text-xl font-black tracking-tight text-slate-800 dark:text-white hidden sm:block">Caleoban</h1>
        </div>

        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button onClick={() => setView('month')} className={`px-3 md:px-4 py-1.5 rounded-lg text-[10px] md:text-xs font-bold transition-all ${view === 'month' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600' : 'text-slate-500'}`}>Місяць</button>
          <button onClick={() => setView('week')} className={`px-3 md:px-4 py-1.5 rounded-lg text-[10px] md:text-xs font-bold transition-all ${view === 'week' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600' : 'text-slate-500'}`}>Тиждень</button>
        </div>
      </div>

      <div className="order-2 lg:order-3 flex items-center gap-2 md:gap-3 lg:flex-1 justify-end">
        {user ? (
          <div className="relative">
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)} 
              className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden border-2 border-white dark:border-slate-800 shadow-md bg-blue-600 flex items-center justify-center text-white font-black text-[10px]"
            >
              {user.photoURL ? <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" /> : user.email[0].toUpperCase()}
            </button>
            {isProfileOpen && <ProfileDropdown user={user} onClose={() => setIsProfileOpen(false)} tasks={tasks} isQuietMode={isQuietMode} setIsQuietMode={setIsQuietMode} />}
          </div>
        ) : (
          <button onClick={onAuthClick} className="bg-blue-600 text-white px-4 md:px-6 py-2 rounded-xl font-bold text-xs md:text-sm">Увійти</button>
        )}
      </div>

      <div className="order-3 lg:order-2 w-full lg:w-auto mt-4 lg:mt-0 lg:flex-1 flex justify-center">
        <div className="flex items-center gap-2 md:gap-4 bg-slate-100 dark:bg-slate-800 p-1 md:p-1.5 rounded-2xl w-full lg:w-auto justify-between lg:justify-center max-w-sm lg:max-w-none shadow-sm">
          <button onClick={() => onNavigate(-1)} className="p-1.5 md:p-2 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all"><ChevronLeft size={18} /></button>
          <span className="font-bold min-w-30 text-center capitalize tracking-wide text-xs md:text-sm dark:text-slate-200">{dateLabel}</span>
          <button onClick={() => onNavigate(1)} className="p-1.5 md:p-2 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all"><ChevronRight size={18} /></button>
        </div>
      </div>
    </header>
  );
}