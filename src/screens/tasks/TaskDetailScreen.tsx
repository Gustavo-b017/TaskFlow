import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { TaskStackParamList } from '../../types/navigation';
import { CustomButton } from '../../shared/components/CustomButton';
import { useAuth } from '../../hooks/useAuth';
import { useTasks } from '../../hooks/useTasks';

type DetailNav = NativeStackNavigationProp<TaskStackParamList, 'TaskDetail'>;
type DetailRoute = RouteProp<TaskStackParamList, 'TaskDetail'>;

const STATUS_LABELS: Record<string, string> = {
  pendente: 'Pendente',
  em_andamento: 'Em andamento',
  concluida: 'Concluída',
};

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
  const isAdmin = user?.role === 'admin';

  const { taskId } = route.params;
  const task = tasks.find((t) => t.id === taskId);

  if (!task) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContent}>
          <Text style={styles.errorText}>Tarefa não encontrada.</Text>
        </View>
      </SafeAreaView>
    );
  }

  function handleDelete() {
    Alert.alert(
      'Excluir tarefa',
      'Tem certeza que deseja excluir esta tarefa?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            await removeTask(task!.id);
            navigation.goBack();
          },
        },
      ]
    );
  }

  function handleEdit() {
    navigation.navigate('TaskForm', { taskId: task!.id });
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.icon}>{task.categoryIcon}</Text>
          <Text style={styles.category}>{task.category}</Text>
        </View>

        <Text style={styles.title}>{task.title}</Text>

        {task.description ? (
          <Text style={styles.description}>{task.description}</Text>
        ) : null}

        <View style={styles.metaRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeLabel}>Status</Text>
            <Text style={styles.badgeValue}>{STATUS_LABELS[task.status] ?? task.status}</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeLabel}>Prioridade</Text>
            <Text style={styles.badgeValue}>{PRIORITY_LABELS[task.priority] ?? task.priority}</Text>
          </View>
        </View>

        {isAdmin && (
          <View style={styles.actions}>
            <CustomButton label="Editar tarefa" onPress={handleEdit} testID="btn-edit" />
            <CustomButton label="Excluir tarefa" type="outline" onPress={handleDelete} testID="btn-delete" />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7' },
  content: { padding: 24, paddingBottom: 40 },
  errorContent: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 16, color: '#8E8E93' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  icon: { fontSize: 28 },
  category: { fontSize: 14, color: '#8E8E93' },
  title: { fontSize: 22, fontWeight: '700', color: '#1C1C1E', marginBottom: 12 },
  description: { fontSize: 16, color: '#444444', lineHeight: 24, marginBottom: 16 },
  metaRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  badge: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 12, padding: 12 },
  badgeLabel: { fontSize: 12, color: '#8E8E93', marginBottom: 4 },
  badgeValue: { fontSize: 15, fontWeight: '600', color: '#1C1C1E' },
  actions: { gap: 8 },
});
