import React, { useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { RectButton } from 'react-native-gesture-handler';
import { Star, Trash2, ChevronRight } from 'lucide-react-native';

import type { PersonMet } from '../types/types';
import { Colors, Radius, Spacing } from '../theme/colors';
import Card from './Card';
import Typography from './Typography';

interface PersonListItemProps {
    person: PersonMet;
    onPress: () => void;
    onToggleFavorite: () => void;
    onRemove: () => void;
}

const ACTION_WIDTH = 140; // total width of both action buttons

const PersonListItem: React.FC<PersonListItemProps> = ({
    person,
    onToggleFavorite,
    onPress,
    onRemove,
}) => {
    const swipeableRef = useRef < Swipeable > (null);

    const renderRightActions = (
        progress: Animated.AnimatedInterpolation<number>,
        _dragX: Animated.AnimatedInterpolation<number>,
    ) => {
        const scale = progress.interpolate({
            inputRange: [0, 1],
            outputRange: [0.6, 1],
            extrapolate: 'clamp',
        });
        const opacity = progress.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
            extrapolate: 'clamp',
        });

        return (
            <Animated.View style={[styles.actionsContainer, { opacity, transform: [{ scale }] }]}>
                <TouchableOpacity
                    style={[styles.actionBtn, styles.favoriteBtn]}
                    onPress={() => {
                        onToggleFavorite();
                        swipeableRef.current?.close();
                    }}
                    activeOpacity={0.8}
                >
                    <Star
                        size={20}
                        color={person.isFavorite ? Colors.amber400 : Colors.white}
                        fill={person.isFavorite ? Colors.amber400 : 'transparent'}
                    />
                    <Text style={styles.actionLabel}>
                        {person.isFavorite ? 'Unfave' : 'Fave'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionBtn, styles.deleteBtn]}
                    onPress={() => {
                        swipeableRef.current?.close();
                        onRemove();
                    }}
                    activeOpacity={0.8}
                >
                    <Trash2 size={20} color={Colors.white} />
                    <Text style={styles.actionLabel}>Delete</Text>
                </TouchableOpacity>
            </Animated.View>
        );
    };

    return (
        <Swipeable
            ref={swipeableRef}
            renderRightActions={renderRightActions}
            rightThreshold={40}
            overshootRight={false}
        >
            <RectButton onPress={onPress} underlayColor={Colors.amber50}>
                <Card variant="base" style={styles.card}>
                    <View style={styles.row}>
                        <View style={{ flex: 1 }}>
                            <View style={styles.nameRow}>
                                <Typography variant="subtitle">{person.name}</Typography>
                                {person.isFavorite && (
                                    <Star size={14} color={Colors.amber400} fill={Colors.amber400} />
                                )}
                            </View>
                            {person.whereMet && (
                                <Typography variant="caption" tone="muted">
                                    Met at {person.whereMet}
                                </Typography>
                            )}
                        </View>
                        <ChevronRight size={16} color={Colors.gray300} />
                    </View>
                </Card>
            </RectButton>
        </Swipeable>
    );
};

const styles = StyleSheet.create({
    card: {
        padding: 14,
        borderTopWidth: 2,
        borderWidth: 0,
        borderColor: Colors.amber100,
        borderRadius: 0,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    tagRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
        marginTop: 6,
    },
    tag: {
        backgroundColor: Colors.amber100,
        borderRadius: Radius.full,
        paddingHorizontal: 8,
        paddingVertical: 2,
    },
    tagText: {
        fontSize: 10,
        color: Colors.amber700,
    },
    // ── Swipe actions ─────────────────────────
    actionsContainer: {
        flexDirection: 'row',
        width: ACTION_WIDTH,
    },
    actionBtn: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        borderRadius: 0,
    },
    favoriteBtn: {
        backgroundColor: Colors.amber500,
        borderTopLeftRadius: Radius.md,
        borderBottomLeftRadius: Radius.md,
    },
    deleteBtn: {
        backgroundColor: Colors.red500,
        borderTopRightRadius: Radius.md,
        borderBottomRightRadius: Radius.md,
    },
    actionLabel: {
        color: Colors.white,
        fontSize: 11,
        fontWeight: '600',
        borderRadius: 0
    },
});

export default PersonListItem; 