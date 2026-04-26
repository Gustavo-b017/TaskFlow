import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { COLORS, SPACING } from '../../styles/theme';
import { resolveLucideIcon } from '../utils/iconRegistry';

interface EmptyStateProps {
  message: string;
  iconName?: string;
}

export function EmptyState({ message, iconName = 'ClipboardList' }: EmptyStateProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const themeColors = COLORS[theme];

  const Icon = resolveLucideIcon(iconName);

  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>
        <Icon size={48} color={themeColors.textMuted} strokeWidth={1.5} />
      </View>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

function createStyles(theme: 'light' | 'dark') {
  const themeColors = COLORS[theme];
  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: SPACING.xl,
    },
    iconWrapper: {
      marginBottom: SPACING.md,
      opacity: 0.5,
    },
    message: {
      fontSize: 15,
      fontWeight: '600',
      textAlign: 'center',
      color: themeColors.textMuted,
      lineHeight: 22,
      maxWidth: '80%',
    },
  });
}
