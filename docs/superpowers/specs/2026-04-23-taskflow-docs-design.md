# Spec: Reescrita da Documentação do TaskFlow

**Data:** 2026-04-23
**Status:** Aprovado pelo usuário

---

## Contexto

O TaskFlow é um app educacional open source de gerenciamento de tarefas em React Native + TypeScript. A documentação existente estava incompleta e desalinhada com o CP2.md (fonte de requisitos da prova). O objetivo desta reescrita é produzir uma **fonte da verdade técnica** completa: o que foi construído, como, com o que, por quê.

---

## Decisões de Design

### 1. Estrutura de arquivos

Substituir os 8 arquivos numerados atuais por 10 capítulos + README reescrito:

```
docs/
  README.md
  00-visao-geral.md
  01-arquitetura-e-shared.md
  02-tipos-e-modelos.md
  03-autenticacao-e-permissoes.md
  04-navegacao.md
  05-estado-global-e-hooks.md
  06-crud-e-regras-de-negocio.md
  07-componentes-e-ui-mobile.md
  08-persistencia-e-api.md
  09-padroes-e-padronizacao.md
```

O arquivo `CP2.md` permanece na pasta mas não faz parte da documentação navegável.

### 2. Audiência e tom

Documentação técnica — fonte da verdade do projeto. Não é tutorial passo-a-passo. O leitor entende o que foi construído, como funciona e por que as decisões foram tomadas. Linguagem direta, exemplos de código onde o conceito exige.

### 3. Permissões por perfil (NOVO)

| Ação | `admin` | `user` |
|---|---|---|
| Visualizar tarefas | ✅ | ✅ |
| Criar tarefa | ✅ | ❌ oculto na UI |
| Editar tarefa | ✅ | ❌ oculto na UI |
| Excluir tarefa | ✅ | ❌ oculto na UI |
| Acessar Configurações | ✅ (rota inicial após login) | ✅ |
| Alterar tema | ✅ | ✅ |
| Alterar preferência de tratamento | ✅ | ✅ |

**Regra de UI:** botões e rotas de ação são completamente ocultos para perfis sem permissão. Nenhum estado desabilitado ou tooltip — o elemento simplesmente não existe na tela.

**Implementação:** o `AuthContext` expõe o `user.role`. Componentes e screens consultam o role via `useAuth()` e renderizam condicionalmente.

### 4. Pasta `shared/` (NOVO)

```
src/shared/
  components/     ← componentes genéricos sem vínculo com feature
  hooks/          ← hooks reutilizáveis entre features
  utils/          ← funções utilitárias puras
  constants/      ← valores fixos do app (cores, tamanhos, chaves AsyncStorage)
  types/          ← tipos base compartilhados
```

**Regra de ouro:** se um componente, hook, util ou tipo é usado por mais de uma feature, ele mora em `shared/`. Se é específico de uma feature, mora junto à feature.

Diferença de `components/` (atual):
- `src/components/` → componentes de UI específicos do app (TaskCard, Header, FilterBar)
- `src/shared/components/` → componentes verdadeiramente genéricos (Button, Input, Badge)

### 5. UI Mobile-First (NOVO)

- **SafeAreaView** em todas as telas para respeitar notch e barra de status
- **Tamanho mínimo de toque:** 44x44dp em todos os elementos interativos
- **FlatList** para toda listagem — nunca ScrollView com map()
- **Densidade de pixels:** usar unidades relativas, não pixels fixos
- **Teclado:** `KeyboardAvoidingView` em formulários
- **Tema:** dark/light aplicado via ThemeContext em todos os StyleSheets

### 6. Conteúdo de cada arquivo

**`README.md`**
- O que é o TaskFlow e seu propósito educacional
- Mapa de capítulos com links
- Critérios de avaliação (funcionalidade 45%, código 25%, UI 20%, apresentação 10%)
- Requisitos de entrega (código + vídeo 3-7min via Teams, máx 5 pessoas, data 29/04/2026)
- Referências oficiais

