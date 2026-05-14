import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

type Props = {
  label: string;
  type: 'text' | 'email' | 'password' | 'number';
  value: string;
  error?: string | undefined;
  required?: boolean;
  onChange: (value: string) => void;
};

export function TextFieldInput({ label, type, value, error, required, onChange }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {required ? <Text style={styles.asterisk}> *</Text> : null}
      </Text>
      <TextInput
        style={[styles.input, error ? styles.inputError : undefined]}
        value={value}
        onChangeText={onChange}
        secureTextEntry={type === 'password'}
        keyboardType={
          type === 'email'  ? 'email-address' :
          type === 'number' ? 'numeric'        :
          'default'
        }
        autoCapitalize={type === 'email' ? 'none' : 'sentences'}
        autoCorrect={type !== 'email' && type !== 'password'}
        placeholder={`Digite ${label.toLowerCase()}`}
        placeholderTextColor="#aaa"
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  label:    { fontSize: 14, fontWeight: '600', color: '#222', marginBottom: 6 },
  asterisk: { fontSize: 14, fontWeight: '700', color: '#ef4444' },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#111',
    backgroundColor: '#fff',
  },
  inputError: { borderColor: '#ef4444' },
  error: { fontSize: 12, color: '#ef4444', marginTop: 4 },
});
