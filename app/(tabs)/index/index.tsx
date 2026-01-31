import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { supabase } from '@/src/lib/supabase';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { styles } from './_styles';

type Habit = {
  id: string;
  title: string;
  doneToday: boolean;
};

// getDay(): 0=Domingo, 1=Segunda, ... 6=Sábado (igual ao schema)
function getTodayWeekDayId(): number {
  return new Date().getDay();
}

function formatDateForDb(d: Date): string {
  return d.toISOString().split('T')[0]; // yyyy-mm-dd
}

export default function Home() {
  const today = new Date();
  const formattedDate = `${String(today.getDate()).padStart(2, '0')}-${String(
    today.getMonth() + 1,
  ).padStart(2, '0')}-${today.getFullYear()}`;
  const todayDateStr = formatDateForDb(today);
  const todayWeekDayId = getTodayWeekDayId();
  const router = useRouter();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);

  const loadHabits = useCallback(async () => {
    try {
      setLoading(true);
      const { data: weekDaysData, error: weekDaysError } = await supabase
        .from('habit_week_days')
        .select('habit_id')
        .eq('week_day_id', todayWeekDayId);

      if (weekDaysError) throw weekDaysError;
      const habitIds = weekDaysData?.map((r) => r.habit_id) ?? [];
      if (habitIds.length === 0) {
        setHabits([]);
        return;
      }

      const { data: habitsData, error: habitsError } = await supabase
        .from('habits')
        .select('id, title')
        .in('id', habitIds);

      if (habitsError) throw habitsError;
      const habitsList = habitsData ?? [];

      const { data: completionsData, error: completionsError } = await supabase
        .from('habit_day_completions')
        .select('habit_id')
        .eq('date', todayDateStr)
        .in('habit_id', habitIds);

      if (completionsError) throw completionsError;
      const completedIds = new Set(
        (completionsData ?? []).map((c) => c.habit_id),
      );

      const merged: Habit[] = habitsList.map((h) => ({
        id: h.id,
        title: h.title,
        doneToday: completedIds.has(h.id),
      }));

      setHabits(merged);
    } catch (error) {
      console.error('Erro ao carregar hábitos', error);
      Alert.alert('Erro', 'Não foi possível carregar os hábitos.');
    } finally {
      setLoading(false);
    }
  }, [todayWeekDayId, todayDateStr]);

  useFocusEffect(
    useCallback(() => {
      loadHabits();
    }, [loadHabits]),
  );

  async function toggleHabit(habitId: string) {
    const habit = habits.find((h) => h.id === habitId);
    if (!habit) return;
    const newDone = !habit.doneToday;

    setHabits((prev) =>
      prev.map((h) => (h.id === habitId ? { ...h, doneToday: newDone } : h)),
    );

    try {
      if (newDone) {
        const { error } = await supabase
          .from('habit_day_completions')
          .insert({ habit_id: habitId, date: todayDateStr });
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('habit_day_completions')
          .delete()
          .eq('habit_id', habitId)
          .eq('date', todayDateStr);
        if (error) throw error;
      }
    } catch (error) {
      console.error('Erro ao atualizar hábito', error);
      setHabits((prev) =>
        prev.map((h) => (h.id === habitId ? { ...h, doneToday: !newDone } : h)),
      );
      Alert.alert('Erro', 'Não foi possível atualizar o hábito.');
    }
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="h1" style={styles.title}>
        Hábitos Diários
      </ThemedText>
      <ThemedText style={styles.date}>{formattedDate}</ThemedText>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 24 }} size="large" />
      ) : (
        <FlatList
          data={habits}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <ThemedText style={styles.emptyText}>
              Nenhum hábito para hoje. Adicione um hábito e escolha os dias da
              semana.
            </ThemedText>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.habitItem}
              onPress={() => toggleHabit(item.id)}
              activeOpacity={0.7}
            >
              <ThemedText
                style={[styles.habitText, item.doneToday && styles.habitDone]}
              >
                {item.title}
              </ThemedText>

              <ThemedText type="defaultSemiBold" style={styles.status}>
                {item.doneToday ? '\u2714' : '\u2b1c'}
              </ThemedText>
            </TouchableOpacity>
          )}
        />
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push('/(tabs)/add-habit/add-habit')}
      >
        <ThemedText type="defaultSemiBold" style={styles.addButtonText}>
          + Adicionar hábito
        </ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}
