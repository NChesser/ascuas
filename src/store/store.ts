import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import type {
  Challenge,
  CompletionLog,
  Mood,
  UserProgress,
} from '../types/types';
import { CHALLENGES } from '../data/challenges';
import {
  calculateStreak,
  checkNewAchievements,
  getLevelFromTotalXp,
} from '../utils/helpers';
import { getUserTier } from '../data/tiers';

// ─── Achievement callback ────────────────────────────────────
let achievementCallback: ((ids: string[]) => void) | null = null;
export const onAchievementUnlocked = (cb: (ids: string[]) => void) => {
  achievementCallback = cb;
};

// ─── Today's Challenge Store ─────────────────────────────────

interface TodayChallengeState {
  currentChallenge: Challenge | null;
  lastChallengeDate: string | null;
  setCurrentChallenge: (challenge: Challenge | null) => void;
}

export const useTodayChallengeStore = create<TodayChallengeState>()(
  persist(
    (set) => ({
      currentChallenge: null,
      lastChallengeDate: null,
      setCurrentChallenge: (challenge) =>
        set({
          currentChallenge: challenge,
          lastChallengeDate: challenge ? new Date().toDateString() : null,
        }),
    }),
    {
      name: 'ascuas-today-challenge',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

// Convenience selectors
export const useCurrentChallenge = () =>
  useTodayChallengeStore((s) => s.currentChallenge);

/** Hook that returns a function to pick a new challenge respecting preferences. */
export const useSetCurrentChallenge = () => {
  const set = useTodayChallengeStore((s) => s.setCurrentChallenge);
  const userProgress = useUserProgress();

  return () => {
    const excludedChallenges = userProgress.excludedChallenges || [];
    const preferredCategories = userProgress.preferredCategories || [];
    const createdChallenges = (userProgress.createdChallenges || []).map<Challenge>((c) => ({
      id: c.id,
      title: c.title,
      description: c.description,
      discomfortRating: c.discomfortRating,
      category: c.category,
      xpReward: c.xpReward,
    }));

    const allChallenges = [...CHALLENGES, ...createdChallenges];

    let available = allChallenges.filter(
      (c) => !excludedChallenges.includes(c.id),
    );

    if (preferredCategories.length > 0) {
      available = available.filter((c) =>
        preferredCategories.includes(c.category),
      );
    }

    const tier = getUserTier(userProgress.level);
    const tierFiltered = available.filter(
      (c) => c.discomfortRating <= tier.maxDiscomfort,
    );
    if (tierFiltered.length > 0) available = tierFiltered;
    if (available.length === 0) available = allChallenges;

    const idx = Math.floor(Math.random() * available.length);
    set(available[idx]);
  };
};

// ─── User Progress Store ─────────────────────────────────────

interface UserProgressStore extends UserProgress {
  setUserProgress: (progress: Partial<UserProgress>) => void;
  completeChallenge: (log: CompletionLog, discomfortRating: number) => void;
  attemptChallenge: (challengeId: string, partialXp: number) => void;
  logMood: (mood: Mood) => void;
}

const DEFAULT_PROGRESS: UserProgress = {
  level: 1,
  totalXp: 0,
  completedChallenges: [],
  completedPractices: [],
  peopleMet: [],
  logs: [],
  practiceLogs: [],
  excludedChallenges: [],
  excludedPractices: [],
  preferredCategories: [],
  currentStreak: 0,
  longestStreak: 0,
  achievements: [],
  moodLogs: [],
};

export const useUserProgressStore = create<UserProgressStore>()(
  persist(
    (set) => ({
      ...DEFAULT_PROGRESS,

      setUserProgress: (progress) =>
        set((state) => ({ ...state, ...progress })),

      completeChallenge: (log, discomfortRating) =>
        set((state) => {
          const newLogs = [...state.logs, log];
          const newTotalXp = state.totalXp + log.xpEarned;
          const newLevel = getLevelFromTotalXp(newTotalXp);
          const { current, longest } = calculateStreak(newLogs);

          const draft: UserProgress = {
            ...state,
            logs: newLogs,
            totalXp: newTotalXp,
            level: newLevel,
            completedChallenges: [
              ...state.completedChallenges,
              log.challengeId,
            ],
            currentStreak: current,
            longestStreak: Math.max(longest, state.longestStreak ?? 0),
          };

          const newAchievements = checkNewAchievements(draft, {
            lastCompletedDiscomfort: discomfortRating,
          });
          if (newAchievements.length > 0) {
            draft.achievements = [
              ...(draft.achievements ?? []),
              ...newAchievements,
            ];
            achievementCallback?.(newAchievements);
          }

          return draft;
        }),

      attemptChallenge: (challengeId, partialXp) =>
        set((state) => {
          const log: CompletionLog = {
            challengeId,
            date: new Date().toISOString(),
            beforeFeeling: 0,
            afterFeeling: 0,
            completed: false,
            attempted: true,
            xpEarned: partialXp,
          };
          const newLogs = [...state.logs, log];
          const newTotalXp = state.totalXp + partialXp;
          const newLevel = getLevelFromTotalXp(newTotalXp);

          const draft: UserProgress = {
            ...state,
            logs: newLogs,
            totalXp: newTotalXp,
            level: newLevel,
          };

          const newAchievements = checkNewAchievements(draft);
          if (newAchievements.length > 0) {
            draft.achievements = [
              ...(draft.achievements ?? []),
              ...newAchievements,
            ];
            achievementCallback?.(newAchievements);
          }

          return draft;
        }),

      logMood: (mood) =>
        set((state) => ({
          ...state,
          moodLogs: [
            ...(state.moodLogs ?? []),
            { date: new Date().toISOString(), mood },
          ],
        })),
    }),
    {
      name: 'ascuas-user-progress',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

// Convenience selectors
export const useUserProgress = () => useUserProgressStore((s) => s);
export const useUserPracticeLogs = () =>
  useUserProgressStore((s) => s.practiceLogs);
export const useSetUserProgressStore = () =>
  useUserProgressStore((s) => s.setUserProgress);
