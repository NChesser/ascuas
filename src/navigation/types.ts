import type { Challenge } from '../types/types';

/**
 * Root-level param lists for each navigator.
 * Declaring them here keeps navigation fully type-safe.
 */

// ── Bottom Tabs ──────────────────────────────────────────────
export type BottomTabParamList = {
  HomeTab: undefined;
  PracticeTab: undefined;
  PeopleTab: undefined;
  JourneyTab: undefined;
  SettingsTab: undefined;
};

// ── Root Stack (wraps tabs + modal/detail screens) ───────────
export type RootStackParamList = {
  Tabs: undefined;
  Challenge: { challenge: Challenge };
  Reflect: { challenge: Challenge };
  PracticeDetail: { practiceId: string };
  PersonDetail: { personId: string };
};

// Augment React Navigation so useNavigation() is typed globally
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
