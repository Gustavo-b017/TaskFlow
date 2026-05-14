import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useFormConfig } from '../hooks/useFormConfig';
import { useForm }       from '../hooks/useForm';
import { DynamicField }  from '../components/DynamicField';
import { FormResult }    from '../components/FormResult';

export function FormScreen() {
  const { config, loading, error: configError } = useFormConfig();

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Carregando formulário...</Text>
      </View>
    );
  }

  if (!config) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Não foi possível carregar o formulário.</Text>
      </View>
    );
  }

  return <FormContent config={config} configError={configError} />;
}

// Separated so useForm only runs after config is available.
function FormContent({
  config,
  configError,
}: {
  config: NonNullable<ReturnType<typeof useFormConfig>['config']>;
  configError: string | null;
}) {
  const {
    values,
    errors,
    submitted,
    savedData,
    isValid,
    setValue,
    handleSubmit,
    handleClear,
    handleEdit,
  } = useForm(config);

  if (submitted && savedData) {
    return (
      <FormResult
        config={config}
        data={savedData}
        onEdit={handleEdit}
        onClear={handleClear}
      />
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>{config.title}</Text>

      {configError ? (
        <View style={styles.warnBanner}>
          <Text style={styles.warnText}>{configError}</Text>
        </View>
      ) : null}

      {config.fields.map((field) => (
        <DynamicField
          key={field.id}
          field={field}
          value={values[field.id]}
          error={errors[field.id]}
          onChange={setValue}
        />
      ))}

      {Object.keys(errors).length > 0 ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>
            Corrija os campos destacados antes de continuar.
          </Text>
        </View>
      ) : null}

      <TouchableOpacity
        style={[styles.submitBtn, !isValid ? styles.submitBtnDisabled : undefined]}
        onPress={handleSubmit}
        activeOpacity={0.8}
      >
        <Text style={styles.submitBtnText}>Salvar cadastro</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9fafb',
    gap: 12,
  },
  loadingText: { fontSize: 14, color: '#6b7280' },
  errorText:   { fontSize: 15, color: '#ef4444' },
  container: {
    padding: 20,
    paddingBottom: 48,
    flexGrow: 1,
    backgroundColor: '#f9fafb',
  },
  title: { fontSize: 24, fontWeight: '800', color: '#111', marginBottom: 24 },
  warnBanner: {
    backgroundColor: '#fffbeb',
    borderWidth: 1,
    borderColor: '#fde68a',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  warnText: { fontSize: 13, color: '#92400e' },
  errorBanner: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorBannerText: { fontSize: 14, color: '#dc2626' },
  submitBtn: {
    backgroundColor: '#2563eb',
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitBtnDisabled: { backgroundColor: '#93c5fd' },
  submitBtnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});
