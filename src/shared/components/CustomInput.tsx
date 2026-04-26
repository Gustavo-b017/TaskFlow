import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { COLORS, BORDER_RADIUS, SPACING } from '../../styles/theme';

interface CustomInputProps {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  error?: string;
  secureTextEntry?: boolean;
  placeholder?: string;
  multiline?: boolean;
  editable?: boolean;
  testID?: string;
}

export function CustomInput({
  label,
  value,
  onChangeText,
  error,
  secureTextEntry = false,
  placeholder,
  multiline = false,
  editable = true,
  testID,
}: CustomInputProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme, !!error);
  const themeColors = COLORS[theme];

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.inputMultiline]}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        placeholder={placeholder}
        placeholderTextColor={themeColors.textMuted}
        multiline={multiline}
        editable={editable}
        autoCapitalize="none"
        testID={testID}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

function createStyles(theme: 'light' | 'dark', hasError: boolean) {
  const themeColors = COLORS[theme];
  return StyleSheet.create({
    container: { marginBottom: SPACING.md },
    label: {
      fontSize: 14,
      fontWeight: '600',
      color: themeColors.text,
      marginBottom: SPACING.xs,
      marginLeft: 4,
    },
    input: {
      borderWidth: 1.5,
      borderColor: hasError ? themeColors.error : themeColors.border,
      borderRadius: BORDER_RADIUS.md,
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.sm,
      minHeight: 56,
      color: themeColors.text,
      backgroundColor: themeColors.inputBg,
      fontSize: 16,
    },
    inputMultiline: {
      minHeight: 100,
      textAlignVertical: 'top',
      paddingTop: SPACING.md,
    },
    errorText: {
      color: themeColors.error,
      fontSize: 12,
      marginTop: 4,
      marginLeft: 4,
      fontWeight: '500',
    },
  });
}
