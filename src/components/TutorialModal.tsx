import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown, Play } from 'lucide-react';
import { setSeenTutorial } from '../game/scoring';

interface TutorialModalProps {
  onClose: () => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({ onClose }) => {
  const [step, setStep] = useState<number>(1);
  const [demoState, setDemoState] = useState({
    tileMoved: false,
    rowShifted: false,
    colShifted: false,
  });

  const handleFinish = () => {
    setSeenTutorial(true);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-pop-in">
      <div className="bg-slate-900 dark:bg-slate-900 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 rounded-3xl p-6 w-full max-w-sm shadow-2xl flex flex-col gap-4 text-slate-100 dark:text-slate-100 light:text-slate-900">
        <div className="text-center flex flex-col items-center gap-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">
            Step {step} of 4
          </span>
          <h2 className="text-lg font-black tracking-wider">HOW TO PLAY</h2>
        </div>

        {step === 1 && (
          <div className="flex flex-col items-center text-center gap-4">
            <h3 className="text-sm font-extrabold text-indigo-300 uppercase tracking-wider">YOUR GOAL</h3>
            <p className="text-xs text-slate-300 dark:text-slate-300 light:text-slate-600 leading-relaxed">
              Return the 4×4 board to its original order <strong>1 to 15</strong> with the empty space at the end.
            </p>

            <div className="grid grid-cols-4 gap-1.5 bg-slate-950/80 p-3 rounded-2xl border border-slate-800 w-44">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(num => (
                <div
                  key={num}
                  className="bg-slate-800 text-slate-200 rounded-lg text-xs font-bold h-7 flex items-center justify-center border border-slate-700/60"
                >
                  {num}
                </div>
              ))}
              <div className="border border-dashed border-slate-700/80 rounded-lg text-xs text-slate-500 h-7 flex items-center justify-center">
                □
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-extrabold py-3 rounded-xl shadow-lg active:scale-98 transition-all cursor-pointer text-sm"
            >
              Next: Move Tiles
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col items-center text-center gap-4">
            <h3 className="text-sm font-extrabold text-indigo-300 uppercase tracking-wider">
              OPERATION 1 — MOVE TILE
            </h3>
            <p className="text-xs text-slate-300 dark:text-slate-300 light:text-slate-600 leading-relaxed">
              Tap or click any tile adjacent to the empty space to slide it into the empty slot.
            </p>

            <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800/80 w-full flex flex-col items-center gap-2">
              <span className="text-[11px] text-indigo-400 font-semibold">Try tapping tile 15:</span>
              <div className="flex gap-2">
                <div className="w-12 h-12 bg-slate-800 text-slate-200 border border-slate-700 rounded-xl font-bold flex items-center justify-center">
                  14
                </div>
                <button
                  onClick={() => setDemoState(prev => ({ ...prev, tileMoved: true }))}
                  className={`w-12 h-12 rounded-xl font-bold flex items-center justify-center transition-all cursor-pointer ${
                    demoState.tileMoved
                      ? 'bg-slate-950 border border-dashed border-slate-800 text-slate-600'
                      : 'bg-indigo-600/30 text-indigo-300 border-2 border-indigo-500 ring-2 ring-indigo-500/50 active:scale-95'
                  }`}
                >
                  {demoState.tileMoved ? '□' : '15'}
                </button>
                <div className="w-12 h-12 bg-slate-950 border border-dashed border-slate-800 rounded-xl font-bold flex items-center justify-center text-slate-400">
                  {demoState.tileMoved ? '15' : '□'}
                </div>
              </div>
            </div>

            <button
              disabled={!demoState.tileMoved}
              onClick={() => setStep(3)}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 disabled:opacity-40 text-white font-extrabold py-3 rounded-xl shadow-lg active:scale-98 transition-all cursor-pointer text-sm"
            >
              {demoState.tileMoved ? 'Next: Row Mutation' : 'Tap Tile 15 to Continue'}
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col items-center text-center gap-4">
            <h3 className="text-sm font-extrabold text-indigo-300 uppercase tracking-wider">
              OPERATION 2 — ROW MUTATION
            </h3>
            <p className="text-xs text-slate-300 dark:text-slate-300 light:text-slate-600 leading-relaxed">
              Rotate an entire row <strong>left or right</strong>. Swipe a row or tap the row shift buttons!
            </p>

            <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800/80 w-full flex items-center justify-between">
              <button
                onClick={() => setDemoState(prev => ({ ...prev, rowShifted: true }))}
                className="w-8 h-8 rounded-lg bg-slate-800 text-indigo-400 hover:bg-indigo-600 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <ArrowLeft size={16} />
              </button>

              <div className="flex gap-1.5">
                {(demoState.rowShifted ? [2, 3, 4, 1] : [1, 2, 3, 4]).map((val, i) => (
                  <div
                    key={i}
                    className="w-9 h-9 bg-slate-800 text-slate-100 rounded-lg font-bold flex items-center justify-center border border-slate-700 text-sm"
                  >
                    {val}
                  </div>
                ))}
              </div>

              <button
                onClick={() => setDemoState(prev => ({ ...prev, rowShifted: true }))}
                className="w-8 h-8 rounded-lg bg-slate-800 text-indigo-400 hover:bg-indigo-600 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <ArrowRight size={16} />
              </button>
            </div>

            <button
              disabled={!demoState.rowShifted}
              onClick={() => setStep(4)}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 disabled:opacity-40 text-white font-extrabold py-3 rounded-xl shadow-lg active:scale-98 transition-all cursor-pointer text-sm"
            >
              {demoState.rowShifted ? 'Next: Column Mutation' : 'Try Row Shift'}
            </button>
          </div>
        )}

        {step === 4 && (
          <div className="flex flex-col items-center text-center gap-4">
            <h3 className="text-sm font-extrabold text-indigo-300 uppercase tracking-wider">
              OPERATION 3 — COLUMN MUTATION
            </h3>
            <p className="text-xs text-slate-300 dark:text-slate-300 light:text-slate-600 leading-relaxed">
              Rotate an entire column <strong>up or down</strong>. Swipe a column or tap the column shift buttons!
            </p>

            <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800/80 w-full flex flex-col items-center gap-2">
              <button
                onClick={() => setDemoState(prev => ({ ...prev, colShifted: true }))}
                className="w-8 h-8 rounded-lg bg-slate-800 text-indigo-400 hover:bg-indigo-600 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <ArrowUp size={16} />
              </button>

              <div className="flex flex-col gap-1.5">
                {(demoState.colShifted ? [5, 9, 13, 1] : [1, 5, 9, 13]).map((val, i) => (
                  <div
                    key={i}
                    className="w-9 h-8 bg-slate-800 text-slate-100 rounded-lg font-bold flex items-center justify-center border border-slate-700 text-xs"
                  >
                    {val}
                  </div>
                ))}
              </div>

              <button
                onClick={() => setDemoState(prev => ({ ...prev, colShifted: true }))}
                className="w-8 h-8 rounded-lg bg-slate-800 text-indigo-400 hover:bg-indigo-600 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <ArrowDown size={16} />
              </button>
            </div>

            <button
              onClick={handleFinish}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-extrabold py-3.5 rounded-xl shadow-lg active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              <Play size={16} />
              <span>Start Playing!</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
