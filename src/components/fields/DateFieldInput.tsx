import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

type Props = {
  label: string;
  value: string;
  error?: string | undefined;
  required?: boolean;
  onChange: (value: string) => void;
};

export function DateFieldInput({ label, value, error, required, onChange }: Props) {
  function handleChange(text: string) {
    const isDeleting = text.length < value.length;
    const rawDigits  = text.replace(/\D/g, '').slice(0, 8);

    // When backspacing over a separator (e.g. "/"), the digit count
    // stays the same — strip the last digit so the cursor moves back.
    const currentDigits = value.replace(/\D/g, '');
    const digits =
      isDeleting && rawDigits === currentDigits
        ? rawDigits.slice(0, -1)
        : rawDigits;

    let formatted = digits;
    if (digits.length > 4) {
      formatted = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
    } else if (digits.length > 2) {
      formatted = `${digits.slice(0, 2)}/${digits.slice(2)}`;
    }
    onChange(formatted);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {required ? <Text style={styles.asterisk}> *</Text> : null}
      </Text>
      <TextInput
        style={[styles.input, error ? styles.inputError : undefined]}
        value={value}
        onChangeText={handleChange}
        placeholder="DD/MM/AAAA"
        placeholderTextColor="#aaa"
        keyboardType="numeric"
        maxLength={10}
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
  error:      { fontSize: 12, color: '#ef4444', marginTop: 4 },
});
