import React from 'react';
import { X, Calendar } from 'lucide-react';
import { loadGameStats, formatTime, formatDateForDisplay } from '../game/scoring';

interface StatisticsModalProps {
  onClose: () => void;
}

export const StatisticsModal: React.FC<StatisticsModalProps> = ({ onClose }) => {
  const stats = loadGameStats();

  const winRate = stats.gamesPlayed > 0 ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) : 0;
  const avgMoves = stats.gamesWon > 0 ? Math.round(stats.totalMoves / stats.gamesWon) : 0;
  const avgTimeSec = stats.gamesWon > 0 ? Math.round(stats.totalTimeSeconds / stats.gamesWon) : 0;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-pop-in">
      <div className="bg-slate-900 dark:bg-slate-900 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 rounded-3xl p-6 w-full max-w-sm shadow-2xl flex flex-col gap-4 text-slate-100 dark:text-slate-100 light:text-slate-900">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <h2 className="text-lg font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
            STATISTICS
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* 4 Core Stat Cards */}
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="bg-slate-950/60 dark:bg-slate-950/60 light:bg-slate-100 p-2.5 rounded-2xl border border-slate-800/80 dark:border-slate-800/80 light:border-slate-200 flex flex-col items-center">
            <span className="text-lg font-black font-mono">{stats.gamesPlayed}</span>
            <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400">Played</span>
          </div>

          <div className="bg-slate-950/60 dark:bg-slate-950/60 light:bg-slate-100 p-2.5 rounded-2xl border border-slate-800/80 dark:border-slate-800/80 light:border-slate-200 flex flex-col items-center">
            <span className="text-lg font-black font-mono">{winRate}%</span>
            <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400">Win %</span>
          </div>

          <div className="bg-slate-950/60 dark:bg-slate-950/60 light:bg-slate-100 p-2.5 rounded-2xl border border-slate-800/80 dark:border-slate-800/80 light:border-slate-200 flex flex-col items-center">
            <span className="text-lg font-black font-mono text-orange-400">{stats.currentStreak}</span>
            <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400">Streak</span>
          </div>

          <div className="bg-slate-950/60 dark:bg-slate-950/60 light:bg-slate-100 p-2.5 rounded-2xl border border-slate-800/80 dark:border-slate-800/80 light:border-slate-200 flex flex-col items-center">
            <span className="text-lg font-black font-mono">{stats.maxStreak}</span>
            <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400">Max</span>
          </div>
        </div>

        {/* Secondary Stats */}
        <div className="bg-slate-950/40 dark:bg-slate-950/40 light:bg-slate-100 p-3.5 rounded-2xl border border-slate-800/60 dark:border-slate-800/60 light:border-slate-200 flex justify-between text-xs font-semibold">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Avg Moves</span>
            <span className="font-mono text-sm font-bold">{avgMoves || '-'}</span>
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Avg Time</span>
            <span className="font-mono text-sm font-bold">{avgTimeSec ? formatTime(avgTimeSec) : '-'}</span>
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Best Eff</span>
            <span className="font-mono text-sm font-bold text-indigo-400">{stats.bestEfficiency ? `${stats.bestEfficiency}%` : '-'}</span>
          </div>
        </div>

        {/* History Log */}
        <div className="flex flex-col gap-2">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Daily History</h3>
          {stats.history.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-4">No daily puzzles completed yet.</p>
          ) : (
            <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto pr-1">
              {stats.history.map((item, idx) => (
                <div
                  key={`hist-${idx}`}
                  className="bg-slate-950/50 dark:bg-slate-950/50 light:bg-slate-100 p-2.5 rounded-xl border border-slate-800/60 dark:border-slate-800/60 light:border-slate-200 flex justify-between items-center text-xs"
                >
                  <div className="flex items-center gap-1.5 font-bold text-slate-300 dark:text-slate-300 light:text-slate-700">
                    <Calendar size={13} className="text-indigo-400" />
                    <span>{formatDateForDisplay(item.date)}</span>
                  </div>
                  <div className="flex gap-2.5 font-mono text-[11px]">
                    <span>{item.movesCount}m</span>
                    <span>{formatTime(item.timeSeconds)}</span>
                    <span className="text-indigo-400 font-bold">{item.efficiency}%</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
