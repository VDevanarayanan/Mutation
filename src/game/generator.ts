import type { BoardState, GeneratedPuzzle, GameAction } from './types';
import { createSolvedBoard, getValidActions, executeAction, isSolved } from './board';
import { dateStringToSeed, createPRNG, getRandomInt, pickRandom } from './dailySeed';
import { solvePuzzle } from './solver';

export interface GeneratorConfig {
  minOptimalMoves: number;
  maxOptimalMoves: number;
  minScrambleSteps: number;
  maxScrambleSteps: number;
}

export const DEFAULT_DAILY_CONFIG: GeneratorConfig = {
  minOptimalMoves: 6,
  maxOptimalMoves: 12,
  minScrambleSteps: 8,
  maxScrambleSteps: 14,
};

export const PRACTICE_CONFIG: GeneratorConfig = {
  minOptimalMoves: 5,
  maxOptimalMoves: 10,
  minScrambleSteps: 6,
  maxScrambleSteps: 12,
};

export function generatePuzzle(
  dateStr: string,
  config: GeneratorConfig = DEFAULT_DAILY_CONFIG
): GeneratedPuzzle {
  const baseSeed = dateStringToSeed(dateStr);
  let attempt = 0;

  while (attempt < 100) {
    const seed = baseSeed + attempt * 997;
    const prng = createPRNG(seed);

    let board: BoardState = createSolvedBoard();
    const scrambleCount = getRandomInt(prng, config.minScrambleSteps, config.maxScrambleSteps);

    let lastAction: GameAction | undefined = undefined;

    for (let step = 0; step < scrambleCount; step++) {
      const validActions = getValidActions(board);

      let candidates = validActions;
      if (lastAction) {
        candidates = validActions.filter(a => !isInverseAction(lastAction!, a));
        if (candidates.length === 0) candidates = validActions;
      }

      const action = pickRandom(prng, candidates);
      const nextBoard = executeAction(board, action);
      if (nextBoard) {
        board = nextBoard;
        lastAction = action;
      }
    }

    if (isSolved(board)) {
      attempt++;
      continue;
    }

    const solution = solvePuzzle(board, config.maxOptimalMoves + 2);

    if (
      solution.solved &&
      solution.optimalMoves >= config.minOptimalMoves &&
      solution.optimalMoves <= config.maxOptimalMoves
    ) {
      return {
        seed: `${dateStr}_v${attempt}`,
        initialBoard: board,
        optimalMoves: solution.optimalMoves,
        scrambleMovesCount: scrambleCount,
      };
    }

    attempt++;
  }

  const prng = createPRNG(baseSeed);
  let fallbackBoard = createSolvedBoard();
  for (let i = 0; i < 7; i++) {
    const valid = getValidActions(fallbackBoard);
    const act = pickRandom(prng, valid);
    const nb = executeAction(fallbackBoard, act);
    if (nb) fallbackBoard = nb;
  }
  const fallbackSol = solvePuzzle(fallbackBoard, 15);
  return {
    seed: `${dateStr}_fallback`,
    initialBoard: fallbackBoard,
    optimalMoves: fallbackSol.optimalMoves || 6,
    scrambleMovesCount: 7,
  };
}

function isInverseAction(a: GameAction, b: GameAction): boolean {
  if (a.type === 'MOVE_TILE' && b.type === 'MOVE_TILE') {
    return a.index === b.index;
  }
  if (a.index !== b.index) return false;
  if (
    (a.type === 'ROTATE_ROW_LEFT' && b.type === 'ROTATE_ROW_RIGHT') ||
    (a.type === 'ROTATE_ROW_RIGHT' && b.type === 'ROTATE_ROW_LEFT')
  ) {
    return true;
  }
  if (
    (a.type === 'ROTATE_COL_UP' && b.type === 'ROTATE_COL_DOWN') ||
    (a.type === 'ROTATE_COL_DOWN' && b.type === 'ROTATE_COL_UP')
  ) {
    return true;
  }
  return false;
}
