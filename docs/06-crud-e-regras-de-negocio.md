# CRUD e Regras de Negocio

## CRUD de Tarefas

O CRUD completo e executado pelo TaskContext e acessado pelas screens via hook useTasks(). Somente o perfil admin tem acesso as operacoes de escrita.

| Operacao | Quem pode | Como acessa | Onde acontece |
|---|---|---|---|
| Create | admin | TaskFormScreen (modo criacao) | addTask() no TaskContext |
| Read | admin e user | TaskListScreen, TaskDetailScreen | tasks[] no TaskContext |
| Update | admin | TaskFormScreen (modo edicao, via TaskDetail) | updateTask() no TaskContext |
| Delete | admin | TaskDetailScreen (com confirmacao) | removeTask() no TaskContext |

## Filtros

A lista de tarefas pode ser filtrada por status:

- Todos (sem filtro)
- Pendente
- Em andamento
- Concluida

O filtro e aplicado localmente no estado do TaskContext ou na screen, sem nova chamada ao AsyncStorage.

## Formulario de tarefa

Campos obrigatorios:

- Titulo (string, obrigatorio)
- Descricao (string)
- Status (TaskStatus: 'pendente' | 'em_andamento' | 'concluida')
- Prioridade (TaskPriority: 'baixa' | 'media' | 'alta')
- Categoria (string, buscada via API)

Campos gerados automaticamente:

- id: string unico gerado por generateId()
- createdAt: data de criacao (ISO string)
- updatedAt: data de atualizacao (ISO string, atualizado a cada edicao)
- categoryIcon: icone/imagem da categoria (buscado junto com a categoria via API)

## Validacoes

Regras aplicadas antes de salvar:

- Titulo nao pode ser vazio
- Nao e permitido salvar com campos obrigatorios em branco
- Feedback visual imediato para campos invalidos (borda vermelha + mensagem)

## Exclusao com confirmacao

Antes de excluir uma tarefa, o app exibe um dialogo de confirmacao:

```ts
Alert.alert(
  'Excluir tarefa',
  'Tem certeza que deseja excluir esta tarefa?',
  [
    { text: 'Cancelar', style: 'cancel' },
    { text: 'Excluir', style: 'destructive', onPress: () => removeTask(id) },
  ]
);
```

## Regras de negocio (14 regras completas)

| # | Regra |
|---|---|
| 1 | Titulo e obrigatorio — nao salvar tarefa sem titulo |
| 2 | Nao permitir salvar campos obrigatorios vazios |
| 3 | Cada tarefa deve ter um ID unico gerado automaticamente |
| 4 | Data de criacao gerada automaticamente no momento do addTask |
| 5 | Data de atualizacao gerada automaticamente a cada updateTask |
| 6 | Edicao preserva o ID original da tarefa |
| 7 | Exclusao exige confirmacao visual do usuario antes de executar |
| 8 | Empty state deve ser exibido quando a lista estiver vazia |
| 9 | Persistencia local: toda operacao de CRUD e refletida no AsyncStorage |
| 10 | O app deve consumir pelo menos uma API externa (frase motivacional + categorias) |
| 11 | Loading e erros de rede devem ser tratados e exibidos ao usuario |
| 12 | A navegacao deve combinar Stack + Bottom Tabs |
| 13 | O uso de `any` e proibido em todo o codigo |
| 14 | Somente admin pode criar, editar e excluir tarefas — a UI oculta essas acoes para o perfil user |

## Controle de acesso por perfil

O controle de acesso e feito nas screens com base no campo `role` do usuario autenticado, obtido via `useAuth()`. Os elementos de escrita (botao de adicionar, botoes de editar e excluir) sao renderizados condicionalmente:

```ts
const { user } = useAuth();
const isAdmin = user?.role === 'admin';

// Exemplo: botao de adicionar tarefa visivel apenas para admin
{isAdmin && (
  <CustomButton title="Nova Tarefa" onPress={handleNavigateToForm} />
)}
```

O usuario com perfil `user` consegue visualizar e filtrar tarefas normalmente, mas nao ve os controles de escrita na interface.
