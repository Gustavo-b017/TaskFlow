import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { TaskStackParamList } from '../../types/navigation';
import { CustomButton } from '../../shared/components/CustomButton';
import { StatusBadge } from '../../shared/components/StatusBadge';
import { useAuth } from '../../hooks/useAuth';
import { useTasks } from '../../hooks/useTasks';
import { useTheme } from '../../hooks/useTheme';
import { formatDate } from '../../shared/utils/formatDate';

type DetailNav = NativeStackNavigationProp<TaskStackParamList, 'TaskDetail'>;
type DetailRoute = RouteProp<TaskStackParamList, 'TaskDetail'>;

const PRIORITY_LABELS: Record<string, string> = {
  baixa: 'Baixa',
  media: 'Média',
  alta: 'Alta',
};

export function TaskDetailScreen() {
  const navigation = useNavigation<DetailNav>();
  const route = useRoute<DetailRoute>();
  const { tasks, removeTask } = useTasks();
  const { user } = useAuth();
  const { theme } = useTheme();
  const isAdmin = user?.role === 'admin';

  const { taskId } = route.params;
  const task = tasks.find((t) => t.id === taskId);

  const styles = createStyles(theme);

  if (!task) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContent}>
          <Text style={styles.errorText}>Tarefa não encontrada.</Text>
        </View>
      </SafeAreaView>
    );
  }

  async function handleDelete() {
    const message = 'Tem certeza que deseja excluir esta tarefa?';

    if (Platform.OS === 'web') {
      const confirmed = window.confirm(message);
      if (confirmed) {
        try {
          await removeTask(task!.id);
          navigation.goBack();
        } catch {
          Alert.alert('Erro', 'Não foi possível excluir a tarefa.');
        }
      }
      return;
    }

    Alert.alert(
      'Excluir tarefa',
      message,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeTask(task!.id);
              navigation.goBack();
            } catch {
              Alert.alert('Erro', 'Não foi possível excluir a tarefa.');
            }
          },
        },
      ]
    );
  }

  function handleEdit() {
    navigation.navigate('TaskForm', { taskId: task!.id });
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.icon}>{task.categoryIcon}</Text>
          <Text style={styles.category}>{task.category}</Text>
        </View>

        <Text style={styles.title}>{task.title}</Text>

        <View style={styles.badgeWrapper}>
          <StatusBadge status={task.status} />
        </View>

        {task.description ? (
          <Text style={styles.description}>{task.description}</Text>
        ) : null}

        <View style={styles.metaRow}>
          <View style={styles.badgeInfo}>
            <Text style={styles.badgeLabel}>Prioridade</Text>
            <Text style={styles.badgeValue}>{PRIORITY_LABELS[task.priority] ?? task.priority}</Text>
          </View>
        </View>

        <View style={styles.datesContainer}>
          <Text style={styles.dateText}>Criado em: {formatDate(task.createdAt)}</Text>
          <Text style={styles.dateText}>Atualizado em: {formatDate(task.updatedAt)}</Text>
        </View>

        {isAdmin && (
          <View style={styles.actions}>
            <CustomButton title="Editar" onPress={handleEdit} />
            <CustomButton title="Excluir" variant="danger" onPress={handleDelete} />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles(theme: 'light' | 'dark') {
  const isDark = theme === 'dark';
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: isDark ? '#121212' : '#F2F2F7' },
    content: { padding: 24, paddingBottom: 40 },
    errorContent: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    errorText: { fontSize: 16, color: isDark ? '#9CA3AF' : '#8E8E93' },
    header: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
    icon: { fontSize: 28 },
    category: { fontSize: 14, color: isDark ? '#D1D5DB' : '#8E8E93' },
    title: { fontSize: 24, fontWeight: '700', color: isDark ? '#F9FAFB' : '#1C1C1E', marginBottom: 12 },
    badgeWrapper: { marginBottom: 16 },
    description: { fontSize: 16, color: isDark ? '#E5E7EB' : '#444444', lineHeight: 24, marginBottom: 24 },
    metaRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
    badgeInfo: { flex: 1, backgroundColor: isDark ? '#1F2937' : '#FFFFFF', borderRadius: 12, padding: 12 },
    badgeLabel: { fontSize: 12, color: isDark ? '#9CA3AF' : '#8E8E93', marginBottom: 4 },
    badgeValue: { fontSize: 15, fontWeight: '600', color: isDark ? '#F9FAFB' : '#1C1C1E' },
    datesContainer: { marginBottom: 32 },
    dateText: { fontSize: 12, color: isDark ? '#9CA3AF' : '#8E8E93', marginBottom: 4 },
    actions: { gap: 8 },
  });
}
