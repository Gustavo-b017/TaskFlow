import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Platform, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as LucideIcons from 'lucide-react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { TaskStackParamList } from '../../types/navigation';
import type { TaskPriority, TaskStatus } from '../../types/task';
import { CustomButton } from '../../shared/components/CustomButton';
import { StatusBadge } from '../../shared/components/StatusBadge';
import { useAuth } from '../../hooks/useAuth';
import { useTasks } from '../../hooks/useTasks';
import { useTheme } from '../../hooks/useTheme';
import { formatDate } from '../../shared/utils/formatDate';
import { resolveLucideIcon } from '../../shared/utils/iconRegistry';
import { COLORS, BORDER_RADIUS, SPACING } from '../../styles/theme';

type DetailNav = NativeStackNavigationProp<TaskStackParamList, 'TaskDetail'>;
type DetailRoute = RouteProp<TaskStackParamList, 'TaskDetail'>;

const PRIORITY_LABELS: Record<TaskPriority, string> = {
  baixa: 'Baixa',
  media: 'Media',
  alta: 'Alta',
};

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: 'pendente', label: 'Pendente' },
  { value: 'em_andamento', label: 'Em andamento' },
  { value: 'concluida', label: 'Concluida' },
];

export function TaskDetailScreen() {
  const navigation = useNavigation<DetailNav>();
  const route = useRoute<DetailRoute>();
  const { tasks, removeTask, updateTask } = useTasks();
  const { user } = useAuth();
  const { theme } = useTheme();
  const themeColors = COLORS[theme];
  const isAdmin = user?.role === 'admin';
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const { taskId } = route.params;
  const task = tasks.find((t) => t.id === taskId);

  const styles = createStyles(theme);

  if (!task) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContent}>
          <Text style={styles.errorText}>Tarefa nao encontrada.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const currentTask = task;
  const IconComponent = resolveLucideIcon(currentTask.categoryIcon);

  async function handleDelete() {
    const message = 'Tem certeza que deseja excluir esta tarefa?';

    if (Platform.OS === 'web') {
      const confirmed = window.confirm(message);
      if (confirmed) {
        try {
          await removeTask(currentTask.id);
          navigation.goBack();
        } catch {
          Alert.alert('Erro', 'Nao foi possivel excluir a tarefa.');
        }
      }
      return;
    }

    Alert.alert('Excluir tarefa', message, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await removeTask(currentTask.id);
            navigation.goBack();
          } catch {
            Alert.alert('Erro', 'Nao foi possivel excluir a tarefa.');
          }
        },
      },
    ]);
  }

  function handleEdit() {
    navigation.navigate('TaskForm', { taskId: currentTask.id });
  }

  async function handleQuickStatusChange(nextStatus: TaskStatus) {
    if (currentTask.status === nextStatus || updatingStatus) return;

    setUpdatingStatus(true);
    try {
      await updateTask(currentTask.id, { status: nextStatus });
    } catch {
      Alert.alert('Erro', 'Nao foi possivel atualizar o status da tarefa.');
    } finally {
      setUpdatingStatus(false);
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.navHeader}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          accessibilityRole="button"
          accessibilityLabel="Voltar para lista de tarefas"
        >
          <LucideIcons.ChevronLeft size={24} color={themeColors.text} strokeWidth={2.5} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Detalhes</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.mainInfoCard}>
          <View style={styles.categoryHeader}>
            <View style={[styles.iconWrapper, { backgroundColor: `${themeColors.primary}15` }]}>
              <IconComponent size={28} color={themeColors.primary} strokeWidth={2.5} />
            </View>
            <View>
              <Text style={styles.categoryLabel}>{currentTask.category || 'Sem categoria'}</Text>
              <StatusBadge status={currentTask.status} />
            </View>
          </View>

          <Text style={styles.title}>{currentTask.title}</Text>

          {currentTask.description ? (
            <Text style={styles.description}>{currentTask.description}</Text>
          ) : (
            <Text style={[styles.description, { fontStyle: 'italic', opacity: 0.7 }]}>Sem descricao informada.</Text>
          )}
        </View>

        <View style={styles.metaGrid}>
          <View style={styles.metaItem}>
            <LucideIcons.BarChart2 size={20} color={themeColors.textMuted} />
            <View style={styles.metaContent}>
              <Text style={styles.metaLabel}>Prioridade</Text>
              <Text
                style={[
                  styles.metaValue,
                  {
                    color:
                      currentTask.priority === 'alta'
                        ? themeColors.error
                        : currentTask.priority === 'media'
                          ? themeColors.accent
                          : themeColors.success,
                  },
                ]}
              >
                {PRIORITY_LABELS[currentTask.priority]}
              </Text>
            </View>
          </View>

          <View style={styles.metaItem}>
            <LucideIcons.Calendar size={20} color={themeColors.textMuted} />
            <View style={styles.metaContent}>
              <Text style={styles.metaLabel}>Criado em</Text>
              <Text style={styles.metaValue}>{formatDate(currentTask.createdAt)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.quickStatusCard}>
          <Text style={styles.quickStatusTitle}>Atualizar status</Text>
          <View style={styles.quickStatusRow}>
            {STATUS_OPTIONS.map((statusOption) => {
              const isActive = currentTask.status === statusOption.value;
              return (
                <TouchableOpacity
                  key={statusOption.value}
                  onPress={() => handleQuickStatusChange(statusOption.value)}
                  style={[styles.quickStatusChip, isActive && styles.quickStatusChipActive]}
                  activeOpacity={0.85}
                  disabled={isActive || updatingStatus}
                  accessibilityRole="button"
                  accessibilityLabel={`Definir status ${statusOption.label}`}
                  accessibilityState={{ selected: isActive, disabled: isActive || updatingStatus }}
                >
                  <Text style={[styles.quickStatusChipText, isActive && styles.quickStatusChipTextActive]}>
                    {statusOption.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {isAdmin && (
          <View style={styles.actions}>
            <CustomButton title="Editar Tarefa" onPress={handleEdit} />
            <CustomButton title="Excluir" variant="danger" onPress={handleDelete} />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles(theme: 'light' | 'dark') {
  const themeColors = COLORS[theme];
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: themeColors.background },
    navHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.sm,
    },
    backBtn: {
      width: 44,
      height: 44,
      borderRadius: 12,
      backgroundColor: themeColors.surface,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: themeColors.border,
    },
    navTitle: {
      fontSize: 17,
      fontWeight: '700',
      color: themeColors.text,
    },
    content: { padding: SPACING.lg, paddingBottom: 40 },
    mainInfoCard: {
      backgroundColor: themeColors.surface,
      borderRadius: BORDER_RADIUS.lg,
      padding: SPACING.lg,
      borderWidth: 1.5,
      borderColor: themeColors.border,
      marginBottom: SPACING.lg,
    },
    categoryHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.md,
      marginBottom: SPACING.lg,
    },
    iconWrapper: {
      width: 60,
      height: 60,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    categoryLabel: {
      fontSize: 13,
      fontWeight: '700',
      color: themeColors.textMuted,
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: 4,
    },
    title: {
      fontSize: 26,
      fontWeight: '800',
      color: themeColors.text,
      marginBottom: SPACING.md,
      letterSpacing: -0.5,
    },
    description: {
      fontSize: 16,
      color: themeColors.text,
      lineHeight: 24,
      opacity: 0.9,
    },
    metaGrid: {
      gap: SPACING.md,
      marginBottom: SPACING.lg,
    },
    metaItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: themeColors.surface,
      borderRadius: BORDER_RADIUS.md,
      padding: SPACING.md,
      borderWidth: 1,
      borderColor: themeColors.border,
      gap: SPACING.md,
    },
    metaContent: {
      flex: 1,
    },
    metaLabel: {
      fontSize: 11,
      fontWeight: '600',
      color: themeColors.textMuted,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    metaValue: {
      fontSize: 15,
      fontWeight: '700',
      color: themeColors.text,
      marginTop: 2,
    },
    quickStatusCard: {
      marginBottom: SPACING.xl,
      borderRadius: BORDER_RADIUS.md,
      borderWidth: 1,
      borderColor: themeColors.border,
      backgroundColor: themeColors.surface,
      padding: SPACING.md,
      gap: SPACING.sm,
    },
    quickStatusTitle: {
      fontSize: 12,
      fontWeight: '700',
      color: themeColors.textMuted,
      letterSpacing: 0.5,
      textTransform: 'uppercase',
    },
    quickStatusRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: SPACING.sm,
    },
    quickStatusChip: {
      borderRadius: BORDER_RADIUS.full,
      borderWidth: 1,
      borderColor: themeColors.border,
      backgroundColor: themeColors.inputBg,
      paddingHorizontal: 14,
      paddingVertical: 8,
    },
    quickStatusChipActive: {
      borderColor: themeColors.primary,
      backgroundColor: theme === 'dark' ? '#0F766E33' : '#F0FDFA',
    },
    quickStatusChipText: {
      fontSize: 12,
      fontWeight: '700',
      color: themeColors.textMuted,
    },
    quickStatusChipTextActive: {
      color: themeColors.primary,
    },
    errorContent: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    errorText: { fontSize: 16, color: themeColors.textMuted },
    actions: { gap: 8 },
  });
}
