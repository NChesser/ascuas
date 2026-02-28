import React, { useEffect, useState } from 'react';
import {
	View,
	ScrollView,
	Text,
	TextInput,
	TouchableOpacity,
	Modal,
	StyleSheet,
} from 'react-native';
import { useRoute, type RouteProp } from '@react-navigation/native';
import {
	BarChart3,
	CheckCircle,
	Lightbulb,
	NotebookPen,
} from 'lucide-react-native';

import type { RootStackParamList } from '../navigation/types';
import type { PracticeLog } from '../types/types';
import { PRACTICES } from '../data/practices';
import {
	useUserPracticeLogs,
	useUserProgress,
	useSetUserProgressStore,
} from '../store/store';
import { Colors, Spacing, Radius } from '../theme/colors';
import Card from '../components/Card';
import Button from '../components/Button';
import Typography from '../components/Typography';

type Route = RouteProp<RootStackParamList, 'PracticeDetail'>;

const PracticeDetailScreen: React.FC = () => {
	const { params } = useRoute < Route > ();
	const practice = PRACTICES.find((p) => p.id === params.practiceId);
	const practiceLogs = useUserPracticeLogs();
	const userProgress = useUserProgress();
	const setUserProgress = useSetUserProgressStore();

	if (!practice) return null;

	const today = new Date().toDateString();
	const isCompletedToday = practiceLogs.some((log) => {
		const logDate = new Date(log.date).toDateString();
		return log.practiceId === practice.id && logDate === today;
	});

	const todaysLog = practiceLogs.find((log) => {
		const logDate = new Date(log.date).toDateString();
		return log.practiceId === practice.id && logDate === today;
	});

	const [note, setNote] = useState(todaysLog?.note ?? '');
	const [isNoteOpen, setIsNoteOpen] = useState(false);
	const [noteDraft, setNoteDraft] = useState(note);
	const [isStatsOpen, setIsStatsOpen] = useState(false);

	useEffect(() => {
		const nextNote = todaysLog?.note ?? '';
		setNote(nextNote);
		setNoteDraft(nextNote);
	}, [todaysLog?.note, practice.id]);

	const handleComplete = (noteText: string) => {
		if (!isCompletedToday) {
			const newLog: PracticeLog = {
				practiceId: practice.id,
				date: new Date().toISOString(),
				note: noteText,
			};
			setUserProgress({
				practiceLogs: [...userProgress.practiceLogs, newLog],
			});
		}
	};

	// Stats
	const practiceEntries = practiceLogs.filter(
		(l) => l.practiceId === practice.id,
	);
	const totalCompletions = practiceEntries.length;
	const lastCompleted =
		practiceEntries.length > 0
			? new Date(practiceEntries[practiceEntries.length - 1].date)
			: null;
	const uniqueDays = new Set(
		practiceEntries.map((l) => new Date(l.date).toDateString()),
	);

	const currentStreak = (() => {
		const dateSet = new Set(
			practiceEntries.map(
				(l) => new Date(l.date).toISOString().split('T')[0],
			),
		);
		if (dateSet.size === 0) return 0;
		const t = new Date();
		t.setHours(0, 0, 0, 0);
		const todayStr = t.toISOString().split('T')[0];
		const checkDate = new Date(t);
		if (!dateSet.has(todayStr)) {
			checkDate.setDate(checkDate.getDate() - 1);
			const yStr = checkDate.toISOString().split('T')[0];
			if (!dateSet.has(yStr)) return 0;
		}
		let count = 0;
		while (true) {
			const ds = checkDate.toISOString().split('T')[0];
			if (dateSet.has(ds)) {
				count++;
				checkDate.setDate(checkDate.getDate() - 1);
			} else break;
		}
		return count;
	})();

	const lastCompletedLabel = lastCompleted
		? lastCompleted.toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
		})
		: 'Not yet';

	const Icon = practice.icon;
	const iconColor = isCompletedToday ? Colors.green600 : Colors.amber600;

	return (
		<ScrollView
			style={styles.container}
			contentContainerStyle={styles.content}
		>
			{/* Header row */}
			<View style={styles.headerRow}>
				<View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
					<Icon size={24} color={iconColor} />
					<Typography variant="overline">{practice.category}</Typography>
				</View>
				<View style={{ flexDirection: 'row', gap: 20 }}>
					<TouchableOpacity onPress={() => setIsStatsOpen(true)}>
						<BarChart3 size={24} color={Colors.amber600} />
					</TouchableOpacity>
					<TouchableOpacity onPress={() => setIsNoteOpen(true)}>
						<NotebookPen size={24} color={Colors.amber600} />
					</TouchableOpacity>
				</View>
			</View>

			{/* Main card */}
			<Card
				variant="elevated"
				style={
					isCompletedToday
						? {
							backgroundColor: Colors.green50,
							borderColor: Colors.green300,
						}
						: undefined
				}
			>
				<Typography variant="title" style={{ marginBottom: 8 }}>
					{practice.title}
				</Typography>
				<View style={styles.divider} />
				<Typography>{practice.description}</Typography>

				{/* Hint */}
				{practice.hint && (
					<View style={styles.hintBox}>
						<View style={styles.hintHeader}>
							<Lightbulb size={16} color={Colors.sky600} />
							<Typography variant="overline" tone="info">
								How to approach it
							</Typography>
						</View>
						<Typography variant="body-sm" tone="info-strong">
							{practice.hint}
						</Typography>
					</View>
				)}

				{/* Complete button */}
				<View style={{ marginTop: 16 }}>
					<Button
						variant={isCompletedToday ? 'success' : 'primary'}
						size="lg"
						onPress={() => handleComplete(note.trim())}
						disabled={isCompletedToday}
					>
						<CheckCircle
							size={16}
							color={Colors.white}
						/>
						<Text style={{ color: Colors.white, fontWeight: '600', fontSize: 15 }}>
							{isCompletedToday ? 'Completed Today' : 'Complete'}
						</Text>
					</Button>
				</View>
			</Card>

			{/* ── Note Modal ── */}
			<Modal visible={isNoteOpen} transparent animationType="fade">
				<View style={styles.modalOverlay}>
					<View style={styles.modalCard}>
						<Typography variant="label">Daily Note</Typography>
						<Typography variant="caption" style={{ marginTop: 4 }}>
							Capture how it went today.
						</Typography>
						<TextInput
							value={noteDraft}
							onChangeText={setNoteDraft}
							placeholder="How did it go today?"
							placeholderTextColor={Colors.amber400}
							multiline
							numberOfLines={4}
							style={styles.textInput}
							textAlignVertical="top"
						/>
						<View style={styles.modalButtons}>
							<Button
								variant="cancel"
								size="sm"
								style={{ flex: 1 }}
								onPress={() => {
									setNoteDraft(note);
									setIsNoteOpen(false);
								}}
							>
								<Text style={{ color: Colors.amber700 }}>Cancel</Text>
							</Button>
							<Button
								variant="save"
								size="sm"
								style={{ flex: 1 }}
								onPress={() => {
									const trimmed = noteDraft.trim();
									setNote(trimmed);
									handleComplete(trimmed);
									setIsNoteOpen(false);
								}}
							>
								<Text style={{ color: Colors.white }}>Save Note</Text>
							</Button>
						</View>
					</View>
				</View>
			</Modal>

			{/* ── Stats Modal ── */}
			<Modal visible={isStatsOpen} transparent animationType="fade">
				<View style={styles.modalOverlay}>
					<View style={styles.modalCard}>
						<View style={styles.statsHeader}>
							<Typography variant="label">Your stats</Typography>
							<Typography variant="caption">
								{lastCompletedLabel === 'Not yet'
									? 'No activity yet'
									: `Last: ${lastCompletedLabel}`}
							</Typography>
						</View>
						<View style={styles.statsGrid}>
							{[
								{
									label: 'Current streak',
									value: `${currentStreak} day${currentStreak === 1 ? '' : 's'}`,
								},
								{ label: 'Total completions', value: String(totalCompletions) },
								{ label: 'Days completed', value: String(uniqueDays.size) },
								{ label: 'Last completed', value: lastCompletedLabel },
							].map((stat) => (
								<View key={stat.label} style={styles.statBox}>
									<Typography variant="caption">{stat.label}</Typography>
									<Typography variant="subtitle">{stat.value}</Typography>
								</View>
							))}
						</View>
						<Button
							variant="cancel"
							size="sm"
							onPress={() => setIsStatsOpen(false)}
							style={{ marginTop: 16 }}
						>
							<Text style={{ color: Colors.amber700 }}>Close</Text>
						</Button>
					</View>
				</View>
			</Modal>
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
	// Modals
	modalOverlay: {
		flex: 1,
		backgroundColor: 'rgba(0,0,0,0.5)',
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20,
	},
	modalCard: {
		width: '100%',
		maxWidth: 380,
		backgroundColor: Colors.white,
		borderRadius: Radius['2xl'],
		padding: 20,
		borderWidth: 1,
		borderColor: Colors.amber200,
	},
	textInput: {
		marginTop: 12,
		borderWidth: 1,
		borderColor: Colors.amber200,
		borderRadius: Radius.sm,
		padding: 12,
		fontSize: 14,
		color: Colors.amber900,
		backgroundColor: Colors.white,
		minHeight: 80,
	},
	modalButtons: {
		flexDirection: 'row',
		gap: 8,
		marginTop: 12,
	},
	statsHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 12,
	},
	statsGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 10,
	},
	statBox: {
		width: '47%',
		borderRadius: Radius.lg,
		borderWidth: 1,
		borderColor: Colors.amber100,
		backgroundColor: Colors.amber50,
		padding: 12,
	},
});

export default PracticeDetailScreen;
