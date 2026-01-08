'use client';

import { useState } from "react";
import { motion, HTMLMotionProps, AnimatePresence } from "framer-motion"; 
import { createTask, updateTask, deleteTask, Task } from "@/lib/tasks"; 
import { format } from "date-fns"; 
import { Trash2, AlertTriangle, AlignLeft } from "lucide-react";

const formatForInput = (dateStr?: string) => {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    return format(d, "yyyy-MM-dd'T'HH:mm");
  } catch (e) { return ""; }
};

interface TaskModalProps {
  user: any; onClose: () => void; date: Date; initialStatus: 'todo' | 'in-progress' | 'done'; allTasks: Task[]; taskToEdit?: Task | null;
}

export default function TaskModal({ user, onClose, date, initialStatus, allTasks, taskToEdit }: TaskModalProps) {
  const [title, setTitle] = useState(taskToEdit?.title || "");
  const [description, setDescription] = useState(taskToEdit?.description || "");
  const [dueDate, setDueDate] = useState(formatForInput(taskToEdit?.dueDate)); 
  const [endDateTime, setEndDateTime] = useState(formatForInput(taskToEdit?.endDateTime));
  const [priority, setPriority] = useState<string>(taskToEdit?.priority || "");
  const [dependsOn, setDependsOn] = useState<string[]>(taskToEdit?.dependsOn || []);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const toggleDependency = (taskId: string) => {
    if (taskToEdit && taskId === taskToEdit.id) return;
    setDependsOn(prev => prev.includes(taskId) ? prev.filter(id => id !== taskId) : [...prev, taskId]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    let gridDate = format(date, 'yyyy-MM-dd');
    if (dueDate) {
      const d = new Date(dueDate);
      if (!isNaN(d.getTime())) gridDate = format(d, 'yyyy-MM-dd');
    } else if (dueDate) {
      const d = new Date(dueDate);
      if (!isNaN(d.getTime())) gridDate = format(d, 'yyyy-MM-dd');
    }

    const taskData = {
      title, 
      description, 
      status: taskToEdit ? taskToEdit.status : initialStatus,
      priority: (priority || "medium") as "low" | "medium" | "high",
      date: gridDate, 
      dueDate, 
      endDateTime, 
      userId: user.uid, 
      dependsOn,
    };

    if (taskToEdit?.id) {
      await updateTask(taskToEdit.id, taskData);
    } else {
      await createTask(taskData);
    }
    onClose();
  };

  const confirmDelete = async () => {
    if (taskToEdit?.id) {
      await deleteTask(taskToEdit.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <motion.div {...({ initial: { opacity: 0 }, animate: { opacity: 1 }, onClick: onClose, className: "absolute inset-0 bg-slate-900/60 backdrop-blur-md" } as HTMLMotionProps<"div">)} />
      
      <motion.form 
        {...({ onSubmit: handleSubmit, initial: { scale: 0.9, opacity: 0 }, animate: { scale: 1, opacity: 1 }, className: "relative bg-white dark:bg-slate-900 p-10 rounded-[40px] shadow-2xl w-full max-w-md flex flex-col gap-6 border dark:border-slate-800" } as HTMLMotionProps<"form">)}
      >
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-black dark:text-white">{taskToEdit ? "Редагувати" : "Нове завдання"}</h2>
          {taskToEdit && (
            <button type="button" onClick={() => setShowDeleteConfirm(true)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors">
              <Trash2 size={20} />
            </button>
          )}
        </div>
        
        <div className="space-y-4">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Назва завдання..." required className="w-full p-4 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-2xl outline-none border-none focus:ring-2 ring-blue-500 font-bold" />
          
          <div className="relative">
            <AlignLeft className="absolute left-4 top-4 text-slate-400 dark:text-slate-500" size={18} />
            <textarea 
              value={description} onChange={(e) => setDescription(e.target.value)} 
              placeholder="Опис завдання..."
              className="w-full p-4 pl-12 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-2xl outline-none border-none focus:ring-2 ring-blue-500 min-h-25 text-sm resize-none"
            />
          </div> 

          <div className="space-y-4">
            <select 
              value={priority} 
              onChange={(e) => setPriority(e.target.value)} 
              className={`w-full h-13 px-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none border-none focus:ring-2 ring-blue-500 cursor-pointer text-sm font-bold ${
                priority === "" ? "text-slate-400 dark:text-slate-500" : "text-slate-900 dark:text-white"
              }`}
            >
              <option value="" disabled hidden>Пріоритет</option>
              <option value="low">Низький</option>
              <option value="medium">Середній</option>
              <option value="high">Високий</option>
            </select>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-slate-400 px-2 tracking-widest">Початок</label>
                <input 
                  type="datetime-local" 
                  value={dueDate} 
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full h-13 px-3 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-2xl outline-none focus:ring-2 ring-blue-500 text-[11px] font-bold dark:scheme-dark"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-slate-400 px-2 tracking-widest">Завершення</label>
                <input 
                  type="datetime-local" 
                  value={endDateTime} 
                  onChange={(e) => setEndDateTime(e.target.value)}
                  className="w-full h-13 px-3 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-2xl outline-none focus:ring-2 ring-blue-500 text-[11px] font-bold dark:scheme-dark"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 px-1">Залежить від:</label>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
              {allTasks.filter(t => t.id && t.id !== taskToEdit?.id).map(t => (
                <button key={t.id} type="button" onClick={() => toggleDependency(t.id!)} className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${dependsOn.includes(t.id!) ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-500'}`}>{t.title}</button>
              ))}
            </div>
          </div>
        </div>

        <button className="bg-blue-600 text-white h-13 rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95">
          {taskToEdit ? "Оновити завдання" : "Створити завдання"}
        </button>
      </motion.form>

      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-110 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowDeleteConfirm(false)} className="absolute inset-0 bg-red-950/20 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative bg-white dark:bg-slate-900 p-8 rounded-4xl shadow-2xl w-full max-w-xs flex flex-col items-center text-center gap-6 border border-red-100 dark:border-red-900/30">
              <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center text-red-500"><AlertTriangle size={32} /></div>
              <div>
                <h3 className="text-xl font-black text-slate-800 dark:text-white">Видалити?</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium">Цю дію неможливо скасувати</p>
              </div>
              <div className="flex gap-3 w-full">
                <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 p-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-bold text-sm">Ні</button>
                <button onClick={confirmDelete} className="flex-1 p-4 bg-red-500 text-white rounded-2xl font-bold text-sm shadow-lg">Так</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}