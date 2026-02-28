import type { CompletionLog, UserProgress } from '../types/types';
import { ACHIEVEMENTS } from '../data/achievements';

/** Capitalizes the first letter of a string. */
export const capitalizeFirstLetter = (text: string): string => {
  if (text.length === 0) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
};

// --- XP & Leveling ---
const XP_PER_LEVEL = 100;

export const getLevelFromTotalXp = (totalXp: number): number =>
  Math.floor(totalXp / XP_PER_LEVEL) + 1;

export const getXpForLevel = (_level: number): number => XP_PER_LEVEL;

export const getXpProgress = (totalXp: number): number =>
  totalXp % XP_PER_LEVEL;

// --- Streaks ---

export const calculateStreak = (
  logs: CompletionLog[],
): { current: number; longest: number } => {
  const completedDates = new Set(
    logs
      .filter((l) => l.completed)
      .map((l) => new Date(l.date).toDateString()),
  );

  if (completedDates.size === 0) return { current: 0, longest: 0 };

  const sorted = [...completedDates]
    .map((d) => new Date(d))
    .sort((a, b) => a.getTime() - b.getTime());

  let current = 0;
  let longest = 0;
  let streak = 1;

  for (let i = 1; i < sorted.length; i++) {
    const diff =
      (sorted[i].getTime() - sorted[i - 1].getTime()) / (1000 * 60 * 60 * 24);
    if (diff === 1) {
      streak++;
    } else {
      longest = Math.max(longest, streak);
      streak = 1;
    }
  }
  longest = Math.max(longest, streak);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const lastDate = sorted[sorted.length - 1];
  lastDate.setHours(0, 0, 0, 0);

  if (
    lastDate.getTime() === today.getTime() ||
    lastDate.getTime() === yesterday.getTime()
  ) {
    current = streak;
  } else {
    current = 0;
  }

  return { current, longest };
};

// --- Achievements ---

export const checkNewAchievements = (
  progress: UserProgress,
  extra?: { lastCompletedDiscomfort?: number },
): string[] => {
  const alreadyUnlocked = new Set(progress.achievements ?? []);
  const newlyUnlocked: string[] = [];

  for (const achievement of ACHIEVEMENTS) {
    if (alreadyUnlocked.has(achievement.id)) continue;
    if (achievement.condition(progress, extra)) {
      newlyUnlocked.push(achievement.id);
    }
  }

  return newlyUnlocked;
};
