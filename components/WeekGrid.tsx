'use client';

import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isBefore, parseISO } from "date-fns"; 

interface WeekGridProps {
  currentDate: Date;
  onDateSelect: (date: Date) => void;
  tasks: any[];
  isQuietMode: boolean;
}

export default function WeekGrid({ currentDate, onDateSelect, tasks, isQuietMode }: WeekGridProps) {
  const startInterval = startOfWeek(currentDate, { weekStartsOn: 1 });
  const endInterval = endOfWeek(currentDate, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: startInterval, end: endInterval });
  const now = new Date();
  
  const taskLimit = 7;

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="hidden lg:grid grid-cols-7 mb-4 px-4">
        {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'].map((day) => (
          <div key={day} className="text-slate-500 dark:text-slate-400 font-bold text-center text-[10px] uppercase tracking-[0.2em]">{day}</div>
        ))}
      </div>
      
      <div className="flex-1 overflow-x-auto snap-x snap-mandatory lg:overflow-y-auto lg:overflow-x-visible pt-2 pb-10 custom-scrollbar">
        <div className="flex lg:grid lg:grid-cols-7 h-full lg:gap-6 lg:px-4">
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
              <div key={index} className="w-full shrink-0 snap-center px-4 lg:w-auto lg:px-0 lg:shrink flex flex-col">
                <div className="lg:hidden text-center text-slate-500 dark:text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mb-4">
                  {['Понеділок', 'Вівторок', 'Середа', 'Четвер', 'П’ятниця', 'Субота', 'Неділя'][index]}
                </div>

                <div onClick={() => onDateSelect(day)} className={`flex-1 min-h-100 lg:min-h-75 bg-white dark:bg-slate-900 rounded-[40px] border p-6 cursor-pointer transition-all duration-300 group flex flex-col mb-2 ${isSameDay(day, new Date()) ? 'ring-2 ring-blue-600 ring-offset-4 dark:ring-offset-slate-950 shadow-xl' : 'border-slate-100 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-2xl hover:-translate-y-1'}`}>
                  <div className="mb-6"><span className={`text-3xl font-black ${isSameDay(day, new Date()) ? 'text-blue-600' : 'text-slate-950 dark:text-white'}`}>{format(day, 'd')}</span></div>
                  
                  <div className="space-y-3 flex-1 overflow-hidden pr-1 flex flex-col">
                    <div className="space-y-3">
                      {dayTasks.slice(0, taskLimit).map(task => {
                        const isOverdue = task.endDateTime && isBefore(parseISO(task.endDateTime), now) && task.status !== 'done';
                        const isStartDay = task.dueDate && format(parseISO(task.dueDate), 'yyyy-MM-dd') === dayStr;
                        const isEndDay = task.endDateTime && format(parseISO(task.endDateTime), 'yyyy-MM-dd') === dayStr;
                        
                        let timeLabel = "";
                        if (isStartDay) timeLabel = format(parseISO(task.dueDate!), 'HH:mm');
                        else if (isEndDay) timeLabel = `До ${format(parseISO(task.endDateTime!), 'HH:mm')}`;

                        return (
                          <div key={task.id} className={`group/task relative p-3 rounded-2xl border transition-all ${isOverdue && !isQuietMode ? 'bg-red-50 dark:bg-red-950/40 border-red-400 animate-pulse' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700 hover:border-blue-300'}`}>
                            <p className={`text-xs font-bold truncate ${isOverdue && !isQuietMode ? 'text-red-700' : 'text-slate-700 dark:text-slate-200'}`}>
                              {timeLabel && <span className="opacity-50 mr-2">{timeLabel}</span>}
                              {task.title}
                            </p>
                            <div className={`w-1 h-6 absolute left-0 top-3 rounded-r-full ${task.priority === 'high' ? 'bg-red-500' : task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}`} />
                          </div>
                        )
                      })}
                    </div>

                    {dayTasks.length > taskLimit && (
                      <div className="mt-3 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-lg text-center border border-dashed border-slate-200 dark:border-slate-700">
                        + ще {dayTasks.length - taskLimit} завдань
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}