# Estado Global e Hooks Customizados

## Regra fundamental

Estado global nao deve ser gerenciado com useState nas screens. Todo estado compartilhado entre telas vive nos contextos (AuthContext, TaskContext, ThemeContext) e e acessado via hooks customizados.

## AuthContext

Responsabilidade: gerenciar quem esta logado e decidir qual bloco de rotas exibir.

```ts
// src/context/AuthContext.tsx

interface AuthContextData {
  user: User | null;
  loading: boolean;
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}
```

- `user`: dados do usuario logado ou null se nao autenticado
- `loading`: true enquanto o app verifica a sessao salva no AsyncStorage ao iniciar
- `signIn`: valida credenciais contra os usuarios hardcoded, salva sessao no AsyncStorage, atualiza user
- `signOut`: remove sessao do AsyncStorage, define user como null

Fluxo de inicializacao:

1. App abre -> loading: true
2. AuthContext le AsyncStorage buscando sessao salva
3. Se encontrou -> user = dados salvos, loading: false -> AppRoutes
4. Se nao encontrou -> user = null, loading: false -> AuthRoutes

## TaskContext

Responsabilidade: gerenciar o CRUD completo de tarefas e sincronizar com AsyncStorage.

```ts
// src/context/TaskContext.tsx

interface TaskContextData {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTask: (id: string, data: Partial<Task>) => Promise<void>;
  removeTask: (id: string) => Promise<void>;
  loading: boolean;
}
```

- `tasks`: lista de tarefas carregadas do AsyncStorage
- `addTask`: cria tarefa com ID unico (generateId) e datas automaticas, salva no AsyncStorage
- `updateTask`: atualiza tarefa existente, atualiza updatedAt, salva no AsyncStorage
- `removeTask`: remove tarefa da lista e do AsyncStorage
- `loading`: true durante operacoes assincronas

## ThemeContext

Responsabilidade: controlar o tema atual e persistir a preferencia.

```ts
// src/context/ThemeContext.tsx

type Theme = 'light' | 'dark';

interface ThemeContextData {
  theme: Theme;
  toggleTheme: () => void;
}
```

- `theme`: tema atual ('light' ou 'dark')
- `toggleTheme`: alterna entre os temas e salva a preferencia no AsyncStorage
- Ao iniciar o app, le o tema salvo no AsyncStorage e aplica

## Hooks customizados

Os hooks sao a interface entre as screens e os contextos. Cada screen usa o hook, nao o contexto diretamente.

```ts
// src/hooks/useTasks.ts — exemplo de hook customizado obrigatorio
export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) throw new Error('useTasks deve ser usado dentro de TaskProvider');
  return context;
}

// useAuth e useTheme seguem o mesmo padrao
```

Vantagens dos hooks customizados:

- Codigo mais limpo nas screens — uma linha para acessar dados e funcoes
- Validacao de uso correto do contexto (erro claro se usado fora do Provider)
- Facilita testes — o hook pode ser mockado sem alterar a screen

## Hierarquia de Providers

```tsx
// App.tsx
<ThemeProvider>
  <AuthProvider>
    <TaskProvider>
      <NavigationContainer>
        {/* rotas */}
      </NavigationContainer>
    </TaskProvider>
  </AuthProvider>
</ThemeProvider>
```

A ordem importa: ThemeProvider fica mais externo porque nao depende de autenticacao. AuthProvider envolve o TaskProvider porque as tarefas so existem no contexto de um usuario autenticado. O NavigationContainer fica dentro de todos os providers para que qualquer tela tenha acesso ao contexto global.
