import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },

  backButton: {
    fontSize: 16,
    color: '#4F46E5',
    marginBottom: 16,
  },

  title: {
    marginBottom: 24,
  },

  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#E6E8EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
    fontSize: 16,
  },

  button: {
    height: 48,
    borderRadius: 10,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },

  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },

  scrollContent: {
    paddingBottom: 24,
  },

  sectionLabel: {
    marginBottom: 12,
    color: '#6B7280',
  },

  weekDaysRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },

  dayChip: {
    minWidth: 44,
    height: 44,
    paddingHorizontal: 10,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },

  dayChipSelected: {
    borderColor: '#4F46E5',
    backgroundColor: '#4F46E5',
  },

  dayChipText: {
    fontSize: 14,
    color: '#374151',
  },

  dayChipTextSelected: {
    color: '#FFF',
  },

  daysHint: {
    fontSize: 13,
    color: '#9CA3AF',
    marginBottom: 20,
    minHeight: 20,
  },

  buttonDisabled: {
    opacity: 0.7,
  },
});
