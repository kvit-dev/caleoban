'use client';

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar as CalendarIcon, Layout, Zap, ArrowRight, ChevronDown, Star, Quote } from "lucide-react";
import Footer from "./Footer";

interface LandingViewProps {
  onAuthClick: (mode: 'login' | 'register') => void;
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b dark:border-slate-800 last:border-none">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 md:py-6 flex justify-between items-center text-left hover:text-blue-600 transition-colors group"
      >
        <span className="text-base md:text-lg font-black dark:text-white tracking-tight pr-4">{question}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} className="text-slate-400 group-hover:text-blue-600 shrink-0">
          <ChevronDown size={20} className="md:w-6 md:h-6" />
        </motion.div>
      </button> 
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="pb-4 md:pb-6 text-sm md:text-base text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-2xl">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function LandingView({ onAuthClick }: LandingViewProps) {
  const testimonials = [
    { name: "Катерина Ю.", role: "Project Manager", text: "Caleoban повністю змінив мій підхід до планування. Візуальний зв'язок між календарем та канбаном - це неймовірно", color: "bg-blue-500" },
    { name: "Анастасія Д.", role: "Freelancer", text: "Найкращий інтерфейс, який я бачила. Тихий режим - просто порятунок у дні, коли дедлайни сильно тиснуть", color: "bg-purple-500" },
    { name: "Надія З.", role: "Developer", text: "Простий, швидкий та надійний інструмент. Використовую його для щоденних задач і нарешті бачу повну картину свого тижня", color: "bg-emerald-500" }
  ];

  return (
    <div className="flex flex-col w-full bg-white dark:bg-slate-950 transition-colors overflow-x-hidden">
      <nav className="p-4 md:p-8 flex justify-between items-center max-w-7xl mx-auto w-full sticky top-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg text-sm md:text-base">C</div>
          <span className="text-xl md:text-2xl font-black dark:text-white uppercase tracking-tighter hidden sm:block">Caleoban</span>
        </div>
        <div className="flex items-center gap-4 md:gap-6">
          <button 
            onClick={() => onAuthClick('login')} 
            className="text-xs md:text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors"
          >Увійти
          </button>
          <button 
            onClick={() => onAuthClick('register')} 
            className="bg-blue-600 text-white px-4 py-2 md:px-8 md:py-3 rounded-xl md:rounded-2xl font-black text-xs md:text-sm uppercase tracking-widest hover:bg-blue-700 transition shadow-xl shadow-blue-200"
          >
            <span className="hidden md:inline">Почати безкоштовно</span>
            <span className="md:hidden">Почати</span>
          </button>
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center">
        <div className="space-y-6 md:space-y-10 text-center lg:text-left">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl sm:text-5xl md:text-7xl font-black text-slate-800 dark:text-white leading-[1.1] tracking-tighter">
            Caleoban допомагає тобі <span className="text-blue-600 underline decoration-blue-200 underline-offset-4 md:underline-offset-8">рухатися</span> вперед.
          </motion.h1>
          <p className="text-base md:text-xl text-slate-500 dark:text-slate-400 font-medium max-w-lg leading-relaxed mx-auto lg:mx-0">
            Об'єднайте ваші завдання та терміни в одному візуальному просторі.
          </p>
          <button 
            onClick={() => onAuthClick('register')} 
            className="bg-blue-600 text-white h-12 md:h-16 px-6 md:px-10 rounded-xl md:rounded-2xl font-black uppercase tracking-widest shadow-2xl shadow-blue-200 hover:scale-105 transition-all flex items-center justify-center gap-3 w-fit mx-auto lg:mx-0 text-xs md:text-sm"
          >Спробувати безкоштовно <ArrowRight size={16} className="md:w-5 md:h-5" />
          </button>
        </div>
        
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-slate-100 dark:bg-slate-900 rounded-[40px] md:rounded-[80px] p-6 md:p-12 aspect-square relative shadow-inner overflow-hidden border border-slate-200 dark:border-slate-800 w-full max-w-md mx-auto lg:max-w-none">
          <div className="absolute top-4 left-4 right-0 bottom-0 md:top-12 md:left-12 bg-white dark:bg-slate-800 rounded-3xl md:rounded-4xl shadow-2xl border border-slate-200 dark:border-slate-700 p-6 md:p-8">
             <div className="flex gap-2 mb-6 md:mb-10"><div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-red-400" /><div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-yellow-400" /><div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-green-400" /></div>
             <div className="space-y-4 md:space-y-6">
               <div className="h-3 md:h-4 bg-slate-100 dark:bg-slate-700 rounded-full w-3/4" /><div className="h-3 md:h-4 bg-slate-100 dark:bg-slate-700 rounded-full w-1/2" />
               <div className="grid grid-cols-2 gap-4 md:gap-6 mt-8 md:mt-12">
                 <div className="h-28 md:h-40 bg-blue-50 dark:bg-blue-900/20 rounded-2xl md:rounded-3xl border border-blue-100 dark:border-blue-800 flex items-center justify-center"><CalendarIcon className="text-blue-600 w-8 h-8 md:w-10 md:h-10" /></div>
                 <div className="h-28 md:h-40 bg-slate-50 dark:bg-slate-800 rounded-2xl md:rounded-3xl border border-slate-100 dark:border-slate-700 flex items-center justify-center"><Layout className="text-slate-400 w-8 h-8 md:w-10 md:h-10" /></div>
               </div>
             </div>
          </div>
        </motion.div>
      </section>

      <section className="py-16 md:py-32 bg-white dark:bg-slate-950 transition-colors">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-16 gap-6 md:gap-8">
            <div className="space-y-2 md:space-y-4">
              <h2 className="text-3xl md:text-4xl font-black dark:text-white tracking-tight">Відгуки користувачів</h2>
              <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 font-medium max-w-md">Дізнайтеся, чому професіонали обирають Caleoban для своєї роботи.</p>
            </div>
            <div className="flex gap-1 text-yellow-400"><Star fill="currentColor" size={20} /><Star fill="currentColor" size={20} /><Star fill="currentColor" size={20} /><Star fill="currentColor" size={20} /><Star fill="currentColor" size={20} /></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {testimonials.map((item, i) => (
              <motion.div key={i} whileHover={{ y: -10 }} className="p-6 md:p-8 bg-slate-50 dark:bg-slate-900 rounded-4xl md:rounded-[40px] border border-slate-100 dark:border-slate-800 flex flex-col gap-6 relative transition-colors shadow-sm">
                <Quote className="absolute right-6 top-6 md:right-8 md:top-8 text-blue-600/10" size={40} />
                <p className="text-slate-600 dark:text-slate-300 font-bold italic leading-relaxed z-10 text-sm md:text-base">{item.text}</p>
                <div className="flex items-center gap-4 mt-auto">
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl ${item.color} flex items-center justify-center text-white font-black text-lg md:text-xl shadow-lg`}>{item.name[0]}</div>
                  <div>
                    <p className="font-black dark:text-white text-sm">{item.name}</p>
                    <p className="text-[9px] md:text-[10px] uppercase font-black tracking-widest text-slate-400">{item.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-32 bg-slate-50 dark:bg-slate-900/50 transition-colors">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <div className="text-center mb-10 md:mb-16 space-y-2 md:space-y-4">
            <h2 className="text-3xl md:text-4xl font-black dark:text-white tracking-tight">Поширені запитання</h2>
            <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 font-medium">Все, що ви хотіли знати про роботу сервісу.</p>
          </div>
          
          <div className="bg-white dark:bg-slate-900 rounded-4xl md:rounded-[40px] p-6 md:p-12 shadow-sm border border-slate-100 dark:border-slate-800">
            <FAQItem question="Caleoban безкоштовний?" answer="Так, ви можете користуватися всіма базовими функціями планування, календаря та канбан-дошок абсолютно безкоштовно. Ми цінуємо вашу продуктивність." />
            <FAQItem question="Як працює Тихий режим?" answer="Цей режим приховує всі червоні індикатори протермінованих завдань та прибирає анімацію пульсації. Це дозволяє вам сфокусуватися на поточній справі без візуального тиску." />
            <FAQItem question="Чи мої дані в безпеці?" answer="Ми використовуємо Firebase від Google для авторизації та зберігання даних. Ваші завдання доступні лише вам завдяки надійним правилам доступу на рівні бази даних." />
            <FAQItem question="Чи є підтримка темної теми?" answer="Звичайно! Caleoban автоматично підлаштовується під системну тему вашого пристрою або дозволяє перемикати її вручну кнопкою в кутку екрана." />
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32 px-4 md:px-8 text-center bg-blue-600 text-white overflow-hidden relative">
        <div className="relative z-10 space-y-6 md:space-y-8">
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter leading-tight">Почніть планувати <br className="hidden md:block"/> вже сьогодні</h2>
          <p className="text-blue-100 text-base md:text-xl font-medium max-w-xl mx-auto">Приєднуйтесь до користувачів, які вже обрали зручність.</p>
          <button 
            onClick={() => onAuthClick('register')} 
            className="bg-white text-blue-600 px-8 py-3 md:px-12 md:py-4 rounded-xl md:rounded-2xl font-black text-xs md:text-sm uppercase tracking-widest hover:bg-slate-100 transition-all shadow-2xl active:scale-95"
          >Зареєструватися безкоштовно
          </button>
        </div>
        <div className="absolute top-0 left-0 w-48 h-48 md:w-64 md:h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-blue-400/20 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />
      </section>

      <Footer />
    </div>
  );
}