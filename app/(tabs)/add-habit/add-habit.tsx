import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { TextInput, TouchableOpacity } from 'react-native';
import { styles } from './styles';

export default function AddHabit() {
  const router = useRouter();
  const [habitName, setHabitName] = useState('');

  type Habit = {
    id: string;
    title: string;
    doneToday: boolean;
  };

  const STORAGE_KEY = '@habits';

  async function handleAddHabit() {
    if (!habitName.trim()) {
      return;
    }

    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      const habits: Habit[] = stored ? JSON.parse(stored) : [];

      const newHabit: Habit = {
        id: Date.now().toString(),
        title: habitName.trim(),
        doneToday: false,
      };

      const updated = [...habits, newHabit];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

      console.log('Hábito criado:', newHabit);
      setHabitName('');
      router.back();
    } catch (error) {
      console.error('Erro ao salvar hábito', error);
    }
  }

  return (
    <ThemedView style={styles.container}>
      {/* Botão voltar */}
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
      />

      <TouchableOpacity style={styles.button} onPress={handleAddHabit}>
        <ThemedText type="defaultSemiBold" style={styles.buttonText}>
          Salvar
        </ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}
