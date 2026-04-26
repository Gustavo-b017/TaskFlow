import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface EmptyStateProps {
  message: string;
  icon?: string;
}

export function EmptyState({ message, icon = '📋' }: EmptyStateProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

function createStyles(theme: 'light' | 'dark') {
  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 32,
    },
    icon: {
      fontSize: 48,
      marginBottom: 16,
    },
    message: {
      fontSize: 16,
      textAlign: 'center',
      color: theme === 'dark' ? '#9CA3AF' : '#6B7280',
    },
  });
}
