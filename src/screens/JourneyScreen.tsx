import React, { useMemo, useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Flame, BookOpen, TrendingUp, Trophy } from 'lucide-react-native';

import { useUserProgress } from '../store/store';
import { ACHIEVEMENTS } from '../data/achievements';
import { Colors, Spacing, Radius, FontSize } from '../theme/colors';
import Card from '../components/Card';
import Typography from '../components/Typography';
import { getXpProgress, getLevelFromTotalXp, getXpForLevel } from '../utils/helpers';

// ─── Tab type ─────────────────────────────────────────────────
type JourneyTab = 'journal' | 'insights' | 'badges';

const TABS: { id: JourneyTab; label: string }[] = [
  { id: 'journal', label: 'Journal' },
  { id: 'insights', label: 'Insights' },
  { id: 'badges', label: 'Badges' },
];

// ─── Mood helpers ─────────────────────────────────────────────
const MOOD_EMOJI: Record<string, string> = {
  overwhelmed: '😰',
  nervous: '😟',
  okay: '😊',
  good: '😄',
  brave: '🦁',
};

// ─── Sub-components ───────────────────────────────────────────

const MoodTrends: React.FC = () => {
  const userProgress = useUserProgress();
  const moodLogs = userProgress.moodLogs ?? [];
  const recent = moodLogs.slice(-7);

  if (recent.length === 0) {
    return (
      <Typography
        variant="body-sm"
        tone="muted"
        style={{ textAlign: 'center', paddingVertical: 16 }}
      >
        Use the mood check-in on the home screen to start tracking trends.
      </Typography>
    );
  }

  return (
    <Card variant="elevated" style={{ marginBottom: 12 }}>
      <Typography variant="label" style={{ marginBottom: 10 }}>
        Recent Moods
      </Typography>
      <View style={s.moodRow}>
        {recent.map((entry, i) => (
          <View key={i} style={s.moodItem}>
            <Text style={{ fontSize: 22 }}>{MOOD_EMOJI[entry.mood] ?? '😊'}</Text>
            <Text style={s.moodDay}>
              {new Date(entry.date).toLocaleDateString(undefined, {
                weekday: 'short',
              })}
            </Text>
          </View>
        ))}
      </View>
    </Card>
  );
};

const WeeklyChart: React.FC = () => {
  const userProgress = useUserProgress();

  const data = useMemo(() => {
    const days: {
      label: string;
      challenges: number;
      practices: number;
      peopleMet: number;
    }[] = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const ds = d.toDateString();
      const isoDate = d.toISOString().split('T')[0];

      const challenges = userProgress.logs.filter(
        (l) => l.completed && new Date(l.date).toDateString() === ds,
      ).length;

      const practices = userProgress.practiceLogs.filter(
        (l) => l.date === isoDate || new Date(l.date).toDateString() === ds,
      ).length;

      const peopleMet = (userProgress.peopleMet ?? []).filter((p) => {
        try {
          return new Date(p.meetDate).toDateString() === ds;
        } catch {
          return false;
        }
      }).length;

      days.push({
        label: d.toLocaleDateString(undefined, { weekday: 'short' }),
        challenges,
        practices,
        peopleMet,
      });
    }
    return days;
  }, [userProgress.logs, userProgress.practiceLogs, userProgress.peopleMet]);

  const max = Math.max(
    1,
    ...data.map((d) => d.challenges + d.practices + d.peopleMet),
  );

  const BAR_HEIGHT = 100;

  const categories = [
    { key: 'challenges' as const, label: 'Challenges', color: Colors.amber400 },
    { key: 'practices' as const, label: 'Practices', color: '#60a5fa' },
    { key: 'peopleMet' as const, label: 'People Met', color: '#4ade80' },
  ];

  return (
    <Card variant="elevated" style={{ marginBottom: 12 }}>
      <Typography variant="label" style={{ marginBottom: 10 }}>
        This Week
      </Typography>

      <View style={s.chartRow}>
        {data.map((day, i) => {
          const total = day.challenges + day.practices + day.peopleMet;
          const h = total > 0 ? (total / max) * BAR_HEIGHT : 4;
          return (
            <View key={i} style={s.barCol}>
              <View style={[s.barWrapper, { height: h }]}>
                {total > 0 ? (
                  categories.map(({ key, color }) =>
                    day[key] > 0 ? (
                      <View
                        key={key}
                        style={{ flex: day[key], backgroundColor: color }}
                      />
                    ) : null,
                  )
                ) : (
                  <View
                    style={{ flex: 1, backgroundColor: Colors.gray100 }}
                  />
                )}
              </View>
              <Text style={s.barLabel}>{day.label}</Text>
            </View>
          );
        })}
      </View>

      {/* Legend */}
      <View style={s.legendRow}>
        {categories.map(({ key, label, color }) => (
          <View key={key} style={s.legendItem}>
            <View style={[s.legendDot, { backgroundColor: color }]} />
            <Text style={s.legendText}>{label}</Text>
          </View>
        ))}
      </View>
    </Card>
  );
};

