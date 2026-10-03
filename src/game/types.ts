export type BoardState = number[]; // 16 elements (0 = blank space, 1..15 = tiles)

export type ActionType = 
  | 'MOVE_TILE'
  | 'ROTATE_ROW_LEFT'
  | 'ROTATE_ROW_RIGHT'
  | 'ROTATE_COL_UP'
  | 'ROTATE_COL_DOWN';

export interface GameAction {
  type: ActionType;
  index: number; // For MOVE_TILE: tile index 0..15; For ROW: row index 0..3; For COL: col index 0..3
  label?: string;
}

export interface GeneratedPuzzle {
  seed: string;
  initialBoard: BoardState;
  optimalMoves: number;
  scrambleMovesCount: number;
}

export interface DailyResult {
  date: string; // YYYY-MM-DD
  completed: boolean;
  movesCount: number;
  timeSeconds: number;
  optimalMoves: number;
  efficiency: number; // 0..100
  board: BoardState;
  history: GameAction[];
  solvedAt?: string;
}

export interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  lastPlayedDate: string; // YYYY-MM-DD
  totalMoves: number;
  totalTimeSeconds: number;
  bestEfficiency: number;
  history: DailyResult[];
}
