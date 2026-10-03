import React from 'react';
import { getRowCol } from '../game/board';

interface TileProps {
  value: number;
  index: number;
  isAdjacentToBlank: boolean;
  onClick: () => void;
  isSolvedPosition: boolean;
}

export const TileComponent: React.FC<TileProps> = ({
  value,
  index,
  isAdjacentToBlank,
  onClick,
  isSolvedPosition,
}) => {
  const isBlank = value === 0;
  const { row, col } = getRowCol(index);

  const gridStyle: React.CSSProperties = {
    gridRowStart: row + 1,
    gridColumnStart: col + 1,
  };

  if (isBlank) {
    return (
      <div
        style={gridStyle}
        data-index={index}
        aria-label="Empty space"
        className="w-full h-full rounded-2xl bg-slate-950/70 dark:bg-slate-950/70 light:bg-slate-300/50 border-2 border-dashed border-slate-800/80 dark:border-slate-800/80 light:border-slate-300/80 shadow-inner flex items-center justify-center transition-all duration-200"
      />
    );
  }

  return (
    <button
      style={gridStyle}
      onClick={onClick}
      aria-label={`Tile ${value}`}
      data-value={value}
      data-index={index}
      className={`w-full h-full rounded-2xl flex items-center justify-center font-black text-xl md:text-2xl transition-all duration-200 tile-shadow cursor-pointer select-none ${
        isAdjacentToBlank
          ? 'bg-gradient-to-b from-indigo-900/90 to-slate-900 border-2 border-indigo-400/90 text-indigo-100 ring-2 ring-indigo-500/50 hover:scale-[1.03] active:scale-95 shadow-indigo-500/20'
          : isSolvedPosition
          ? 'bg-gradient-to-b from-slate-800 to-slate-900 dark:from-slate-800 dark:to-slate-900 light:from-white light:to-slate-100 border border-emerald-500/40 text-emerald-400 dark:text-emerald-400 light:text-emerald-600'
          : 'bg-gradient-to-b from-slate-800 to-slate-900 dark:from-slate-800 dark:to-slate-900 light:from-white light:to-slate-100 border border-slate-700/80 dark:border-slate-700/80 light:border-slate-300 text-slate-100 dark:text-slate-100 light:text-slate-800'
      }`}
    >
      <span className="drop-shadow-sm">{value}</span>
    </button>
  );
};