**`00-visao-geral.md`**
- Descrição do app e propósito educacional
- O que o usuário pode fazer no app
- 10 temas de aprendizado (do CP2)
- Conceitos React Native aplicados (View, Text, TextInput, TouchableOpacity/Pressable, FlatList, StyleSheet, useState, useEffect, Context API, eventos, renderização condicional)
- Tecnologias utilizadas com justificativa de cada escolha
- Diferenciais (animações, validação avançada, loading states)
- Regras de ouro do projeto

**`01-arquitetura-e-shared.md`**
- Estrutura completa de pastas (`src/` + `shared/`)
- Separação de responsabilidades (screens → UI, hooks → lógica, services → I/O, context → estado, shared → reutilização)
- Explicação de cada pasta e o que pertence a ela
- Regra da pasta `shared/`
- Por que ESModules

**`02-tipos-e-modelos.md`**
- Regra absoluta: sem `any`
- O que deve ser tipado (props, estados, funções, eventos, API, contextos, navegação, parâmetros de rota)
- Modelo de dados: `TaskStatus`, `TaskPriority`, `Task`, `User`
- Tipos de navegação: `TaskStackParamList`, `TabParamList`

**`03-autenticacao-e-permissoes.md`**
- Tela de login (campos, validação, erro)
- Usuários hardcoded com código
- Regras de autenticação (redirecionamento por role, sessão, auto-login, logout)
- Matriz completa de permissões por role
- Como implementar: AuthContext + useAuth() + renderização condicional

**`04-navegacao.md`**
- Stack Navigation + Bottom Tabs Navigation
- AuthRoutes vs AppRoutes
- HomeStack, TaskStack, SettingsStack
- Conteúdo de cada aba
- Navegações esperadas (5 fluxos)
- Por que esta estrutura

**`05-estado-global-e-hooks.md`**
- Regra: sem useState global nas telas
- AuthContext: user, signIn, signOut, loading
- TaskContext: tasks, addTask, updateTask, removeTask (+ sync AsyncStorage)
- ThemeContext: theme, toggleTheme (+ AsyncStorage)
- Hooks customizados: useAuth, useTasks, useTheme
- Vantagens da separação

**`06-crud-e-regras-de-negocio.md`**
- CRUD explícito: Create, Read, Update, Delete
- Filtros de status (pendente, em andamento, concluída)
- Todas as 12 regras de negócio do CP2
- Validações de formulário
- Confirmação de exclusão

**`07-componentes-e-ui-mobile.md`**
- Os 7 componentes obrigatórios com responsabilidade de cada um
- Mobile-first: SafeAreaView, tap targets, KeyboardAvoidingView, FlatList
- FlatList: todos os requisitos de campos a exibir
- Princípios de UI: layout limpo, cores por status, inputs estilizados, loading, feedback, empty state, erro
- Dark/Light theme

**`08-persistencia-e-api.md`**
- AsyncStorage: o que salva (sessão, tarefas, tema), como funciona
- API externa: casos de uso (frase motivacional, categorias, ícones)
- Demonstrar: fetch/axios, loading, erro, atualização da interface
- Sugestões de APIs públicas

**`09-padroes-e-padronizacao.md`**
- Nomenclatura: PascalCase para componentes/tipos, camelCase para funções/variáveis, kebab-case para arquivos de rota
- Regras da pasta shared/
- Padrão de exports (named exports, sem default em contextos)
- Organização de imports (externos → internos → tipos)
- Diferenciais documentados: animações, validação avançada, loading states

---

## Arquivos a remover/substituir

Os seguintes arquivos serão substituídos:
- `01-objetivos-e-tecnologias.md`
- `02-arquitetura-e-pastas.md`
- `03-modelagem-e-typescript.md`
- `04-autenticacao-e-fluxo.md`
- `05-navegacao-profissional.md`
- `06-estado-global-context-api.md`
- `07-componentizacao-e-ui.md`
- `08-persistencia-e-api.md`

O `CP2.md` e o `README.md` existente também serão reescritos.

---

## Fora do escopo

- Código de implementação do app (somente documentação)
- Mudanças na estrutura de pastas do projeto (somente docs/)
- Tutorial passo-a-passo — a doc é referência técnica, não curso
