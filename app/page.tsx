'use client';

import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { Sun, Moon } from "lucide-react";
import { subscribeToTasks, Task } from "@/lib/tasks";
import { format, parseISO } from "date-fns";

import DashboardView from "@/components/DashboardView";
import LandingView from "@/components/LandingView";
import KanbanModal from "@/components/KanbanModal";
import AuthModal from "@/components/AuthModal";
import AddTaskModal from "@/components/AddTaskModal";

export default function HomePage() {
  const { user, loading } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [view, setView] = useState<'month' | 'week'>('month');
  const [isQuietMode, setIsQuietMode] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [initialStatus, setInitialStatus] = useState<'todo' | 'in-progress' | 'done'>('todo');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const savedQuiet = localStorage.getItem('quiet_mode') === 'true';
    setIsQuietMode(savedQuiet);
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) setIsDarkMode(true);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (user) {
      const unsubscribe = subscribeToTasks(user.uid, (t) => {
        setTasks(t);
      });
      return () => unsubscribe();
    }
  }, [user]);

  const handleNavigate = (offset: number) => {
    const newDate = new Date(currentDate);
    view === 'month' ? newDate.setMonth(currentDate.getMonth() + offset) : newDate.setDate(newDate.getDate() + offset * 7);
    setCurrentDate(newDate);
  };

  const handleAuthOpen = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 animate-pulse">Caleoban завантажується...</div>
    </div>
  );

  return (
    <main className={`min-h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 relative transition-colors duration-300 ${user ? 'h-screen overflow-hidden' : ''}`}>
      {user ? (
        <DashboardView 
          user={user} tasks={tasks} currentDate={currentDate} onNavigate={handleNavigate}
          view={view} setView={setView} isQuietMode={isQuietMode} setIsQuietMode={setIsQuietMode}
          onDateSelect={setSelectedDate} 
          onAuthClick={() => handleAuthOpen('login')} 
          isBlurred={!!selectedDate || showAuthModal || showAddTaskModal}
        />
      ) : (
        <LandingView onAuthClick={handleAuthOpen} />
      )}

      <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-100">
        <button 
          onClick={() => setIsDarkMode(!isDarkMode)} 
          className="w-12 h-12 md:w-14 md:h-14 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 flex items-center justify-center text-slate-500 transition-all hover:scale-110 active:scale-90"
        >
          {isDarkMode ? (
            <Sun className="w-5 h-5 md:w-6 md:h-6 text-yellow-400" /> 
          ) : (
            <Moon className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
          )}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {selectedDate && (
          <KanbanModal 
            key={`kanban-${format(selectedDate, 'yyyy-MM-dd')}`}
            date={selectedDate} 
            onClose={() => setSelectedDate(null)} 
            tasks={tasks.filter(t => {
              const selDateStr = format(selectedDate, 'yyyy-MM-dd');
              if (t.date === selDateStr) return true;
              if (t.dueDate && t.endDateTime) {
                const start = format(parseISO(t.dueDate), 'yyyy-MM-dd');
                const end = format(parseISO(t.endDateTime), 'yyyy-MM-dd');
                return selDateStr >= start && selDateStr <= end;
              }
              return false;
            })} 
            allTasks={tasks} 
            isQuietMode={isQuietMode} 
            onAddTaskClick={(s, t) => { 
              setInitialStatus(s); 
              setEditingTask(t || null); 
              setShowAddTaskModal(true); 
            }} 
          />
        )}

        {showAuthModal && (
          <AuthModal key="auth-modal" initialMode={authMode} onClose={() => setShowAuthModal(false)} />
        )}

        {showAddTaskModal && (
          <AddTaskModal 
            key={editingTask?.id || "new-task"} 
            user={user} 
            onClose={() => setShowAddTaskModal(false)} 
            date={selectedDate || currentDate} 
            initialStatus={initialStatus} 
            allTasks={tasks} 
            taskToEdit={editingTask} 
          />
        )}
      </AnimatePresence>
    </main>
  );
}