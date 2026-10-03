import type { DailyResult, GameStats } from './types';
import { getTodayDateString } from './dailySeed';

const STATS_KEY = 'mutation_stats_v1';
const STATE_PREFIX = 'mutation_state_';
const TUTORIAL_KEY = 'mutation_tutorial_seen';
const THEME_KEY = 'mutation_theme';

export function calculateEfficiency(playerMoves: number, optimalMoves: number): number {
  if (playerMoves <= 0) return 100;
  const eff = Math.round((optimalMoves / playerMoves) * 100);
  return Math.min(100, Math.max(0, eff));
}

export function formatTime(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function loadGameStats(): GameStats {
  try {
    const data = localStorage.getItem(STATS_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to load stats', e);
  }
  return {
    gamesPlayed: 0,
    gamesWon: 0,
    currentStreak: 0,
    maxStreak: 0,
    lastPlayedDate: '',
    totalMoves: 0,
    totalTimeSeconds: 0,
    bestEfficiency: 0,
    history: [],
  };
}

export function saveGameStats(stats: GameStats): void {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (e) {
    console.error('Failed to save stats', e);
  }
}

export function recordDailyCompletion(result: DailyResult): GameStats {
  const stats = loadGameStats();

  const existingIdx = stats.history.findIndex(h => h.date === result.date);
  if (existingIdx >= 0) {
    stats.history[existingIdx] = result;
    saveGameStats(stats);
    return stats;
  }

  stats.history.unshift(result);
  stats.gamesPlayed += 1;
  if (result.completed) {
    stats.gamesWon += 1;
    stats.totalMoves += result.movesCount;
    stats.totalTimeSeconds += result.timeSeconds;
    if (result.efficiency > stats.bestEfficiency) {
      stats.bestEfficiency = result.efficiency;
    }

    const yesterday = getYesterdayDateString(result.date);
    if (stats.lastPlayedDate === yesterday) {
      stats.currentStreak += 1;
    } else if (stats.lastPlayedDate === result.date) {

    } else {
      stats.currentStreak = 1;
    }

    if (stats.currentStreak > stats.maxStreak) {
      stats.maxStreak = stats.currentStreak;
    }
    stats.lastPlayedDate = result.date;
  }

  saveGameStats(stats);
  return stats;
}

export function getYesterdayDateString(dateStr: string): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() - 1);
  return getTodayDateString(d);
}

export function saveDailyState(result: Partial<DailyResult> & { date: string }): void {
  try {
    localStorage.setItem(`${STATE_PREFIX}${result.date}`, JSON.stringify(result));
  } catch (e) {
    console.error('Failed to save daily state', e);
  }
}

export function loadDailyState(dateStr: string): Partial<DailyResult> | null {
  try {
    const data = localStorage.getItem(`${STATE_PREFIX}${dateStr}`);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Failed to load daily state', e);
  }
  return null;
}

export function hasSeenTutorial(): boolean {
  return localStorage.getItem(TUTORIAL_KEY) === 'true';
}

export function setSeenTutorial(seen: boolean = true): void {
  localStorage.setItem(TUTORIAL_KEY, seen ? 'true' : 'false');
}

export function getSavedTheme(): 'light' | 'dark' {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === 'light' || saved === 'dark') return saved;
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

export function saveTheme(theme: 'light' | 'dark'): void {
  localStorage.setItem(THEME_KEY, theme);
}

export function generateShareText(result: DailyResult, streak: number): string {
  const eff = result.efficiency;
  let squares = '🟩🟩🟨⬜';
  if (eff >= 90) squares = '🟩🟩🟩🟩';
  else if (eff >= 75) squares = '🟩🟩🟩🟨';
  else if (eff >= 60) squares = '🟩🟩🟨🟨';
  else if (eff >= 40) squares = '🟨🟨🟧⬜';
  else squares = '🟧🟧⬜⬜';

  const dateFormatted = formatDateForDisplay(result.date);
  const timeFormatted = formatTime(result.timeSeconds);

  return `Mutation — ${dateFormatted}\n\n${squares}\n${result.movesCount} moves | ${timeFormatted}\nOptimal: ${result.optimalMoves} (${eff}% efficiency)\n🔥 ${streak} day streak\n\nMutation Game`;
}

export function formatDateForDisplay(dateStr: string): string {
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch (e) {
    return dateStr;
  }
}
