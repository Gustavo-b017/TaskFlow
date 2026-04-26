import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { TaskStackParamList } from '../../types/navigation';
import type { Task } from '../../types/task';
import { Header } from '../../components/Header';
import { TaskCard } from '../../components/TaskCard';
import { FilterBar, type FilterOption } from '../../components/FilterBar';
import { TaskSkeleton } from '../../components/TaskSkeleton';
import { CustomButton } from '../../shared/components/CustomButton';
import { EmptyState } from '../../shared/components/EmptyState';
import { useAuth } from '../../hooks/useAuth';
import { useTasks } from '../../hooks/useTasks';
import { useTheme } from '../../hooks/useTheme';

type ListNav = NativeStackNavigationProp<TaskStackParamList, 'TaskList'>;

export default function TaskListScreen() {
  const navigation = useNavigation<ListNav>();
  const { user, signOut } = useAuth();
  const { tasks, loading, loadTasks } = useTasks();
  const { theme } = useTheme();
  const isAdmin = user?.role === 'admin';

  const [selectedFilter, setSelectedFilter] = useState<FilterOption>('all');
  const [refreshing, setRefreshing] = useState(false);

  const filteredTasks: Task[] = (selectedFilter === 'all'
    ? tasks
    : tasks.filter((t) => t.status === selectedFilter)
  ).slice().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const listStyles = createStyles(theme);

  async function onRefresh() {
    setRefreshing(true);
    try {
      await loadTasks();
    } finally {
      setRefreshing(false);
    }
  }

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={listStyles.container} edges={['top', 'left', 'right']}>
        <Header 
          userName={user?.name ?? ''} 
          role={user?.role ?? 'user'} 
          onLogout={signOut} 
          title="Tarefas"
        />
        <View style={{ marginTop: 16 }}>
          {[1, 2, 3, 4].map((i) => <TaskSkeleton key={i} theme={theme} />)}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={listStyles.container} edges={['top', 'left', 'right']}>
      <Header 
        userName={user?.name ?? ''} 
        role={user?.role ?? 'user'} 
        onLogout={signOut} 
        title="Tarefas"
      />

      <FilterBar selected={selectedFilter} onSelect={setSelectedFilter} />

      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={filteredTasks.length === 0 ? listStyles.emptyContent : listStyles.listContent}
        renderItem={({ item }) => (
          <TaskCard 
            task={item} 
            onPress={(id) => navigation.navigate('TaskDetail', { taskId: id })} 
          />
        )}
        ListEmptyComponent={
          <EmptyState message="Nenhuma tarefa encontrada." icon="📋" />
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#3B82F6']}
            tintColor="#3B82F6"
          />
        }
      />

      {isAdmin && (
        <View style={listStyles.footer}>
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
    listContent: { paddingVertical: 12, paddingBottom: 96 },
    emptyContent: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    footer: { position: 'absolute', bottom: 24, left: 16, right: 16 },
  });
}
