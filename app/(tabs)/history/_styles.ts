import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },

  title: {
    marginBottom: 12,
    textAlign: 'center',
  },

  list: {
    gap: 12,
    flexGrow: 1,
  },

  emptyText: {
    textAlign: 'center',
    color: '#9CA3AF',
    marginTop: 24,
    paddingHorizontal: 16,
  },

  entry: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    padding: 12,
    backgroundColor: '#fff',
  },

  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  entryDate: {
    fontSize: 16,
    fontWeight: '700',
  },

  entryCount: {
    fontSize: 14,
    color: '#6B7280',
  },

  entryBody: {
    marginTop: 8,
    gap: 8,
  },

  habitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },

  habitTitle: {
    fontSize: 15,
  },

  habitDone: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },

  habitStatus: {
    fontSize: 16,
  },
});
