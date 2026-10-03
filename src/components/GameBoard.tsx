import React, { useRef, useEffect } from 'react';
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
    <div className="w-full flex items-center justify-center p-2 relative">
      <div
        ref={boardRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className={`grid grid-cols-4 grid-rows-4 gap-2.5 bg-slate-900/90 dark:bg-slate-900/90 light:bg-slate-200/90 p-3.5 rounded-3xl border border-slate-800/80 dark:border-slate-800/80 light:border-slate-300 shadow-2xl aspect-square w-full max-w-[340px] md:max-w-[380px] touch-none transition-all duration-300 ${
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
    </div>
  );
};
