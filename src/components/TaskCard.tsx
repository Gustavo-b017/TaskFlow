import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { StatusBadge } from '../shared/components/StatusBadge';
import { formatDate } from '../shared/utils/formatDate';
import { useTheme } from '../hooks/useTheme';
import type { Task } from '../types/task';

interface TaskCardProps {
  task: Task;
  onPress: (taskId: string) => void;
}

export function TaskCard({ task, onPress }: TaskCardProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(task.id)}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={1}>{task.title}</Text>
        <Text style={styles.icon}>{task.categoryIcon}</Text>
      </View>
      <StatusBadge status={task.status} />
      <View style={styles.content}>
        <Text style={styles.meta}>Categoria: {task.category}</Text>
        <Text style={styles.meta}>Prioridade: {task.priority}</Text>
        <Text style={styles.meta}>Criado: {formatDate(task.createdAt)}</Text>
        <Text style={styles.meta}>Atualizado: {formatDate(task.updatedAt)}</Text>
      </View>
    </TouchableOpacity>
  );
}

function createStyles(theme: 'light' | 'dark') {
  return StyleSheet.create({
    card: {
      backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
      borderRadius: 12,
      padding: 16,
      marginVertical: 6,
      marginHorizontal: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 4,
      elevation: 2,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    title: {
      fontSize: 16,
      fontWeight: '600',
      color: theme === 'dark' ? '#F9FAFB' : '#111827',
      flex: 1,
    },
    icon: {
      fontSize: 20,
      marginLeft: 8,
    },
    content: {
      marginTop: 8,
    },
    meta: {
      fontSize: 12,
      color: theme === 'dark' ? '#9CA3AF' : '#6B7280',
      marginTop: 2,
    },
  });
}