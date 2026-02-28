import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CheckCircle } from 'lucide-react-native';
import type { Practice } from '../types/types';
import { Colors, Radius, Spacing } from '../theme/colors';

interface PracticeCardProps {
  practice: Practice;
  isCompleted: boolean;
  onComplete: () => void;
  onPress: () => void;
}

const PracticeCard: React.FC<PracticeCardProps> = ({
  practice,
  isCompleted,
  onComplete,
  onPress,
}) => {
  const Icon = practice.icon;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.card, isCompleted && styles.cardCompleted]}
    >
      <View style={styles.iconRow}>
        <Icon
          size={22}
          color={isCompleted ? Colors.green600 : Colors.amber600}
        />
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation?.();
            onComplete();
          }}
          hitSlop={8}
        >
          <CheckCircle
            size={20}
            color={isCompleted ? Colors.green500 : Colors.gray300}
          />
        </TouchableOpacity>
      </View>
      <Text
        style={[styles.title, isCompleted && styles.titleCompleted]}
        numberOfLines={2}
      >
        {practice.title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.amber200,
    width: '31%',
    minHeight: 90,
    justifyContent: 'space-between',
  },
  cardCompleted: {
    backgroundColor: Colors.green50,
    borderColor: Colors.green300,
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.amber900,
  },
  titleCompleted: {
    color: Colors.green800,
  },
});

export default PracticeCard;
