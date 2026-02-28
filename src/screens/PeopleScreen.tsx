import React, { useState } from 'react';
import {
	View,
	ScrollView,
	Text,
	TextInput,
	TouchableOpacity,
	Modal,
	Alert,
	StyleSheet,
	KeyboardAvoidingView,
	Platform,
	Keyboard,
	TouchableWithoutFeedback,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
	Plus,
	Star,
	Trash2,
	Search,
	ChevronRight,
} from 'lucide-react-native';

import type { RootStackParamList } from '../navigation/types';
import type { PersonMet } from '../types/types';
import { RELATIONSHIP_TAGS, THINGS_THEY_LIKE_OPTIONS } from '../types/types';
import {
	useUserProgress,
	useSetUserProgressStore,
} from '../store/store';
import { Colors, Spacing, Radius } from '../theme/colors';
import Button from '../components/Button';
import Card from '../components/Card';
import Typography from '../components/Typography';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const PeopleScreen: React.FC = () => {
	const navigation = useNavigation < Nav > ();
	const userProgress = useUserProgress();
	const setUserProgress = useSetUserProgressStore();
	const people: PersonMet[] = userProgress.peopleMet || [];

	// Form state
	const [showAddModal, setShowAddModal] = useState(false);
	const [name, setName] = useState('');
	const [somethingInteresting, setSomethingInteresting] = useState('');
	const [whereMet, setWhereMet] = useState('');
	const [selectedTags, setSelectedTags] = useState < string[] > ([]);
	const [searchQuery, setSearchQuery] = useState('');
	const [sortBy, setSortBy] = useState < 'newest' | 'name' > ('newest');

	const toggleFavorite = (id: string) => {
		setUserProgress({
			peopleMet: people.map((p) =>
				p.id === id ? { ...p, isFavorite: !p.isFavorite } : p,
			),
		});
	};

	const filteredPeople = people.filter((person) => {
		if (!searchQuery.trim()) return true;
		const q = searchQuery.toLowerCase();
		return (
			person.name.toLowerCase().includes(q) ||
			person.somethingInteresting?.toLowerCase().includes(q) ||
			person.whereMet?.toLowerCase().includes(q) ||
			person.tags?.some((t) => t.toLowerCase().includes(q))
		);
	});

	const sortedPeople = [...filteredPeople].sort((a, b) => {
		if (a.isFavorite && !b.isFavorite) return -1;
		if (!a.isFavorite && b.isFavorite) return 1;
		if (sortBy === 'name') return a.name.localeCompare(b.name);
		return (
			new Date(b.meetDate).getTime() - new Date(a.meetDate).getTime()
		);
	});

	const addPerson = () => {
		if (name.trim() === '') return;
		const newPerson: PersonMet = {
			id: Date.now().toString(),
			name: name.trim(),
			meetDate: new Date().toLocaleDateString(),
			somethingInteresting: somethingInteresting.trim() || undefined,
			whereMet: whereMet.trim() || undefined,
			tags: selectedTags.length > 0 ? selectedTags : undefined,
		};
		setUserProgress({ peopleMet: [newPerson, ...people] });
		setName('');
		setSomethingInteresting('');
		setWhereMet('');
		setSelectedTags([]);
		setShowAddModal(false);
	};

	const removePerson = (id: string, personName: string) => {
		Alert.alert(
			'Remove Person',
			`Are you sure you want to remove ${personName}?`,
			[
				{ text: 'Cancel', style: 'cancel' },
				{
					text: 'Remove',
					style: 'destructive',
					onPress: () => {
						setUserProgress({
							peopleMet: people.filter((p) => p.id !== id),
						});
					},
				},
			],
		);
	};

	return (
		<View style={styles.container}>
			{/* Toolbar */}
			<View style={styles.toolbar}>
				<View style={styles.searchRow}>
					<Search size={16} color={Colors.gray400} />
					<TextInput
						value={searchQuery}
						onChangeText={setSearchQuery}
						placeholder="Search people..."
						placeholderTextColor={Colors.gray400}
						style={styles.searchInput}
					/>
				</View>
				<TouchableOpacity
					onPress={() => setShowAddModal(true)}
					style={styles.addBtn}
				>
					<Plus size={20} color={Colors.white} />
				</TouchableOpacity>
			</View>

			{/* Sort toggle */}
			<View style={styles.sortRow}>
				<TouchableOpacity
					onPress={() =>
						setSortBy((s) => (s === 'newest' ? 'name' : 'newest'))
					}
				>
					<Typography variant="caption" tone="accent">
						Sort: {sortBy === 'newest' ? 'Newest' : 'Name'}
					</Typography>
				</TouchableOpacity>
				<Typography variant="caption" tone="muted">
					{people.length} people
				</Typography>
			</View>

			<ScrollView
				contentContainerStyle={styles.list}
				showsVerticalScrollIndicator={false}
			>
				{sortedPeople.length === 0 && (
					<View style={styles.empty}>
						<Text style={{ fontSize: 40 }}>{'\u{1F465}'}</Text>
						<Typography variant="body-sm" style={{ textAlign: 'center', marginTop: 8 }}>
							No people yet. Tap + to add someone you've met!
						</Typography>
					</View>
				)}

				{sortedPeople.map((person) => (
					<TouchableOpacity
						key={person.id}
						onPress={() =>
							navigation.navigate('PersonDetail', { personId: person.id })
						}
						activeOpacity={0.7}
					>
						<Card variant="base" style={styles.personCard}>
							<View style={styles.personRow}>
								<View style={{ flex: 1 }}>
									<View style={styles.nameRow}>
										<Typography variant="subtitle">{person.name}</Typography>
										{person.isFavorite && (
											<Star
												size={14}
												color={Colors.amber400}
												fill={Colors.amber400}
											/>
										)}
									</View>
									{person.whereMet && (
										<Typography variant="caption" tone="muted">
											Met at {person.whereMet}
										</Typography>
									)}
									{person.tags && person.tags.length > 0 && (
										<View style={styles.tagRow}>
											{person.tags.slice(0, 3).map((tag) => (
												<View key={tag} style={styles.tag}>
													<Text style={styles.tagText}>{tag}</Text>
												</View>
											))}
										</View>
									)}
								</View>
								<View style={styles.personActions}>
									<TouchableOpacity
										onPress={() => toggleFavorite(person.id)}
										hitSlop={8}
									>
										<Star
											size={18}
											color={
												person.isFavorite ? Colors.amber400 : Colors.gray300
											}
											fill={person.isFavorite ? Colors.amber400 : 'transparent'}
										/>
									</TouchableOpacity>
									<TouchableOpacity
										onPress={() => removePerson(person.id, person.name)}
										hitSlop={8}
									>
										<Trash2 size={16} color={Colors.red400} />
									</TouchableOpacity>
									<ChevronRight size={16} color={Colors.gray400} />
								</View>
							</View>
						</Card>
					</TouchableOpacity>
				))}
			</ScrollView>

			{/* ── Add Person Modal ── */}
			<Modal visible={showAddModal} transparent animationType="slide">
				<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
					<KeyboardAvoidingView
						style={styles.modalOverlay}
						behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
					>
						<View style={styles.modalCard}>
							<ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
								<Typography variant="headline" style={{ marginBottom: 16 }}>
									Add a Person
								</Typography>

								<TextInput
									value={name}
									onChangeText={setName}
									placeholder="Name *"
									placeholderTextColor={Colors.gray400}
									style={styles.input}
									returnKeyType="next"
								/>
								<TextInput
									value={whereMet}
									onChangeText={setWhereMet}
									placeholder="Where you met"
									placeholderTextColor={Colors.gray400}
									style={styles.input}
									returnKeyType="next"
								/>
								<TextInput
									value={somethingInteresting}
									onChangeText={setSomethingInteresting}
									placeholder="Something interesting about them"
									placeholderTextColor={Colors.gray400}
									style={styles.input}
									multiline
									blurOnSubmit
									returnKeyType="done"
								/>

								{/* Tags */}
								<Typography variant="caption" tone="muted" style={{ marginBottom: 6 }}>
									Tags
								</Typography>
								<View style={styles.tagRow}>
									{RELATIONSHIP_TAGS.map((tag) => {
										const sel = selectedTags.includes(tag);
										return (
											<TouchableOpacity
												key={tag}
												onPress={() =>
													setSelectedTags((prev) =>
														sel ? prev.filter((t) => t !== tag) : [...prev, tag],
													)
												}
												style={[styles.chipBtn, sel && styles.chipBtnSelected]}
											>
												<Text
													style={[
														styles.chipText,
														sel && styles.chipTextSelected,
													]}
												>
													{tag}
												</Text>
											</TouchableOpacity>
										);
									})}
								</View>

								<View style={styles.modalButtons}>
									<Button
										variant="cancel"
										size="sm"
										style={{ flex: 1 }}
										onPress={() => { Keyboard.dismiss(); setShowAddModal(false); }}
									>
										<Text style={{ color: Colors.amber700 }}>Cancel</Text>
									</Button>
									<Button
										variant="save"
										size="sm"
										style={{ flex: 1 }}
										onPress={() => { Keyboard.dismiss(); addPerson(); }}
										disabled={name.trim() === ''}
									>
										<Text style={{ color: Colors.white }}>Add</Text>
									</Button>
								</View>
							</ScrollView>
						</View>
					</KeyboardAvoidingView>
				</TouchableWithoutFeedback>
			</Modal>
		</View>
	);
};

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: Colors.amber50, padding: Spacing.lg },
	toolbar: {
		flexDirection: 'row',
		gap: 10,
		marginBottom: 10,
	},
	searchRow: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
		backgroundColor: Colors.white,
		borderRadius: Radius.sm,
		borderWidth: 1,
		borderColor: Colors.amber200,
		paddingHorizontal: 10,
		height: 40,
	},
	searchInput: {
		flex: 1,
		fontSize: 14,
		color: Colors.gray900,
	},
	addBtn: {
		width: 40,
		height: 40,
		borderRadius: Radius.sm,
		backgroundColor: Colors.amber500,
		alignItems: 'center',
		justifyContent: 'center',
	},
	sortRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 10,
	},
	list: { paddingBottom: 100, gap: 10 },
	empty: {
		alignItems: 'center',
		paddingVertical: 40,
	},
	personCard: { padding: 14 },
	personRow: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	nameRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 6,
	},
	personActions: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12,
	},
	tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 6 },
	tag: {
		backgroundColor: Colors.amber100,
		borderRadius: Radius.full,
		paddingHorizontal: 8,
		paddingVertical: 2,
	},
	tagText: { fontSize: 10, color: Colors.amber700 },

	// Modal
	modalOverlay: {
		flex: 1,
		backgroundColor: 'rgba(0,0,0,0.5)',
		justifyContent: 'center',
		padding: 20,
	},
	modalCard: {
		backgroundColor: Colors.white,
		borderRadius: Radius['2xl'],
		padding: 20,
	},
	input: {
		borderWidth: 1,
		borderColor: Colors.amber200,
		borderRadius: Radius.sm,
		paddingHorizontal: 12,
		paddingVertical: 10,
		fontSize: 14,
		color: Colors.gray900,
		marginBottom: 10,
	},
	chipBtn: {
		borderWidth: 1,
		borderColor: Colors.amber200,
		borderRadius: Radius.full,
		paddingHorizontal: 10,
		paddingVertical: 4,
	},
	chipBtnSelected: {
		backgroundColor: Colors.amber500,
		borderColor: Colors.amber500,
	},
	chipText: { fontSize: 12, color: Colors.amber700 },
	chipTextSelected: { color: Colors.white },
	modalButtons: { flexDirection: 'row', gap: 8, marginTop: 16 },
});

export default PeopleScreen;