const InsightsTab: React.FC = () => {
  const userProgress = useUserProgress();

  const feelingData = useMemo(() => {
    const completed = userProgress.logs.filter(
      (l) => l.completed && l.beforeFeeling && l.afterFeeling,
    );
    if (completed.length === 0) return null;
    const avgBefore =
      completed.reduce((s, l) => s + l.beforeFeeling, 0) / completed.length;
    const avgAfter =
      completed.reduce((s, l) => s + l.afterFeeling, 0) / completed.length;
    return {
      avgBefore: avgBefore.toFixed(1),
      avgAfter: avgAfter.toFixed(1),
      count: completed.length,
    };
  }, [userProgress.logs]);

  return (
    <View>
      {/* Streak */}
      <Card variant="elevated" style={{ marginBottom: 12 }}>
        <View style={s.streakRow}>
          <View>
            <Typography variant="micro" tone="accent">
              Current Streak
            </Typography>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Flame size={20} color="#f97316" />
              <Typography variant="headline">
                {userProgress.currentStreak ?? 0} days
              </Typography>
            </View>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Typography variant="micro" tone="accent">
              Longest
            </Typography>
            <Typography variant="subtitle">
              {userProgress.longestStreak ?? 0} days
            </Typography>
          </View>
        </View>
      </Card>

      <WeeklyChart />
      <MoodTrends />

      {/* Feeling improvement */}
      {feelingData && (
        <Card variant="elevated">
          <Typography variant="label" style={{ marginBottom: 6 }}>
            Anxiety Trend
          </Typography>
          <Typography variant="body-sm">
            Across {feelingData.count} challenges, your average anxiety went
            from{' '}
            <Text style={{ fontWeight: '600' }}>{feelingData.avgBefore}</Text> →{' '}
            <Text style={{ fontWeight: '600' }}>{feelingData.avgAfter}</Text>
            {Number(feelingData.avgAfter) < Number(feelingData.avgBefore)
              ? ' 📉 Great progress!'
              : ''}
          </Typography>
        </Card>
      )}
    </View>
  );
};

// ─── Journal tab sub-components (inlined) ─────────────────────

const XPDisplay: React.FC = () => {
  const userProgress = useUserProgress();
  const current = getXpProgress(userProgress.totalXp);
  const required = getXpForLevel(userProgress.level);
  const pct = Math.min((current / required) * 100, 100);

  return (
    <Card variant="elevated" style={{ marginBottom: 12 }}>
      <View style={s.xpRow}>
        <Typography variant="label">
          Level {userProgress.level}
        </Typography>
        <Typography variant="micro" tone="muted">
          {current} / {required} XP
        </Typography>
      </View>
      <View style={s.progressTrack}>
        <View style={[s.progressFill, { width: `${pct}%` }]} />
      </View>
      <Typography variant="micro" tone="muted" style={{ marginTop: 4 }}>
        Total: {userProgress.totalXp} XP
      </Typography>
    </Card>
  );
};

