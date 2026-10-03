import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Share2, Flame, CheckCircle, Zap, ArrowRight } from 'lucide-react';
import type { DailyResult } from '../game/types';
import { formatTime, generateShareText, formatDateForDisplay } from '../game/scoring';

interface DailyResultModalProps {
  result: DailyResult;
  streak: number;
  onClose: () => void;
  onShowToast: (msg: string) => void;
  onSwitchToPractice: () => void;
}

export const DailyResultModal: React.FC<DailyResultModalProps> = ({
  result,
  streak,
  onClose,
  onShowToast,
  onSwitchToPractice,
}) => {
  useEffect(() => {
    confetti({
      particleCount: 90,
      spread: 80,
      origin: { y: 0.55 },
    });
  }, []);

  const handleShare = async () => {
    const text = generateShareText(result, streak);
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Mutation Daily Result',
          text: text,
        });
        onShowToast('Result shared!');
        return;
      } catch (err) {
        // Fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(text);
      onShowToast('Result copied to clipboard!');
    } catch (err) {
      onShowToast('Failed to copy to clipboard');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-pop-in">
      <div className="bg-slate-900 dark:bg-slate-900 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 rounded-3xl p-6 w-full max-w-sm shadow-2xl flex flex-col gap-5 text-slate-100 dark:text-slate-100 light:text-slate-900">
        {/* Header */}
        <div className="text-center flex flex-col items-center gap-1.5">
          <div className="w-14 h-14 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center mb-1 ring-4 ring-emerald-500/10">
            <CheckCircle size={32} />
          </div>
          <h2 className="text-xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
            MUTATION
          </h2>
          <p className="text-xs font-semibold text-slate-400">
            Daily Puzzle — {formatDateForDisplay(result.date)}
          </p>
        </div>

        {/* Primary Stats Grid */}
        <div className="grid grid-cols-3 gap-2 bg-slate-950/60 dark:bg-slate-950/60 light:bg-slate-100 p-3.5 rounded-2xl border border-slate-800/80 dark:border-slate-800/80 light:border-slate-200 text-center">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-black font-mono">{result.movesCount}</span>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Moves</span>
          </div>

          <div className="flex flex-col items-center border-x border-slate-800/80 dark:border-slate-800/80 light:border-slate-200 px-1">
            <span className="text-2xl font-black font-mono">{formatTime(result.timeSeconds)}</span>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Time</span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-2xl font-black font-mono text-indigo-400">{result.efficiency}%</span>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Efficiency</span>
          </div>
        </div>

        {/* Details Row */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="bg-slate-950/40 dark:bg-slate-950/40 light:bg-slate-100 p-3 rounded-2xl border border-slate-800/60 dark:border-slate-800/60 light:border-slate-200 flex items-center gap-2.5">
            <Zap size={18} className="text-indigo-400 shrink-0" />
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Optimal</span>
              <span className="text-sm font-bold">{result.optimalMoves} moves</span>
            </div>
          </div>

          <div className="bg-slate-950/40 dark:bg-slate-950/40 light:bg-slate-100 p-3 rounded-2xl border border-slate-800/60 dark:border-slate-800/60 light:border-slate-200 flex items-center gap-2.5">
            <Flame size={18} className="text-orange-500 shrink-0" />
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Streak</span>
              <span className="text-sm font-bold text-orange-400">{streak} Days</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5 pt-1">
          <button
            onClick={handleShare}
            className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white font-extrabold py-3.5 px-5 rounded-2xl shadow-xl shadow-indigo-500/25 active:scale-98 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Share2 size={18} />
            <span>Share Result</span>
          </button>

          <button
            onClick={onSwitchToPractice}
            className="w-full bg-slate-800/80 dark:bg-slate-800/80 light:bg-slate-200 hover:bg-slate-800 text-slate-200 dark:text-slate-200 light:text-slate-800 font-bold py-3 px-5 rounded-2xl border border-slate-700/80 dark:border-slate-700/80 light:border-slate-300 active:scale-98 flex items-center justify-center gap-2 transition-all cursor-pointer text-sm"
          >
            <span>Try Practice Mode</span>
            <ArrowRight size={16} />
          </button>

          <button
            onClick={onClose}
            className="text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors py-1 cursor-pointer"
          >
            View Board
          </button>
        </div>
      </div>
    </div>
  );
};
