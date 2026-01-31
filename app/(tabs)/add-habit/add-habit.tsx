import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { supabase } from '@/src/lib/supabase';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { styles } from './_styles';

const WEEK_DAYS = [
  { id: 0, title: 'Domingo', short: 'Dom' },
  { id: 1, title: 'Segunda-feira', short: 'Seg' },
  { id: 2, title: 'Terça-feira', short: 'Ter' },
  { id: 3, title: 'Quarta-feira', short: 'Qua' },
  { id: 4, title: 'Quinta-feira', short: 'Qui' },
  { id: 5, title: 'Sexta-feira', short: 'Sex' },
  { id: 6, title: 'Sábado', short: 'Sáb' },
] as const;
const WEEK_DAYS_ORDER = [1, 2, 3, 4, 5, 6, 0]; // Segunda a Domingo

export default function AddHabit() {
  const router = useRouter();
  const [habitName, setHabitName] = useState('');
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  function toggleDay(dayId: number) {
    setSelectedDays((prev) =>
      prev.includes(dayId) ? prev.filter((d) => d !== dayId) : [...prev, dayId],
    );
  }

  async function handleAddHabit() {
    const title = habitName.trim();
    if (!title) {
      Alert.alert('Atenção', 'Informe o nome do hábito.');
      return;
    }
    if (selectedDays.length === 0) {
      Alert.alert('Atenção', 'Selecione pelo menos um dia da semana.');
      return;
    }

    setLoading(true);
    try {
      const { data: habit, error: habitError } = await supabase
        .from('habits')
        .insert({ title })
        .select('id')
        .single();

      if (habitError) throw habitError;
      if (!habit?.id) throw new Error('Hábito não criado.');

      const weekDaysData = selectedDays.map((week_day_id) => ({
        habit_id: habit.id,
        week_day_id,
      }));

      const { error: weekDaysError } = await supabase
        .from('habit_week_days')
        .insert(weekDaysData);

      if (weekDaysError) throw weekDaysError;

      setHabitName('');
      setSelectedDays([]);
      router.back();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Erro ao salvar hábito';
      console.error('Erro ao salvar hábito', error);
      Alert.alert('Erro', message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity onPress={() => router.back()}>
          <ThemedText type="link" style={styles.backButton}>
            ← Voltar
          </ThemedText>
        </TouchableOpacity>

        <ThemedText type="h2" style={styles.title}>
          Novo Hábito
        </ThemedText>

        <TextInput
          style={styles.input}
          placeholder="Nome do hábito"
          placeholderTextColor="#9CA3AF"
          value={habitName}
          onChangeText={setHabitName}
          editable={!loading}
        />

        <ThemedText type="default" style={styles.sectionLabel}>
          Qual a recorrência?
        </ThemedText>
        <View style={styles.weekDaysRow}>
          {WEEK_DAYS_ORDER.map((id) => {
            const day = WEEK_DAYS.find((d) => d.id === id)!;
            return (
            <TouchableOpacity
              key={day.id}
              style={[
                styles.dayChip,
                selectedDays.includes(day.id) && styles.dayChipSelected,
              ]}
              onPress={() => toggleDay(day.id)}
              disabled={loading}
            >
              <ThemedText
                type="defaultSemiBold"
                style={[
                  styles.dayChipText,
                  selectedDays.includes(day.id) && styles.dayChipTextSelected,
                ]}
              >
                {day.short}
              </ThemedText>
            </TouchableOpacity>
            );
          })}
        </View>
        <ThemedText type="subtitle" style={styles.daysHint}>
          {WEEK_DAYS_ORDER.filter((id) => selectedDays.includes(id))
            .map((id) => WEEK_DAYS.find((d) => d.id === id)!.title)
            .join(', ') || 'Nenhum dia selecionado'}
        </ThemedText>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleAddHabit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <ThemedText type="defaultSemiBold" style={styles.buttonText}>
              Salvar
            </ThemedText>
          )}
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
}
