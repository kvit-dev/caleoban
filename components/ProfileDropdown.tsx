'use client';

import { useState, useMemo, useEffect } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { auth, signOut } from "@/lib/firebase"; 
import { LogOut, PieChart, Bell, Zap, AlertCircle, ShieldOff } from "lucide-react"; 
import { Task } from "@/lib/tasks";
import { isBefore, parseISO, startOfWeek, endOfWeek } from "date-fns";

export default function ProfileDropdown({ user, onClose, tasks, isQuietMode, setIsQuietMode }: { user: any, onClose: () => void, tasks: Task[], isQuietMode: boolean, setIsQuietMode: (v: boolean) => void }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    localStorage.setItem('quiet_mode', isQuietMode.toString());
  }, [isQuietMode]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const done = tasks.filter(t => t.status === 'done').length;
    const percent = total > 0 ? Math.round((done / total) * 100) : 0;
    const now = new Date();
    const overdue = tasks.filter(t => t.dueDate && t.status !== 'done' && isBefore(parseISO(t.dueDate), now)).length;
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
    const highDoneThisWeek = tasks.filter(t => t.priority === 'high' && t.status === 'done' && parseISO(t.date) >= weekStart && parseISO(t.date) <= weekEnd).length;

    return { percent, overdue, highDoneThisWeek, total, done };
  }, [tasks]);

  return (
    <>
      <div className="fixed inset-0 z-45 bg-slate-900/20 backdrop-blur-sm md:bg-transparent md:backdrop-blur-none" onClick={onClose} />
      
      <motion.div 
        {...({ 
          initial: isMobile ? { y: "100%" } : { opacity: 0, y: 10, scale: 0.95 }, 
          animate: { opacity: 1, y: 0, scale: 1 }, 
          exit: isMobile ? { y: "100%" } : { opacity: 0, y: 10, scale: 0.95 },
          className: `
            bg-white dark:bg-slate-900 shadow-2xl border border-slate-100 dark:border-slate-800 z-[50] overflow-hidden flex flex-col
            fixed bottom-0 left-0 right-0 w-full rounded-t-[32px] 
            md:absolute md:top-full md:right-0 md:left-auto md:bottom-auto md:w-80 md:mt-3 md:rounded-[40px]
          `
        } as HTMLMotionProps<"div">)}
      >
        <div className="p-6 pb-4 flex flex-col items-center gap-3 text-center border-b dark:border-slate-800 shrink-0">
          <div className="w-16 h-16 rounded-3xl overflow-hidden shadow-xl bg-blue-600 flex items-center justify-center text-white text-2xl font-black">
            {user.photoURL ? <img src={user.photoURL} className="w-full h-full object-cover" alt="Avatar" /> : user.email[0].toUpperCase()}
          </div>
          <div>
            <p className="font-black text-slate-800 dark:text-white truncate max-w-60">{user.displayName || user.email.split('@')[0]}</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{user.email}</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto max-h-[60vh] md:max-h-100 custom-scrollbar p-5 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-slate-400">
              <PieChart size={14} />
              <span className="text-[10px] font-black uppercase tracking-wider">Ваша статистика</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-3xl space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="text-xs font-bold dark:text-slate-300">Виконання завдань</span>
                  <span className="text-lg font-black text-blue-600">{stats.percent}%</span>
                </div>
                <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${stats.percent}%` }} className="h-full bg-blue-600" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl border dark:border-slate-700 flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-red-500"><AlertCircle size={14} /><span className="text-lg font-black">{stats.overdue}</span></div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase leading-tight">Протерміновано</span>
                </div>
                <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl border dark:border-slate-700 flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-orange-500"><Zap size={14} /><span className="text-lg font-black">{stats.highDoneThisWeek}</span></div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase leading-tight">Важливих за тиждень</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-slate-400">
              <Bell size={14} />
              <span className="text-[10px] font-black uppercase tracking-wider">Налаштування</span>
            </div>
            <div className="space-y-2">
              <button 
                onClick={() => setIsQuietMode(!isQuietMode)}
                className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all ${isQuietMode ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300'}`}
              >
                <div className="flex items-center gap-2"><ShieldOff size={16} /><span className="text-xs font-bold">Тихий режим</span></div>
                <div className={`w-8 h-4 rounded-full relative transition-colors ${isQuietMode ? 'bg-blue-400' : 'bg-slate-300 dark:bg-slate-600'}`}>
                  <motion.div animate={{ x: isQuietMode ? 16 : 2 }} className="absolute top-0.5 w-3 h-3 bg-white rounded-full shadow-sm" />
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-800/30 shrink-0">
          <button onClick={() => { signOut(auth); onClose(); }} className="w-full flex items-center justify-center gap-3 p-4 hover:bg-red-500 hover:text-white text-red-500 rounded-3xl transition-all font-black text-xs uppercase tracking-widest border border-red-100 dark:border-red-900/20"><LogOut size={16} /> Вийти</button>
        </div>
      </motion.div>
    </>
  );
}