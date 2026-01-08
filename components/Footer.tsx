'use client';
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t dark:border-slate-800 py-8 md:py-12 mt-10 md:mt-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">C</div>
            <span className="text-xl font-black dark:text-white uppercase tracking-tighter">Caleoban</span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-xs">
            Візуальний простір для керування завданнями, де календар зустрічається з Канбан-дошкою
          </p>
        </div> 
        
        <div>
          <h4 className="font-black uppercase text-[10px] tracking-widest text-slate-400 mb-4 md:mb-6">Продукт</h4>
          <ul className="space-y-3 text-sm font-bold text-slate-600 dark:text-slate-300">
            <li className="hover:text-blue-600 cursor-pointer transition-colors">Функції</li>
            <li className="hover:text-blue-600 cursor-pointer transition-colors">Інтеграції</li>
            <li className="hover:text-blue-600 cursor-pointer transition-colors">Безпека</li>
          </ul>
        </div>

        <div>
          <h4 className="font-black uppercase text-[10px] tracking-widest text-slate-400 mb-4 md:mb-6">Компанія</h4>
          <ul className="space-y-3 text-sm font-bold text-slate-600 dark:text-slate-300">
            <li className="hover:text-blue-600 cursor-pointer transition-colors">Про нас</li>
            <li className="hover:text-blue-600 cursor-pointer transition-colors">Кар'єра</li>
            <li className="hover:text-blue-600 cursor-pointer transition-colors">Контакти</li>
          </ul>
        </div>

        <div>
          <h4 className="font-black uppercase text-[10px] tracking-widest text-slate-400 mb-4 md:mb-6">Підтримка</h4>
          <ul className="space-y-3 text-sm font-bold text-slate-600 dark:text-slate-300">
            <li className="hover:text-blue-600 cursor-pointer transition-colors">Довідка</li>
            <li className="hover:text-blue-600 cursor-pointer transition-colors">Спільнота</li>
            <li className="hover:text-blue-600 cursor-pointer transition-colors">Умови</li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-10 md:mt-12 pt-8 border-t dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black uppercase text-slate-400 tracking-tighter text-center md:text-left">
        <span>© 2025 Caleoban Inc.</span>
        <div className="flex gap-4 md:gap-6">
          <span className="hover:text-blue-600 cursor-pointer">Privacy Policy</span>
          <span className="hover:text-blue-600 cursor-pointer">Terms of Service</span>
        </div>
      </div>
    </footer>
  );
}