import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

type StatusValue = 'pendente' | 'em_andamento' | 'concluida';

interface StatusBadgeProps {
  status: StatusValue;
}

const STATUS_CONFIG: Record<StatusValue, { label: string; light: string; dark: string }> = {
  pendente:     { label: 'Pendente',      light: '#EF4444', dark: '#F87171' },
  em_andamento: { label: 'Em andamento',  light: '#F59E0B', dark: '#FCD34D' },
  concluida:    { label: 'Concluída',     light: '#10B981', dark: '#34D399' },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const { theme } = useTheme();
  const config = STATUS_CONFIG[status];
  const bgColor = config[theme];

  return (
    <View style={[styles.badge, { backgroundColor: bgColor }]}>
      <Text style={styles.label}>{config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  label: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});
