import React, { useState, useEffect } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { CustomButton } from '../../shared/components/CustomButton';
import { useTreatment } from '../../hooks/useTreatment';

export default function SettingsScreen() {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { treatment, updateTreatment } = useTreatment();
  
  // Using local state for local UI update and global via useTreatment
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
      <View style={styles.content}>
        {/* Seção: Perfil */}
        <Text style={styles.sectionTitle}>Perfil</Text>
        <View style={styles.card}>
          <Text style={styles.profileName}>{user?.name}</Text>
          <Text style={styles.profileRole}>{user?.role === 'admin' ? 'Administrador' : 'Usuário'}</Text>
        </View>

        {/* Seção: Preferência de tratamento */}
        <Text style={styles.sectionTitle}>Tratamento</Text>
        <View style={styles.treatmentRow}>
          {(['Sr.', 'Sra.', 'Srta.'] as const).map((option) => (
            <View key={option} style={{ flex: 1, paddingHorizontal: 4 }}>
              <CustomButton
                title={option}
                onPress={() => handleTreatmentChange(option)}
                variant={localTreatment === option ? 'primary' : 'secondary'}
              />
            </View>
          ))}
        </View>

        {/* Seção: Tema */}
        <Text style={styles.sectionTitle}>Tema</Text>
        <View style={[styles.card, styles.themeRow]}>
          <Text style={styles.themeLabel}>{theme === 'dark' ? 'Escuro' : 'Claro'}</Text>
          <Switch
            value={theme === 'dark'}
            onValueChange={toggleTheme}
            trackColor={{ true: '#3B82F6', false: '#E5E7EB' }}
          />
        </View>

        {/* Logout */}
        <View style={styles.footer}>
          <CustomButton title="Sair" onPress={signOut} variant="danger" />
        </View>
      </View>
    </SafeAreaView>
  );
}

function createStyles(theme: 'light' | 'dark') {
  const isDark = theme === 'dark';
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: isDark ? '#121212' : '#F2F2F7' },
    content: { flex: 1, padding: 24 },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: isDark ? '#E5E5EA' : '#3A3A3C',
      marginTop: 24,
      marginBottom: 12,
    },
    card: {
      backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
      padding: 16,
      borderRadius: 12,
    },
    profileName: { fontSize: 18, fontWeight: 'bold', color: isDark ? '#F9FAFB' : '#1C1C1E', marginBottom: 4 },
    profileRole: { fontSize: 14, color: isDark ? '#9CA3AF' : '#8E8E93' },
    treatmentRow: { flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: -4 },
    themeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    themeLabel: { fontSize: 16, color: isDark ? '#F9FAFB' : '#1C1C1E' },
    footer: { marginTop: 'auto', paddingTop: 24 },
  });
}
