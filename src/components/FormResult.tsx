import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import type { FormConfig, FormValues } from '../types/form';

type Props = {
  config: FormConfig;
  data: FormValues;
  onEdit: () => void;
  onClear: () => void;
};

export function FormResult({ config, data, onEdit, onClear }: Props) {
  const rows = useMemo(
    () =>
      config.fields.map((field) => {
        const raw = data[field.id];
        let display = '—';
        if (raw === true)  display = 'Sim';
        else if (raw === false) display = 'Não';
        else if (Array.isArray(raw)) display = raw.length > 0 ? raw.join(', ') : '—';
        else if (typeof raw === 'string' && raw.length > 0) display = raw;
        return { label: field.label, display };
      }),
    [config.fields, data],
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Dados Salvos</Text>
      <View style={styles.card}>
        {rows.map((row) => (
          <View key={row.label} style={styles.row}>
            <Text style={styles.rowLabel}>{row.label}</Text>
            <Text style={styles.rowValue}>{row.display}</Text>
          </View>
        ))}
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.btnEdit} onPress={onEdit} activeOpacity={0.8}>
          <Text style={styles.btnEditText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnClear} onPress={onClear} activeOpacity={0.8}>
          <Text style={styles.btnClearText}>Limpar dados</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 40 },
  title:     { fontSize: 22, fontWeight: '700', color: '#111', marginBottom: 20 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  rowLabel: { fontSize: 14, fontWeight: '600', color: '#6b7280', flex: 1 },
  rowValue: { fontSize: 14, color: '#111', flex: 1.5, textAlign: 'right' },
  actions:      { gap: 12 },
  btnEdit: {
    backgroundColor: '#2563eb',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  btnEditText:  { color: '#fff', fontSize: 16, fontWeight: '700' },
  btnClear: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  btnClearText: { color: '#ef4444', fontSize: 16, fontWeight: '600' },
});
