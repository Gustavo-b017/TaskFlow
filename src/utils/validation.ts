import type { FormField, FormValues } from '../types/form';

export type FormErrors = Record<string, string>;

export function validateForm(fields: FormField[], values: FormValues): FormErrors {
  const errors: FormErrors = {};

  for (const field of fields) {
    const value = values[field.id];

    // Bug fix: options:[] + required → campo inviável → erro de config, não de usuário
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
      // Bug fix: switch required:true → value=false deve falhar (não apenas undefined)
      if (field.type === 'switch') {
        if (value !== true) {
          errors[field.id] = `${field.label} é obrigatório`;
          continue;
        }
      } else {
        // Bug fix: option.value='' → '' é tratado como vazio → bloqueado
        // Para radio/select: required significa que um valor não-vazio deve estar selecionado
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
      if (!/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
        errors[field.id] = 'Formato inválido (DD/MM/AAAA)';
      }
    }
  }

  return errors;
}
