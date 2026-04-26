import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

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

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        placeholder={placeholder}
        placeholderTextColor={theme === 'dark' ? '#6B7280' : '#9CA3AF'}
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
  return StyleSheet.create({
    container: { marginBottom: 16 },
    label: {
      fontSize: 14,
      fontWeight: '500',
      color: theme === 'dark' ? '#F9FAFB' : '#111827',
      marginBottom: 4,
    },
    input: {
      borderWidth: 1,
      borderColor: hasError ? '#EF4444' : (theme === 'dark' ? '#374151' : '#E5E7EB'),
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 10,
      minHeight: 44,
      color: theme === 'dark' ? '#F9FAFB' : '#111827',
      backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
    },
    errorText: {
      color: '#EF4444',
      fontSize: 12,
      marginTop: 4,
    },
  });
}
