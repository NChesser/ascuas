import React, { useRef, useState } from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	Modal,
	Animated,
	Pressable,
} from 'react-native';
import type { Mood } from '../types/types';
import { Colors, Radius, Spacing } from '../theme/colors';

const MOODS: { mood: Mood; emoji: string; label: string }[] = [
	{ mood: 'overwhelmed', emoji: '\u{1F630}', label: 'Overwhelmed' },
	{ mood: 'nervous', emoji: '\u{1F61F}', label: 'Nervous' },
	{ mood: 'okay', emoji: '\u{1F60A}', label: 'Okay' },
	{ mood: 'good', emoji: '\u{1F604}', label: 'Good' },
	{ mood: 'brave', emoji: '\u{1F981}', label: 'Brave' },
];

interface MoodCheckInProps {
	selectedMood: Mood | null;
	onMoodSelected: (mood: Mood) => void;
}

const MoodCheckIn: React.FC<MoodCheckInProps> = ({
	selectedMood,
	onMoodSelected,
}) => {
	const [visible, setVisible] = useState(false);
	const slideAnim = useRef(new Animated.Value(300)).current;
	const backdropAnim = useRef(new Animated.Value(0)).current;

	const openModal = () => {
		setVisible(true);
		Animated.parallel([
			Animated.spring(slideAnim, {
				toValue: 0,
				useNativeDriver: true,
				bounciness: 5,
			}),
			Animated.timing(backdropAnim, {
				toValue: 1,
				duration: 220,
				useNativeDriver: true,
			}),
		]).start();
	};

	const closeModal = () => {
		Animated.parallel([
			Animated.timing(slideAnim, {
				toValue: 300,
				duration: 200,
				useNativeDriver: true,
			}),
			Animated.timing(backdropAnim, {
				toValue: 0,
				duration: 200,
				useNativeDriver: true,
			}),
		]).start(() => setVisible(false));
	};

	const handleSelect = (mood: Mood) => {
		onMoodSelected(mood);
		closeModal();
	};

	const current = MOODS.find((m) => m.mood === selectedMood);

	return (
		<>
			<TouchableOpacity
				style={styles.trigger}
				onPress={openModal}
				activeOpacity={0.75}
			>
				<View style={styles.triggerLeft}>
					<Text style={styles.triggerEmoji}>
						{current ? current.emoji : '😶'}
					</Text>
					<View>
						<Text style={styles.triggerLabel}>Today's mood</Text>
						<Text style={styles.triggerValue}>
							{current ? current.label : 'How are you feeling?'}
						</Text>
					</View>
				</View>
				<Text style={styles.triggerCaret}>›</Text>
			</TouchableOpacity>

			<Modal visible={visible} transparent animationType="none" onRequestClose={closeModal}>
				{/* Backdrop */}
				<Animated.View style={[styles.backdrop, { opacity: backdropAnim }]}>
					<Pressable style={StyleSheet.absoluteFill} onPress={closeModal} />
				</Animated.View>

				{/* Sheet */}
				<Animated.View
					style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}
				>
					<View style={styles.handle} />
					<Text style={styles.sheetTitle}>How are you feeling?</Text>

					<View style={styles.row}>
						{MOODS.map(({ mood, emoji, label }) => {
							const isSelected = selectedMood === mood;
							return (
								<TouchableOpacity
									key={mood}
									onPress={() => handleSelect(mood)}
									style={[styles.moodBtn, isSelected && styles.moodBtnSelected]}
									activeOpacity={0.7}
								>
									<Text style={styles.emoji}>{emoji}</Text>
									<Text style={[styles.label, isSelected && styles.labelSelected]}>
										{label}
									</Text>
								</TouchableOpacity>
							);
						})}
					</View>
				</Animated.View>
			</Modal>
		</>
	);
};

const styles = StyleSheet.create({
	// ── Trigger button ────────────────────────
	trigger: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		backgroundColor: Colors.white,
		borderRadius: Radius['2xl'],
		padding: Spacing.lg,
		borderWidth: 1,
		borderColor: Colors.amber200,
	},
	triggerLeft: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: Spacing.md,
	},
	triggerEmoji: {
		fontSize: 28,
	},
	triggerLabel: {
		fontSize: 11,
		color: Colors.gray500,
		fontWeight: '500',
	},
	triggerValue: {
		fontSize: 14,
		fontWeight: '600',
		color: Colors.amber800,
		marginTop: 1,
	},
	triggerCaret: {
		fontSize: 22,
		color: Colors.amber400,
		fontWeight: '300',
	},

	// ── Modal backdrop ────────────────────────
	backdrop: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: 'rgba(0,0,0,0.35)',
	},

	// ── Bottom sheet ──────────────────────────
	sheet: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor: Colors.white,
		borderTopLeftRadius: Radius['2xl'],
		borderTopRightRadius: Radius['2xl'],
		paddingHorizontal: Spacing.lg,
		paddingBottom: 40,
		paddingTop: Spacing.md,
	},
	handle: {
		alignSelf: 'center',
		width: 40,
		height: 4,
		borderRadius: 2,
		backgroundColor: Colors.gray200,
		marginBottom: Spacing.lg,
	},
	sheetTitle: {
		fontSize: 16,
		fontWeight: '700',
		color: Colors.amber800,
		marginBottom: Spacing.lg,
		textAlign: 'center',
	},

	// ── Mood grid ─────────────────────────────
	row: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	moodBtn: {
		alignItems: 'center',
		padding: Spacing.sm,
		borderRadius: Radius.md,
		borderWidth: 2,
		borderColor: 'transparent',
		flex: 1,
	},
	moodBtnSelected: {
		borderColor: Colors.amber400,
		backgroundColor: Colors.amber50,
	},
	emoji: {
		fontSize: 28,
		marginBottom: 4,
	},
	label: {
		fontSize: 10,
		color: Colors.gray500,
	},
	labelSelected: {
		color: Colors.amber700,
		fontWeight: '600',
	},
});

export default MoodCheckIn;
