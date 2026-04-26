import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import * as LucideIcons from 'lucide-react-native';
import { StatusBadge } from '../shared/components/StatusBadge';
import { formatDate } from '../shared/utils/formatDate';
import { resolveLucideIcon } from '../shared/utils/iconRegistry';
import { useTheme } from '../hooks/useTheme';
import { COLORS, BORDER_RADIUS, SPACING } from '../styles/theme';
import type { Task } from '../types/task';

interface TaskCardProps {
  task: Task;
  onPress: (taskId: string) => void;
}

const PRIORITY_LABELS: Record<Task['priority'], string> = {
  baixa: 'Baixa',
  media: 'Media',
  alta: 'Alta',
};

function TaskCardComponent({ task, onPress }: TaskCardProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const themeColors = COLORS[theme];

  const IconComponent = resolveLucideIcon(task.categoryIcon);
  const priorityColor =
    task.priority === 'alta'
      ? themeColors.error
      : task.priority === 'media'
        ? themeColors.accent
        : themeColors.success;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(task.id)}
      activeOpacity={0.6}
      accessibilityRole="button"
      accessibilityLabel={`Abrir tarefa ${task.title}`}
      accessibilityHint={`Status ${task.status}. Prioridade ${PRIORITY_LABELS[task.priority]}.`}
    >
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <IconComponent size={24} color={themeColors.primary} strokeWidth={2.5} />
        </View>

        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title} numberOfLines={1}>{task.title}</Text>
            <View style={styles.badgeWrapper}>
              <StatusBadge status={task.status} />
            </View>
          </View>

          <Text style={styles.description} numberOfLines={2}>
            {task.description || 'Sem descricao.'}
          </Text>

          <View style={styles.categoryRow}>
            <LucideIcons.Tag size={12} color={themeColors.textMuted} style={{ marginRight: 4 }} />
            <Text style={styles.categoryText} numberOfLines={1}>
              {task.category || 'Sem categoria'}
            </Text>
          </View>

          <View style={styles.footer}>
            <View style={styles.metaStack}>
              <View style={styles.metaRow}>
                <LucideIcons.Calendar size={12} color={themeColors.textMuted} style={{ marginRight: 4 }} />
                <Text style={styles.metaLabel}>Criada</Text>
                <Text style={styles.metaValue}>{formatDate(task.createdAt)}</Text>
              </View>
              <View style={styles.metaRow}>
                <LucideIcons.History size={12} color={themeColors.textMuted} style={{ marginRight: 4 }} />
                <Text style={styles.metaLabel}>Atualizada</Text>
                <Text style={styles.metaValue}>{formatDate(task.updatedAt)}</Text>
              </View>
            </View>

            <View style={styles.footerRight}>
              <View style={[styles.priorityPill, { borderColor: `${priorityColor}44`, backgroundColor: `${priorityColor}1A` }]}>
                <LucideIcons.Flag size={11} color={priorityColor} strokeWidth={2.4} />
                <Text style={[styles.priorityText, { color: priorityColor }]}>{PRIORITY_LABELS[task.priority]}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export const TaskCard = React.memo(TaskCardComponent);

function createStyles(theme: 'light' | 'dark') {
  const themeColors = COLORS[theme];
  return StyleSheet.create({
    card: {
      backgroundColor: themeColors.surface,
      borderRadius: BORDER_RADIUS.lg,
      borderWidth: 1.5,
      borderColor: themeColors.border,
      marginVertical: SPACING.xs,
      marginHorizontal: SPACING.md,
      overflow: 'hidden',
    },
    container: {
      flexDirection: 'row',
      padding: SPACING.md,
    },
    iconContainer: {
      width: 48,
      height: 48,
      borderRadius: BORDER_RADIUS.md,
      backgroundColor: theme === 'dark' ? '#0F766E33' : '#F0FDFA',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: SPACING.md,
    },
    content: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 4,
    },
    title: {
      fontSize: 16,
      fontWeight: '700',
      color: themeColors.text,
      flex: 1,
      marginRight: 8,
    },
    badgeWrapper: {
      transform: [{ scale: 0.9 }],
      marginTop: -2,
    },
    description: {
      fontSize: 13,
      color: themeColors.textMuted,
      marginBottom: 8,
      lineHeight: 18,
    },
    categoryRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    categoryText: {
      fontSize: 12,
      fontWeight: '700',
      color: themeColors.textMuted,
      textTransform: 'uppercase',
      letterSpacing: 0.4,
      flex: 1,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      gap: SPACING.sm,
    },
    metaStack: {
      gap: 2,
      flexShrink: 1,
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    metaLabel: {
      fontSize: 11,
      fontWeight: '600',
      color: themeColors.textMuted,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    metaValue: {
      fontSize: 11,
      fontWeight: '700',
      color: themeColors.text,
      marginLeft: 4,
    },
    footerRight: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
    priorityPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      borderRadius: BORDER_RADIUS.full,
      borderWidth: 1,
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
    priorityText: {
      fontSize: 11,
      fontWeight: '700',
      textTransform: 'uppercase',
    },
  });
}
