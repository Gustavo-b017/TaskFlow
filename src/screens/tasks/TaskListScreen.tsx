import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { TaskStackParamList } from '../../types/navigation';
import type { Task, TaskStatus } from '../../types/task';
import { Header } from '../../components/Header';
import { CustomButton } from '../../shared/components/CustomButton';
import { useAuth } from '../../hooks/useAuth';
import { useTasks } from '../../hooks/useTasks';

type ListNav = NativeStackNavigationProp<TaskStackParamList, 'TaskList'>;

type FilterOption = 'all' | TaskStatus;

const FILTER_OPTIONS: { label: string; value: FilterOption }[] = [
  { label: 'Todos', value: 'all' },
  { label: 'Pendente', value: 'pendente' },
  { label: 'Em andamento', value: 'em_andamento' },
  { label: 'Concluída', value: 'concluida' },
];

export default function TaskListScreen() {
  const navigation = useNavigation<ListNav>();
  const { user } = useAuth();
  const { tasks, loading } = useTasks();
  const isAdmin = user?.role === 'admin';

  const [selectedFilter, setSelectedFilter] = useState<FilterOption>('all');

  const filteredTasks: Task[] =
    selectedFilter === 'all'
      ? tasks
      : tasks.filter((t) => t.status === selectedFilter);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Tarefas" />
        <View style={styles.loadingContent}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Tarefas" />

      <View style={styles.filterRow}>
        {FILTER_OPTIONS.map((opt) => (
          <TouchableOpacity
            key={opt.value}
            style={[styles.filterChip, selectedFilter === opt.value && styles.filterChipSelected]}
            onPress={() => setSelectedFilter(opt.value)}
            testID={`filter-${opt.value}`}
          >
            <Text style={[styles.filterChipText, selectedFilter === opt.value && styles.filterChipTextSelected]}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={filteredTasks.length === 0 ? styles.emptyContent : styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('TaskDetail', { taskId: item.id })}
            testID={`task-card-${item.id}`}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
              <Text style={styles.cardIcon}>{item.categoryIcon}</Text>
            </View>
            <Text style={styles.cardCategory}>{item.category}</Text>
            <View style={styles.cardFooter}>
              <Text style={styles.cardStatus}>{item.status.replace('_', ' ')}</Text>
              <Text style={styles.cardPriority}>{item.priority}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhuma tarefa encontrada.</Text>
        }
      />

      {isAdmin && (
        <View style={styles.footer}>
          <CustomButton
            label="Nova Tarefa"
            onPress={() => navigation.navigate('TaskForm', {})}
            testID="btn-nova-tarefa"
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7' },
  loadingContent: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    backgroundColor: '#FFFFFF',
  },
  filterChipSelected: { borderColor: '#007AFF', backgroundColor: '#007AFF' },
  filterChipText: { fontSize: 13, color: '#333333' },
  filterChipTextSelected: { color: '#FFFFFF', fontWeight: '600' },
  listContent: { padding: 16, gap: 12, paddingBottom: 96 },
  emptyContent: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  emptyText: { fontSize: 16, color: '#8E8E93', textAlign: 'center' },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#1C1C1E', flex: 1 },
  cardIcon: { fontSize: 20, marginLeft: 8 },
  cardCategory: { fontSize: 13, color: '#8E8E93', marginBottom: 8 },
  cardFooter: { flexDirection: 'row', gap: 8 },
  cardStatus: { fontSize: 12, color: '#007AFF', fontWeight: '500', textTransform: 'capitalize' },
  cardPriority: { fontSize: 12, color: '#8E8E93' },
  footer: { position: 'absolute', bottom: 24, left: 16, right: 16 },
});
