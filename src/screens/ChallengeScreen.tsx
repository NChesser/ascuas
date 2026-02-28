import React, { useState } from 'react';
import { View, ScrollView, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Heart, Lightbulb, MessageCircle, Sparkles } from 'lucide-react-native';

import type { RootStackParamList } from '../navigation/types';
import { Colors, Spacing, Radius } from '../theme/colors';
import { getUserTier } from '../data/tiers';
import { useUserProgressStore } from '../store/store';
import { capitalizeFirstLetter } from '../utils/helpers';
import Card from '../components/Card';
import Button from '../components/Button';
import Typography from '../components/Typography';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Route = RouteProp<RootStackParamList, 'Challenge'>;

const ChallengeScreen: React.FC = () => {
    const navigation = useNavigation < Nav > ();
    const { params } = useRoute < Route > ();
    const challenge = params.challenge;
    const level = useUserProgressStore((s) => s.level);
    const tier = getUserTier(level);

    const [showRemember, setShowRemember] = useState(false);

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
        >
            {/* Category + difficulty */}
            <View style={styles.headerRow}>
                <View style={styles.headerLeft}>
                    <Typography variant="overline">
                        {capitalizeFirstLetter(
                            challenge.category?.replace('-', ' ') ?? 'General',
                        )}
                    </Typography>
                    <View style={[styles.tierBadge, { backgroundColor: tier.bgColor }]}>
                        <Text style={{ fontSize: 12 }}>{tier.emoji}</Text>
                        <Text style={[styles.tierText, { color: tier.color }]}>
                            {tier.name}
                        </Text>
                    </View>
                </View>
                <View style={styles.heartsRow}>
                    {[...Array(5)].map((_, i) => (
                        <Heart
                            key={i}
                            size={14}
                            color={
                                i < challenge.discomfortRating
                                    ? Colors.amber400
                                    : Colors.amber200
                            }
                            fill={
                                i < challenge.discomfortRating
                                    ? Colors.amber400
                                    : 'transparent'
                            }
                        />
                    ))}
                </View>
            </View>

            {/* Main challenge card */}
            <Card variant="elevated">
                <Typography variant="title" style={{ marginBottom: 8 }}>
                    {challenge.title}
                </Typography>
                <View style={styles.divider} />
                <Typography>{challenge.description}</Typography>

                {/* How to approach it */}
                <TouchableOpacity
                    onPress={() => setShowRemember((p) => !p)}
                    style={styles.hintBox}
                    activeOpacity={0.7}
                >
                    <View style={styles.hintHeader}>
                        <Lightbulb size={16} color={Colors.sky600} />
                        <Typography variant="overline" tone="info">
                            How to approach it
                        </Typography>
                    </View>
                    {challenge.remember && (
                        <Typography variant="body-sm" tone="info-strong">
                            {challenge.remember}
                        </Typography>
                    )}
                    {showRemember && challenge.exampleScript && (
                        <View style={styles.scriptSection}>
                            <View style={styles.hintHeader}>
                                <MessageCircle size={16} color={Colors.sky600} />
                                <Typography variant="overline" tone="info">
                                    You Could Say
                                </Typography>
                            </View>
                            {challenge.exampleScript.map((script, idx) => (
                                <Typography
                                    key={idx}
                                    variant="body-sm"
                                    tone="info-strong"
                                    style={{ marginTop: 4 }}
                                >
                                    {script}
                                </Typography>
                            ))}
                        </View>
                    )}
                </TouchableOpacity>

                {/* I Did It button */}
                <View style={{ marginTop: 16 }}>
                    <Button
                        variant="success"
                        size="lg"
                        onPress={() =>
                            navigation.navigate('Reflect', { challenge })
                        }
                    >
                        <Sparkles size={16} color={Colors.white} />
                        <Text style={styles.successBtnText}>I Did It!</Text>
                    </Button>
                    <Typography
                        variant="caption"
                        style={{ textAlign: 'center', marginTop: 8, color: Colors.amber400 }}
                    >
                        +{challenge.xpReward ?? 0} XP on completion
                    </Typography>
                </View>
            </Card>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.amber50 },
    content: { padding: Spacing.lg, gap: Spacing.md },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    tierBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: Radius.full,
    },
    tierText: { fontSize: 12, fontWeight: '500' },
    heartsRow: { flexDirection: 'row', gap: 2 },
    divider: {
        height: 1,
        backgroundColor: Colors.amber100,
        marginVertical: 12,
    },
    hintBox: {
        marginTop: 16,
        backgroundColor: Colors.sky50,
        borderWidth: 1,
        borderColor: Colors.sky200,
        borderRadius: Radius.lg,
        padding: Spacing.lg,
    },
    hintHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    scriptSection: {
        marginTop: 12,
        borderTopWidth: 1,
        borderTopColor: Colors.sky200,
        paddingTop: 12,
    },
    successBtnText: { color: Colors.white, fontWeight: '600', fontSize: 15 },
});

export default ChallengeScreen;
