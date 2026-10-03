import React from 'react';

interface ToastProps {
  message: string;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-100 dark:bg-slate-100 light:bg-slate-900 text-slate-900 dark:text-slate-900 light:text-slate-100 font-extrabold text-xs py-2.5 px-5 rounded-full shadow-2xl animate-pop-in pointer-events-none border border-slate-300">
      <span>{message}</span>
    </div>
  );
};
