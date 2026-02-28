import React from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import {
  ChevronRight,
  Info,
  ListChecks,
  Tag,
  Plus,
  Sparkles,
} from 'lucide-react-native';

import { useUserProgress } from '../store/store';
import { Colors, Spacing, Radius, FontSize } from '../theme/colors';
import Typography from '../components/Typography';

// ─── Setting row helper ───────────────────────────────────────
type RowProps = {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onPress: () => void;
  isLast?: boolean;
};

const SettingRow: React.FC<RowProps> = ({
  icon,
  title,
  subtitle,
  onPress,
  isLast,
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={[s.row, !isLast && s.rowBorder]}
    activeOpacity={0.6}
  >
    <View style={s.iconCircle}>{icon}</View>
    <View style={{ flex: 1 }}>
      <Text style={s.rowTitle}>{title}</Text>
      <Text style={s.rowSubtitle}>{subtitle}</Text>
    </View>
    <ChevronRight size={20} color={Colors.gray400} />
  </TouchableOpacity>
);

// ─── Main Screen ──────────────────────────────────────────────
const SettingsScreen: React.FC = () => {
  const userProgress = useUserProgress();
  const excludedChallenges = userProgress.excludedChallenges || [];
  const excludedPractices = userProgress.excludedPractices || [];
  const preferredCategories = userProgress.preferredCategories || [];

  const comingSoon = () =>
    Alert.alert('Coming Soon', 'This feature will be available in a future update.');

  return (
    <ScrollView
      style={s.container}
      contentContainerStyle={s.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Settings list */}
      <View style={s.card}>
        <SettingRow
          icon={<ListChecks size={20} color={Colors.amber600} />}
          title="Manage Challenges"
          subtitle={
            excludedChallenges.length > 0
              ? `${excludedChallenges.length} excluded`
              : 'All challenges active'
          }
          onPress={comingSoon}
        />
        <SettingRow
          icon={<Tag size={20} color={Colors.amber600} />}
          title="Category Preferences"
          subtitle={
            preferredCategories.length > 0
              ? `${preferredCategories.length} selected`
              : 'All categories'
          }
          onPress={comingSoon}
        />
        <SettingRow
          icon={<Sparkles size={20} color={Colors.amber600} />}
          title="Manage Practices"
          subtitle={
            excludedPractices.length > 0
              ? `${excludedPractices.length} hidden`
              : 'All practices visible'
          }
          onPress={comingSoon}
        />
        <SettingRow
          icon={<Plus size={20} color={Colors.amber600} />}
          title="Create Custom Challenge"
          subtitle="Design your own challenge"
          onPress={comingSoon}
          isLast
        />
      </View>

      {/* About */}
      <View style={[s.card, { marginTop: 12 }]}>
        <SettingRow
          icon={<Info size={20} color={Colors.amber600} />}
          title="About Ascuas"
          subtitle="v1.0.0"
          onPress={() =>
            Alert.alert(
              'Ascuas',
              'A social-anxiety confidence-building companion.\n\nBuild courage one small step at a time. 🌱',
            )
          }
          isLast
        />
      </View>

      <Typography
        variant="micro"
        tone="muted"
        style={{ textAlign: 'center', marginTop: 24 }}
      >
        Made with 🧡
      </Typography>
    </ScrollView>
  );
};

// ─── Styles ───────────────────────────────────────────────────
const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.amber50 },
  content: { padding: Spacing.lg, paddingBottom: 100 },
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.amber100,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.amber100,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.amber100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowTitle: {
    fontSize: FontSize.bodySm,
    fontWeight: '500',
    color: Colors.gray900,
  },
  rowSubtitle: {
    fontSize: FontSize.caption,
    color: Colors.gray500,
    marginTop: 1,
  },
});

export default SettingsScreen;
