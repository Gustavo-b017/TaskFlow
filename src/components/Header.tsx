import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { useTreatment } from '../hooks/useTreatment';
import { useTheme } from '../hooks/useTheme';

interface HeaderProps {
  title?: string;
}

export function Header({ title }: HeaderProps) {
  const { user, signOut } = useAuth();
  const { treatment } = useTreatment();
  const { theme } = useTheme();

  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.userSection}>
        {title ? (
          <Text style={styles.title}>{title}</Text>
        ) : (
          <>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.name.charAt(0).toUpperCase() || 'U'}
              </Text>
            </View>
            <View>
              <Text style={styles.userName}>
                {treatment ? `${treatment} ` : ''}{user?.name || 'Usuário'}
              </Text>
              <Text style={styles.userRole}>
                {user?.role === 'admin' ? 'Administrador' : 'Colaborador'}
              </Text>
            </View>
          </>
        )}
      </View>

      <TouchableOpacity onPress={signOut} style={styles.logoutButton} activeOpacity={0.7}>
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

function createStyles(theme: 'light' | 'dark') {
  const isDark = theme === 'dark';
  return StyleSheet.create({
    container: {
      width: '100%',
      height: 90,
      backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingTop: 30,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#374151' : '#EEEEEE',
    },
    userSection: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: isDark ? '#F9FAFB' : '#000000',
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#3B82F6',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    avatarText: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: 'bold',
    },
    userName: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#F9FAFB' : '#333333',
    },
    userRole: {
      fontSize: 12,
      color: isDark ? '#9CA3AF' : '#666666',
    },
    logoutButton: {
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 6,
      backgroundColor: isDark ? '#374151' : '#F2F2F7',
    },
    logoutText: {
      color: '#EF4444',
      fontSize: 14,
      fontWeight: '500',
    },
  });
}
