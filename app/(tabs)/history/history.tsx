import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useCallback, useEffect, useState } from 'react'
import { FlatList, TouchableOpacity, View } from 'react-native'
import { styles } from './styles'

type Habit = {
	id: string
	title: string
	doneToday: boolean
}

type HistoryEntry = {
	date: string
	habits: Habit[]
}

export default function HistoryScreen() {
	const [history, setHistory] = useState<HistoryEntry[]>([])
	const [expanded, setExpanded] = useState<Record<string, boolean>>({})

	const load = useCallback(async () => {
		const raw = await AsyncStorage.getItem('@historico')
		const list: HistoryEntry[] = raw ? JSON.parse(raw) : []
		// sort descending by date string (dd-mm-yyyy) -> convert to yyyy-mm-dd for reliable sort
		const sorted = list.sort((a, b) => {
			const aParts = a.date.split('-').reverse().join('-')
			const bParts = b.date.split('-').reverse().join('-')
			return bParts.localeCompare(aParts)
		})
		setHistory(sorted)
	}, [])

	useEffect(() => {
		load()
	}, [load])

	function toggle(date: string) {
		setExpanded((prev) => ({ ...prev, [date]: !prev[date] }))
	}

	return (
		<ThemedView style={styles.container}>
			<ThemedText type="h1" style={styles.title}>Histórico</ThemedText>

			<FlatList
				data={history}
				keyExtractor={(item) => item.date}
				contentContainerStyle={styles.list}
				renderItem={({ item }) => (
					<View style={styles.entry}>
						<TouchableOpacity onPress={() => toggle(item.date)} style={styles.entryHeader}>
							<ThemedText style={styles.entryDate}>{item.date}</ThemedText>
							<ThemedText style={styles.entryCount}>{item.habits.length} hábitos</ThemedText>
						</TouchableOpacity>

						{expanded[item.date] && (
							<View style={styles.entryBody}>
								{item.habits.map((h) => (
									<View key={h.id} style={styles.habitRow}>
										<ThemedText style={[styles.habitTitle, h.doneToday && styles.habitDone]}>{h.title}</ThemedText>
										<ThemedText style={styles.habitStatus}>{h.doneToday ? '\u2714' : '\u2b1c'}</ThemedText>
									</View>
								))}
							</View>
						)}
					</View>
				)}
			/>
		</ThemedView>
	)
}