const CompletedChallengesList: React.FC = () => {
  const userProgress = useUserProgress();
  const completedLogs = userProgress.logs.filter((l) => l.completed);

  if (completedLogs.length === 0) {
    return (
      <Typography
        variant="body-sm"
        tone="muted"
        style={{ textAlign: 'center', paddingVertical: 20 }}
      >
        Complete your first challenge to see your history here!
      </Typography>
    );
  }

  // Show most recent first, limit 20
  const recent = [...completedLogs].reverse().slice(0, 20);

  return (
    <View>
      <Typography variant="label" style={{ marginBottom: 10 }}>
        Completed ({completedLogs.length})
      </Typography>
      {recent.map((log, i) => (
        <View key={i} style={s.logRow}>
          <View style={{ flex: 1 }}>
            <Typography variant="body-sm">{log.challengeId}</Typography>
            {log.note ? (
              <Typography variant="micro" tone="muted">
                "{log.note}"
              </Typography>
            ) : null}
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={s.xpBadge}>+{log.xpEarned} XP</Text>
            <Typography variant="micro" tone="muted">
              {new Date(log.date).toLocaleDateString()}
            </Typography>
          </View>
        </View>
      ))}
    </View>
  );
};

// ─── Badges tab ───────────────────────────────────────────────

const AchievementsGrid: React.FC = () => {
  const userProgress = useUserProgress();
  const unlocked = userProgress.achievements ?? [];

  return (
    <View style={s.badgeGrid}>
      {ACHIEVEMENTS.map((a) => {
        const earned = unlocked.includes(a.id);
        return (
          <View
            key={a.id}
            style={[s.badgeCard, !earned && s.badgeCardLocked]}
          >
            <Text style={{ fontSize: 28 }}>{a.icon}</Text>
            <Typography
              variant="micro"
              tone={earned ? 'neutral' : 'muted'}
              style={{ textAlign: 'center', marginTop: 4 }}
            >
              {a.title}
            </Typography>
            {earned && (
              <Text style={s.earnedCheck}>✓</Text>
            )}
          </View>
        );
      })}
    </View>
  );
};

// ─── Main Screen ──────────────────────────────────────────────

const JourneyScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<JourneyTab>('journal');

  return (
    <ScrollView
      style={s.container}
      contentContainerStyle={s.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Tab bar */}
      <View style={s.tabBar}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            onPress={() => setActiveTab(tab.id)}
            style={[s.tabItem, activeTab === tab.id && s.tabItemActive]}
          >
            <Text
              style={[
                s.tabLabel,
                activeTab === tab.id && s.tabLabelActive,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab content */}
      {activeTab === 'journal' && (
        <>
          <XPDisplay />
          <CompletedChallengesList />
        </>
      )}

      {activeTab === 'insights' && <InsightsTab />}

      {activeTab === 'badges' && <AchievementsGrid />}
    </ScrollView>
  );
};

// ─── Styles ───────────────────────────────────────────────────

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.amber50 },
  content: { padding: Spacing.lg, paddingBottom: 100 },

  // Tab bar
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.amber100,
    borderRadius: Radius.md,
    padding: 3,
    marginBottom: 16,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: Radius.sm,
    alignItems: 'center',
  },
  tabItemActive: {
    backgroundColor: Colors.white,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
  },
  tabLabel: {
    fontSize: FontSize.bodySm,
    fontWeight: '500',
    color: Colors.amber600,
  },
  tabLabelActive: {
    color: Colors.amber800,
    fontWeight: '600',
  },

  // Mood
  moodRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 4 },
  moodItem: { alignItems: 'center', gap: 2 },
  moodDay: { fontSize: 10, color: Colors.gray400 },

  // Chart
  chartRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
    height: 110,
  },
  barCol: { flex: 1, alignItems: 'center', gap: 4 },
  barWrapper: {
    width: '100%',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    overflow: 'hidden',
  },
  barLabel: { fontSize: 10, color: Colors.gray400 },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginTop: 10,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 10, color: Colors.gray500 },

  // Streak
  streakRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  // XP
  xpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  progressTrack: {
    height: 8,
    backgroundColor: Colors.amber100,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.amber500,
    borderRadius: 4,
  },

  // Completed list
  logRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.amber100,
  },
  xpBadge: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.amber600,
  },

  // Badges
  badgeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  badgeCard: {
    width: '30%',
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.amber200,
  },
  badgeCardLocked: {
    opacity: 0.4,
  },
  earnedCheck: {
    position: 'absolute',
    top: 4,
    right: 4,
    fontSize: 12,
    color: Colors.amber600,
  },
});

export default JourneyScreen;
