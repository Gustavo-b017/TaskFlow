# Tipos e Modelos de Dados

## Regra absoluta: sem `any`

E terminantemente proibido o uso de `any` em qualquer parte do codigo. O TypeScript existe para garantir contratos claros entre as partes do sistema.

## O que deve ser tipado

Lista completa:

- Props: todas as propriedades passadas entre componentes
- Estados: o tipo de cada useState
- Funcoes: parametros e retorno
- Eventos: handlers de touch, change, submit
- Respostas de API: interfaces definidas para cada resposta externa
- Contextos: o contrato de cada Context
- Navegacao: as rotas e seus parametros
- Parametros de rota: o que cada tela recebe ao ser aberta

## Modelo de dados — Tarefa

```ts
// src/types/task.ts

export type TaskStatus = 'pendente' | 'em_andamento' | 'concluida';
export type TaskPriority = 'baixa' | 'media' | 'alta';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  category: string;
  categoryIcon: string;
  createdAt: string;
  updatedAt: string;
}
```

## Modelo de dados — Usuario

```ts
// src/types/user.ts

export type UserRole = 'admin' | 'user';

export interface User {
  id: number;
  username: string;
  password: string;
  role: UserRole;
  name: string;
}
```

## Tipagem de navegacao

```ts
// src/types/navigation.ts

export type TaskStackParamList = {
  TaskList: undefined;
  TaskForm: { taskId?: string }; // opcional na criacao, obrigatorio na edicao
  TaskDetail: { taskId: string };
};

export type TabParamList = {
  Home: undefined;
  Tasks: undefined;
  Settings: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
};
```

## Exemplo de tipagem de props

```ts
// Exemplo: props de um componente de card de tarefa
interface TaskCardProps {
  task: Task;
  onPress: (taskId: string) => void;
}
```

## Exemplo de tipagem de contexto

```ts
// Contrato do AuthContext
interface AuthContextData {
  user: User | null;
  loading: boolean;
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}
```
