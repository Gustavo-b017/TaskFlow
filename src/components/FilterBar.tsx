import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import type { TaskStatus } from '../types/task';

export type FilterOption = 'all' | TaskStatus;

interface FilterBarProps {
  selected: FilterOption;
  onSelect: (option: FilterOption) => void;
}

const FILTER_OPTIONS: { value: FilterOption; label: string }[] = [
  { value: 'all',          label: 'Todos' },
  { value: 'pendente',     label: 'Pendente' },
  { value: 'em_andamento', label: 'Em andamento' },
  { value: 'concluida',    label: 'Concluída' },
];

export function FilterBar({ selected, onSelect }: FilterBarProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {FILTER_OPTIONS.map((option) => {
        const isActive = selected === option.value;
        return (
          <TouchableOpacity
            key={option.value}
            onPress={() => onSelect(option.value)}
            style={[
              styles.chip,
              isActive && styles.chipActive,
            ]}
          >
            <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

function createStyles(theme: 'light' | 'dark') {
  return StyleSheet.create({
    container: { flexGrow: 0 },
    content: { paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
    chip: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme === 'dark' ? '#4B5563' : '#E5E7EB',
      backgroundColor: theme === 'dark' ? '#374151' : '#FFFFFF',
      minHeight: 44, // Aumentado para 44dp para área de toque mínima
      justifyContent: 'center',
    },
    chipActive: { backgroundColor: '#3B82F6', borderColor: '#3B82F6' },
    chipText: { fontSize: 14, color: theme === 'dark' ? '#D1D5DB' : '#6B7280' },
    chipTextActive: { color: '#FFFFFF', fontWeight: '600' },
  });
}
