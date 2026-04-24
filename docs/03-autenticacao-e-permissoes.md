# Autenticacao e Permissoes

## Tela de Login

A aplicacao inicia obrigatoriamente na tela de Login. Ela contem:

- Campo de usuario (TextInput)
- Campo de senha (TextInput com secureTextEntry)
- Botao de login (aciona a validacao)
- Mensagem de erro (exibida somente quando as credenciais sao invalidas)

## Usuarios hardcoded

Para fins didaticos, os usuarios sao definidos diretamente no codigo:

```ts
// src/context/AuthContext.tsx

const users: User[] = [
  {
    id: 1,
    username: 'admin',
    password: '123',
    role: 'admin',
    name: 'Administrador',
  },
  {
    id: 2,
    username: 'user',
    password: '123',
    role: 'user',
    name: 'Usuario Comum',
  },
];
```

## Regras de autenticacao

Apos login bem-sucedido:

- Perfil `admin` — navega para a aba Configuracoes
- Perfil `user` — navega para a aba Home
- Credenciais invalidas — exibe mensagem de erro, nao navega

Sessao:

- Os dados do usuario logado sao salvos no AsyncStorage
- Ao reabrir o app, se houver sessao salva, vai direto para a area logada (auto-login)
- No logout, todos os dados de sessao sao removidos do AsyncStorage

## Matriz de permissoes por perfil

| Acao                              | admin                         | user |
|-----------------------------------|-------------------------------|------|
| Visualizar lista de tarefas       | Sim                           | Sim  |
| Ver detalhes de uma tarefa        | Sim                           | Sim  |
| Criar tarefa                      | Sim                           | Nao  |
| Editar tarefa                     | Sim                           | Nao  |
| Excluir tarefa                    | Sim                           | Nao  |
| Filtrar tarefas por status        | Sim                           | Sim  |
| Acessar aba Configuracoes         | Sim (rota inicial apos login) | Sim  |
| Alterar tema                      | Sim                           | Sim  |
| Alterar preferencia de tratamento | Sim                           | Sim  |

## Regra de UI para permissoes

Botoes e rotas de acao sao completamente **ocultos** para perfis sem permissao. O elemento simplesmente nao existe na tela — nenhum estado desabilitado, nenhum tooltip.

Implementacao:

```ts
// Dentro de uma screen ou componente
const { user } = useAuth();

// O botao de criar tarefa so e renderizado para admin
{user?.role === 'admin' && (
  <CustomButton title="Nova Tarefa" onPress={handleCreate} />
)}
```

## AuthContext

O gerenciamento de autenticacao acontece no AuthContext:

```ts
interface AuthContextData {
  user: User | null;
  loading: boolean;          // true enquanto verifica sessao no AsyncStorage ao abrir o app
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}
```

- `loading: true` enquanto o app verifica a sessao salva — exibe splash ou loading screen
- `loading: false` e `user: null` — exibe tela de Login
- `loading: false` e `user: User` — exibe as abas (area logada)
