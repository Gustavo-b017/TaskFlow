import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { COLORS, BORDER_RADIUS } from '../../styles/theme';

type StatusValue = 'pendente' | 'em_andamento' | 'concluida';

interface StatusBadgeProps {
  status: StatusValue;
}

const STATUS_CONFIG: Record<StatusValue, { label: string; colorKey: 'error' | 'accent' | 'success' }> = {
  pendente:     { label: 'Pendente',      colorKey: 'error' },
  em_andamento: { label: 'Em andamento',  colorKey: 'accent' },
  concluida:    { label: 'Concluída',     colorKey: 'success' },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const { theme } = useTheme();
  const themeColors = COLORS[theme];
  const config = STATUS_CONFIG[status];
  const mainColor = themeColors[config.colorKey];

  return (
    <View style={[styles.badge, { backgroundColor: `${mainColor}22`, borderColor: `${mainColor}44` }]}>
      <View style={[styles.dot, { backgroundColor: mainColor }]} />
      <Text style={[styles.label, { color: mainColor }]}>{config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
});
