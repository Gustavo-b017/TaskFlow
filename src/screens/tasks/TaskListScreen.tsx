import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { TaskStackParamList } from '../../types/navigation';
import type { Task, TaskStatus } from '../../types/task';
import { Header } from '../../components/Header';
import { CustomButton } from '../../shared/components/CustomButton';
import { EmptyState } from '../../shared/components/EmptyState';
import { StatusBadge } from '../../shared/components/StatusBadge';
import { useAuth } from '../../hooks/useAuth';
import { useTasks } from '../../hooks/useTasks';
import { useTheme } from '../../hooks/useTheme';

type ListNav = NativeStackNavigationProp<TaskStackParamList, 'TaskList'>;

type FilterOption = 'all' | TaskStatus;

const FILTER_OPTIONS: { label: string; value: FilterOption }[] = [
  { label: 'Todos', value: 'all' },
  { label: 'Pendente', value: 'pendente' },
  { label: 'Em andamento', value: 'em_andamento' },
  { label: 'Concluída', value: 'concluida' },
];

interface TaskCardProps {
  task: Task;
  onPress: (id: string) => void;
  index: number;
  styles: any; 
}

function TaskCard({ task, onPress, index, styles }: TaskCardProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      delay: index * 50,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim, index]);

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }}>
      <Pressable
        onPress={() => onPress(task.id)}
        style={({ pressed }) => [
          styles.card,
          {
            transform: [{ scale: pressed ? 0.97 : 1 }],
            opacity: pressed ? 0.9 : 1,
          }
        ]}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle} numberOfLines={1}>{task.title}</Text>
          <Text style={styles.cardIcon}>{task.categoryIcon}</Text>
        </View>
        <Text style={styles.cardCategory}>{task.category}</Text>
        <View style={styles.cardFooter}>
          <StatusBadge status={task.status} />
          <Text style={styles.cardPriority}>{task.priority}</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

export default function TaskListScreen() {
  const navigation = useNavigation<ListNav>();
  const { user } = useAuth();
  const { tasks, loading } = useTasks();
  const { theme } = useTheme();
  const isAdmin = user?.role === 'admin';

  const [selectedFilter, setSelectedFilter] = useState<FilterOption>('all');

  const filteredTasks: Task[] =
    selectedFilter === 'all'
      ? tasks
      : tasks.filter((t) => t.status === selectedFilter);

  const styles = createStyles(theme);

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <Header title="Tarefas" />
        <View style={styles.loadingContent}>
          <ActivityIndicator size="large" color={theme === 'dark' ? '#FFFFFF' : '#007AFF'} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <Header title="Tarefas" />

      <View style={styles.filterRow}>
        {FILTER_OPTIONS.map((opt) => (
          <Pressable
            key={opt.value}
            onPress={() => setSelectedFilter(opt.value)}
            style={({ pressed }) => [
              styles.filterChip,
              selectedFilter === opt.value && styles.filterChipSelected,
              { transform: [{ scale: pressed ? 0.95 : 1 }] }
            ]}
          >
            <Text style={[styles.filterChipText, selectedFilter === opt.value && styles.filterChipTextSelected]}>
              {opt.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={filteredTasks.length === 0 ? styles.emptyContent : styles.listContent}
        renderItem={({ item, index }) => (
          <TaskCard 
            task={item} 
            onPress={(id) => navigation.navigate('TaskDetail', { taskId: id })} 
            index={index} 
            styles={styles} 
          />
        )}
        ListEmptyComponent={
          <EmptyState message="Nenhuma tarefa encontrada." icon="📋" />
        }
      />

      {isAdmin && (
        <View style={styles.footer}>
          <CustomButton
            title="Nova Tarefa"
            onPress={() => navigation.navigate('TaskForm', {})}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

function createStyles(theme: 'light' | 'dark') {
  const isDark = theme === 'dark';
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: isDark ? '#121212' : '#F2F2F7' },
    loadingContent: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    filterRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#374151' : '#E5E5EA',
    },
    filterChip: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: isDark ? '#4B5563' : '#CCCCCC',
      backgroundColor: isDark ? '#374151' : '#FFFFFF',
    },
    filterChipSelected: { borderColor: '#3B82F6', backgroundColor: '#3B82F6' },
    filterChipText: { fontSize: 13, color: isDark ? '#D1D5DB' : '#333333' },
    filterChipTextSelected: { color: '#FFFFFF', fontWeight: '600' },
    listContent: { padding: 16, gap: 12, paddingBottom: 96 },
    emptyContent: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    card: {
      backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
      borderRadius: 12,
      padding: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 4,
      elevation: 2,
    },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
    cardTitle: { fontSize: 16, fontWeight: '600', color: isDark ? '#F9FAFB' : '#1C1C1E', flex: 1 },
    cardIcon: { fontSize: 20, marginLeft: 8 },
    cardCategory: { fontSize: 13, color: isDark ? '#9CA3AF' : '#8E8E93', marginBottom: 8 },
    cardFooter: { flexDirection: 'row', gap: 8, alignItems: 'center', marginTop: 8 },
    cardPriority: { fontSize: 12, color: isDark ? '#9CA3AF' : '#8E8E93', marginLeft: 'auto' },
    footer: { position: 'absolute', bottom: 24, left: 16, right: 16 },
  });
}
