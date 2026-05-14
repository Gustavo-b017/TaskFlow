import type { FormConfig } from '../types/form';

export const formConfig: FormConfig = {
  title: 'Cadastro de Usuário',
  fields: [
    { id: 'name',     label: 'Nome',   type: 'text',     required: true  },
    { id: 'email',    label: 'E-mail', type: 'email',    required: true  },
    { id: 'password', label: 'Senha',  type: 'password', required: true  },
    { id: 'age',      label: 'Idade',  type: 'number',   required: false },
    { id: 'bio',      label: 'Biografia', type: 'multiline', required: false },
    {
      id: 'gender',
      label: 'Gênero',
      type: 'radio',
      required: true,
      options: [
        { label: 'Masculino', value: 'male'   },
        { label: 'Feminino',  value: 'female' },
        { label: 'Outro',     value: 'other'  },
      ],
    },
    {
      id: 'state',
      label: 'Estado',
      type: 'select',
      required: true,
      options: [
        { label: 'SP', value: 'SP' },
        { label: 'RJ', value: 'RJ' },
        { label: 'MG', value: 'MG' },
        { label: 'RS', value: 'RS' },
        { label: 'BA', value: 'BA' },
        { label: 'PR', value: 'PR' },
        { label: 'SC', value: 'SC' },
      ],
    },
    {
      id: 'interests',
      label: 'Interesses',
      type: 'checkbox',
      required: false,
      options: [
        { label: 'Esportes',   value: 'sports' },
        { label: 'Arte',       value: 'art'    },
        { label: 'Música',     value: 'music'  },
      ],
    },
    { id: 'notifications', label: 'Receber notificações', type: 'switch', required: false },
    { id: 'birthDate',     label: 'Data de nascimento',   type: 'date',   required: true  },
  ],
};
