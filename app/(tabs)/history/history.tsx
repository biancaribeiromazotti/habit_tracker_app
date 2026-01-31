import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { supabase } from '@/src/lib/supabase';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  TouchableOpacity,
  View,
} from 'react-native';
import { styles } from './_styles';

type HistoryHabit = {
  id: string;
  title: string;
  doneToday: boolean;
};

type HistoryEntry = {
  date: string;
  dateDisplay: string;
  habits: HistoryHabit[];
};

// yyyy-mm-dd -> dd-mm-yyyy
function formatDateDisplay(isoDate: string): string {
  const [y, m, d] = isoDate.split('-');
  return `${d}-${m}-${y}`;
}

export default function HistoryScreen() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('habit_day_completions')
        .select('date, habit_id, habits(title)')
        .order('date', { ascending: false });

      if (error) throw error;

      const byDate = new Map<string, HistoryHabit[]>();
      for (const row of data ?? []) {
        const date = row.date as string;
        const habitsRel = row.habits as
          | { title?: string }
          | { title?: string }[]
          | null;
        const title = Array.isArray(habitsRel)
          ? (habitsRel[0]?.title ?? '?')
          : (habitsRel?.title ?? '?');
        const habit: HistoryHabit = {
          id: row.habit_id,
          title,
          doneToday: true,
        };
        const list = byDate.get(date) ?? [];
        list.push(habit);
        byDate.set(date, list);
      }

      const entries: HistoryEntry[] = Array.from(byDate.entries()).map(
        ([date, habits]) => ({
          date,
          dateDisplay: formatDateDisplay(date),
          habits,
        }),
      );
      setHistory(entries);
    } catch (err) {
      console.error('Erro ao carregar histórico', err);
      Alert.alert('Erro', 'Não foi possível carregar o histórico.');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  function toggle(date: string) {
    setExpanded((prev) => ({ ...prev, [date]: !prev[date] }));
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="h1" style={styles.title}>
        Histórico
      </ThemedText>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 24 }} size="large" />
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.date}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <ThemedText style={styles.emptyText}>
              Nenhum hábito concluído ainda. Marque os hábitos na tela inicial.
            </ThemedText>
          }
          renderItem={({ item }) => (
            <View style={styles.entry}>
              <TouchableOpacity
                onPress={() => toggle(item.date)}
                style={styles.entryHeader}
              >
                <ThemedText style={styles.entryDate}>
                  {item.dateDisplay}
                </ThemedText>
                <ThemedText style={styles.entryCount}>
                  {item.habits.length} hábito
                  {item.habits.length !== 1 ? 's' : ''} concluído
                  {item.habits.length !== 1 ? 's' : ''}
                </ThemedText>
              </TouchableOpacity>

              {expanded[item.date] && (
                <View style={styles.entryBody}>
                  {item.habits.map((h) => (
                    <View key={h.id} style={styles.habitRow}>
                      <ThemedText
                        style={[
                          styles.habitTitle,
                          h.doneToday && styles.habitDone,
                        ]}
                      >
                        {h.title}
                      </ThemedText>
                      <ThemedText style={styles.habitStatus}>
                        {h.doneToday ? '\u2714' : '\u2b1c'}
                      </ThemedText>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}
        />
      )}
    </ThemedView>
  );
}
