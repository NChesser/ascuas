import React, { useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import { PartyPopper, Sparkles } from 'lucide-react-native';

import type { RootStackParamList } from '../navigation/types';
import type { CompletionLog } from '../types/types';
import { Colors, Spacing, Radius } from '../theme/colors';
import { useUserProgressStore } from '../store/store';
import { CHALLENGES } from '../data/challenges';
import Card from '../components/Card';
import Button from '../components/Button';
import Typography from '../components/Typography';

type Route = RouteProp<RootStackParamList, 'Reflect'>;

const ReflectScreen: React.FC = () => {
  const navigation = useNavigation();
  const { params } = useRoute<Route>();
  const challenge = params.challenge;
  const completeChallenge = useUserProgressStore((s) => s.completeChallenge);

  const [beforeFeeling, setBeforeFeeling] = useState(3);
  const [afterFeeling, setAfterFeeling] = useState(3);
  const [note, setNote] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleReflect = () => {
    const reflectionBonus = note.length > 0 ? 25 : 0;
    const xpEarned = Math.floor(challenge.xpReward) + reflectionBonus;

    const log: CompletionLog = {
      challengeId: challenge.id,
      date: new Date().toISOString(),
      beforeFeeling,
      afterFeeling,
      note,
      completed: true,
      attempted: true,
      xpEarned,
    };

    const found = CHALLENGES.find((c) => c.id === challenge.id);
    const discomfortRating = found?.discomfortRating ?? challenge.discomfortRating;

    setShowSuccess(true);
    completeChallenge(log, discomfortRating);

    setTimeout(() => {
      navigation.goBack();
    }, 2000);
  };

  const handleSkip = () => {
    const xpEarned = Math.floor(challenge.xpReward);
    const log: CompletionLog = {
      challengeId: challenge.id,
      date: new Date().toISOString(),
      beforeFeeling: 3,
      afterFeeling: 3,
      note: '',
      completed: true,
      attempted: true,
      xpEarned,
    };

    const found = CHALLENGES.find((c) => c.id === challenge.id);
    const discomfortRating = found?.discomfortRating ?? challenge.discomfortRating;

    setShowSuccess(true);
    completeChallenge(log, discomfortRating);

    setTimeout(() => {
      navigation.goBack();
    }, 2000);
  };

  const FeelingSelector = ({
    label,
    value,
    onChange,
  }: {
    label: string;
    value: number;
    onChange: (v: number) => void;
  }) => (
    <View style={{ marginBottom: 16 }}>
      <Typography variant="label" style={{ marginBottom: 10 }}>
        {label}
      </Typography>
      <View style={styles.feelingRow}>
        {[1, 2, 3, 4, 5].map((val) => (
          <TouchableOpacity
            key={val}
            onPress={() => onChange(val)}
            style={[
              styles.feelingBtn,
              value === val && styles.feelingBtnSelected,
            ]}
          >
            <Text
              style={[
                styles.feelingText,
                value === val && styles.feelingTextSelected,
              ]}
            >
              {val}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Card variant="elevated">
        {/* Mascot header */}
        <View style={styles.mascotRow}>
          <Text style={{ fontSize: 32 }}>{'\u{1F428}'}</Text>
          <Typography style={{ flex: 1 }} tone="primary-soft">
            That was brave! How did it feel?
          </Typography>
        </View>

        <FeelingSelector
          label="Before you tried (1 = calm, 5 = very nervous)"
          value={beforeFeeling}
          onChange={setBeforeFeeling}
        />

        <FeelingSelector
          label="After (1 = calm, 5 = very nervous)"
          value={afterFeeling}
          onChange={setAfterFeeling}
        />

        {/* Note */}
        <Typography variant="label" style={{ marginBottom: 8 }}>
          Any thoughts? (optional)
        </Typography>
        <TextInput
          value={note}
          onChangeText={setNote}
          placeholder="How it went, what you noticed..."
          placeholderTextColor={Colors.amber400}
          multiline
          numberOfLines={4}
          style={styles.textInput}
          textAlignVertical="top"
        />
        {note.length > 0 && (
          <Typography variant="caption" tone="accent" style={{ marginTop: 4 }}>
            +25 XP bonus for reflecting
          </Typography>
        )}

        {/* Buttons */}
        <View style={{ marginTop: 20 }}>
          <Button
            variant="primary"
            size="lg"
            onPress={handleReflect}
            disabled={showSuccess}
          >
            {showSuccess ? (
              <View style={styles.successBtn}>
                <PartyPopper size={16} color={Colors.white} />
                <Text style={styles.btnText}>Amazing Work!</Text>
              </View>
            ) : (
              <Text style={styles.btnText}>Save & Continue</Text>
            )}
          </Button>

          {!showSuccess && (
            <Button
              variant="ghost"
              size="lg"
              onPress={handleSkip}
              style={{ marginTop: 8 }}
            >
              <Text style={{ color: Colors.amber600, fontWeight: '500' }}>
                Skip reflection
              </Text>
            </Button>
          )}
        </View>

        {/* Success banner */}
        {showSuccess && (
          <View style={styles.successBanner}>
            <View style={styles.successRow}>
              <Text style={styles.successText}>
                +{Math.floor(challenge.xpReward) + (note.length > 0 ? 25 : 0)}{' '}
                XP earned!
              </Text>
              <Sparkles size={14} color={Colors.yellow500} />
            </View>
          </View>
        )}
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.amber50 },
  content: { padding: Spacing.lg },
  mascotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  feelingRow: {
    flexDirection: 'row',
    gap: 8,
  },
  feelingBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: Radius.sm,
    borderWidth: 2,
    borderColor: Colors.amber200,
    alignItems: 'center',
  },
  feelingBtnSelected: {
    borderColor: Colors.amber400,
    backgroundColor: Colors.amber50,
  },
  feelingText: {
    fontSize: 15,
    color: Colors.amber600,
  },
  feelingTextSelected: {
    fontWeight: '600',
    color: Colors.amber900,
  },
  textInput: {
    borderWidth: 2,
    borderColor: Colors.amber200,
    borderRadius: Radius.sm,
    padding: 12,
    fontSize: 14,
    color: Colors.amber900,
    backgroundColor: Colors.white,
    minHeight: 100,
  },
  btnText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 15,
  },
  successBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  successBanner: {
    marginTop: 16,
    borderRadius: Radius.lg,
    padding: 16,
    borderWidth: 2,
    borderColor: Colors.green300,
    backgroundColor: Colors.green50,
  },
  successRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  successText: {
    fontWeight: '600',
    color: Colors.green800,
    textAlign: 'center',
  },
});

export default ReflectScreen;
