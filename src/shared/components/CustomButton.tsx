import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { COLORS, BORDER_RADIUS, SPACING } from '../../styles/theme';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'danger' | 'secondary';
  testID?: string;
}

export function CustomButton({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
  testID,
}: CustomButtonProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme, variant, disabled);

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.6}
      testID={testID}
    >
      {loading
        ? <ActivityIndicator color={variant === 'secondary' ? COLORS[theme].primary : "#FFFFFF"} />
        : <Text style={styles.text}>{title}</Text>
      }
    </TouchableOpacity>
  );
}

function createStyles(theme: 'light' | 'dark', variant: string, disabled: boolean) {
  const themeColors = COLORS[theme];
  
  let backgroundColor: string = themeColors.primary;
  let textColor: string = '#FFFFFF';

  if (variant === 'danger') {
    backgroundColor = themeColors.error;
  } else if (variant === 'secondary') {
    backgroundColor = themeColors.inputBg;
    textColor = themeColors.text;
  }

  return StyleSheet.create({
    button: {
      minHeight: 56,
      paddingHorizontal: SPACING.lg,
      paddingVertical: SPACING.md,
      borderRadius: BORDER_RADIUS.full,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: backgroundColor,
      opacity: disabled ? 0.4 : 1,
      marginVertical: SPACING.sm,
    },
    text: {
      color: textColor,
      fontSize: 16,
      fontWeight: '700',
      letterSpacing: 0.5,
    },
  });
}
