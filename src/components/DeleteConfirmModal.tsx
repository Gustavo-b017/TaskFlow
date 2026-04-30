import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import * as LucideIcons from 'lucide-react-native';
import { useTheme } from '../hooks/useTheme';
import { BORDER_RADIUS, COLORS, SPACING } from '../styles/theme';

const COUNTDOWN_START = 3;

interface DeleteConfirmModalProps {
  visible: boolean;
  taskName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmModal({
  visible,
  taskName,
  onConfirm,
  onCancel,
}: DeleteConfirmModalProps) {
  const { theme } = useTheme();
  const themeColors = COLORS[theme];
  const styles = createStyles(theme);

  const [countdown, setCountdown] = useState(COUNTDOWN_START);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setCountdown(COUNTDOWN_START);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();

      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    } else {
      fadeAnim.setValue(0);
    }
  }, [visible, fadeAnim]);

  const canConfirm = countdown === 0;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onCancel}
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={onCancel}>
        <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
          <TouchableWithoutFeedback>
            <View style={styles.card}>
              <View style={styles.iconWrapper}>
                <LucideIcons.Trash2
                  size={28}
                  color={themeColors.error}
                  strokeWidth={2.5}
                />
              </View>

              <Text style={styles.title}>Excluir tarefa?</Text>

              <Text style={styles.subtitle}>
                Você está prestes a excluir{' '}
                <Text style={styles.taskName}>"{taskName}"</Text>
                {'. Esta ação não pode ser desfeita.'}
              </Text>

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={onCancel}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityLabel="Cancelar exclusão"
                >
                  <Text style={styles.cancelText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.deleteButton,
                    !canConfirm && styles.deleteButtonDisabled,
                  ]}
                  onPress={canConfirm ? onConfirm : undefined}
                  disabled={!canConfirm}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityLabel={
                    canConfirm
                      ? 'Confirmar exclusão'
                      : `Aguarde ${countdown} segundos`
                  }
                  accessibilityState={{ disabled: !canConfirm }}
                >
                  <Text style={styles.deleteText}>
                    {canConfirm ? 'Excluir' : `Excluir (${countdown})`}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

function createStyles(theme: 'light' | 'dark') {
  const themeColors = COLORS[theme];
  return StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.55)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    card: {
      backgroundColor: themeColors.surface,
      borderRadius: BORDER_RADIUS.lg,
      borderWidth: 1.5,
      borderColor: themeColors.border,
      padding: SPACING.lg,
      marginHorizontal: SPACING.lg,
      width: '85%',
      alignItems: 'center',
    },
    iconWrapper: {
      width: 64,
      height: 64,
      borderRadius: BORDER_RADIUS.full,
      backgroundColor: `${themeColors.error}1A`,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: SPACING.md,
    },
    title: {
      fontSize: 20,
      fontWeight: '800',
      color: themeColors.text,
      marginBottom: SPACING.sm,
      textAlign: 'center',
      letterSpacing: -0.3,
    },
    subtitle: {
      fontSize: 14,
      color: themeColors.textMuted,
      textAlign: 'center',
      lineHeight: 21,
      marginBottom: SPACING.lg,
    },
    taskName: {
      fontWeight: '700',
      color: themeColors.text,
    },
    buttonRow: {
      flexDirection: 'row',
      gap: SPACING.sm,
      width: '100%',
    },
    cancelButton: {
      flex: 1,
      minHeight: 48,
      borderRadius: BORDER_RADIUS.full,
      borderWidth: 1.5,
      borderColor: themeColors.border,
      backgroundColor: themeColors.inputBg,
      justifyContent: 'center',
      alignItems: 'center',
    },
    cancelText: {
      fontSize: 15,
      fontWeight: '700',
      color: themeColors.text,
    },
    deleteButton: {
      flex: 1,
      minHeight: 48,
      borderRadius: BORDER_RADIUS.full,
      backgroundColor: themeColors.error,
      justifyContent: 'center',
      alignItems: 'center',
    },
    deleteButtonDisabled: {
      opacity: 0.45,
    },
    deleteText: {
      fontSize: 15,
      fontWeight: '700',
      color: '#FFFFFF',
    },
  });
}
