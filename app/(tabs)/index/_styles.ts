import { Platform, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },

  title: {
    marginBottom: 16,
    textAlign: 'center',
  },

  date: {
    textAlign: 'center',
    marginBottom: 12,
    color: '#6B7280',
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

  habitItem: {
    flexDirection: 'row',
    backgroundColor: '#296477ff',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 18,
    minHeight: 64,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(15,23,32,0.04)',
    borderLeftWidth: 6,
    borderLeftColor: '#1b404dff',
    elevation: 4,
    ...Platform.select({
      web: { boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)' },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
    }),
    marginVertical: 6,
  },

  habitText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#E6EEF3',
  },

  habitDone: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },

  status: {
    fontSize: 18,
  },

  addButton: {
    marginTop: 24,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 10,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    alignSelf: 'stretch',
  },

  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

});
