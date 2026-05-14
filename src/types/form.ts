export type FieldOption = {
  label: string;
  value: string;
};

type BaseField = {
  id: string;
  label: string;
  required: boolean;
};

type TextInputField = BaseField & {
  type: 'text' | 'email' | 'password' | 'number';
};

type MultilineInputField = BaseField & {
  type: 'multiline' | 'textarea';
};

type SelectInputField = BaseField & {
  type: 'select';
  options: FieldOption[];
};

type RadioInputField = BaseField & {
  type: 'radio';
  options: FieldOption[];
};

type CheckboxInputField = BaseField & {
  type: 'checkbox';
  options: FieldOption[];
};

type SwitchInputField = BaseField & {
  type: 'switch';
};

type DateInputField = BaseField & {
  type: 'date';
};

export type FormField =
  | TextInputField
  | MultilineInputField
  | SelectInputField
  | RadioInputField
  | CheckboxInputField
  | SwitchInputField
  | DateInputField;

export type FormConfig = {
  title: string;
  fields: FormField[];
};

export type FormFieldValue = string | boolean | string[];

export type FormValues = Record<string, FormFieldValue>;
