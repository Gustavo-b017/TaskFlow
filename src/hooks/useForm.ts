import { useState, useEffect, useMemo, useCallback } from 'react';
import type { FormConfig, FormFieldValue, FormValues } from '../types/form';
import type { FormErrors } from '../utils/validation';
import { validateForm } from '../utils/validation';
import { saveFormData, loadFormData, clearFormData } from '../services/storage';

export type UseFormReturn = {
  values: FormValues;
  errors: FormErrors;
  submitted: boolean;
  savedData: FormValues | null;
  isValid: boolean;
  setValue: (id: string, value: FormFieldValue) => void;
  handleSubmit: () => Promise<void>;
  handleClear: () => Promise<void>;
  handleEdit: () => void;
};

export function useForm(config: FormConfig): UseFormReturn {
  const [values, setValues]       = useState<FormValues>({});
  const [errors, setErrors]       = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [savedData, setSavedData] = useState<FormValues | null>(null);

  useEffect(() => {
    loadFormData().then((data) => {
      if (data) {
        setValues(data);
        setSavedData(data);
        setSubmitted(true);
      }
    });
  }, []);

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
    const errs = validateForm(config.fields, values);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    await saveFormData(values);
    setSavedData({ ...values });
    setSubmitted(true);
  }, [config.fields, values]);

  const handleClear = useCallback(async () => {
    await clearFormData();
    setValues({});
    setErrors({});
    setSavedData(null);
    setSubmitted(false);
  }, []);

  const handleEdit = useCallback(() => {
    setSubmitted(false);
  }, []);

  return {
    values,
    errors,
    submitted,
    savedData,
    isValid,
    setValue,
    handleSubmit,
    handleClear,
    handleEdit,
  };
}
