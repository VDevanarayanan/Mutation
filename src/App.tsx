import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { GameBoard } from './components/GameBoard';
import { VisualControls } from './components/VisualControls';
import { DailyResultModal } from './components/DailyResultModal';
import { TutorialModal } from './components/TutorialModal';
import { StatisticsModal } from './components/StatisticsModal';
import { Toast } from './components/Toast';
import { GoogleAd } from './components/GoogleAd';

import type { BoardState, GameAction, GeneratedPuzzle, DailyResult } from './game/types';
import { generatePuzzle, DEFAULT_DAILY_CONFIG, PRACTICE_CONFIG } from './game/generator';
import { isSolved, executeAction } from './game/board';
import { getTodayDateString } from './game/dailySeed';
import {
  calculateEfficiency,
  formatTime,
  loadDailyState,
  saveDailyState,
  recordDailyCompletion,
  loadGameStats,
  hasSeenTutorial,
  getSavedTheme,
  saveTheme,
} from './game/scoring';
import { CheckCircle2 } from 'lucide-react';

export const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(getSavedTheme);
  const [mode, setMode] = useState<'daily' | 'practice'>('daily');
  const [todayDate] = useState<string>(getTodayDateString());

  const [dailyPuzzle, setDailyPuzzle] = useState<GeneratedPuzzle | null>(null);
  const [practicePuzzle, setPracticePuzzle] = useState<GeneratedPuzzle | null>(null);

  const [board, setBoard] = useState<BoardState>([]);
  const [movesCount, setMovesCount] = useState<number>(0);
  const [timeSeconds, setTimeSeconds] = useState<number>(0);
  const [gameSolved, setGameSolved] = useState<boolean>(false);
  const [history, setHistory] = useState<GameAction[]>([]);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  const [showTutorial, setShowTutorial] = useState<boolean>(false);
  const [showStats, setShowStats] = useState<boolean>(false);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');

  const [currentStreak, setCurrentStreak] = useState<number>(0);

  const activePuzzle = mode === 'daily' ? dailyPuzzle : practicePuzzle;

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    saveTheme(theme);
  }, [theme]);

  useEffect(() => {
    if (!hasSeenTutorial()) {
      setShowTutorial(true);
    }
  }, []);

  useEffect(() => {
    const stats = loadGameStats();
    setCurrentStreak(stats.currentStreak);
  }, []);

  useEffect(() => {
    const puzzle = generatePuzzle(todayDate, DEFAULT_DAILY_CONFIG);
    setDailyPuzzle(puzzle);

    const saved = loadDailyState(todayDate);
    if (saved) {
      setBoard(saved.board || puzzle.initialBoard);
      setMovesCount(saved.movesCount || 0);
      setTimeSeconds(saved.timeSeconds || 0);
      setGameSolved(saved.completed || false);
      setHistory(saved.history || []);
    } else {
      setBoard(puzzle.initialBoard);
      setMovesCount(0);
      setTimeSeconds(0);
      setGameSolved(false);
      setHistory([]);
    }
  }, [todayDate]);

  const handleSwitchMode = (newMode: 'daily' | 'practice') => {
    setMode(newMode);
    setIsTimerRunning(false);

    if (newMode === 'daily') {
      if (dailyPuzzle) {
        const saved = loadDailyState(todayDate);
        if (saved) {
          setBoard(saved.board || dailyPuzzle.initialBoard);
          setMovesCount(saved.movesCount || 0);
          setTimeSeconds(saved.timeSeconds || 0);
          setGameSolved(saved.completed || false);
        } else {
          setBoard(dailyPuzzle.initialBoard);
          setMovesCount(0);
          setTimeSeconds(0);
          setGameSolved(false);
        }
      }
    } else {
      if (!practicePuzzle) {
        generateNewPracticePuzzle();
      } else {
        setBoard(practicePuzzle.initialBoard);
        setMovesCount(0);
        setTimeSeconds(0);
        setGameSolved(false);
      }
    }
  };

  const generateNewPracticePuzzle = () => {
    const randomSeedDate = `practice_${Date.now()}`;
    const puzzle = generatePuzzle(randomSeedDate, PRACTICE_CONFIG);
    setPracticePuzzle(puzzle);
    setBoard(puzzle.initialBoard);
    setMovesCount(0);
    setTimeSeconds(0);
    setGameSolved(false);
    setHistory([]);
    setIsTimerRunning(false);
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isTimerRunning && !gameSolved) {
      interval = setInterval(() => {
        setTimeSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, gameSolved]);

  const handleExecuteAction = (action: GameAction) => {
    if (gameSolved || !activePuzzle) return;

    const nextBoard = executeAction(board, action);
    if (!nextBoard) return;

    if (movesCount === 0 && !isTimerRunning) {
      setIsTimerRunning(true);
    }

    const newMovesCount = movesCount + 1;
    const newHistory = [...history, action];

    setBoard(nextBoard);
    setMovesCount(newMovesCount);
    setHistory(newHistory);

    if (navigator.vibrate) {
      try {
        navigator.vibrate(10);
      } catch (e) {}
    }

    if (isSolved(nextBoard)) {
      setIsTimerRunning(false);
      setGameSolved(true);

      const optimal = activePuzzle.optimalMoves;
      const efficiency = calculateEfficiency(newMovesCount, optimal);

      const result: DailyResult = {
        date: mode === 'daily' ? todayDate : `practice_${todayDate}`,
        completed: true,
        movesCount: newMovesCount,
        timeSeconds: timeSeconds + 1,
        optimalMoves: optimal,
        efficiency,
        board: nextBoard,
        history: newHistory,
        solvedAt: new Date().toISOString(),
      };

      if (mode === 'daily') {
        saveDailyState(result);
        const updatedStats = recordDailyCompletion(result);
        setCurrentStreak(updatedStats.currentStreak);
      }

      setShowResult(true);
    } else {
      if (mode === 'daily') {
        saveDailyState({
          date: todayDate,
          completed: false,
          movesCount: newMovesCount,
          timeSeconds,
          optimalMoves: activePuzzle.optimalMoves,
          efficiency: 0,
          board: nextBoard,
          history: newHistory,
        });
      }
    }
  };

  const showToastMsg = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 2500);
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-slate-950 dark:bg-slate-950 light:bg-slate-100 text-slate-100 dark:text-slate-100 light:text-slate-900 transition-colors">
      <Header
        mode={mode}
        dateStr={todayDate}
        theme={theme}
        onToggleTheme={() => setTheme(prev => (prev === 'light' ? 'dark' : 'light'))}
        onOpenStats={() => setShowStats(true)}
        onOpenTutorial={() => setShowTutorial(true)}
        onSwitchMode={handleSwitchMode}
        onNewPractice={generateNewPracticePuzzle}
      />

      <div className="flex-1 w-full max-w-7xl mx-auto px-2 md:px-4 flex justify-center items-start gap-4 xl:gap-8">
        {/* Left Side Ad */}
        <aside className="hidden lg:flex flex-col items-center shrink-0 w-40 xl:w-64 pt-4 sticky top-4">
          <GoogleAd position="left" />
        </aside>

        {/* Center Main Game Area */}
        <main className="flex-1 max-w-md w-full flex flex-col items-center gap-4 py-4">
          {/* Status Dashboard */}
          <div className="grid grid-cols-3 gap-2.5 w-full">
            <div className="bg-slate-900/80 dark:bg-slate-900/80 light:bg-white border border-slate-800/80 dark:border-slate-800/80 light:border-slate-200 rounded-2xl p-2.5 flex flex-col items-center shadow-lg backdrop-blur-md">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">MOVES</span>
              <span className="text-xl md:text-2xl font-black font-mono mt-0.5">{movesCount}</span>
            </div>

            <div className="bg-slate-900/80 dark:bg-slate-900/80 light:bg-white border border-slate-800/80 dark:border-slate-800/80 light:border-slate-200 rounded-2xl p-2.5 flex flex-col items-center shadow-lg backdrop-blur-md">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">TIME</span>
              <span className="text-xl md:text-2xl font-black font-mono mt-0.5">{formatTime(timeSeconds)}</span>
            </div>

            <div className="bg-slate-900/80 dark:bg-slate-900/80 light:bg-white border border-slate-800/80 dark:border-slate-800/80 light:border-slate-200 rounded-2xl p-2.5 flex flex-col items-center shadow-lg backdrop-blur-md">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">OPTIMAL</span>
              <span className="text-xl md:text-2xl font-black font-mono mt-0.5 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                {activePuzzle?.optimalMoves ?? '-'}
              </span>
            </div>
          </div>

          {/* Solved Banner */}
          {gameSolved && (
            <div className="w-full bg-emerald-500/10 border border-emerald-500/40 rounded-2xl p-3 flex items-center justify-between shadow-lg backdrop-blur-md animate-pop-in">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 size={22} className="text-emerald-400 shrink-0" />
                <div>
                  <strong className="text-sm font-black text-emerald-300 block">Puzzle Solved!</strong>
                  <span className="text-xs text-slate-300">
                    {movesCount} moves ({calculateEfficiency(movesCount, activePuzzle?.optimalMoves || 10)}% efficiency)
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowResult(true)}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs px-3.5 py-2 rounded-xl transition-all cursor-pointer shadow-md"
              >
                Result
              </button>
            </div>
          )}

          {/* Game Board */}
          {board.length > 0 && (
            <GameBoard
              board={board}
              onExecuteAction={handleExecuteAction}
              isSolved={gameSolved}
            />
          )}

          {/* Mutation Direction Controls */}
          <VisualControls
            onExecuteAction={handleExecuteAction}
            disabled={gameSolved}
          />

          {/* Mobile Ad Banner (visible on small screens) */}
          <div className="lg:hidden w-full flex justify-center mt-1">
            <GoogleAd position="mobile" format="horizontal" />
          </div>

          <div className="mt-auto pt-2 text-center text-xs text-slate-400 leading-relaxed max-w-xs">
            <p>
              💡 <strong>Controls:</strong> Tap adjacent tile to move. Swipe any row or column to rotate.
            </p>
          </div>
        </main>

        {/* Right Side Ad */}
        <aside className="hidden lg:flex flex-col items-center shrink-0 w-40 xl:w-64 pt-4 sticky top-4">
          <GoogleAd position="right" />
        </aside>
      </div>

      {/* Modals */}
      {showTutorial && <TutorialModal onClose={() => setShowTutorial(false)} />}
      {showStats && <StatisticsModal onClose={() => setShowStats(false)} />}
      {showResult && activePuzzle && (
        <DailyResultModal
          result={{
            date: todayDate,
            completed: true,
            movesCount,
            timeSeconds,
            optimalMoves: activePuzzle.optimalMoves,
            efficiency: calculateEfficiency(movesCount, activePuzzle.optimalMoves),
            board,
            history,
          }}
          streak={currentStreak}
          onClose={() => setShowResult(false)}
          onShowToast={showToastMsg}
          onSwitchToPractice={() => {
            setShowResult(false);
            handleSwitchMode('practice');
          }}
        />
      )}

      <Toast message={toastMessage} />
    </div>
  );
};

export default App;
