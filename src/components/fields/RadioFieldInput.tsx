import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { FieldOption } from '../../types/form';

type Props = {
  label: string;
  options: FieldOption[];
  value: string;
  error?: string | undefined;
  required?: boolean;
  onChange: (value: string) => void;
};

export function RadioFieldInput({ label, options, value, error, required, onChange }: Props) {
  // Bug fix: opções com value='' são tratadas como vazio na validação → filtra
  const validOptions = options.filter((o) => o.value !== '');

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {required ? <Text style={styles.asterisk}> *</Text> : null}
      </Text>
      {validOptions.map((option) => {
        const selected = option.value === value;
        return (
          <TouchableOpacity
            key={option.value}
            style={styles.row}
            onPress={() => onChange(option.value)}
            activeOpacity={0.7}
          >
            <View style={[styles.radio, selected ? styles.radioSelected : undefined]}>
              {selected ? <View style={styles.radioDot} /> : null}
            </View>
            <Text style={styles.optionLabel}>{option.label}</Text>
          </TouchableOpacity>
        );
      })}
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container:    { marginBottom: 16 },
  label:    { fontSize: 14, fontWeight: '600', color: '#222', marginBottom: 8 },
  asterisk: { fontSize: 14, fontWeight: '700', color: '#ef4444' },
  row:          { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#d1d5db',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  radioSelected: { borderColor: '#2563eb' },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2563eb',
  },
  optionLabel: { fontSize: 15, color: '#333' },
  error:       { fontSize: 12, color: '#ef4444', marginTop: 4 },
});
