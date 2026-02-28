import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Animated, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Heart } from 'lucide-react-native';

import type { RootStackParamList } from '../navigation/types';
import { Colors } from '../theme/colors';
import {
    useCurrentChallenge,
    useTodayChallengeStore,
    useSetCurrentChallenge,
} from '../store/store';

import Card from './Card';
import Button from './Button';
import Typography from './Typography';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const CurrentChallenge: React.FC = () => {
    const navigation = useNavigation < Nav > ();
    const currentChallenge = useCurrentChallenge();
    const setCurrentChallenge = useSetCurrentChallenge();
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handleViewChallenge = () => {
        navigation.navigate('Challenge', { challenge: currentChallenge! });
    };

    const handleTryAnother = () => {
        Animated.sequence([
            Animated.timing(scaleAnim, {
                toValue: 0.96,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                useNativeDriver: true,
                bounciness: 6,
            })
        ]).start(() => {
            setCurrentChallenge();
        });
    }

    useEffect(() => {
        const store = useTodayChallengeStore.getState();
        const isNewDay = store.lastChallengeDate !== new Date().toDateString();
        if (!currentChallenge || isNewDay) {
            setCurrentChallenge();
        }
    }, []);

    if (!currentChallenge) return null;

    return (
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <Card variant="elevated">
                <Typography variant="title" style={{ marginTop: 8 }}>
                    {currentChallenge.title}
                </Typography>
                <View style={{ borderBottomWidth: 2, borderBottomColor: Colors.amber200, marginVertical: 8 }} />
                <Typography variant="body" style={{ marginTop: 4 }}>
                    {currentChallenge.description}
                </Typography>

                <View style={{ marginTop: 20 }}>
                    <Button
                        variant="primary"
                        size="lg"
                        onPress={handleViewChallenge}
                    >
                        <Text style={styles.btnText}>View Challenge</Text>
                    </Button>
                    <Button
                        variant="secondary"
                        size="lg"
                        onPress={handleTryAnother}
                        style={{ marginTop: 12 }}
                    >
                        <Text style={styles.secondaryBtnText}>Try Another</Text>
                    </Button>
                </View>
                <View style={{ borderBottomWidth: 2, borderBottomColor: Colors.amber200, marginVertical: 16 }} />

                <View style={styles.challengeHeader}>
                    <Typography variant="overline">
                        {currentChallenge.category?.replace('-', ' ') ?? 'General'}
                    </Typography>
                    <View style={styles.heartsRow}>
                        {[...Array(5)].map((_, i) => (
                            <Heart
                                key={i}
                                size={14}
                                color={
                                    i < currentChallenge.discomfortRating
                                        ? Colors.amber400
                                        : Colors.amber200
                                }
                                fill={
                                    i < currentChallenge.discomfortRating
                                        ? Colors.amber400
                                        : 'transparent'
                                }
                            />
                        ))}
                    </View>
                </View>
            </Card>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    challengeHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    heartsRow: {
        flexDirection: 'row',
        gap: 2,
    },
    btnText: {
        color: Colors.white,
        fontWeight: '600',
        fontSize: 15,
    },
    secondaryBtnText: {
        color: Colors.amber700,
        fontWeight: '600',
        fontSize: 15,
    },
});

export default CurrentChallenge;
