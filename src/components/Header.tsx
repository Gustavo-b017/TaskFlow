import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import * as LucideIcons from 'lucide-react-native';
import { useTheme } from '../hooks/useTheme';
import { useTreatment } from '../hooks/useTreatment';
import { COLORS, BORDER_RADIUS, SPACING } from '../styles/theme';
import type { UserRole } from '../types/user';

interface HeaderProps {
  userName: string;
  role: UserRole;
  onLogout?: () => void;
  title?: string;
  showSearch?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onClearSearch?: () => void;
  searchPlaceholder?: string;
}

export function Header({
  userName,
  role,
  onLogout,
  title,
  showSearch = false,
  searchValue = '',
  onSearchChange,
  onClearSearch,
  searchPlaceholder = 'Pesquisar',
}: HeaderProps) {
  const { theme } = useTheme();
  const { treatment } = useTreatment();
  const styles = createStyles(theme);
  const themeColors = COLORS[theme];

  const avatarChar = userName && userName.length > 0 ? userName.charAt(0).toUpperCase() : 'U';
  const displayName = treatment ? `${treatment} ${userName}` : userName;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.userSection}>
          {title ? (
            <Text style={styles.title} numberOfLines={1}>{title}</Text>
          ) : (
            <>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{avatarChar}</Text>
              </View>
              <View>
                <Text style={styles.userName}>{displayName || 'Usuário'}</Text>
                <Text style={styles.role}>
                  {role === 'admin' ? 'Administrador' : 'Usuário Comum'}
                </Text>
              </View>
            </>
          )}
        </View>
        {showSearch ? (
          <View style={styles.searchWrap}>
            <LucideIcons.Search size={16} color={themeColors.textMuted} />
            <TextInput
              value={searchValue}
              onChangeText={onSearchChange}
              placeholder={searchPlaceholder}
              placeholderTextColor={themeColors.textMuted}
              style={styles.searchInput}
              returnKeyType="search"
              accessibilityLabel="Campo de pesquisa"
            />
            {searchValue.length > 0 && (
              <TouchableOpacity
                onPress={onClearSearch}
                style={styles.clearSearchBtn}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel="Limpar pesquisa"
              >
                <LucideIcons.X size={14} color={themeColors.textMuted} />
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <TouchableOpacity
            onPress={onLogout}
            style={styles.logoutBtn}
            activeOpacity={0.7}
            disabled={!onLogout}
            accessibilityRole="button"
            accessibilityLabel="Sair da conta"
          >
            <LucideIcons.LogOut size={20} color={themeColors.error} strokeWidth={2.5} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

function createStyles(theme: 'light' | 'dark') {
  const themeColors = COLORS[theme];
  return StyleSheet.create({
    container: {
      backgroundColor: themeColors.background,
      paddingTop: SPACING.sm,
    },
    content: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: SPACING.lg,
      paddingVertical: SPACING.md,
      backgroundColor: themeColors.surface,
      marginHorizontal: SPACING.md,
      borderRadius: BORDER_RADIUS.lg,
      borderWidth: 1.5,
      borderColor: themeColors.border,
    },
    userSection: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      marginRight: SPACING.sm,
    },
    avatar: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: themeColors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: SPACING.sm,
    },
    avatarText: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: '800',
    },
    title: {
      fontSize: 22,
      fontWeight: '800',
      color: themeColors.text,
      letterSpacing: -0.5,
      flexShrink: 1,
    },
    userName: {
      fontSize: 15,
      fontWeight: '700',
      color: themeColors.text,
    },
    role: {
      fontSize: 11,
      fontWeight: '600',
      color: themeColors.textMuted,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    logoutBtn: {
      width: 44,
      height: 44,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 12,
      backgroundColor: theme === 'dark' ? '#EF444415' : '#FEE2E2',
    },
    searchWrap: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      minHeight: 44,
      width: '56%',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: themeColors.border,
      backgroundColor: themeColors.inputBg,
      paddingHorizontal: 10,
    },
    searchInput: {
      flex: 1,
      color: themeColors.text,
      fontSize: 14,
      paddingVertical: 8,
    },
    clearSearchBtn: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: themeColors.surface,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
}
