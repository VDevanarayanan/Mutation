import type { BoardState, GameAction } from './types';

export const GRID_SIZE = 4;
export const TOTAL_TILES = GRID_SIZE * GRID_SIZE; // 16

export function createSolvedBoard(): BoardState {
  const board: BoardState = [];
  for (let i = 1; i < TOTAL_TILES; i++) {
    board.push(i);
  }
  board.push(0); // 0 represents the blank tile
  return board;
}

export const SOLVED_BOARD_STRING = createSolvedBoard().join(',');

export function isSolved(board: BoardState): boolean {
  for (let i = 0; i < TOTAL_TILES - 1; i++) {
    if (board[i] !== i + 1) return false;
  }
  return board[TOTAL_TILES - 1] === 0;
}

export function getBlankIndex(board: BoardState): number {
  return board.indexOf(0);
}

export function getRowCol(index: number): { row: number; col: number } {
  return {
    row: Math.floor(index / GRID_SIZE),
    col: index % GRID_SIZE,
  };
}

export function getIndexFromRowCol(row: number, col: number): number {
  const r = (row + GRID_SIZE) % GRID_SIZE;
  const c = (col + GRID_SIZE) % GRID_SIZE;
  return r * GRID_SIZE + c;
}

export function canMoveTile(board: BoardState, index: number): boolean {
  if (index < 0 || index >= TOTAL_TILES) return false;
  const blankIdx = getBlankIndex(board);
  if (index === blankIdx) return false;

  const tileLoc = getRowCol(index);
  const blankLoc = getRowCol(blankIdx);

  const rowDiff = Math.abs(tileLoc.row - blankLoc.row);
  const colDiff = Math.abs(tileLoc.col - blankLoc.col);

  return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
}

export function moveTile(board: BoardState, index: number): BoardState | null {
  if (!canMoveTile(board, index)) return null;
  const blankIdx = getBlankIndex(board);
  const newBoard = [...board];
  newBoard[blankIdx] = newBoard[index];
  newBoard[index] = 0;
  return newBoard;
}

export function rotateRow(board: BoardState, rowIndex: number, direction: 'left' | 'right'): BoardState {
  if (rowIndex < 0 || rowIndex >= GRID_SIZE) return [...board];
  const newBoard = [...board];
  const start = rowIndex * GRID_SIZE;
  const row = newBoard.slice(start, start + GRID_SIZE);

  if (direction === 'left') {
    const shifted = [row[1], row[2], row[3], row[0]];
    for (let i = 0; i < GRID_SIZE; i++) {
      newBoard[start + i] = shifted[i];
    }
  } else {
    const shifted = [row[3], row[0], row[1], row[2]];
    for (let i = 0; i < GRID_SIZE; i++) {
      newBoard[start + i] = shifted[i];
    }
  }
  return newBoard;
}

export function rotateCol(board: BoardState, colIndex: number, direction: 'up' | 'down'): BoardState {
  if (colIndex < 0 || colIndex >= GRID_SIZE) return [...board];
  const newBoard = [...board];
  const colValues = [
    board[colIndex],
    board[colIndex + GRID_SIZE],
    board[colIndex + GRID_SIZE * 2],
    board[colIndex + GRID_SIZE * 3],
  ];

  let shifted: number[];
  if (direction === 'up') {
    shifted = [colValues[1], colValues[2], colValues[3], colValues[0]];
  } else {
    shifted = [colValues[3], colValues[0], colValues[1], colValues[2]];
  }

  for (let r = 0; r < GRID_SIZE; r++) {
    newBoard[colIndex + r * GRID_SIZE] = shifted[r];
  }
  return newBoard;
}

export function executeAction(board: BoardState, action: GameAction): BoardState | null {
  switch (action.type) {
    case 'MOVE_TILE':
      return moveTile(board, action.index);
    case 'ROTATE_ROW_LEFT':
      return rotateRow(board, action.index, 'left');
    case 'ROTATE_ROW_RIGHT':
      return rotateRow(board, action.index, 'right');
    case 'ROTATE_COL_UP':
      return rotateCol(board, action.index, 'up');
    case 'ROTATE_COL_DOWN':
      return rotateCol(board, action.index, 'down');
    default:
      return null;
  }
}

export function getValidActions(board: BoardState): GameAction[] {
  const actions: GameAction[] = [];

  const blankIdx = getBlankIndex(board);
  const { row: bRow, col: bCol } = getRowCol(blankIdx);

  const neighbors = [
    { row: bRow - 1, col: bCol },
    { row: bRow + 1, col: bCol },
    { row: bRow, col: bCol - 1 },
    { row: bRow, col: bCol + 1 },
  ];

  for (const n of neighbors) {
    if (n.row >= 0 && n.row < GRID_SIZE && n.col >= 0 && n.col < GRID_SIZE) {
      const idx = getIndexFromRowCol(n.row, n.col);
      actions.push({ type: 'MOVE_TILE', index: idx, label: `Move tile ${board[idx]}` });
    }
  }

  for (let r = 0; r < GRID_SIZE; r++) {
    actions.push({ type: 'ROTATE_ROW_LEFT', index: r, label: `Rotate Row ${r + 1} Left` });
    actions.push({ type: 'ROTATE_ROW_RIGHT', index: r, label: `Rotate Row ${r + 1} Right` });
  }

  for (let c = 0; c < GRID_SIZE; c++) {
    actions.push({ type: 'ROTATE_COL_UP', index: c, label: `Rotate Col ${c + 1} Up` });
    actions.push({ type: 'ROTATE_COL_DOWN', index: c, label: `Rotate Col ${c + 1} Down` });
  }

  return actions;
}
