import React, { useRef } from 'react';
import { Animated, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import * as LucideIcons from 'lucide-react-native';
import { useTheme } from '../hooks/useTheme';
import { BORDER_RADIUS, COLORS, SPACING } from '../styles/theme';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChangeText,
  onClear,
  placeholder = 'Buscar por título, categoria...',
}: SearchBarProps) {
  const { theme } = useTheme();
  const themeColors = COLORS[theme];
  const focusAnim = useRef(new Animated.Value(0)).current;

  function handleFocus() {
    Animated.spring(focusAnim, {
      toValue: 1,
      useNativeDriver: false,
      speed: 24,
      bounciness: 3,
    }).start();
  }

  function handleBlur() {
    Animated.spring(focusAnim, {
      toValue: 0,
      useNativeDriver: false,
      speed: 24,
      bounciness: 3,
    }).start();
  }

  const animatedBorderColor = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [themeColors.border, themeColors.primary],
  });

  const animatedShadowOpacity = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, theme === 'dark' ? 0.4 : 0.18],
  });

  const animatedIconBg = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [
      theme === 'dark' ? '#1E293B' : '#F1F5F9',
      theme === 'dark' ? '#14B8A620' : '#0F766E18',
    ],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: themeColors.inputBg,
          borderColor: animatedBorderColor,
          shadowColor: themeColors.primary,
          shadowOpacity: animatedShadowOpacity,
          shadowOffset: { width: 0, height: 0 },
          shadowRadius: 10,
        },
      ]}
    >
      <Animated.View style={[styles.iconWrap, { backgroundColor: animatedIconBg }]}>
        <LucideIcons.Search size={16} color={themeColors.primary} strokeWidth={2.5} />
      </Animated.View>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={themeColors.textMuted}
        style={[styles.input, { color: themeColors.text }]}
        onFocus={handleFocus}
        onBlur={handleBlur}
        returnKeyType="search"
        autoCorrect={false}
        autoCapitalize="none"
        accessibilityLabel="Campo de busca"
      />

      {value.length > 0 && (
        <TouchableOpacity
          onPress={onClear}
          style={[styles.clearBtn, { backgroundColor: themeColors.surface }]}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Limpar busca"
        >
          <LucideIcons.X size={13} color={themeColors.textMuted} strokeWidth={2.5} />
        </TouchableOpacity>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SPACING.md,
    marginTop: SPACING.sm,
    marginBottom: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    height: 52,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1.5,
    gap: SPACING.sm,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: BORDER_RADIUS.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    paddingVertical: 0,
  },
  clearBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
