import React, { useState, useEffect } from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as LucideIcons from 'lucide-react-native';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { CustomButton } from '../../shared/components/CustomButton';
import { useTreatment } from '../../hooks/useTreatment';
import { COLORS, BORDER_RADIUS, SPACING } from '../../styles/theme';

export default function SettingsScreen() {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { treatment, updateTreatment } = useTreatment();
  const themeColors = COLORS[theme];
  
  const [localTreatment, setLocalTreatment] = useState<'Sr.' | 'Sra.' | 'Srta.'>('Sr.');

  useEffect(() => {
    if (treatment === 'Sr.' || treatment === 'Sra.' || treatment === 'Srta.') {
      setLocalTreatment(treatment);
    }
  }, [treatment]);

  async function handleTreatmentChange(value: 'Sr.' | 'Sra.' | 'Srta.') {
    setLocalTreatment(value);
    await updateTreatment(value);
  }

  const styles = createStyles(theme);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.pageTitle}>Ajustes</Text>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <LucideIcons.User size={20} color={themeColors.primary} strokeWidth={2.5} />
            <Text style={styles.sectionTitle}>Perfil</Text>
          </View>
          <View style={styles.card}>
            <View style={styles.profileInfo}>
              <View style={[styles.avatar, { backgroundColor: themeColors.primary + '15' }]}>
                <Text style={[styles.avatarText, { color: themeColors.primary }]}>
                  {user?.name.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View>
                <Text style={styles.profileName}>{user?.name}</Text>
                <Text style={styles.profileRole}>
                  {user?.role === 'admin' ? 'Administrador' : 'Colaborador'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <LucideIcons.MessageSquare size={20} color={themeColors.primary} strokeWidth={2.5} />
            <Text style={styles.sectionTitle}>Tratamento</Text>
          </View>
          <View style={styles.treatmentRow}>
            {(['Sr.', 'Sra.', 'Srta.'] as const).map((option) => {
              const isActive = localTreatment === option;
              return (
                <TouchableOpacity
                  key={option}
                  onPress={() => handleTreatmentChange(option)}
                  style={[styles.treatmentBtn, isActive && styles.treatmentBtnActive]}
                >
                  <Text style={[styles.treatmentText, isActive && styles.treatmentTextActive]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <LucideIcons.Moon size={20} color={themeColors.primary} strokeWidth={2.5} />
            <Text style={styles.sectionTitle}>Aparência</Text>
          </View>
          <View style={[styles.card, styles.themeRow]}>
            <Text style={styles.themeLabel}>Modo Escuro</Text>
            <Switch
              value={theme === 'dark'}
              onValueChange={toggleTheme}
              trackColor={{ true: themeColors.primary, false: themeColors.border }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        <View style={styles.logoutSection}>
          <CustomButton 
            title="Encerrar Sessão" 
            onPress={signOut} 
            variant="danger" 
          />
          <Text style={styles.versionText}>TaskFlow v1.0.0 Pro Max</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles(theme: 'light' | 'dark') {
  const themeColors = COLORS[theme];
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: themeColors.background },
    content: { padding: SPACING.lg, paddingBottom: 40 },
    pageTitle: {
      fontSize: 28,
      fontWeight: '800',
      color: themeColors.text,
      marginBottom: SPACING.lg,
      letterSpacing: -0.5,
    },
    section: {
      marginBottom: SPACING.xl,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: SPACING.md,
      marginLeft: 4,
    },
    sectionTitle: {
      fontSize: 13,
      fontWeight: '700',
      color: themeColors.textMuted,
      textTransform: 'uppercase',
      letterSpacing: 1.5,
      marginLeft: 8,
    },
    card: {
      backgroundColor: themeColors.surface,
      borderRadius: BORDER_RADIUS.lg,
      padding: SPACING.lg,
      borderWidth: 1.5,
      borderColor: themeColors.border,
    },
    profileInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.md,
    },
    avatar: {
      width: 56,
      height: 56,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatarText: {
      fontSize: 22,
      fontWeight: '800',
    },
    profileName: { fontSize: 18, fontWeight: '700', color: themeColors.text },
    profileRole: { fontSize: 13, color: themeColors.textMuted, fontWeight: '600' },
    treatmentRow: { flexDirection: 'row', gap: SPACING.sm },
    treatmentBtn: {
      flex: 1,
      height: 48,
      borderRadius: BORDER_RADIUS.md,
      backgroundColor: themeColors.surface,
      borderWidth: 1.5,
      borderColor: themeColors.border,
      justifyContent: 'center',
      alignItems: 'center',
    },
    treatmentBtnActive: {
      borderColor: themeColors.primary,
      backgroundColor: theme === 'dark' ? '#0F766E33' : '#F0FDFA',
    },
    treatmentText: {
      fontSize: 14,
      fontWeight: '700',
      color: themeColors.textMuted,
    },
    treatmentTextActive: {
      color: themeColors.primary,
    },
    themeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    themeLabel: { fontSize: 16, fontWeight: '600', color: themeColors.text },
    logoutSection: { marginTop: SPACING.lg },
    versionText: {
      fontSize: 12,
      color: themeColors.textMuted,
      textAlign: 'center',
      marginTop: SPACING.md,
      fontWeight: '600',
    },
  });
}