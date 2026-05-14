import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';

type Props = {
  label: string;
  value: boolean;
  required?: boolean;
  onChange: (value: boolean) => void;
};

export function SwitchFieldInput({ label, value, required, onChange }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {required ? <Text style={styles.asterisk}> *</Text> : null}
      </Text>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: '#d1d5db', true: '#93c5fd' }}
        thumbColor={value ? '#2563eb' : '#f4f4f5'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingVertical: 4,
  },
  label:    { fontSize: 14, fontWeight: '600', color: '#222', flex: 1, marginRight: 12 },
  asterisk: { fontSize: 14, fontWeight: '700', color: '#ef4444' },
});
