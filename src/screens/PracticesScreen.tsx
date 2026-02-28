import React from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Sparkles } from 'lucide-react-native';

import type { RootStackParamList } from '../navigation/types';
import type { PracticeLog } from '../types/types';
import { PRACTICES } from '../data/practices';
import {
  useUserProgress,
  useSetUserProgressStore,
} from '../store/store';
import { Colors, Spacing, Radius } from '../theme/colors';
import Typography from '../components/Typography';
import PracticeCard from '../components/PracticeCard';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const CATEGORY_ORDER = [
  'social',
  'connection',
  'growth',
  'mindset',
  'wellbeing',
] as const;

const CATEGORY_LABELS: Record<(typeof CATEGORY_ORDER)[number], string> = {
  social: 'Social',
  connection: 'Connection',
  growth: 'Growth',
  mindset: 'Mindset',
  wellbeing: 'Wellbeing',
};

const PracticesScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const userProgress = useUserProgress();
  const setUserProgress = useSetUserProgressStore();
  const excludedPractices = userProgress.excludedPractices || [];
  const practices = PRACTICES.filter(
    (p) => !excludedPractices.includes(p.id),
  );

  const practicesByCategory = CATEGORY_ORDER.map((category) => ({
    category,
    label: CATEGORY_LABELS[category],
    items: practices.filter((p) => p.category === category),
  })).filter((g) => g.items.length > 0);

  const today = new Date().toDateString();

  const isPracticeCompletedToday = (practiceId: string): boolean =>
    userProgress.practiceLogs.some((log) => {
      const logDate = new Date(log.date).toDateString();
      return log.practiceId === practiceId && logDate === today;
    });

  const completedTodayCount = practices.filter((p) =>
    isPracticeCompletedToday(p.id),
  ).length;

  const getDaysWithCompleted = () => {
    const uniqueDays = new Set<string>();
    userProgress.practiceLogs.forEach((log) => {
      uniqueDays.add(new Date(log.date).toDateString());
    });
    return uniqueDays.size;
  };
  const daysTracked = getDaysWithCompleted();

  const handlePracticeComplete = (practiceId: string) => {
    const isCompleted = isPracticeCompletedToday(practiceId);
    if (!isCompleted) {
      const newLog: PracticeLog = {
        practiceId,
        date: new Date().toISOString(),
        note: '',
      };
      setUserProgress({
        practiceLogs: [...userProgress.practiceLogs, newLog],
      });
    } else {
      setUserProgress({
        practiceLogs: userProgress.practiceLogs.filter((log) => {
          const logDate = new Date(log.date).toDateString();
          return !(log.practiceId === practiceId && logDate === today);
        }),
      });
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Typography variant="caption" tone="muted">
        Daily tracker \u2022 {completedTodayCount}/{practices.length} today \u2022{' '}
        {daysTracked} days tracked
      </Typography>

      {/* Empty state */}
      {daysTracked === 0 && completedTodayCount === 0 && (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Sparkles size={28} color={Colors.amber500} />
          </View>
          <Text style={styles.emptyTitle}>
            Start building your daily practices!
          </Text>
          <Text style={styles.emptyDesc}>
            Tap the checkmark on any practice below to track it for today.
            Small steps lead to big changes. {'\u{1F49B}'}
          </Text>
        </View>
      )}

      {/* Practices by category */}
      {practicesByCategory.map((group) => (
        <View key={group.category} style={{ marginTop: 20 }}>
          <Typography variant="label" style={{ marginBottom: 10 }}>
            {group.label}
          </Typography>
          <View style={styles.grid}>
            {group.items.map((practice) => (
              <PracticeCard
                key={practice.id}
                practice={practice}
                isCompleted={isPracticeCompletedToday(practice.id)}
                onComplete={() => handlePracticeComplete(practice.id)}
                onPress={() =>
                  navigation.navigate('PracticeDetail', {
                    practiceId: practice.id,
                  })
                }
              />
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.amber50 },
  content: { padding: Spacing.lg, paddingBottom: 100 },
  emptyState: {
    borderRadius: Radius['2xl'],
    padding: 24,
    marginTop: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: Colors.amber200,
    backgroundColor: Colors.amber50,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.amber100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emptyTitle: {
    fontWeight: '600',
    fontSize: 15,
    color: Colors.amber900,
    marginBottom: 8,
  },
  emptyDesc: {
    fontSize: 13,
    color: Colors.amber700,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
});

export default PracticesScreen;
