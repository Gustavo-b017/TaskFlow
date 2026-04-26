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
import { useAuth } from '../../hooks/useAuth';
import { useTasks } from '../../hooks/useTasks';
import { useTheme } from '../../hooks/useTheme';
import { useTreatment } from '../../hooks/useTreatment';
import { fetchMotivationalQuote } from '../../services/api';
import { BORDER_RADIUS, COLORS, SPACING } from '../../styles/theme';

type HomeNav = BottomTabNavigationProp<TabParamList, 'Home'>;

const QUOTE_MAX_LINES = 4;

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

  const pendingCount = useMemo(
    () => tasks.filter((task) => task.status !== 'concluida').length,
    [tasks]
  );

  const completedCount = useMemo(
    () => tasks.filter((task) => task.status === 'concluida').length,
    [tasks]
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
    navigation.navigate('Tasks');
  }

  const styles = createStyles(theme);

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
    actionsGrid: {
      flexDirection: 'row',
      gap: SPACING.md,
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
