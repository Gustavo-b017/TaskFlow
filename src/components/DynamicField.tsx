import React from 'react';
import type { FormField, FormFieldValue } from '../types/form';
import { TextFieldInput }      from './fields/TextFieldInput';
import { MultilineFieldInput } from './fields/MultilineFieldInput';
import { SelectFieldInput }    from './fields/SelectFieldInput';
import { RadioFieldInput }     from './fields/RadioFieldInput';
import { CheckboxFieldInput }  from './fields/CheckboxFieldInput';
import { SwitchFieldInput }    from './fields/SwitchFieldInput';
import { DateFieldInput }      from './fields/DateFieldInput';

type Props = {
  field: FormField;
  value: FormFieldValue | undefined;
  error?: string | undefined;
  onChange: (id: string, value: FormFieldValue) => void;
};

export function DynamicField({ field, value, error, onChange }: Props) {
  const { id, label, required } = field;

  switch (field.type) {
    case 'text':
    case 'email':
    case 'password':
    case 'number':
      return (
        <TextFieldInput
          label={label}
          type={field.type}
          value={typeof value === 'string' ? value : ''}
          error={error}
          required={required}
          onChange={(v) => onChange(id, v)}
        />
      );

    case 'multiline':
    case 'textarea':
      return (
        <MultilineFieldInput
          label={label}
          value={typeof value === 'string' ? value : ''}
          error={error}
          required={required}
          onChange={(v) => onChange(id, v)}
        />
      );

    case 'select':
      return (
        <SelectFieldInput
          label={label}
          options={field.options}
          value={typeof value === 'string' ? value : ''}
          error={error}
          required={required}
          onChange={(v) => onChange(id, v)}
        />
      );

    case 'radio':
      return (
        <RadioFieldInput
          label={label}
          options={field.options}
          value={typeof value === 'string' ? value : ''}
          error={error}
          required={required}
          onChange={(v) => onChange(id, v)}
        />
      );

    case 'checkbox':
      return (
        <CheckboxFieldInput
          label={label}
          options={field.options}
          value={Array.isArray(value) ? value : []}
          error={error}
          required={required}
          onChange={(v) => onChange(id, v)}
        />
      );

    case 'switch':
      return (
        <SwitchFieldInput
          label={label}
          value={typeof value === 'boolean' ? value : false}
          required={required}
          onChange={(v) => onChange(id, v)}
        />
      );

    case 'date':
      return (
        <DateFieldInput
          label={label}
          value={typeof value === 'string' ? value : ''}
          error={error}
          required={required}
          onChange={(v) => onChange(id, v)}
        />
      );
  }
}
