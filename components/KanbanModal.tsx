'use client';

import { uk } from "date-fns/locale";
import { format, isBefore, parseISO } from "date-fns";
import { motion, AnimatePresence, HTMLMotionProps, PanInfo } from "framer-motion"; 
import { X, Lock, AlertCircle, Filter, Clock, AlertTriangle } from "lucide-react"; 
import { updateTask, Task } from "@/lib/tasks"; 
import { useState, useRef, useMemo } from "react";

interface KanbanModalProps {
  date: Date;
  onClose: () => void;
  tasks: Task[];
  allTasks: Task[]; 
  onAddTaskClick: (status: 'todo' | 'in-progress' | 'done', task?: Task) => void;
  isQuietMode: boolean;
}

export default function KanbanModal({ date, onClose, tasks, allTasks, onAddTaskClick, isQuietMode }: KanbanModalProps) {
  const columns: ('todo' | 'in-progress' | 'done')[] = ['todo', 'in-progress', 'done'];
  const columnLabels = { todo: 'Заплановано', 'in-progress': 'В процесі', done: 'Завершено' };
  
  const [error, setError] = useState<string | null>(null);
  const [activeDropTarget, setActiveDropTarget] = useState<'todo' | 'in-progress' | 'done' | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  
  const isDraggingRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const checkDependencies = (task: Task) => {
    return task.dependsOn?.some(depId => {
      const depTask = allTasks.find(t => t.id === depId);
      return depTask && depTask.status !== 'done';
    });
  };

  const getTargetColumn = (point: { x: number; y: number }) => {
    if (!containerRef.current) return 'todo';
    const rect = containerRef.current.getBoundingClientRect();
    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      const relativeY = point.y - rect.top;
      const colHeight = rect.height / 3;
      if (relativeY < colHeight) return 'todo';
      if (relativeY < colHeight * 2) return 'in-progress';
      return 'done';
    } else {
      const relativeX = point.x - rect.left;
      const colWidth = rect.width / 3;
      if (relativeX < colWidth) return 'todo';
      if (relativeX < colWidth * 2) return 'in-progress';
      return 'done';
    }
  };

  const handleDragStart = () => { isDraggingRef.current = true; };

  const handleDrag = (_: any, info: PanInfo) => { 
    setActiveDropTarget(getTargetColumn(info.point)); 
  };

  const handleDragEnd = async (_: any, info: PanInfo, task: Task) => {
    setActiveDropTarget(null);
    const newStatus = getTargetColumn(info.point);
    
    setTimeout(() => { isDraggingRef.current = false; }, 100);

    if (newStatus === task.status) return;
    if (newStatus === 'done' && checkDependencies(task)) {
      setError(`Завдання заблоковане невиконаними залежностями!`);
      setTimeout(() => setError(null), 3000);
      return; 
    }

    if (task.id) {
      await updateTask(task.id, { status: newStatus });
    }
  };

  const processedTasks = useMemo(() => {
    const now = new Date();
    const priorityWeight = { high: 3, medium: 2, low: 1 };
    
    return tasks
      .filter(t => priorityFilter === 'all' || t.priority === priorityFilter)
      .sort((a, b) => {
        const isAOverdue = a.endDateTime && isBefore(parseISO(a.endDateTime), now) && a.status !== 'done';
        const isBOverdue = b.endDateTime && isBefore(parseISO(b.endDateTime), now) && b.status !== 'done';

        if (isAOverdue && !isBOverdue) return -1;
        if (!isAOverdue && isBOverdue) return 1;

        return priorityWeight[b.priority] - priorityWeight[a.priority];
      });
  }, [tasks, priorityFilter]);

  const priorityLabels = { high: "Високий", medium: "Середній", low: "Низький" };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
      <motion.div {...({ initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, onClick: onClose, className: "absolute inset-0 bg-slate-900/10 dark:bg-slate-950/40 backdrop-blur-sm" } as HTMLMotionProps<"div">)} />
      
      <AnimatePresence>
        {error && (
          <motion.div {...({ initial: { y: -50, opacity: 0 }, animate: { y: 20, opacity: 1 }, exit: { y: -50, opacity: 0 }, className: "fixed top-0 z-[110] bg-red-500 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 font-bold text-center mx-4" } as HTMLMotionProps<"div">)}>
            <AlertCircle size={20} className="shrink-0" /> {error}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div {...({ initial: { scale: 0.9, opacity: 0, y: 30 }, animate: { scale: 1, opacity: 1, y: 0 }, className: "relative bg-white dark:bg-slate-900 w-full max-w-6xl h-[90vh] sm:h-[85vh] rounded-[32px] md:rounded-[40px] shadow-2xl overflow-hidden flex flex-col border dark:border-slate-800" } as HTMLMotionProps<"div">)}>
        <div className="p-5 md:p-8 border-b dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50 shrink-0">
          <div className="flex flex-col gap-2 md:gap-3">
            <h2 className="text-xl md:text-3xl font-black text-slate-800 dark:text-white capitalize">{format(date, 'EEEE, d MMMM', { locale: uk })}</h2>
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              <Filter size={14} className="text-slate-400 shrink-0" />
              <div className="flex gap-1">
                {(['all', 'high', 'medium', 'low'] as const).map(p => (
                  <button key={p} onClick={() => setPriorityFilter(p)} className={`px-3 py-1 rounded-full text-[9px] md:text-[10px] font-black uppercase transition-all whitespace-nowrap ${priorityFilter === p ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200'}`}>{p === 'all' ? 'Всі' : p}</button>
                ))}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 rounded-2xl transition bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shrink-0"><X size={20} /></button>
        </div>

        <div className="flex-1 p-4 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 overflow-y-auto bg-white dark:bg-slate-950 relative custom-scrollbar" ref={containerRef}>
          {columns.map((status) => {
            const colTasks = processedTasks.filter(t => t.status === status);
            return (
              <div key={status} className="flex flex-col relative z-10 min-h-37.5 md:min-h-0">
                <h3 className="font-black text-slate-400 dark:text-slate-500 uppercase text-[10px] mb-2 md:mb-6 px-2 tracking-widest">{columnLabels[status]}</h3>
                <div 
                  className={`flex-1 rounded-[28px] md:rounded-4xl p-3 md:p-4 border-2 border-dashed transition-all duration-300 flex flex-col gap-3 md:gap-4 overflow-y-auto custom-scrollbar md:overflow-visible max-h-75 md:max-h-none ${
                    activeDropTarget === status ? 'border-blue-500 bg-blue-50/20 dark:bg-blue-900/20 scale-[1.01]' : 'border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50'
                  }`}
                  onClick={(e) => e.target === e.currentTarget && onAddTaskClick(status)}
                >
                  <AnimatePresence mode="popLayout">
                    {colTasks.map((task) => {
                      const isBlocked = checkDependencies(task);
                      const isOverdue = task.dueDate && isBefore(parseISO(task.dueDate), new Date()) && task.status !== 'done';

                      return (
                        <motion.div 
                          key={task.id}
                          layout 
                          drag
                          dragSnapToOrigin={true} 
                          dragConstraints={containerRef}
                          dragElastic={0.1}
                          dragMomentum={false}
                          onDragStart={handleDragStart}
                          onDrag={handleDrag}
                          onDragEnd={(e, info) => handleDragEnd(e, info, task)}
                          whileDrag={{ scale: 1.05, zIndex: 100, cursor: 'grabbing' }}
                          className={`bg-white dark:bg-slate-800 p-4 md:p-5 rounded-2xl shadow-sm border-2 transition-colors cursor-grab active:cursor-grabbing shrink-0
                            ${isBlocked 
                              ? 'border-red-400 dark:border-red-500/50' 
                              : (isOverdue && !isQuietMode)
                                ? 'border-red-600 shadow-md shadow-red-50 dark:shadow-none' 
                                : 'border-slate-100 dark:border-slate-700 hover:border-blue-400'}`}
                          onClick={() => !isDraggingRef.current && onAddTaskClick(status, task)}
                        >
                          <div className="flex justify-between items-start gap-2 mb-3">
                            <h4 className="font-black text-sm text-slate-800 dark:text-white line-clamp-2">{task.title}</h4>
                            <div className="flex gap-1 shrink-0">
                              {isOverdue && !isQuietMode && <AlertTriangle size={16} className="text-red-500 animate-pulse" />}
                              {isBlocked && <Lock size={14} className="text-red-400" />}
                            </div>
                          </div>

                          <div className="flex items-center justify-between mt-auto">
                            <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-md ${
                              task.priority === 'high' ? 'bg-red-100 text-red-600' : 
                              task.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' : 
                              'bg-green-100 text-green-600'
                            }`}>
                              {priorityLabels[task.priority]}
                            </span>
                            
                            {task.dueDate && (
                              <div className={`flex items-center gap-1.5 ${isOverdue ? 'text-red-500' : 'text-slate-400 dark:text-slate-500'}`}>
                                <Clock size={15} /> 
                                <span className="text-[10px] font-black">{format(parseISO(task.dueDate), 'd MMM, HH:mm', { locale: uk })}</span> 
                              </div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div> 
    </div> 
  );
}