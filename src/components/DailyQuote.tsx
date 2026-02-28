import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DAILY_QUOTES } from '../data/quotes';
import Card from './Card';
import { Colors } from '../theme/colors';

const DailyQuote: React.FC = () => {
  const dayIndex = new Date().getDate() % DAILY_QUOTES.length;
  const dailyQuote = DAILY_QUOTES[dayIndex];

  return (
    <Card variant="elevated">
      <View style={styles.row}>
        <View style={styles.emojiContainer}>
          <Text style={styles.emoji}>{'\u{1F428}'}</Text>
        </View>
        <Text style={styles.quote}>{dailyQuote}</Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  emojiContainer: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 32,
  },
  quote: {
    flex: 1,
    fontStyle: 'italic',
    fontSize: 15,
    lineHeight: 22,
    color: Colors.amber900,
  },
});

export default DailyQuote;
