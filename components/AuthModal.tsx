'use client';

import { useState } from "react";
import { motion, AnimatePresence, HTMLMotionProps } from "framer-motion"; 
import { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, googleProvider, signInWithPopup,sendPasswordResetEmail } from "@/lib/firebase";

type AuthMode = 'login' | 'register' | 'forgot';

export default function AuthModal({ onClose, initialMode = 'login' }: { onClose: () => void, initialMode?: 'login' | 'register' }) {

  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState(''); 

  const getFriendlyError = (code: string) => {
    switch (code) {
      case 'auth/invalid-credential': return 'Неправильна пошта або пароль';
      case 'auth/email-already-in-use': return 'Ця пошта вже зайнята';
      case 'auth/user-not-found': return 'Користувача з такою поштою не знайдено';
      case 'auth/too-many-requests': return 'Забагато спроб. Спробуйте пізніше';
      default: return 'Помилка авторизації';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      if (mode === 'register') {
        await createUserWithEmailAndPassword(auth, email, password);
        onClose();
      } else if (mode === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
        onClose();
      } else if (mode === 'forgot') {
        await sendPasswordResetEmail(auth, email);
        setMessage('Інструкцію для скидання пароля надіслано на Email');
        setTimeout(() => setMode('login'), 4000);
      }
    } catch (err: any) {
      setError(getFriendlyError(err.code));
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      onClose();
    } catch (err: any) {
      setError('Не вдалося увійти через Google');
    }
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
      <motion.div 
        {...({
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          onClick: onClose,
          className: "absolute inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-md"
        } as HTMLMotionProps<"div">)} 
      />

      <motion.form 
        {...({
          onSubmit: handleSubmit,
          initial: { scale: 0.9, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          className: "relative bg-white dark:bg-slate-900 p-6 md:p-10 rounded-[32px] md:rounded-[40px] shadow-2xl w-full max-w-md flex flex-col gap-4 border dark:border-slate-800"
        } as HTMLMotionProps<"form">)}
      >
        <h2 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white">
          {mode === 'register' ? "Реєстрація" : mode === 'login' ? "Вхід" : "Відновлення"}
        </h2>
        
        <AnimatePresence mode="wait">
          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-red-50 text-red-500 p-3 rounded-xl text-xs font-bold text-center">
              {error}
            </motion.div>
          )}
          {message && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-green-50 text-green-600 p-3 rounded-xl text-xs font-bold text-center">
              {message}
            </motion.div>
          )}
        </AnimatePresence>

        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required
          className="p-3 md:p-4 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-2xl outline-none focus:ring-2 ring-blue-500 text-sm md:text-base" />
        
        {mode !== 'forgot' && (
          <input type="password" placeholder="Пароль" value={password} onChange={e => setPassword(e.target.value)} required
            className="p-3 md:p-4 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-2xl outline-none focus:ring-2 ring-blue-500 text-sm md:text-base" />
        )}
        
        <button className="bg-blue-600 text-white p-3 md:p-4 rounded-2xl font-bold hover:bg-blue-700 transition-colors text-sm md:text-base shadow-lg shadow-blue-100 dark:shadow-none">
          {mode === 'register' ? "Зареєструватися" : mode === 'login' ? "Увійти" : "Надіслати лінк"}
        </button>

        {mode !== 'forgot' && (
          <button type="button" onClick={handleGoogleLogin} className="flex items-center justify-center gap-3 p-3 md:p-4 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-2xl font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition-all text-sm md:text-base">
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="G" />
            Увійти з Google
          </button>
        )}

        <div className="flex flex-col gap-3 mt-2">
          {mode === 'login' && (
            <p onClick={() => setMode('forgot')} className="text-center text-xs text-slate-400 cursor-pointer hover:text-blue-600 font-bold">
              Забули пароль?
            </p>
          )}
          
          <p onClick={() => setMode(mode === 'register' ? 'login' : 'register')} className="text-center text-xs md:text-sm text-slate-400 cursor-pointer hover:text-blue-600 transition-colors">
            {mode === 'register' ? "Вже є акаунт? Увійти" : "Створити новий акаунт"}
          </p>

          {mode === 'forgot' && (
            <p onClick={() => setMode('login')} className="text-center text-xs text-blue-600 cursor-pointer font-black uppercase tracking-widest">
              Повернутися до входу
            </p>
          )}
        </div>
      </motion.form>
    </div> 
  );
}