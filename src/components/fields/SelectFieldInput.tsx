import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import type { FieldOption } from '../../types/form';

type Props = {
  label: string;
  options: FieldOption[];
  value: string;
  error?: string | undefined;
  required?: boolean;
  onChange: (value: string) => void;
};

export function SelectFieldInput({ label, options, value, error, required, onChange }: Props) {
  const [open, setOpen] = useState(false);

  // Bug fix: opções com value='' são tratadas como "vazio" na validação → filtra
  const validOptions = useMemo(() => options.filter((o) => o.value !== ''), [options]);

  const selectedLabel = useMemo(
    () => validOptions.find((o) => o.value === value)?.label ?? 'Selecione...',
    [validOptions, value],
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {required ? <Text style={styles.asterisk}> *</Text> : null}
      </Text>
      <TouchableOpacity
        style={[styles.trigger, error ? styles.triggerError : undefined]}
        onPress={() => setOpen(true)}
        activeOpacity={0.7}
      >
        <Text style={[styles.triggerText, !value ? styles.placeholder : undefined]}>
          {selectedLabel}
        </Text>
        <Text style={styles.arrow}>▾</Text>
      </TouchableOpacity>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Modal visible={open} transparent animationType="fade">
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setOpen(false)}>
          <SafeAreaView style={styles.sheet}>
            <Text style={styles.sheetTitle}>{label}</Text>
            <FlatList
              data={validOptions}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.option, item.value === value ? styles.optionSelected : undefined]}
                  onPress={() => { onChange(item.value); setOpen(false); }}
                >
                  <Text style={[styles.optionText, item.value === value ? styles.optionTextSelected : undefined]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </SafeAreaView>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container:  { marginBottom: 16 },
  label:    { fontSize: 14, fontWeight: '600', color: '#222', marginBottom: 6 },
  asterisk: { fontSize: 14, fontWeight: '700', color: '#ef4444' },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  triggerError: { borderColor: '#ef4444' },
  triggerText:  { fontSize: 16, color: '#111', flex: 1 },
  placeholder:  { color: '#aaa' },
  arrow:        { fontSize: 14, color: '#666' },
  error:        { fontSize: 12, color: '#ef4444', marginTop: 4 },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '60%',
    paddingBottom: 16,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  option: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f9fafb',
  },
  optionSelected:     { backgroundColor: '#eff6ff' },
  optionText:         { fontSize: 16, color: '#333' },
  optionTextSelected: { color: '#2563eb', fontWeight: '600' },
});
