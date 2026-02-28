import React, { useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useRoute, type RouteProp } from '@react-navigation/native';
import {
  Star,
  MapPin,
  Tag,
  MessageCircle,
  Plus,
  Trash2,
} from 'lucide-react-native';

import type { RootStackParamList } from '../navigation/types';
import type { Interaction, PersonalNote } from '../types/types';
import {
  useUserProgress,
  useSetUserProgressStore,
} from '../store/store';
import { Colors, Spacing, Radius } from '../theme/colors';
import Card from '../components/Card';
import Button from '../components/Button';
import Typography from '../components/Typography';

type Route = RouteProp<RootStackParamList, 'PersonDetail'>;

const PersonDetailScreen: React.FC = () => {
  const { params } = useRoute<Route>();
  const userProgress = useUserProgress();
  const setUserProgress = useSetUserProgressStore();
  const person = (userProgress.peopleMet || []).find(
    (p) => p.id === params.personId,
  );

  const [newNote, setNewNote] = useState('');
  const [newInteraction, setNewInteraction] = useState('');

  if (!person) {
    return (
      <View style={styles.container}>
        <Typography variant="body" style={{ textAlign: 'center', marginTop: 40 }}>
          Person not found.
        </Typography>
      </View>
    );
  }

  const updatePerson = (updates: Partial<typeof person>) => {
    setUserProgress({
      peopleMet: (userProgress.peopleMet || []).map((p) =>
        p.id === person.id ? { ...p, ...updates } : p,
      ),
    });
  };

  const addNote = () => {
    if (!newNote.trim()) return;
    const note: PersonalNote = {
      id: Date.now().toString(),
      text: newNote.trim(),
      createdAt: new Date().toISOString(),
    };
    updatePerson({
      personalNotes: [...(person.personalNotes || []), note],
    });
    setNewNote('');
  };

  const addInteraction = () => {
    if (!newInteraction.trim()) return;
    const interaction: Interaction = {
      id: Date.now().toString(),
      text: newInteraction.trim(),
      date: new Date().toISOString(),
    };
    updatePerson({
      interactions: [...(person.interactions || []), interaction],
    });
    setNewInteraction('');
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Name + favorite */}
      <View style={styles.nameRow}>
        <Typography variant="title">{person.name}</Typography>
        <TouchableOpacity
          onPress={() => updatePerson({ isFavorite: !person.isFavorite })}
        >
          <Star
            size={22}
            color={person.isFavorite ? Colors.amber400 : Colors.gray300}
            fill={person.isFavorite ? Colors.amber400 : 'transparent'}
          />
        </TouchableOpacity>
      </View>

      {/* Meta info */}
      <Card variant="soft" style={{ marginTop: 12 }}>
        {person.whereMet && (
          <View style={styles.metaRow}>
            <MapPin size={14} color={Colors.amber600} />
            <Typography variant="body-sm">Met at {person.whereMet}</Typography>
          </View>
        )}
        {person.somethingInteresting && (
          <View style={styles.metaRow}>
            <Typography variant="body-sm">
              {person.somethingInteresting}
            </Typography>
          </View>
        )}
        {person.tags && person.tags.length > 0 && (
          <View style={[styles.metaRow, { flexWrap: 'wrap' }]}>
            <Tag size={14} color={Colors.amber600} />
            {person.tags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}
      </Card>

      {/* Interactions */}
      <View style={{ marginTop: 20 }}>
        <Typography variant="label" style={{ marginBottom: 10 }}>
          Interactions
        </Typography>
        {(person.interactions || []).map((i) => (
          <View key={i.id} style={styles.logItem}>
            <MessageCircle size={14} color={Colors.amber500} />
            <View style={{ flex: 1 }}>
              <Typography variant="body-sm">{i.text}</Typography>
              <Typography variant="micro">
                {new Date(i.date).toLocaleDateString()}
              </Typography>
            </View>
          </View>
        ))}
        <View style={styles.addRow}>
          <TextInput
            value={newInteraction}
            onChangeText={setNewInteraction}
            placeholder="Add interaction..."
            placeholderTextColor={Colors.gray400}
            style={[styles.input, { flex: 1 }]}
          />
          <TouchableOpacity onPress={addInteraction} style={styles.addIconBtn}>
            <Plus size={18} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Notes */}
      <View style={{ marginTop: 20 }}>
        <Typography variant="label" style={{ marginBottom: 10 }}>
          Personal Notes
        </Typography>
        {(person.personalNotes || []).map((n) => (
          <View key={n.id} style={styles.logItem}>
            <Typography variant="body-sm" style={{ flex: 1 }}>
              {n.text}
            </Typography>
          </View>
        ))}
        <View style={styles.addRow}>
          <TextInput
            value={newNote}
            onChangeText={setNewNote}
            placeholder="Add note..."
            placeholderTextColor={Colors.gray400}
            style={[styles.input, { flex: 1 }]}
          />
          <TouchableOpacity onPress={addNote} style={styles.addIconBtn}>
            <Plus size={18} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.amber50 },
  content: { padding: Spacing.lg, paddingBottom: 100 },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  tag: {
    backgroundColor: Colors.amber100,
    borderRadius: Radius.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  tagText: { fontSize: 10, color: Colors.amber700 },
  logItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.amber100,
  },
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.amber200,
    borderRadius: Radius.sm,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: Colors.gray900,
  },
  addIconBtn: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm,
    backgroundColor: Colors.amber500,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default PersonDetailScreen;
