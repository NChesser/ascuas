import React, { useMemo, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';

import type { Mood } from '../types/types';
import { Colors, Spacing, Radius } from '../theme/colors';
import {
    useUserProgress,
    useUserProgressStore,
} from '../store/store';
import { getUserTier } from '../data/tiers';
import { getXpProgress, getXpForLevel } from '../utils/helpers';

import DailyQuote from '../components/DailyQuote';
import MoodCheckIn from '../components/MoodCheckIn';
import CurrentChallenge from '../components/CurrentChallenge';
import Typography from '../components/Typography';

const HomeScreen: React.FC = () => {
    const userProgress = useUserProgress();
    const logMood = useUserProgressStore((s) => s.logMood);

    // Mood
    const todaysMood = useMemo(() => {
        const today = new Date().toDateString();
        const todayLog = (userProgress.moodLogs ?? [])
            .slice()
            .reverse()
            .find((entry) => new Date(entry.date).toDateString() === today);
        return todayLog?.mood ?? null;
    }, [userProgress.moodLogs]);

    const [selectedMood, setSelectedMood] = useState < Mood | null > (todaysMood);

    const handleMoodSelected = (mood: Mood) => {
        setSelectedMood(mood);
        logMood(mood);
    };

    // XP / tier
    const tier = getUserTier(userProgress.level);
    const xpProgress = getXpProgress(userProgress.totalXp);
    const xpNeeded = getXpForLevel(userProgress.level);
    const progressPercent = (xpProgress / xpNeeded) * 100;


    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
        >
            <DailyQuote />

            {/* Current Challenge  */}
            <CurrentChallenge />

            {/* Mood */}
            <MoodCheckIn
                selectedMood={selectedMood}
                onMoodSelected={handleMoodSelected}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.amber50,
    },
    content: {
        padding: Spacing.lg,
        paddingBottom: 100,
        gap: Spacing.lg,
    },
    tierRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    tierEmoji: {
        fontSize: 32,
    },
    tierLabelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    xpBarBg: {
        height: 6,
        borderRadius: 3,
        backgroundColor: Colors.amber200,
        marginTop: 6,
        overflow: 'hidden',
    },
    xpBarFill: {
        height: '100%',
        borderRadius: 3,
        backgroundColor: Colors.amber500,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    statPill: {
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderRadius: Radius.lg,
        paddingHorizontal: Spacing.xl,
        paddingVertical: Spacing.md,
        borderWidth: 1,
        borderColor: Colors.amber200,
    },
});

export default HomeScreen;
