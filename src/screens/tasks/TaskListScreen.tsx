import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import * as LucideIcons from 'lucide-react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { TaskStackParamList } from '../../types/navigation';
import type { Task } from '../../types/task';
import { Header } from '../../components/Header';
import { TaskCard } from '../../components/TaskCard';
import { FilterBar, type FilterOption } from '../../components/FilterBar';
import { TaskSkeleton } from '../../components/TaskSkeleton';
import { EmptyState } from '../../shared/components/EmptyState';
import { useAuth } from '../../hooks/useAuth';
import { useTasks } from '../../hooks/useTasks';
import { useTheme } from '../../hooks/useTheme';
import { COLORS, SPACING } from '../../styles/theme';

type ListNav = NativeStackNavigationProp<TaskStackParamList, 'TaskList'>;

const STATUS_TITLES = {
  all: 'Todas',
  pendente: 'Pendentes',
  em_andamento: 'Em andamento',
  concluida: 'Concluidas',
} as const;

export default function TaskListScreen() {
  const navigation = useNavigation<ListNav>();
  const { user } = useAuth();
  const { tasks, loading, loadTasks } = useTasks();
  const { theme } = useTheme();
  const themeColors = COLORS[theme];

  const [selectedFilter, setSelectedFilter] = useState<FilterOption>('all');
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const taskCounters = useMemo(() => {
    const counters = {
      all: tasks.length,
      pendente: 0,
      em_andamento: 0,
      concluida: 0,
    };

    tasks.forEach((task) => {
      counters[task.status] += 1;
    });

    return counters;
  }, [tasks]);

  const filteredTasks: Task[] = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return (selectedFilter === 'all'
      ? tasks
      : tasks.filter((t) => t.status === selectedFilter))
      .filter((task) => {
        if (!normalizedQuery) return true;
        const searchable = `${task.title} ${task.description} ${task.category}`.toLowerCase();
        return searchable.includes(normalizedQuery);
      })
      .slice()
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [selectedFilter, searchQuery, tasks]);

  const listStyles = createStyles(theme);

  async function onRefresh() {
    setRefreshing(true);
    try {
      await loadTasks();
    } finally {
      setRefreshing(false);
    }
  }

  const clearSearch = useCallback(() => setSearchQuery(''), []);
  const renderTaskItem = useCallback(
    ({ item }: { item: Task }) => (
      <TaskCard
        task={item}
        onPress={(id) => navigation.navigate('TaskDetail', { taskId: id })}
      />
    ),
    [navigation]
  );
  const keyExtractor = useCallback((item: Task) => item.id, []);

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={listStyles.container} edges={['top', 'left', 'right']}>
        <Header
          userName={user?.name ?? ''}
          role={user?.role ?? 'user'}
          title="Minhas Tarefas"
          showSearch
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          onClearSearch={clearSearch}
          searchPlaceholder="Pesquisar tarefa"
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
        title="Minhas Tarefas"
        showSearch
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        onClearSearch={clearSearch}
        searchPlaceholder="Pesquisar tarefa"
      />

      <View style={listStyles.insightsRow}>
        <View style={listStyles.insightCard}>
          <Text style={listStyles.insightValue}>{taskCounters.all}</Text>
          <Text style={listStyles.insightLabel}>{STATUS_TITLES.all}</Text>
        </View>
        <View style={listStyles.insightCard}>
          <Text style={listStyles.insightValue}>{taskCounters.pendente}</Text>
          <Text style={listStyles.insightLabel}>{STATUS_TITLES.pendente}</Text>
        </View>
        <View style={listStyles.insightCard}>
          <Text style={listStyles.insightValue}>{taskCounters.em_andamento}</Text>
          <Text style={listStyles.insightLabel}>{STATUS_TITLES.em_andamento}</Text>
        </View>
      </View>

      <FilterBar selected={selectedFilter} onSelect={setSelectedFilter} counts={taskCounters} />

      <FlatList
        style={listStyles.list}
        data={filteredTasks}
        keyExtractor={keyExtractor}
        contentContainerStyle={
          filteredTasks.length === 0
            ? listStyles.emptyContent
            : [listStyles.listContent, listStyles.listContentWithFab]
        }
        renderItem={renderTaskItem}
        ListEmptyComponent={
          <EmptyState
            message={
              searchQuery.trim().length > 0
                ? 'Nenhuma tarefa encontrada com os termos pesquisados.'
                : 'Fique tranquilo. Nenhuma tarefa por aqui no momento.'
            }
            iconName={searchQuery.trim().length > 0 ? 'SearchX' : 'ClipboardList'}
          />
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[themeColors.primary]}
            tintColor={themeColors.primary}
          />
        }
        keyboardShouldPersistTaps="handled"
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        windowSize={10}
        removeClippedSubviews
      />

      <View style={listStyles.fabContainer}>
        <TouchableOpacity
          style={listStyles.fab}
          onPress={() => navigation.navigate('TaskForm', {})}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Criar nova tarefa"
        >
          <LucideIcons.Plus color="#FFFFFF" size={28} strokeWidth={3} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function createStyles(theme: 'light' | 'dark') {
  const themeColors = COLORS[theme];
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: themeColors.background },
    list: { flex: 1 },
    insightsRow: {
      flexDirection: 'row',
      marginTop: SPACING.sm,
      marginHorizontal: SPACING.md,
      gap: SPACING.sm,
    },
    insightCard: {
      flex: 1,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: themeColors.border,
      backgroundColor: themeColors.surface,
      paddingHorizontal: 12,
      paddingVertical: 10,
    },
    insightValue: {
      fontSize: 22,
      fontWeight: '800',
      color: themeColors.text,
      letterSpacing: -0.4,
    },
    insightLabel: {
      fontSize: 12,
      fontWeight: '600',
      color: themeColors.textMuted,
      marginTop: 2,
    },
    listContent: { paddingVertical: 12, paddingBottom: 120 },
    listContentWithFab: {
      paddingBottom: 176,
    },
    emptyContent: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    fabContainer: {
      position: 'absolute',
      bottom: 106,
      right: SPACING.lg,
    },
    fab: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: themeColors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: themeColors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
  });
}
