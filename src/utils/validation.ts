import type { FormField, FormValues } from '../types/form';

export type FormErrors = Record<string, string>;

export function validateForm(fields: FormField[], values: FormValues): FormErrors {
  const errors: FormErrors = {};

  for (const field of fields) {
    const value: FormValues[string] | undefined = values[field.id];

    // Config error: options array empty on a selection field → unresolvable required
    if (
      (field.type === 'radio' || field.type === 'select' || field.type === 'checkbox') &&
      field.options.length === 0
    ) {
      if (field.required) {
        errors[field.id] = `${field.label}: sem opções disponíveis (verifique o JSON)`;
      }
      continue;
    }

    if (field.required) {
      if (field.type === 'switch') {
        // switch required:true → only true passes; false/undefined both fail
        if (value !== true) {
          errors[field.id] = `${field.label} é obrigatório`;
          continue;
        }
      } else {
        const isEmpty =
          value === undefined ||
          value === null ||
          value === '' ||
          (Array.isArray(value) && value.length === 0);

        if (isEmpty) {
          errors[field.id] = `${field.label} é obrigatório`;
          continue;
        }
      }
    }

    // --- Format validations (run even when not required, if a value is present) ---

    if (field.type === 'email' && typeof value === 'string' && value.length > 0) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        errors[field.id] = 'E-mail inválido';
      }
    }

    if (field.type === 'number' && typeof value === 'string' && value.length > 0) {
      if (isNaN(Number(value))) {
        errors[field.id] = `${field.label} deve ser um número`;
      }
    }

    if (field.type === 'date' && typeof value === 'string' && value.length > 0) {
      const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
      const match = dateRegex.exec(value);
      if (!match) {
        errors[field.id] = 'Formato inválido (DD/MM/AAAA)';
      } else {
        const dayStr   = match[1];
        const monthStr = match[2];
        const yearStr  = match[3];
        if (!dayStr || !monthStr || !yearStr) {
          errors[field.id] = 'Formato inválido (DD/MM/AAAA)';
        } else {
          const day   = Number(dayStr);
          const month = Number(monthStr);
          const year  = Number(yearStr);
          const d = new Date(year, month - 1, day);
          const isCalendarValid =
            d.getFullYear() === year  &&
            d.getMonth()    === month - 1 &&
            d.getDate()     === day;
          if (!isCalendarValid) {
            errors[field.id] = 'Data inválida';
          }
        }
      }
    }

    // Defense-in-depth: radio/select value must be in current options.
    // sanitizeLoadedValues already removes orphans on load, but this catches
    // any value that bypassed sanitize (e.g., stale in-memory state).
    if (
      (field.type === 'radio' || field.type === 'select') &&
      typeof value === 'string' &&
      value.length > 0
    ) {
      const validValues = field.options.map((o) => o.value).filter((v) => v !== '');
      if (!validValues.includes(value)) {
        errors[field.id] = `${field.label}: opção não disponível`;
      }
    }
  }

  return errors;
}
