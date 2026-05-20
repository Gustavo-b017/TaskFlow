import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import type { FormConfig, FormField, FormFieldValue, FormValues } from '../types/form';
import type { FormErrors } from '../utils/validation';
import { validateForm } from '../utils/validation';
import { saveFormData, loadFormData, clearFormData } from '../services/storage';

/**
 * Sanitizes values loaded from storage against the CURRENT config.
 *
 * Handles all config-change scenarios:
 * - Field removed → key dropped (no stale data)
 * - Field type changed → type mismatch → value dropped
 * - Radio/select option removed → orphaned value → dropped
 * - Checkbox options removed → orphaned items filtered out
 * - New field added → simply absent (undefined), form pre-populates empty
 */
function sanitizeLoadedValues(fields: FormField[], raw: FormValues): FormValues {
  const result: FormValues = {};

  for (const field of fields) {
    const value: FormFieldValue | undefined = raw[field.id];
    if (value === undefined) continue;

    if (
      field.type === 'text'      ||
      field.type === 'email'     ||
      field.type === 'password'  ||
      field.type === 'number'    ||
      field.type === 'multiline' ||
      field.type === 'textarea'  ||
      field.type === 'date'
    ) {
      if (typeof value === 'string') result[field.id] = value;
      // type mismatch (was checkbox/switch) → silent discard
    } else if (field.type === 'switch') {
      if (typeof value === 'boolean') result[field.id] = value;
      // type mismatch → silent discard
    } else if (field.type === 'radio' || field.type === 'select') {
      if (typeof value === 'string' && value.length > 0) {
        const validValues = field.options.map((o) => o.value);
        // orphaned value (option removed from config) → discard
        if (validValues.includes(value)) result[field.id] = value;
      }
    } else if (field.type === 'checkbox') {
      if (Array.isArray(value)) {
        const validOptionValues = field.options.map((o) => o.value);
        // filter orphaned option values; empty result is a valid empty selection
        const filtered = value.filter((v) => validOptionValues.includes(v));
        result[field.id] = filtered;
      }
      // type mismatch (was text string) → silent discard
    }
  }

  return result;
}

export type UseFormReturn = {
  values: FormValues;
  errors: FormErrors;
  submitted: boolean;
  savedData: FormValues | null;
  isValid: boolean;
  isSubmitting: boolean;
  storageError: string | null;
  setValue: (id: string, value: FormFieldValue) => void;
  handleSubmit: () => Promise<void>;
  handleClear: () => Promise<void>;
  handleEdit: () => void;
};

export function useForm(config: FormConfig): UseFormReturn {
  const [values, setValues]             = useState<FormValues>({});
  const [errors, setErrors]             = useState<FormErrors>({});
  const [submitted, setSubmitted]       = useState(false);
  const [savedData, setSavedData]       = useState<FormValues | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);

  // Raw storage data is kept so we can re-sanitize if config.fields changes
  // (e.g. a field is removed then added back during development hot-reload).
  const rawRef = useRef<FormValues | null>(null);

  useEffect(() => {
    loadFormData()
      .then((raw) => {
        // {} is truthy — check for actual content before treating as saved data
        if (!raw || Object.keys(raw).length === 0) return;

        rawRef.current = raw;

        const clean = sanitizeLoadedValues(config.fields, raw);
        if (Object.keys(clean).length === 0) return;

        setValues(clean);

        // Only enter the result view when all required fields still pass.
        // If config changed (added a required field, removed an option, etc.),
        // stay in form view so the user can fill in what is now missing.
        const errs = validateForm(config.fields, clean);
        if (Object.keys(errs).length === 0) {
          setSavedData(clean);
          setSubmitted(true);
        }
        // else: pre-populate the form and let the user fix/complete the data
      })
      .catch(() => {
        setStorageError('Não foi possível restaurar os dados salvos.');
      });
  // Load from storage exactly once on mount — config is stable at this point
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-sync values and savedData when config.fields changes at runtime
  // (handles hot-reload scenarios where a field is removed then re-added).
  const fieldKey = useMemo(
    () => config.fields.map((f) => f.id).join('\x00'),
    [config.fields],
  );
  const prevFieldKeyRef = useRef(fieldKey);
  useEffect(() => {
    if (fieldKey === prevFieldKeyRef.current) return;
    prevFieldKeyRef.current = fieldKey;
    const raw = rawRef.current;
    if (!raw) return;

    const clean = sanitizeLoadedValues(config.fields, raw);
    const fieldIds = new Set(config.fields.map((f) => f.id));

    setValues((prev) => {
      const next = { ...prev };
      let changed = false;
      // Restore values for fields that came back into the config
      for (const field of config.fields) {
        if (clean[field.id] !== undefined && prev[field.id] === undefined) {
          next[field.id] = clean[field.id];
          changed = true;
        }
      }
      // Drop values for fields no longer in config
      for (const key of Object.keys(next)) {
        if (!fieldIds.has(key)) {
          delete next[key];
          changed = true;
        }
      }
      return changed ? next : prev;
    });

    setSavedData((prev) => {
      if (!prev) return prev;
      const next = { ...prev };
      let changed = false;
      for (const field of config.fields) {
        if (clean[field.id] !== undefined && prev[field.id] === undefined) {
          next[field.id] = clean[field.id];
          changed = true;
        }
      }
      for (const key of Object.keys(next)) {
        if (!fieldIds.has(key)) {
          delete next[key];
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fieldKey]);

  const isValid = useMemo(
    () => Object.keys(validateForm(config.fields, values)).length === 0,
    [config.fields, values],
  );

  const setValue = useCallback((id: string, value: FormFieldValue) => {
    setValues((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return;

    const errs = validateForm(config.fields, values);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setIsSubmitting(true);
    setStorageError(null);

    // Save only keys that exist in the current config — drops stale keys from old sessions
    const toSave: FormValues = {};
    for (const field of config.fields) {
      const v: FormFieldValue | undefined = values[field.id];
      if (v !== undefined) toSave[field.id] = v;
    }

    try {
      await saveFormData(toSave);
      setSavedData({ ...toSave });
      setSubmitted(true);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Erro desconhecido';
      setStorageError(`Falha ao salvar: ${msg}`);
    } finally {
      setIsSubmitting(false);
    }
  }, [config.fields, isSubmitting, values]);

  const handleClear = useCallback(async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setStorageError(null);
    try {
      await clearFormData();
      setValues({});
      setErrors({});
      setSavedData(null);
      setSubmitted(false);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Erro desconhecido';
      setStorageError(`Falha ao limpar dados: ${msg}`);
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting]);

  const handleEdit = useCallback(() => {
    setSubmitted(false);
  }, []);

  return {
    values,
    errors,
    submitted,
    savedData,
    isValid,
    isSubmitting,
    storageError,
    setValue,
    handleSubmit,
    handleClear,
    handleEdit,
  };
}
