# Persistência e API Externa

## AsyncStorage

O AsyncStorage é o mecanismo de persistência local do app. Ele salva dados como strings JSON no dispositivo.

O que é salvo:

| Chave | Conteúdo | Quando salva | Quando lê |
|---|---|---|---|
| @taskflow:user | Dados do usuário logado (User) | No signIn | Na inicialização do app (auto-login) |
| @taskflow:tasks | Array de tarefas (Task[]) | A cada operação de CRUD | Na inicialização do TaskContext |
| @taskflow:theme | Tema preferido ('light' ou 'dark') | No toggleTheme | Na inicialização do ThemeContext |

As chaves do AsyncStorage devem ser centralizadas em shared/constants/storageKeys.ts para evitar erros de digitação:

```ts
// src/shared/constants/storageKeys.ts
export const STORAGE_KEYS = {
  USER: '@taskflow:user',
  TASKS: '@taskflow:tasks',
  THEME: '@taskflow:theme',
} as const;
```

Como funciona:

```ts
// Salvar
await AsyncStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));

// Ler
const raw = await AsyncStorage.getItem(STORAGE_KEYS.TASKS);
const tasks: Task[] = raw ? JSON.parse(raw) : [];
```

O serviço de persistência fica em src/services/taskStorage.ts, separando a lógica de I/O dos contextos.

## API Externa

O app consome uma API externa para complementar funcionalidades. São usadas APIs públicas como JSONPlaceholder ou DummyJSON.

Casos de uso:

| Funcionalidade | Tela | Fonte sugerida |
|---|---|---|
| Frase motivacional do dia | HomeScreen | API pública de quotes |
| Lista de categorias de tarefas | TaskFormScreen | DummyJSON /products/categories |
| Ícone/imagem representando a categoria | TaskCard, TaskFormScreen | DummyJSON /products |

O serviço de API fica em src/services/api.ts:

```ts
// src/services/api.ts
const BASE_URL = 'https://dummyjson.com';

export async function fetchCategories(): Promise<string[]> {
  const response = await fetch(`${BASE_URL}/products/categories`);
  if (!response.ok) throw new Error('Falha ao buscar categorias');
  return response.json();
}
```

## O que o app deve demonstrar

O uso de API deve demonstrar obrigatoriamente:

1. Fetch ou Axios para chamada HTTP
2. Estado de loading: ActivityIndicator visível enquanto os dados não chegaram
3. Tratamento de erro: mensagem clara se o servidor estiver fora do ar ou sem internet
4. Atualização da interface: dados da API refletem na tela automaticamente via useEffect

Exemplo de padrão:

```ts
const [data, setData] = useState<string[]>([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  async function load() {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchCategories();
      setData(result);
    } catch (e) {
      setError('Não foi possível carregar as categorias.');
    } finally {
      setLoading(false);
    }
  }
  load();
}, []);
```
