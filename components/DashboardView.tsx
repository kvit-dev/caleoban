'use client';

import Header from "./Header";
import CalendarGrid from "./CalendarGrid";
import WeekGrid from "./WeekGrid";
import { Task } from "@/lib/tasks";

interface DashboardViewProps {
  user: any;
  tasks: Task[];
  currentDate: Date;
  onNavigate: (offset: number) => void;
  view: 'month' | 'week';
  setView: (v: 'month' | 'week') => void;
  isQuietMode: boolean;
  setIsQuietMode: (v: boolean) => void;
  onDateSelect: (d: Date) => void;
  onAuthClick: () => void;
  isBlurred: boolean;
}
 
export default function DashboardView({ 
  user, tasks, currentDate, onNavigate, view, setView, isQuietMode, setIsQuietMode, onDateSelect, onAuthClick, isBlurred 
}: DashboardViewProps) {
  return (
    <div className={`p-4 md:p-8 transition-all duration-700 h-full flex flex-col ${isBlurred ? 'blur-2xl scale-95 pointer-events-none' : 'blur-0 scale-100'}`}>
      <Header 
        currentDate={currentDate} 
        onNavigate={onNavigate}
        view={view}
        setView={setView}
        user={user}
        onAuthClick={onAuthClick}
        tasks={tasks}
        isQuietMode={isQuietMode}
        setIsQuietMode={setIsQuietMode}
      />

      <div className="flex-1 overflow-hidden">
        {view === 'month' ? (
          <CalendarGrid currentDate={currentDate} onDateSelect={onDateSelect} tasks={tasks} isQuietMode={isQuietMode} />
        ) : (
          <WeekGrid currentDate={currentDate} onDateSelect={onDateSelect} tasks={tasks} isQuietMode={isQuietMode} />
        )}
      </div>
    </div>
  );
}