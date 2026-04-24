# Navegacao

## Tecnologia

React Navigation com dois tipos de navegadores combinados:

- Stack Navigation (pilha) — para fluxos de avanco e retorno
- Bottom Tabs Navigation (abas) — para as secoes principais do app

## Estrutura geral

```
App
└── AuthContext (decide qual bloco mostrar)
    ├── AuthRoutes (Stack) — usuario nao autenticado
    │   └── LoginScreen
    └── AppRoutes (Bottom Tabs) — usuario autenticado
        ├── HomeStack (Stack)
        │   └── HomeScreen
        ├── TaskStack (Stack)
        │   ├── TaskListScreen
        │   ├── TaskFormScreen
        │   └── TaskDetailScreen
        └── SettingsStack (Stack)
            └── SettingsScreen
```

## AuthRoutes vs AppRoutes

**AuthRoutes:** stack com apenas a tela de Login. O usuario nao pode sair daqui sem credenciais validas.

**AppRoutes:** bottom tabs com 3 abas. Cada aba tem seu proprio Stack Navigator, isolando o historico de navegacao.

## Conteudo de cada aba

**Home:**

- Mensagem de boas-vindas com nome do usuario
- Frase motivacional do dia (consumida via API)

**Tarefas:**

- Lista de tarefas (TaskListScreen)
- Formulario de criacao/edicao (TaskFormScreen) — acessivel somente para admin
- Detalhe da tarefa (TaskDetailScreen)

**Configuracoes:**

- Alteracao de tema (Dark/Light) — persistido no AsyncStorage
- Perfil do usuario (exibicao de admin/user)
- Preferencia de tratamento (Sr., Sra., Srta.)

## Navegacoes esperadas

| Origem       | Destino                 | Gatilho                                  |
|--------------|-------------------------|------------------------------------------|
| Home         | Aba de Tarefas          | Botao ou acao na HomeScreen              |
| TaskList     | TaskForm (criacao)      | Botao "Nova Tarefa" (somente admin)      |
| TaskList     | TaskDetail              | Toque em um item da lista                |
| TaskDetail   | TaskForm (edicao)       | Botao "Editar" (somente admin)           |
| Qualquer tela | Tela anterior          | Botao voltar da stack                    |

## Tipagem das rotas

```ts
// src/types/navigation.ts

export type TaskStackParamList = {
  TaskList: undefined;
  TaskForm: { taskId?: string };
  TaskDetail: { taskId: string };
};

export type TabParamList = {
  Home: undefined;
  Tasks: undefined;
  Settings: undefined;
};
```

## Por que Stack + Tabs

- **Abas (Bottom Tabs):** acesso rapido as 3 secoes principais sem perder contexto entre elas
- **Pilhas (Stack):** permitem avancar para telas de detalhe e edicao mantendo o historico, com suporte nativo ao botao voltar
- Cada aba com sua propria stack evita conflitos de historico entre secoes diferentes
