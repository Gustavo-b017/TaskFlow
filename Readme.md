# CP3 — Formulários Dinâmicos a partir de JSON

Aplicativo mobile desenvolvido com **React Native**, **Expo SDK 55** e **TypeScript**.  
O formulário é construído automaticamente a partir de uma estrutura JSON — nenhum campo é criado manualmente.  
Suporta Android, iOS e Web com persistência local via AsyncStorage.

---

## Integrantes

- Gabriel Mediotti Marques — RM 552632
- Gustavo Bezerra Assumção — RM 553076
- Jó Sales — RM 552679
- Miguel Garcez de Carvalho — RM 553768
- Vinicius Souza e Silva — RM 552781

---

## Tecnologias utilizadas

| Pacote | Versão | Finalidade |
|---|---|---|
| `expo` | ~55.0.8 | Toolchain e runtime |
| `react-native` | 0.83.2 | Framework mobile multiplataforma |
| `react` | 19.2.0 | Biblioteca de UI |
| `typescript` | ~5.9.2 | Tipagem estática — sem uso de `any` |
| `@react-native-async-storage/async-storage` | 2.2.0 | Persistência local |
| `react-native-safe-area-context` | ~5.6.2 | Safe area iOS/Android |
| `react-native-web` | ^0.21.0 | Suporte à execução no navegador |

---

## Como executar o projeto

### Pré-requisitos

- Node.js 18 ou superior
- [Expo Go](https://expo.dev/client) instalado no celular **ou** emulador configurado

### Instalação

```bash
git clone <url-do-repositorio>
cd TaskFlow
npm install
```

### Execução

```bash
# Inicia com opções para Android / iOS / Web
npx expo start

# Inicia direto no navegador
npx expo start --web
```

Após iniciar, pressione no terminal:

- `a` — abrir no emulador Android
- `i` — abrir no simulador iOS
- `w` — abrir no navegador (web)

---

## Formulário Dinâmico

O formulário é gerado a partir do JSON em `src/config/formConfig.ts`.  
Para alterar campos, edite apenas esse arquivo — nenhum componente precisa ser modificado.

```ts
const formConfig = {
  title: 'Cadastro de Usuário',
  fields: [
    { id: 'name',          label: 'Nome',                 type: 'text',      required: true  },
    { id: 'email',         label: 'E-mail',               type: 'email',     required: true  },
    { id: 'password',      label: 'Senha',                type: 'password',  required: true  },
    { id: 'age',           label: 'Idade',                type: 'number',    required: false },
    { id: 'bio',           label: 'Biografia',            type: 'multiline', required: false },
    { id: 'gender',        label: 'Gênero',               type: 'radio',     required: true,  options: [...] },
    { id: 'state',         label: 'Estado',               type: 'select',    required: true,  options: [...] },
    { id: 'interests',     label: 'Interesses',           type: 'checkbox',  required: false, options: [...] },
    { id: 'notifications', label: 'Receber notificações', type: 'switch',    required: false },
    { id: 'birthDate',     label: 'Data de nascimento',   type: 'date',      required: true  },
  ],
};
```

### Tipos de campo suportados

| Tipo | Componente | Descrição |
|---|---|---|
| `text` | `TextFieldInput` | Campo de texto simples |
| `email` | `TextFieldInput` | Teclado e-mail + validação de formato |
| `password` | `TextFieldInput` | Texto oculto |
| `number` | `TextFieldInput` | Teclado numérico + validação |
| `multiline` / `textarea` | `MultilineFieldInput` | Área de texto multilinha |
| `select` | `SelectFieldInput` | Lista suspensa (bottom sheet modal) |
| `radio` | `RadioFieldInput` | Seleção única entre opções |
| `checkbox` | `CheckboxFieldInput` | Seleção múltipla entre opções |
| `switch` | `SwitchFieldInput` | Toggle on/off |
| `date` | `DateFieldInput` | Máscara automática DD/MM/AAAA |

---

## Funcionalidades

- Formulário gerado 100% via JSON — zero campos criados manualmente
- Validação de campos obrigatórios, formato de e-mail, data e número
- AsyncStorage: salva ao submeter, recupera ao abrir o app, permite limpar
- Tela de resultado após submit com todos os dados salvos
- Botões "Editar" e "Limpar dados" na tela de resultado
- Layout Flexbox + StyleSheet em todos os componentes
- Funciona em Android, iOS e Web

---

## Hooks utilizados

| Hook | Localização | Finalidade |
|---|---|---|
| `useState` | `useForm` | Controla `values`, `errors`, `submitted`, `savedData` |
| `useEffect` | `useForm` | Carrega dados do AsyncStorage ao montar |
| `useMemo` | `useForm`, `SelectFieldInput`, `FormResult` | Derivações sem re-render desnecessário |
| `useCallback` | `useForm` | Funções estáveis: `setValue`, `handleSubmit`, `handleClear`, `handleEdit` |

---

## Estrutura de pastas

```
TaskFlow/
├── App.tsx
├── index.ts
├── app.json
├── package.json
└── src/
    ├── types/
    │   └── form.ts              # Tipos TypeScript do formulário (sem any)
    ├── config/
    │   └── formConfig.ts        # JSON de configuração do formulário
    ├── services/
    │   └── storage.ts           # AsyncStorage: save / load / clear
    ├── utils/
    │   └── validation.ts        # Validação de campos obrigatórios e formatos
    ├── hooks/
    │   └── useForm.ts           # Hook principal: state, efeitos, submit, clear
    ├── components/
    │   ├── DynamicField.tsx     # Switch por tipo → renderiza componente correto
    │   ├── FormResult.tsx       # Exibe dados salvos após submit
    │   └── fields/
    │       ├── TextFieldInput.tsx
    │       ├── MultilineFieldInput.tsx
    │       ├── SelectFieldInput.tsx
    │       ├── RadioFieldInput.tsx
    │       ├── CheckboxFieldInput.tsx
    │       ├── SwitchFieldInput.tsx
    │       └── DateFieldInput.tsx
    └── screens/
        └── FormScreen.tsx       # Tela principal
```

---

## Prints da aplicação

> ⚠️ Adicionar prints antes da entrega (20/05/2026).
