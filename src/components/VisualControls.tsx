import React from 'react';
import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown } from 'lucide-react';
import type { GameAction } from '../game/types';

interface VisualControlsProps {
  onExecuteAction: (action: GameAction) => void;
  disabled?: boolean;
}

export const VisualControls: React.FC<VisualControlsProps> = ({
  onExecuteAction,
  disabled = false,
}) => {
  return (
    <div className="w-full flex flex-col items-center gap-2">
      {/* Top Column Shift Buttons */}
      <div className="grid grid-cols-4 gap-2.5 w-full max-w-[340px] md:max-w-[380px] px-3">
        {[0, 1, 2, 3].map(colIdx => (
          <button
            key={`col-up-${colIdx}`}
            disabled={disabled}
            onClick={() =>
              onExecuteAction({
                type: 'ROTATE_COL_UP',
                index: colIdx,
                label: `Col ${colIdx + 1} Up`,
              })
            }
            title={`Rotate Column ${colIdx + 1} Up`}
            aria-label={`Rotate Column ${colIdx + 1} Up`}
            className="h-9 rounded-xl bg-slate-800/80 dark:bg-slate-800/80 light:bg-slate-200/90 border border-slate-700/80 dark:border-slate-700/80 light:border-slate-300 text-slate-300 dark:text-slate-300 light:text-slate-700 hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-600 hover:text-white hover:border-indigo-400 flex items-center justify-center transition-all active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shadow-sm"
          >
            <ArrowUp size={16} />
          </button>
        ))}
      </div>

      {/* Row Control Pairs (Sides) */}
      <div className="w-full max-w-[340px] md:max-w-[380px] px-3 flex flex-col gap-2.5">
        {[0, 1, 2, 3].map(rowIdx => (
          <div key={`row-controls-${rowIdx}`} className="flex justify-between items-center h-[72px] md:h-[82px]">
            <button
              disabled={disabled}
              onClick={() =>
                onExecuteAction({
                  type: 'ROTATE_ROW_LEFT',
                  index: rowIdx,
                  label: `Row ${rowIdx + 1} Left`,
                })
              }
              title={`Rotate Row ${rowIdx + 1} Left`}
              aria-label={`Rotate Row ${rowIdx + 1} Left`}
              className="w-9 h-full rounded-xl bg-slate-800/80 dark:bg-slate-800/80 light:bg-slate-200/90 border border-slate-700/80 dark:border-slate-700/80 light:border-slate-300 text-slate-300 dark:text-slate-300 light:text-slate-700 hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-600 hover:text-white hover:border-indigo-400 flex items-center justify-center transition-all active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shadow-sm"
            >
              <ArrowLeft size={16} />
            </button>

            <button
              disabled={disabled}
              onClick={() =>
                onExecuteAction({
                  type: 'ROTATE_ROW_RIGHT',
                  index: rowIdx,
                  label: `Row ${rowIdx + 1} Right`,
                })
              }
              title={`Rotate Row ${rowIdx + 1} Right`}
              aria-label={`Rotate Row ${rowIdx + 1} Right`}
              className="w-9 h-full rounded-xl bg-slate-800/80 dark:bg-slate-800/80 light:bg-slate-200/90 border border-slate-700/80 dark:border-slate-700/80 light:border-slate-300 text-slate-300 dark:text-slate-300 light:text-slate-700 hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-600 hover:text-white hover:border-indigo-400 flex items-center justify-center transition-all active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shadow-sm"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Bottom Column Shift Buttons */}
      <div className="grid grid-cols-4 gap-2.5 w-full max-w-[340px] md:max-w-[380px] px-3">
        {[0, 1, 2, 3].map(colIdx => (
          <button
            key={`col-down-${colIdx}`}
            disabled={disabled}
            onClick={() =>
              onExecuteAction({
                type: 'ROTATE_COL_DOWN',
                index: colIdx,
                label: `Col ${colIdx + 1} Down`,
              })
            }
            title={`Rotate Column ${colIdx + 1} Down`}
            aria-label={`Rotate Column ${colIdx + 1} Down`}
            className="h-9 rounded-xl bg-slate-800/80 dark:bg-slate-800/80 light:bg-slate-200/90 border border-slate-700/80 dark:border-slate-700/80 light:border-slate-300 text-slate-300 dark:text-slate-300 light:text-slate-700 hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-600 hover:text-white hover:border-indigo-400 flex items-center justify-center transition-all active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shadow-sm"
          >
            <ArrowDown size={16} />
          </button>
        ))}
      </div>
    </div>
  );
};
