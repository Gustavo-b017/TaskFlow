import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { COLORS, BORDER_RADIUS, SPACING } from '../styles/theme';
import type { TaskStatus } from '../types/task';

export type FilterOption = 'all' | TaskStatus;

interface FilterBarProps {
  selected: FilterOption;
  onSelect: (option: FilterOption) => void;
  counts?: Partial<Record<FilterOption, number>>;
}

const FILTER_OPTIONS: { value: FilterOption; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'pendente', label: 'Pendente' },
  { value: 'em_andamento', label: 'Em andamento' },
  { value: 'concluida', label: 'Concluída' },
];
const FILTER_MIN_WIDTH = 116;
const FILTER_MIN_HEIGHT = 42;

export function FilterBar({ selected, onSelect, counts = {} }: FilterBarProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.outerContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.container}
      >
        {FILTER_OPTIONS.map((option) => {
          const isActive = selected === option.value;
          const count = counts[option.value] ?? 0;
          return (
            <TouchableOpacity
              key={option.value}
              onPress={() => onSelect(option.value)}
              style={[styles.segment, isActive && styles.segmentActive]}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel={`Filtrar por ${option.label}`}
              accessibilityState={{ selected: isActive }}
            >
              <View style={styles.segmentContent}>
                <Text style={[styles.segmentText, isActive && styles.segmentTextActive]}>
                  {option.label}
                </Text>
                <View style={[styles.countBadge, isActive && styles.countBadgeActive]}>
                  <Text style={[styles.countText, isActive && styles.countTextActive]}>{count}</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

function createStyles(theme: 'light' | 'dark') {
  const themeColors = COLORS[theme];
  return StyleSheet.create({
    outerContainer: {
      paddingVertical: SPACING.sm,
      backgroundColor: themeColors.background,
      minHeight: FILTER_MIN_HEIGHT + SPACING.md,
    },
    scrollView: {
      overflow: 'visible',
    },
    container: {
      paddingHorizontal: SPACING.md,
      paddingVertical: 6,
      gap: 8,
    },
    segment: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: BORDER_RADIUS.sm,
      borderWidth: 1,
      borderColor: themeColors.border,
      backgroundColor: themeColors.inputBg,
      minWidth: FILTER_MIN_WIDTH + 14,
      minHeight: FILTER_MIN_HEIGHT,
      flexShrink: 0,
      alignItems: 'center',
      justifyContent: 'center',
    },
    segmentContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    segmentActive: {
      backgroundColor: themeColors.surface,
      borderColor: themeColors.primary,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.12,
      shadowRadius: 4,
      elevation: 4,
    },
    segmentText: {
      fontSize: 13,
      lineHeight: 18,
      fontWeight: '600',
      color: themeColors.textMuted,
    },
    segmentTextActive: {
      color: themeColors.primary,
      fontWeight: '800',
    },
    countBadge: {
      minWidth: 22,
      height: 22,
      borderRadius: BORDER_RADIUS.full,
      backgroundColor: themeColors.surface,
      borderWidth: 1,
      borderColor: themeColors.border,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 6,
    },
    countBadgeActive: {
      borderColor: themeColors.primary,
      backgroundColor: theme === 'dark' ? '#0F766E33' : '#F0FDFA',
    },
    countText: {
      fontSize: 11,
      fontWeight: '700',
      color: themeColors.textMuted,
    },
    countTextActive: {
      color: themeColors.primary,
    },
  });
}
