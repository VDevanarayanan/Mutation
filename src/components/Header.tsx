import React from 'react';
import { BarChart2, HelpCircle, Sun, Moon, RefreshCw, Calendar, Sparkles } from 'lucide-react';
import { formatDateForDisplay } from '../game/scoring';

interface HeaderProps {
  mode: 'daily' | 'practice';
  dateStr: string;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onOpenStats: () => void;
  onOpenTutorial: () => void;
  onSwitchMode: (mode: 'daily' | 'practice') => void;
  onNewPractice?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  mode,
  dateStr,
  theme,
  onToggleTheme,
  onOpenStats,
  onOpenTutorial,
  onSwitchMode,
  onNewPractice,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full backdrop-blur-xl bg-slate-900/80 dark:bg-slate-900/80 light:bg-white/90 border-b border-slate-800/80 dark:border-slate-800/80 light:border-slate-200 px-4 py-3 shadow-xl transition-colors">
      <div className="max-w-md mx-auto flex flex-col gap-3">
        {/* Top Row: Title, Badge & Action Icons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              MUTATION
            </h1>
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${
                mode === 'daily'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
              }`}
            >
              {mode === 'daily' ? (
                <>
                  <Calendar size={11} />
                  <span>Daily</span>
                </>
              ) : (
                <>
                  <Sparkles size={11} />
                  <span>Practice</span>
                </>
              )}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={onOpenTutorial}
              title="How to Play"
              aria-label="How to play"
              className="p-2.5 rounded-xl bg-slate-800/60 dark:bg-slate-800/60 light:bg-slate-100 border border-slate-700/60 dark:border-slate-700/60 light:border-slate-300 text-slate-300 dark:text-slate-300 light:text-slate-700 hover:text-indigo-400 hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all active:scale-95 cursor-pointer"
            >
              <HelpCircle size={18} />
            </button>

            <button
              onClick={onOpenStats}
              title="Statistics"
              aria-label="View statistics"
              className="p-2.5 rounded-xl bg-slate-800/60 dark:bg-slate-800/60 light:bg-slate-100 border border-slate-700/60 dark:border-slate-700/60 light:border-slate-300 text-slate-300 dark:text-slate-300 light:text-slate-700 hover:text-indigo-400 hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all active:scale-95 cursor-pointer"
            >
              <BarChart2 size={18} />
            </button>

            <button
              onClick={onToggleTheme}
              title="Toggle Theme"
              aria-label="Toggle theme"
              className="p-2.5 rounded-xl bg-slate-800/60 dark:bg-slate-800/60 light:bg-slate-100 border border-slate-700/60 dark:border-slate-700/60 light:border-slate-300 text-slate-300 dark:text-slate-300 light:text-slate-700 hover:text-amber-400 hover:border-amber-500/50 hover:bg-amber-500/10 transition-all active:scale-95 cursor-pointer"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>

        {/* Bottom Row: Mode Segment Selector & New Practice Button */}
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-slate-950/60 dark:bg-slate-950/60 light:bg-slate-200/80 p-1 rounded-2xl border border-slate-800/80 dark:border-slate-800/80 light:border-slate-300 flex gap-1">
            <button
              onClick={() => onSwitchMode('daily')}
              className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all truncate cursor-pointer ${
                mode === 'daily'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20'
                  : 'text-slate-400 dark:text-slate-400 light:text-slate-600 hover:text-slate-200'
              }`}
            >
              Daily ({formatDateForDisplay(dateStr)})
            </button>

            <button
              onClick={() => onSwitchMode('practice')}
              className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all truncate cursor-pointer ${
                mode === 'practice'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20'
                  : 'text-slate-400 dark:text-slate-400 light:text-slate-600 hover:text-slate-200'
              }`}
            >
              Practice
            </button>
          </div>

          {mode === 'practice' && onNewPractice && (
            <button
              onClick={onNewPractice}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 hover:bg-indigo-500 hover:text-white transition-all text-xs font-bold active:scale-95 shadow-lg shadow-indigo-500/10 cursor-pointer"
            >
              <RefreshCw size={13} />
              <span>New</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
