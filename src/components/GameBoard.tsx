import React, { useRef, useEffect } from 'react';
import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown } from 'lucide-react';
import type { BoardState, GameAction } from '../game/types';
import { canMoveTile, getRowCol, getBlankIndex } from '../game/board';
import { TileComponent } from './TileComponent';

interface GameBoardProps {
  board: BoardState;
  onExecuteAction: (action: GameAction) => void;
  isSolved: boolean;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  board,
  onExecuteAction,
  isSolved,
}) => {
  const boardRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number; time: number; index: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isSolved) return;
    const touch = e.touches[0];
    const target = e.target as HTMLElement;
    const tileElement = target.closest('[data-index]') as HTMLElement;

    if (tileElement) {
      const index = parseInt(tileElement.getAttribute('data-index') || '-1', 10);
      if (index >= 0) {
        touchStartRef.current = {
          x: touch.clientX,
          y: touch.clientY,
          time: Date.now(),
          index,
        };
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current || isSolved) return;
    const start = touchStartRef.current;
    touchStartRef.current = null;

    const touch = e.changedTouches[0];
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);
    const minDistance = 25;

    if (absX < minDistance && absY < minDistance) {
      return;
    }

    const { row, col } = getRowCol(start.index);

    if (absX > absY) {
      if (dx > 0) {
        onExecuteAction({ type: 'ROTATE_ROW_RIGHT', index: row, label: `Row ${row + 1} Right` });
      } else {
        onExecuteAction({ type: 'ROTATE_ROW_LEFT', index: row, label: `Row ${row + 1} Left` });
      }
    } else {
      if (dy > 0) {
        onExecuteAction({ type: 'ROTATE_COL_DOWN', index: col, label: `Col ${col + 1} Down` });
      } else {
        onExecuteAction({ type: 'ROTATE_COL_UP', index: col, label: `Col ${col + 1} Up` });
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isSolved) return;
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
      }

      const blankIdx = getBlankIndex(board);
      const { row: bRow, col: bCol } = getRowCol(blankIdx);

      if (e.key === 'ArrowUp') {
        if (bRow < 3) {
          const tileIdx = (bRow + 1) * 4 + bCol;
          onExecuteAction({ type: 'MOVE_TILE', index: tileIdx });
        }
      } else if (e.key === 'ArrowDown') {
        if (bRow > 0) {
          const tileIdx = (bRow - 1) * 4 + bCol;
          onExecuteAction({ type: 'MOVE_TILE', index: tileIdx });
        }
      } else if (e.key === 'ArrowLeft') {
        if (bCol < 3) {
          const tileIdx = bRow * 4 + (bCol + 1);
          onExecuteAction({ type: 'MOVE_TILE', index: tileIdx });
        }
      } else if (e.key === 'ArrowRight') {
        if (bCol > 0) {
          const tileIdx = bRow * 4 + (bCol - 1);
          onExecuteAction({ type: 'MOVE_TILE', index: tileIdx });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [board, isSolved, onExecuteAction]);

  return (
    <div className="w-full max-w-[420px] md:max-w-[460px] mx-auto p-1 flex flex-col items-center gap-1.5 select-none">
      {/* Top Column Rotate Up Buttons */}
      <div className="flex items-center gap-1.5 md:gap-2 w-full">
        {/* Left Corner Spacer matching left arrow button width */}
        <div className="w-7 md:w-9 shrink-0" />
        {/* 4 Up Arrows aligned with the 4 columns */}
        <div className="grid grid-cols-4 gap-2 md:gap-2.5 flex-1 px-2.5 md:px-3.5">
          {[0, 1, 2, 3].map(colIdx => (
            <button
              key={`col-up-${colIdx}`}
              disabled={isSolved}
              onClick={() =>
                onExecuteAction({
                  type: 'ROTATE_COL_UP',
                  index: colIdx,
                  label: `Col ${colIdx + 1} Up`,
                })
              }
              title={`Rotate Column ${colIdx + 1} Up`}
              aria-label={`Rotate Column ${colIdx + 1} Up`}
              className="h-7 md:h-9 rounded-xl bg-slate-900/90 dark:bg-slate-900/90 light:bg-white/90 border border-slate-800/80 dark:border-slate-800/80 light:border-slate-300 text-slate-300 dark:text-slate-300 light:text-slate-700 hover:text-indigo-400 hover:border-indigo-500/50 hover:bg-indigo-500/10 flex items-center justify-center transition-all active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shadow-md"
            >
              <ArrowUp size={15} />
            </button>
          ))}
        </div>
        {/* Right Corner Spacer matching right arrow button width */}
        <div className="w-7 md:w-9 shrink-0" />
      </div>

      {/* Middle Row: Left Arrows + 4x4 Matrix Board + Right Arrows */}
      <div className="flex items-stretch justify-center gap-1.5 md:gap-2 w-full">
        {/* Left Row Rotate Left Buttons (height matching each row) */}
        <div className="grid grid-rows-4 gap-2 md:gap-2.5 w-7 md:w-9 py-2.5 md:py-3.5 shrink-0">
          {[0, 1, 2, 3].map(rowIdx => (
            <button
              key={`row-left-${rowIdx}`}
              disabled={isSolved}
              onClick={() =>
                onExecuteAction({
                  type: 'ROTATE_ROW_LEFT',
                  index: rowIdx,
                  label: `Row ${rowIdx + 1} Left`,
                })
              }
              title={`Rotate Row ${rowIdx + 1} Left`}
              aria-label={`Rotate Row ${rowIdx + 1} Left`}
              className="w-7 md:w-9 h-full rounded-xl bg-slate-900/90 dark:bg-slate-900/90 light:bg-white/90 border border-slate-800/80 dark:border-slate-800/80 light:border-slate-300 text-slate-300 dark:text-slate-300 light:text-slate-700 hover:text-indigo-400 hover:border-indigo-500/50 hover:bg-indigo-500/10 flex items-center justify-center transition-all active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shadow-md"
            >
              <ArrowLeft size={15} />
            </button>
          ))}
        </div>

        {/* Center 4x4 Matrix Board */}
        <div
          ref={boardRef}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className={`grid grid-cols-4 grid-rows-4 gap-2 md:gap-2.5 bg-slate-900/90 dark:bg-slate-900/90 light:bg-slate-200/90 p-2.5 md:p-3.5 rounded-3xl border border-slate-800/80 dark:border-slate-800/80 light:border-slate-300 shadow-2xl aspect-square flex-1 touch-none transition-all duration-300 ${
            isSolved ? 'solved-glow border-emerald-500/60 ring-2 ring-emerald-500/30' : 'board-glow'
          }`}
        >
          {board.map((val, idx) => (
            <TileComponent
              key={`tile-slot-${idx}`}
              value={val}
              index={idx}
              isAdjacentToBlank={canMoveTile(board, idx)}
              isSolvedPosition={val === idx + 1 || (val === 0 && idx === 15)}
              onClick={() => {
                if (canMoveTile(board, idx)) {
                  onExecuteAction({ type: 'MOVE_TILE', index: idx });
                }
              }}
            />
          ))}
        </div>

        {/* Right Row Rotate Right Buttons (height matching each row) */}
        <div className="grid grid-rows-4 gap-2 md:gap-2.5 w-7 md:w-9 py-2.5 md:py-3.5 shrink-0">
          {[0, 1, 2, 3].map(rowIdx => (
            <button
              key={`row-right-${rowIdx}`}
              disabled={isSolved}
              onClick={() =>
                onExecuteAction({
                  type: 'ROTATE_ROW_RIGHT',
                  index: rowIdx,
                  label: `Row ${rowIdx + 1} Right`,
                })
              }
              title={`Rotate Row ${rowIdx + 1} Right`}
              aria-label={`Rotate Row ${rowIdx + 1} Right`}
              className="w-7 md:w-9 h-full rounded-xl bg-slate-900/90 dark:bg-slate-900/90 light:bg-white/90 border border-slate-800/80 dark:border-slate-800/80 light:border-slate-300 text-slate-300 dark:text-slate-300 light:text-slate-700 hover:text-indigo-400 hover:border-indigo-500/50 hover:bg-indigo-500/10 flex items-center justify-center transition-all active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shadow-md"
            >
              <ArrowRight size={15} />
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Column Rotate Down Buttons */}
      <div className="flex items-center gap-1.5 md:gap-2 w-full">
        {/* Left Corner Spacer matching left arrow button width */}
        <div className="w-7 md:w-9 shrink-0" />
        {/* 4 Down Arrows aligned with the 4 columns */}
        <div className="grid grid-cols-4 gap-2 md:gap-2.5 flex-1 px-2.5 md:px-3.5">
          {[0, 1, 2, 3].map(colIdx => (
            <button
              key={`col-down-${colIdx}`}
              disabled={isSolved}
              onClick={() =>
                onExecuteAction({
                  type: 'ROTATE_COL_DOWN',
                  index: colIdx,
                  label: `Col ${colIdx + 1} Down`,
                })
              }
              title={`Rotate Column ${colIdx + 1} Down`}
              aria-label={`Rotate Column ${colIdx + 1} Down`}
              className="h-7 md:h-9 rounded-xl bg-slate-900/90 dark:bg-slate-900/90 light:bg-white/90 border border-slate-800/80 dark:border-slate-800/80 light:border-slate-300 text-slate-300 dark:text-slate-300 light:text-slate-700 hover:text-indigo-400 hover:border-indigo-500/50 hover:bg-indigo-500/10 flex items-center justify-center transition-all active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shadow-md"
            >
              <ArrowDown size={15} />
            </button>
          ))}
        </div>
        {/* Right Corner Spacer matching right arrow button width */}
        <div className="w-7 md:w-9 shrink-0" />
      </div>
    </div>
  );
};
