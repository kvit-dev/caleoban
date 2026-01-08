'use client';

import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, isBefore, parseISO } from "date-fns";

interface CalendarGridProps {
  currentDate: Date;
  onDateSelect: (date: Date) => void;
  tasks: any[]; 
  isQuietMode: boolean;
}

export default function CalendarGrid({ currentDate, onDateSelect, tasks, isQuietMode }: CalendarGridProps) {
  const monthStart = startOfMonth(currentDate);
  const now = new Date();
  const days = eachDayOfInterval({
    start: startOfWeek(monthStart, { weekStartsOn: 1 }),
    end: endOfWeek(endOfMonth(monthStart), { weekStartsOn: 1 }),
  });

  const priorityColors = { high: 'bg-red-500', medium: 'bg-yellow-500', low: 'bg-green-500' };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="grid grid-cols-7 mb-2 px-4">
        {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'].map((day) => (
          <div key={day} className="text-slate-500 dark:text-slate-400 font-bold text-center text-[8px] md:text-[10px] uppercase tracking-tighter md:tracking-[0.2em]">{day}</div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1 md:gap-3 flex-1 overflow-y-auto pt-1 md:pt-2 px-1 md:px-4 pr-1 pb-10 custom-scrollbar">
        {days.map((day, index) => {
          const dayStr = format(day, 'yyyy-MM-dd');
          const dayTasks = tasks
            .filter(t => {
              const isPrimary = t.date === dayStr;
              const isInRange = t.dueDate && t.endDateTime && (
                dayStr >= format(parseISO(t.dueDate), 'yyyy-MM-dd') && 
                dayStr <= format(parseISO(t.endDateTime), 'yyyy-MM-dd')
              );
              return isPrimary || isInRange;
            })
            
            .filter((task, idx, self) => idx === self.findIndex((t) => t.id === task.id))
            .sort((a, b) => {
              const priorityWeight = { high: 3, medium: 2, low: 1 };
              const isAOverdue = a.endDateTime && isBefore(parseISO(a.endDateTime), now) && a.status !== 'done';
              const isBOverdue = b.endDateTime && isBefore(parseISO(b.endDateTime), now) && b.status !== 'done';

              if (isAOverdue && !isBOverdue) return -1;
              if (!isAOverdue && isBOverdue) return 1;
              return priorityWeight[b.priority as keyof typeof priorityWeight] - priorityWeight[b.priority as keyof typeof priorityWeight];
            });
            
          return (
            <div key={index} onClick={() => onDateSelect(day)} className={`h-24 sm:h-28 md:h-32 bg-white dark:bg-slate-900 rounded-xl md:rounded-3xl border p-1.5 md:p-4 cursor-pointer transition-all duration-300 group flex flex-col overflow-hidden ${!isSameMonth(day, monthStart) ? 'bg-slate-50/50 dark:bg-slate-950/50 border-transparent opacity-20' : 'border-slate-100 dark:border-slate-800 hover:border-blue-400 hover:shadow-xl'} ${isSameDay(day, new Date()) ? 'ring-1 md:ring-2 ring-blue-600 ring-offset-2 md:ring-offset-4 dark:ring-offset-slate-950' : ''}`}>
              <span className={`text-sm md:text-xl font-black mb-1 md:mb-2 ${isSameDay(day, new Date()) ? 'text-blue-600' : 'text-slate-950 dark:text-white'}`}>{format(day, 'd')}</span>
              <div className="space-y-0.5 md:space-y-1 flex-1 overflow-hidden">
                {dayTasks.slice(0, 2).map(task => {
                  const isOverdue = task.endDateTime && isBefore(parseISO(task.endDateTime), now) && task.status !== 'done';
                  const isStartDay = task.dueDate && format(parseISO(task.dueDate), 'yyyy-MM-dd') === dayStr;
                  const isEndDay = task.endDateTime && format(parseISO(task.endDateTime), 'yyyy-MM-dd') === dayStr;
                  
                  let timeLabel = "";
                  if (isStartDay) timeLabel = format(parseISO(task.dueDate!), 'HH:mm');
                  else if (isEndDay) timeLabel = `До ${format(parseISO(task.endDateTime!), 'HH:mm')}`;

                  return (
                    <div key={task.id} className={`relative text-[7px] md:text-[10px] font-bold pl-1.5 md:pl-3 pr-1 py-0.5 rounded md:rounded-lg truncate border transition-all overflow-hidden flex items-center ${isOverdue && !isQuietMode ? 'bg-red-50 dark:bg-red-950/40 border-red-400 text-red-700 animate-pulse' : 'bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-200 border-slate-100 dark:border-slate-700'} leading-tight`}>
                      <div className={`w-0.5 md:w-1 h-full absolute left-0 top-0 ${priorityColors[task.priority as keyof typeof priorityColors] || 'bg-blue-500'}`} />
                      <span className="truncate">
                        {timeLabel && <span className="opacity-50 mr-1">{timeLabel}</span>}
                        {task.title}
                      </span>
                    </div>
                  )})}
                {dayTasks.length > 2 && (<div className="text-[6px] md:text-[8px] text-slate-400 font-bold px-1">+{dayTasks.length - 2} ще</div>)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}