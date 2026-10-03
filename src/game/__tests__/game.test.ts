import { describe, it, expect } from 'vitest';
import {
  createSolvedBoard,
  isSolved,
  canMoveTile,
  moveTile,
  rotateRow,
  rotateCol,
} from '../board';
import { generatePuzzle } from '../generator';
import { solvePuzzle } from '../solver';
import { calculateEfficiency } from '../scoring';

describe('Board operations', () => {
  it('should detect solved board correctly', () => {
    const solved = createSolvedBoard();
    expect(isSolved(solved)).toBe(true);

    const copy = [...solved];
    copy[0] = 2;
    copy[1] = 1;
    expect(isSolved(copy)).toBe(false);
  });

  it('should handle valid and invalid tile moves', () => {
    const solved = createSolvedBoard();
    expect(canMoveTile(solved, 14)).toBe(true);
    expect(canMoveTile(solved, 11)).toBe(true);
    expect(canMoveTile(solved, 0)).toBe(false);
    expect(canMoveTile(solved, 15)).toBe(false);

    const moved = moveTile(solved, 14);
    expect(moved).not.toBeNull();
    if (moved) {
      expect(moved[14]).toBe(0);
      expect(moved[15]).toBe(15);
    }

    const invalidMoved = moveTile(solved, 0);
    expect(invalidMoved).toBeNull();
  });

  it('should rotate row left and right correctly', () => {
    const board = [
      1,  2,  3,  4,
      5,  6,  7,  8,
      9,  10, 11, 12,
      13, 14, 15, 0,
    ];

    const row0Left = rotateRow(board, 0, 'left');
    expect(row0Left.slice(0, 4)).toEqual([2, 3, 4, 1]);

    const row0Right = rotateRow(row0Left, 0, 'right');
    expect(row0Right.slice(0, 4)).toEqual([1, 2, 3, 4]);

    const row3Left = rotateRow(board, 3, 'left');
    expect(row3Left.slice(12, 16)).toEqual([14, 15, 0, 13]);
  });

  it('should rotate col up and down correctly', () => {
    const board = [
      1,  2,  3,  4,
      5,  6,  7,  8,
      9,  10, 11, 12,
      13, 14, 15, 0,
    ];

    const col0Up = rotateCol(board, 0, 'up');
    expect([col0Up[0], col0Up[4], col0Up[8], col0Up[12]]).toEqual([5, 9, 13, 1]);

    const col0Down = rotateCol(col0Up, 0, 'down');
    expect([col0Down[0], col0Down[4], col0Down[8], col0Down[12]]).toEqual([1, 5, 9, 13]);
  });
});

describe('Solver', () => {
  it('should return 0 optimal moves for solved board', () => {
    const solved = createSolvedBoard();
    const result = solvePuzzle(solved);
    expect(result.solved).toBe(true);
    expect(result.optimalMoves).toBe(0);
  });

  it('should calculate expected optimal solution for 1-move scramble', () => {
    const solved = createSolvedBoard();
    const scrambled = rotateRow(solved, 0, 'left');
    const result = solvePuzzle(scrambled);
    expect(result.solved).toBe(true);
    expect(result.optimalMoves).toBe(1);
  });

  it('should solve a 3-move scrambled board accurately', () => {
    let board = createSolvedBoard();
    board = rotateRow(board, 1, 'right');
    board = rotateCol(board, 2, 'up');
    board = moveTile(board, board.indexOf(0) - 1) || board;

    const result = solvePuzzle(board, 10);
    expect(result.solved).toBe(true);
    expect(result.optimalMoves).toBeGreaterThan(0);
    expect(result.optimalMoves).toBeLessThanOrEqual(3);
  });
});

describe('Generator and Daily System', () => {
  it('should produce identical puzzle for the same date seed', () => {
    const p1 = generatePuzzle('2026-10-01');
    const p2 = generatePuzzle('2026-10-01');
    expect(p1.initialBoard).toEqual(p2.initialBoard);
    expect(p1.optimalMoves).toEqual(p2.optimalMoves);
  });

  it('should produce different puzzles for different dates', () => {
    const p1 = generatePuzzle('2026-10-01');
    const p2 = generatePuzzle('2026-10-02');
    expect(p1.initialBoard).not.toEqual(p2.initialBoard);
  });

  it('should generate solvable puzzles within requested optimal move bounds', () => {
    const puzzle = generatePuzzle('2026-10-01', {
      minOptimalMoves: 6,
      maxOptimalMoves: 12,
      minScrambleSteps: 8,
      maxScrambleSteps: 12,
    });
    expect(puzzle.optimalMoves).toBeGreaterThanOrEqual(6);
    expect(puzzle.optimalMoves).toBeLessThanOrEqual(12);

    const solveCheck = solvePuzzle(puzzle.initialBoard, 15);
    expect(solveCheck.solved).toBe(true);
    expect(solveCheck.optimalMoves).toBe(puzzle.optimalMoves);
  });
});

describe('Scoring', () => {
  it('should calculate efficiency percentage correctly', () => {
    expect(calculateEfficiency(10, 10)).toBe(100);
    expect(calculateEfficiency(20, 10)).toBe(50);
    expect(calculateEfficiency(15, 10)).toBe(67);
  });
});
