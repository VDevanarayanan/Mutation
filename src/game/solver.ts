import type { BoardState, GameAction } from './types';
import { createSolvedBoard, getValidActions, executeAction, isSolved } from './board';

export function boardToBigInt(board: BoardState): bigint {
  let val = 0n;
  for (let i = 0; i < 16; i++) {
    val = (val << 4n) | BigInt(board[i]);
  }
  return val;
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

export interface SolveResult {
  optimalMoves: number;
  solved: boolean;
  nodesVisited: number;
}

export function solvePuzzle(startBoard: BoardState, maxDepth: number = 16): SolveResult {
  if (isSolved(startBoard)) {
    return { optimalMoves: 0, solved: true, nodesVisited: 1 };
  }

  const solvedBoard = createSolvedBoard();
  const startKey = boardToBigInt(startBoard);
  const targetKey = boardToBigInt(solvedBoard);

  if (startKey === targetKey) {
    return { optimalMoves: 0, solved: true, nodesVisited: 1 };
  }

  let forwardFrontier: Array<{ board: BoardState; lastAction?: GameAction }> = [
    { board: startBoard },
  ];
  const forwardVisited = new Map<bigint, number>();
  forwardVisited.set(startKey, 0);

  let backwardFrontier: Array<{ board: BoardState; lastAction?: GameAction }> = [
    { board: solvedBoard },
  ];
  const backwardVisited = new Map<bigint, number>();
  backwardVisited.set(targetKey, 0);

  let nodesVisited = 2;
  const halfDepth = Math.ceil(maxDepth / 2) + 1;

  for (let d = 1; d <= maxDepth; d++) {
    const expandForward = forwardFrontier.length <= backwardFrontier.length;

    if (expandForward) {
      const nextFrontier: Array<{ board: BoardState; lastAction?: GameAction }> = [];
      for (let i = 0; i < forwardFrontier.length; i++) {
        const current = forwardFrontier[i];
        const currentKey = boardToBigInt(current.board);
        const currentDist = forwardVisited.get(currentKey)!;

        if (currentDist + 1 > halfDepth) continue;

        const validActions = getValidActions(current.board);
        for (let j = 0; j < validActions.length; j++) {
          const action = validActions[j];
          if (current.lastAction && isInverseAction(current.lastAction, action)) {
            continue;
          }

          const nextBoard = executeAction(current.board, action);
          if (!nextBoard) continue;
          nodesVisited++;

          const nextKey = boardToBigInt(nextBoard);

          const backDist = backwardVisited.get(nextKey);
          if (backDist !== undefined) {
            return {
              optimalMoves: currentDist + 1 + backDist,
              solved: true,
              nodesVisited,
            };
          }

          if (!forwardVisited.has(nextKey)) {
            forwardVisited.set(nextKey, currentDist + 1);
            nextFrontier.push({ board: nextBoard, lastAction: action });
          }
        }
      }
      if (nextFrontier.length === 0) break;
      forwardFrontier = nextFrontier;
    } else {
      const nextFrontier: Array<{ board: BoardState; lastAction?: GameAction }> = [];
      for (let i = 0; i < backwardFrontier.length; i++) {
        const current = backwardFrontier[i];
        const currentKey = boardToBigInt(current.board);
        const currentDist = backwardVisited.get(currentKey)!;

        if (currentDist + 1 > halfDepth) continue;

        const validActions = getValidActions(current.board);
        for (let j = 0; j < validActions.length; j++) {
          const action = validActions[j];
          if (current.lastAction && isInverseAction(current.lastAction, action)) {
            continue;
          }

          const nextBoard = executeAction(current.board, action);
          if (!nextBoard) continue;
          nodesVisited++;

          const nextKey = boardToBigInt(nextBoard);

          const fwdDist = forwardVisited.get(nextKey);
          if (fwdDist !== undefined) {
            return {
              optimalMoves: currentDist + 1 + fwdDist,
              solved: true,
              nodesVisited,
            };
          }

          if (!backwardVisited.has(nextKey)) {
            backwardVisited.set(nextKey, currentDist + 1);
            nextFrontier.push({ board: nextBoard, lastAction: action });
          }
        }
      }
      if (nextFrontier.length === 0) break;
      backwardFrontier = nextFrontier;
    }
  }

  return {
    optimalMoves: maxDepth,
    solved: false,
    nodesVisited,
  };
}
