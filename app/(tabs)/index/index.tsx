import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect, useRouter } from 'expo-router'
import { useCallback, useState } from 'react'
import { Alert, FlatList, Platform, TouchableOpacity } from 'react-native'
import { styles } from './styles'

type Habit = {
  id: string
  title: string
  doneToday: boolean
}

export default function Home() {
  const today = new Date()
  const formattedDate = `${String(today.getDate()).padStart(2, '0')}-${String(
    today.getMonth() + 1
  ).padStart(2, '0')}-${today.getFullYear()}`
  const router = useRouter()
  const [habits, setHabits] = useState<Habit[]>([])

  const STORAGE_KEY = '@habits'
  const HISTORY_KEY = '@historico'
  const [hasHistoryToday, setHasHistoryToday] = useState(false)

  useFocusEffect(
    useCallback(() => {
      let isActive = true

      async function load() {
        try {
          const stored = await AsyncStorage.getItem(STORAGE_KEY)
          const list: Habit[] = stored ? JSON.parse(stored) : []
          if (isActive) {
            setHabits(list)
            // check if there's already a history entry for today
            const historyStr = await AsyncStorage.getItem(HISTORY_KEY)
            const history: { date: string; habits: Habit[] }[] = historyStr ? JSON.parse(historyStr) : []
            if (isActive) setHasHistoryToday(history.some((h) => h.date === formattedDate))
          }
        } catch (error) {
          console.error('Erro ao carregar hábitos', error)
        }
      }

      load()

      return () => {
        isActive = false
      }
    }, [formattedDate])
  )

  function toggleHabit(id: string) {
    setHabits((prev) => {
      const newList = prev.map((h) => (h.id === id ? { ...h, doneToday: !h.doneToday } : h))
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newList)).catch((error) =>
        console.error('Erro ao salvar hábitos', error)
      )
      return newList
    })
  }

  async function finalizeDay() {
    try {
      const historyStr = await AsyncStorage.getItem(HISTORY_KEY)
      const history: { date: string; habits: Habit[] }[] = historyStr ? JSON.parse(historyStr) : []
      const entry = { date: formattedDate, habits }

      const existingIndex = history.findIndex((h) => h.date === formattedDate)
      async function saveUpdatedHistory(updatedHistory: { date: string; habits: Habit[] }[]) {
        await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory))
        setHasHistoryToday(true)
        Alert.alert('Dia finalizado', 'O dia foi salvo no histórico.')
      }

      if (existingIndex >= 0) {
        // confirmation: use window.confirm on web for reliable behavior
        const proceed = Platform.OS === 'web'
          ? window.confirm('Já existe um registro para hoje. Deseja substituir o histórico de hoje?')
          : null

        if (proceed === true) {
          history[existingIndex] = entry
          await saveUpdatedHistory(history)
        } else if (proceed === false) {
          // user cancelled on web
          return
        } else {
          // on native, show Alert with buttons
          Alert.alert(
            'Já existe um registro para hoje',
            'Deseja substituir o histórico de hoje?',
            [
              { text: 'Cancelar', style: 'cancel' },
              {
                text: 'Substituir',
                onPress: async () => {
                  try {
                    history[existingIndex] = entry
                    await saveUpdatedHistory(history)
                  } catch (err) {
                    console.error('Erro ao salvar histórico', err)
                    Alert.alert('Erro', 'Não foi possível salvar o histórico.')
                  }
                },
              },
            ],
            { cancelable: true }
          )
        }
      } else {
        history.push(entry)
        await saveUpdatedHistory(history)
      }
    } catch (error) {
      console.error('Erro ao salvar histórico', error)
      Alert.alert('Erro', 'Não foi possível salvar o histórico.')
    }
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="h1" style={styles.title}>Hábitos Diários</ThemedText>
      <ThemedText style={styles.date}>{formattedDate}</ThemedText>
      

      <FlatList
        data={habits}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.habitItem}
            onPress={() => toggleHabit(item.id)}
            activeOpacity={0.7}
          >
            <ThemedText style={[styles.habitText, item.doneToday && styles.habitDone]}>{item.title}</ThemedText>

            <ThemedText type="defaultSemiBold" style={styles.status}>
              {item.doneToday ? '\u2714' : '\u2b1c'}
            </ThemedText>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push('/(tabs)/add-habit/add-habit')}
      >
        <ThemedText type="defaultSemiBold" style={styles.addButtonText}>+ Adicionar hábito</ThemedText>
      </TouchableOpacity>


      <TouchableOpacity
        style={[
          styles.finalizeButton,
          hasHistoryToday ? styles.finalizeButtonExists : undefined,
        ]}
        onPress={finalizeDay}
        activeOpacity={0.8}
      >
        <ThemedText type="defaultSemiBold" style={styles.finalizeButtonText}>
          {hasHistoryToday ? 'Finalizar novamente' : 'Finalizar dia'}
        </ThemedText>
      </TouchableOpacity>


    </ThemedView>
  )
}
