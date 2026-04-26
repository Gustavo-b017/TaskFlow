import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

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
      activeOpacity={0.7}
      testID={testID}
    >
      {loading
        ? <ActivityIndicator color="#FFFFFF" />
        : <Text style={styles.text}>{title}</Text>
      }
    </TouchableOpacity>
  );
}

function createStyles(theme: 'light' | 'dark', variant: string, disabled: boolean) {
  return StyleSheet.create({
    button: {
      minHeight: 44,           // toque mínimo de 44dp
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: variant === 'danger' ? '#EF4444' : variant === 'secondary' ? (theme === 'dark' ? '#374151' : '#E5E7EB') : '#3B82F6',
      opacity: disabled ? 0.5 : 1,
      marginVertical: 8,
    },
    text: {
      color: variant === 'secondary' ? (theme === 'dark' ? '#FFFFFF' : '#000000') : '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
  });
}
