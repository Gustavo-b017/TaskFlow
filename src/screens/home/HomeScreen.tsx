import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import * as LucideIcons from 'lucide-react-native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { TabParamList } from '../../types/navigation';
import type { Task } from '../../types/task';
import { useAuth } from '../../hooks/useAuth';
import { useTasks } from '../../hooks/useTasks';
import { useTheme } from '../../hooks/useTheme';
import { useTreatment } from '../../hooks/useTreatment';
import { fetchMotivationalQuote } from '../../services/api';
import { BORDER_RADIUS, COLORS, SPACING } from '../../styles/theme';

type HomeNav = BottomTabNavigationProp<TabParamList, 'Home'>;

const QUOTE_MAX_LINES = 4;
const PRIORITY_ORDER = { alta: 0, media: 1, baixa: 2 } as const;
const PRIORITY_LABELS = { alta: 'Alta', media: 'Média', baixa: 'Baixa' } as const;
const ACTIVE_TASKS_LIMIT = 3;

export default function HomeScreen() {
  const navigation = useNavigation<HomeNav>();
  const { user } = useAuth();
  const { tasks, loading: tasksLoading } = useTasks();
  const { theme } = useTheme();
  const { treatment } = useTreatment();
  const themeColors = COLORS[theme];

  const [quote, setQuote] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'pendente' | 'em_andamento'>('pendente');

  const pendingCount = useMemo(
    () => tasks.filter((task) => task.status !== 'concluida').length,
    [tasks]
  );

  const completedCount = useMemo(
    () => tasks.filter((task) => task.status === 'concluida').length,
    [tasks]
  );

  const pendingTabCount = useMemo(
    () => tasks.filter((t) => t.status === 'pendente').length,
    [tasks]
  );

  const inProgressTabCount = useMemo(
    () => tasks.filter((t) => t.status === 'em_andamento').length,
    [tasks]
  );

  const activeTasks = useMemo(
    () =>
      tasks
        .filter((t) => t.status === activeTab)
        .sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]),
    [tasks, activeTab]
  );

  const firstName = user?.name?.trim().split(/\s+/)[0] || 'Usuario';

  useEffect(() => {
    loadQuote();
  }, []);

  async function loadQuote() {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchMotivationalQuote();
      setQuote(result);
    } catch {
      setError('Nao foi possivel carregar a inspiracao de hoje.');
    } finally {
      setLoading(false);
    }
  }

  function goToTasks() {
    navigation.navigate('Tasks', { screen: 'TaskList' });
  }

  const styles = createStyles(theme);

  function getPriorityColor(priority: Task['priority']) {
    if (priority === 'alta') return themeColors.error;
    if (priority === 'media') return themeColors.accent;
    return themeColors.success;
  }

  function navigateToTask(taskId: string) {
    navigation.navigate('Tasks', {
      screen: 'TaskDetail',
      params: { taskId },
    });
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.welcomeCard}>
          <Text style={styles.greeting}>
            Ola{treatment ? `, ${treatment}` : ''} {firstName}!
          </Text>
          <Text style={styles.welcomeSubtitle}>O que vamos realizar hoje?</Text>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <LucideIcons.BarChart3 size={18} color={themeColors.primary} strokeWidth={2.5} />
            <Text style={styles.summaryTitle}>Resumo rapido</Text>
          </View>

          <View style={styles.metricsRow}>
            <View style={styles.metricCard}>
              <View style={[styles.metricIcon, { backgroundColor: `${themeColors.accent}22` }]}>
                <LucideIcons.Clock3 size={16} color={themeColors.accent} strokeWidth={2.5} />
              </View>
              <Text style={styles.metricLabel}>Pendentes</Text>
              <Text style={styles.metricValue}>{tasksLoading ? '--' : pendingCount}</Text>
            </View>

            <View style={styles.metricCard}>
              <View style={[styles.metricIcon, { backgroundColor: `${themeColors.success}22` }]}>
                <LucideIcons.CheckCircle2 size={16} color={themeColors.success} strokeWidth={2.5} />
              </View>
              <Text style={styles.metricLabel}>Concluidas</Text>
              <Text style={styles.metricValue}>{tasksLoading ? '--' : completedCount}</Text>
            </View>
          </View>
        </View>

        <View style={styles.quoteCard}>
          <View style={styles.quoteHeader}>
            <View style={styles.quoteTitleRow}>
              <LucideIcons.Quote size={18} color={themeColors.primary} strokeWidth={2.5} />
              <Text style={styles.sectionTitle}>Inspiracao</Text>
            </View>

            <TouchableOpacity
              onPress={loadQuote}
              style={styles.refreshBtn}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Atualizar inspiracao"
            >
              <LucideIcons.RefreshCw size={16} color={themeColors.primary} strokeWidth={2.5} />
            </TouchableOpacity>
          </View>

          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={themeColors.primary} />
            </View>
          )}

          {error && !loading && (
            <View style={styles.errorContainer}>
              <Text style={styles.error}>{error}</Text>
            </View>
          )}

          {quote && !loading && (
            <Text style={styles.quote} numberOfLines={QUOTE_MAX_LINES} ellipsizeMode="tail">
              "{quote}"
            </Text>
          )}

          {!quote && !loading && !error && (
            <Text style={styles.quotePlaceholder}>Toque no botao para carregar uma frase.</Text>
          )}
        </View>

        <View style={styles.actionsGrid}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={goToTasks}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Abrir tarefas"
          >
            <View style={[styles.actionIcon, { backgroundColor: `${themeColors.primary}22` }]}>
              <LucideIcons.ListTodo size={30} color={themeColors.primary} strokeWidth={2.5} />
            </View>
            <Text style={styles.actionTitle}>Tarefas</Text>
            <Text style={styles.actionDesc}>Gerencie seus afazeres</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('Settings')}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Abrir ajustes"
          >
            <View style={[styles.actionIcon, { backgroundColor: `${themeColors.accent}22` }]}>
              <LucideIcons.Settings size={30} color={themeColors.accent} strokeWidth={2.5} />
            </View>
            <Text style={styles.actionTitle}>Ajustes</Text>
            <Text style={styles.actionDesc}>Preferencias e tema</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.activeTasksCard}>
          <View style={styles.activeTasksHeader}>
            <View style={styles.activeTitleRow}>
              <View style={styles.activeTitleIcon}>
                <LucideIcons.Zap size={13} color={themeColors.primary} strokeWidth={3} />
              </View>
              <Text style={styles.activeTasksTitle}>Tarefas Ativas</Text>
              {!tasksLoading && activeTasks.length > 0 && (
                <View style={styles.activeCountBadge}>
                  <Text style={styles.activeCountText}>{activeTasks.length}</Text>
                </View>
              )}
            </View>
            <View style={styles.tabSwitcher}>
              <TouchableOpacity
                style={[styles.tabBtn, activeTab === 'pendente' && styles.tabBtnActive]}
                onPress={() => setActiveTab('pendente')}
                activeOpacity={0.7}
              >
                <Text style={[styles.tabBtnText, activeTab === 'pendente' && styles.tabBtnTextActive]}>
                  Pendentes{pendingTabCount > 0 ? ` ${pendingTabCount}` : ''}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tabBtn, activeTab === 'em_andamento' && styles.tabBtnActive]}
                onPress={() => setActiveTab('em_andamento')}
                activeOpacity={0.7}
              >
                <Text style={[styles.tabBtnText, activeTab === 'em_andamento' && styles.tabBtnTextActive]}>
                  Andamento{inProgressTabCount > 0 ? ` ${inProgressTabCount}` : ''}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.activeTasksDivider} />

          {tasksLoading && (
            <View style={styles.miniLoadingContainer}>
              <ActivityIndicator size="small" color={themeColors.primary} />
            </View>
          )}

          {!tasksLoading && activeTasks.length === 0 && (
            <View style={styles.miniEmptyContainer}>
              <LucideIcons.CheckCircle2 size={20} color={themeColors.success} strokeWidth={2.5} />
              <Text style={styles.miniEmptyText}>
                {activeTab === 'pendente' ? 'Nenhuma tarefa pendente.' : 'Nenhuma em andamento.'}
              </Text>
            </View>
          )}

          {!tasksLoading && activeTasks.slice(0, ACTIVE_TASKS_LIMIT).map((task) => {
            const pc = getPriorityColor(task.priority);
            return (
              <TouchableOpacity
                key={task.id}
                style={styles.miniCard}
                onPress={() => navigateToTask(task.id)}
                activeOpacity={0.6}
                accessibilityRole="button"
                accessibilityLabel={`Abrir tarefa ${task.title}`}
              >
                <View style={[styles.miniCardAccent, { backgroundColor: pc }]} />
                <View style={styles.miniCardContent}>
                  <Text style={styles.miniCardTitle} numberOfLines={1}>{task.title}</Text>
                  <Text style={styles.miniCardCategory} numberOfLines={1}>{task.category}</Text>
                </View>
                <View style={[styles.miniPriorityPill, { borderColor: `${pc}55`, backgroundColor: `${pc}18` }]}>
                  <Text style={[styles.miniPriorityText, { color: pc }]}>{PRIORITY_LABELS[task.priority]}</Text>
                </View>
                <LucideIcons.ChevronRight size={16} color={themeColors.textMuted} strokeWidth={2.5} />
              </TouchableOpacity>
            );
          })}

          {!tasksLoading && activeTasks.length > ACTIVE_TASKS_LIMIT && (
            <TouchableOpacity style={styles.seeMoreBtn} onPress={goToTasks} activeOpacity={0.7}>
              <Text style={styles.seeMoreText}>
                Ver mais {activeTasks.length - ACTIVE_TASKS_LIMIT} tarefas
              </Text>
              <LucideIcons.ArrowRight size={14} color={themeColors.primary} strokeWidth={2.5} />
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles(theme: 'light' | 'dark') {
  const themeColors = COLORS[theme];

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: themeColors.background,
    },
    content: {
      padding: SPACING.lg,
      paddingTop: SPACING.md,
      paddingBottom: 132,
    },
    welcomeCard: {
      marginBottom: SPACING.lg,
    },
    greeting: {
      fontSize: 30,
      fontWeight: '800',
      color: themeColors.text,
      letterSpacing: -0.8,
    },
    welcomeSubtitle: {
      fontSize: 15,
      color: themeColors.textMuted,
      fontWeight: '500',
      marginTop: 2,
    },
    summaryCard: {
      backgroundColor: themeColors.surface,
      borderRadius: BORDER_RADIUS.lg,
      padding: SPACING.md,
      borderWidth: 1.5,
      borderColor: themeColors.border,
      marginBottom: SPACING.md,
    },
    summaryHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: SPACING.sm,
    },
    summaryTitle: {
      fontSize: 12,
      fontWeight: '700',
      color: themeColors.textMuted,
      textTransform: 'uppercase',
      letterSpacing: 1.2,
      marginLeft: 8,
    },
    metricsRow: {
      flexDirection: 'row',
      gap: SPACING.sm,
    },
    metricCard: {
      flex: 1,
      backgroundColor: themeColors.inputBg,
      borderRadius: BORDER_RADIUS.md,
      borderWidth: 1,
      borderColor: themeColors.border,
      paddingVertical: SPACING.sm,
      paddingHorizontal: SPACING.sm,
      alignItems: 'center',
      minHeight: 84,
      justifyContent: 'center',
    },
    metricIcon: {
      width: 28,
      height: 28,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 4,
    },
    metricLabel: {
      fontSize: 12,
      fontWeight: '600',
      color: themeColors.textMuted,
    },
    metricValue: {
      fontSize: 20,
      fontWeight: '800',
      color: themeColors.text,
      marginTop: 1,
    },
    actionsGrid: {
      flexDirection: 'row',
      gap: SPACING.md,
      marginBottom: SPACING.md,
    },
    activeTasksCard: {
      backgroundColor: themeColors.surface,
      borderRadius: BORDER_RADIUS.lg,
      padding: SPACING.md,
      borderWidth: 1.5,
      borderColor: theme === 'dark'
        ? `${themeColors.primary}28`
        : themeColors.border,
      marginBottom: SPACING.md,
      shadowColor: themeColors.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: theme === 'dark' ? 0.08 : 0.04,
      shadowRadius: 12,
      elevation: 2,
    },
    activeTasksHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    activeTasksDivider: {
      height: 1,
      backgroundColor: themeColors.border,
      marginTop: SPACING.sm,
      marginBottom: SPACING.sm,
      opacity: 0.6,
    },
    activeTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    activeTitleIcon: {
      width: 26,
      height: 26,
      borderRadius: 8,
      backgroundColor: theme === 'dark' ? `${themeColors.primary}25` : `${themeColors.primary}15`,
      justifyContent: 'center',
      alignItems: 'center',
    },
    activeTasksTitle: {
      fontSize: 14,
      fontWeight: '800',
      color: themeColors.text,
      letterSpacing: 0.2,
    },
    activeCountBadge: {
      minWidth: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: themeColors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 6,
    },
    activeCountText: {
      fontSize: 11,
      fontWeight: '800',
      color: '#FFFFFF',
    },
    tabSwitcher: {
      flexDirection: 'row',
      backgroundColor: themeColors.inputBg,
      borderRadius: BORDER_RADIUS.sm,
      padding: 3,
      gap: 2,
    },
    tabBtn: {
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 6,
    },
    tabBtnActive: {
      backgroundColor: themeColors.primary,
    },
    tabBtnText: {
      fontSize: 11,
      fontWeight: '700',
      color: themeColors.textMuted,
    },
    tabBtnTextActive: {
      color: '#FFFFFF',
    },
    miniLoadingContainer: {
      minHeight: 52,
      justifyContent: 'center',
      alignItems: 'center',
    },
    miniEmptyContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: SPACING.md,
      gap: 8,
    },
    miniEmptyText: {
      fontSize: 13,
      color: themeColors.textMuted,
      fontWeight: '600',
    },
    miniCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: themeColors.inputBg,
      borderRadius: BORDER_RADIUS.md,
      borderWidth: 1,
      borderColor: themeColors.border,
      marginTop: SPACING.xs,
      overflow: 'hidden',
      paddingRight: SPACING.sm,
      minHeight: 52,
    },
    miniCardAccent: {
      width: 4,
      alignSelf: 'stretch',
      borderRadius: 2,
      marginRight: SPACING.sm,
    },
    miniCardContent: {
      flex: 1,
      paddingVertical: SPACING.sm,
    },
    miniCardTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: themeColors.text,
    },
    miniCardCategory: {
      fontSize: 11,
      fontWeight: '600',
      color: themeColors.textMuted,
      textTransform: 'uppercase',
      letterSpacing: 0.4,
      marginTop: 2,
    },
    miniPriorityPill: {
      borderRadius: BORDER_RADIUS.full,
      borderWidth: 1,
      paddingHorizontal: 8,
      paddingVertical: 3,
      marginRight: SPACING.xs,
    },
    miniPriorityText: {
      fontSize: 10,
      fontWeight: '800',
      textTransform: 'uppercase',
      letterSpacing: 0.3,
    },
    seeMoreBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: SPACING.sm,
      paddingVertical: SPACING.xs,
      gap: 6,
    },
    seeMoreText: {
      fontSize: 13,
      fontWeight: '700',
      color: themeColors.primary,
    },
    quoteCard: {
      backgroundColor: themeColors.surface,
      borderRadius: BORDER_RADIUS.lg,
      padding: SPACING.md,
      borderWidth: 1.5,
      borderColor: themeColors.border,
      marginBottom: SPACING.md,
      minHeight: 132,
    },
    quoteHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: SPACING.sm,
    },
    quoteTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    sectionTitle: {
      fontSize: 12,
      fontWeight: '700',
      color: themeColors.textMuted,
      textTransform: 'uppercase',
      letterSpacing: 1.2,
      marginLeft: 8,
    },
    refreshBtn: {
      width: 44,
      height: 44,
      borderRadius: BORDER_RADIUS.md,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: themeColors.inputBg,
      borderWidth: 1,
      borderColor: themeColors.border,
    },
    loadingContainer: {
      minHeight: 72,
      justifyContent: 'center',
      alignItems: 'center',
    },
    errorContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 72,
    },
    error: {
      color: themeColors.error,
      fontSize: 13,
      textAlign: 'center',
      lineHeight: 18,
      fontWeight: '600',
    },
    quote: {
      fontSize: 17,
      fontWeight: '600',
      fontStyle: 'italic',
      color: themeColors.text,
      lineHeight: 25,
    },
    quotePlaceholder: {
      fontSize: 14,
      color: themeColors.textMuted,
      fontWeight: '500',
      lineHeight: 20,
    },
    actionCard: {
      flex: 1,
      backgroundColor: themeColors.surface,
      borderRadius: BORDER_RADIUS.lg,
      padding: SPACING.md,
      borderWidth: 1.5,
      borderColor: themeColors.border,
      alignItems: 'center',
      minHeight: 170,
      justifyContent: 'center',
    },
    actionIcon: {
      width: 58,
      height: 58,
      borderRadius: 18,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: SPACING.sm,
    },
    actionTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: themeColors.text,
    },
    actionDesc: {
      fontSize: 12,
      color: themeColors.textMuted,
      fontWeight: '600',
      marginTop: 2,
      textAlign: 'center',
      lineHeight: 16,
    },
  });
}
