import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { FieldOption } from '../../types/form';

type Props = {
  label: string;
  options: FieldOption[];
  value: string[];
  error?: string | undefined;
  required?: boolean;
  onChange: (value: string[]) => void;
};

export function CheckboxFieldInput({ label, options, value, error, required, onChange }: Props) {
  function toggle(optionValue: string) {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {required ? <Text style={styles.asterisk}> *</Text> : null}
      </Text>
      {options.map((option) => {
        const checked = value.includes(option.value);
        return (
          <TouchableOpacity
            key={option.value}
            style={styles.row}
            onPress={() => toggle(option.value)}
            activeOpacity={0.7}
          >
            <View style={[styles.box, checked ? styles.boxChecked : undefined]}>
              {checked ? <Text style={styles.checkmark}>✓</Text> : null}
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
  container:   { marginBottom: 16 },
  label:    { fontSize: 14, fontWeight: '600', color: '#222', marginBottom: 8 },
  asterisk: { fontSize: 14, fontWeight: '700', color: '#ef4444' },
  row:         { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  box: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#d1d5db',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    backgroundColor: '#fff',
  },
  boxChecked:  { borderColor: '#2563eb', backgroundColor: '#2563eb' },
  checkmark:   { fontSize: 12, color: '#fff', fontWeight: '700' },
  optionLabel: { fontSize: 15, color: '#333' },
  error:       { fontSize: 12, color: '#ef4444', marginTop: 4 },
});
