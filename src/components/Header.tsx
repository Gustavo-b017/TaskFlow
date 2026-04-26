import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import type { UserRole } from '../types/user';

interface HeaderProps {
  userName: string;
  role: UserRole;
  onLogout: () => void;
  title?: string;
}

export function Header({ userName, role, onLogout, title }: HeaderProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  // Fallback seguro para o caractere do avatar
  const avatarChar = userName && userName.length > 0 ? userName.charAt(0).toUpperCase() : 'U';

  return (
    <View style={styles.container}>
      <View style={styles.userSection}>
        {title ? (
          <Text style={styles.title}>{title}</Text>
        ) : (
          <>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{avatarChar}</Text>
            </View>
            <View>
              <Text style={styles.userName}>{userName || 'Usuário'}</Text>
              <Text style={styles.role}>
                {role === 'admin' ? '👑 Administrador' : '👤 Usuário'}
              </Text>
            </View>
          </>
        )}
      </View>
      <TouchableOpacity onPress={onLogout} style={styles.logoutBtn} activeOpacity={0.7}>
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

function createStyles(theme: 'light' | 'dark') {
  const isDark = theme === 'dark';
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#374151' : '#EEEEEE',
    },
    userSection: {
      flexDirection: 'row',
      alignItems: 'center',
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
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: isDark ? '#F9FAFB' : '#000000',
    },
    userName: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#F9FAFB' : '#111827',
    },
    role: {
      fontSize: 12,
      color: isDark ? '#9CA3AF' : '#6B7280',
    },
    logoutBtn: { minHeight: 44, justifyContent: 'center', paddingHorizontal: 12 },
    logoutText: { color: '#EF4444', fontWeight: '600' },
  });
}
