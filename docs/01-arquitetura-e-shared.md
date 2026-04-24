# Arquitetura e Estrutura de Pastas

## Separacao de responsabilidades

O projeto segue o principio de separacao de responsabilidades (Separation of Concerns). Cada camada tem uma funcao unica e bem definida. Misturar responsabilidades — por exemplo, colocar chamadas de API diretamente em uma screen — e considerado erro de arquitetura.

| Camada | Pasta | Responsabilidade |
|---|---|---|
| UI | `screens/` | Exibicao visual e captura de eventos do usuario. Nao contem logica de negocio |
| Componentes de dominio | `components/` | Elementos visuais com conhecimento do dominio do app (ex: TaskCard, FilterBar) |
| Logica reutilizavel | `hooks/` | Regras de negocio, acesso a contextos e operacoes que retornam estado reativo |
| I/O | `services/` | Toda comunicacao com AsyncStorage e com APIs externas. Funcoes puras de entrada e saida |
| Estado global | `context/` | Dados compartilhados entre telas via Context API. AuthContext, TaskContext, ThemeContext |
| Reutilizavel entre features | `shared/` | Componentes, hooks, utils, constantes e tipos que servem mais de uma feature |
| Contratos de dados | `types/` | Interfaces e types TypeScript que definem o formato dos dados |
| Utilitarios | `utils/` | Funcoes puras sem side-effects: formatacao, geracao de ID, calculo |
| Rotas | `routes/` | Configuracao declarativa de toda a navegacao do app |

---

## Estrutura completa de pastas

```
src/
  components/
    Header.tsx
    TaskCard.tsx
    FilterBar.tsx

  screens/
    home/
      HomeScreen.tsx
    tasks/
      TaskListScreen.tsx
      TaskFormScreen.tsx
      TaskDetailScreen.tsx
    settings/
      SettingsScreen.tsx

  routes/
    AppRoutes.tsx
    TabRoutes.tsx
    TaskStackRoutes.tsx

  services/
    taskStorage.ts
    api.ts

  context/
    AuthContext.tsx
    TaskContext.tsx
    ThemeContext.tsx

  hooks/
    useTasks.ts

  types/
    task.ts
    user.ts
    navigation.ts

  utils/
    formatDate.ts
    generateId.ts

  shared/
    components/
      CustomButton.tsx
      CustomInput.tsx
      EmptyState.tsx
      StatusBadge.tsx
    hooks/
      useLocalStorage.ts
    utils/
      formatDate.ts
      generateId.ts
    constants/
      theme.ts
      storageKeys.ts
    types/
      common.ts

App.tsx
```

---

## A pasta shared/

### O que e a pasta shared/

`shared/` e o modulo transversal do projeto. Ela contem tudo que e genuinamente reutilizavel entre duas ou mais features distintas. Ao centralizar esses recursos em um unico lugar, o projeto evita duplicacao de codigo, facilita manutencao e garante consistencia visual e comportamental em todo o app.

### O que pertence a shared/

- **Componentes genericos sem vinculo com feature especifica** — botoes, inputs, estados vazios, badges de status. Esses componentes aceitam dados via props e nao dependem de nenhum contexto especifico do dominio.
- **Hooks reutilizaveis entre features** — por exemplo, `useLocalStorage`, que abstrai o acesso ao AsyncStorage de forma generica e pode ser usado por qualquer feature que precise persistir dados.
- **Funcoes utilitarias puras** — `formatDate`, `generateId` e similares. Sao funcoes sem side-effects que operam apenas sobre seus argumentos e retornam um resultado previsivel.
- **Constantes globais** — paleta de cores, tamanhos tipograficos, espacamentos e chaves do AsyncStorage. Centralizar constantes evita magic strings espalhadas pelo codigo.
- **Tipos base compartilhados** — interfaces e types usados em mais de uma feature, como `Nullable<T>`, `ApiResponse<T>` ou constantes de enumeracao.

### O que NAO pertence a shared/

- **Componentes que dependem do dominio** — `TaskCard` conhece a interface `Task` e depende do formato especifico de dados de tarefa. Ele mora em `src/components/`, nao em `shared/`.
- **Screens** — screens sao especificas de uma rota e nunca sao reutilizadas em outro contexto.
- **Logica de negocio de uma feature especifica** — a logica de criacao, edicao e exclusao de tarefas pertence a `hooks/useTasks.ts`, nao a shared/.

### Regra de ouro

> Se um componente, hook, util ou tipo e usado por mais de uma feature, ele mora em `shared/`. Se e especifico de uma unica feature, mora junto a feature.

---

## Diferenca entre components/ e shared/components/

Uma das confusoes mais comuns e saber onde colocar um novo componente. A regra e direta:

| Pasta | O que contem | Exemplos |
|---|---|---|
| `src/components/` | Componentes de UI com conhecimento do dominio do app. Sabem o que e uma Task, um User, um Status. | `TaskCard`, `Header`, `FilterBar` |
| `src/shared/components/` | Componentes genericos sem conhecimento de dominio. Recebem apenas props primitivas ou callbacks. | `CustomButton`, `CustomInput`, `EmptyState`, `StatusBadge` |

Na pratica: se voce consegue usar o componente em qualquer outro app React Native sem modificacao, ele provavelmente pertence a `shared/components/`. Se ele faz sentido apenas no contexto do TaskFlow, ele pertence a `src/components/`.

---

## Por que ESModules

O projeto usa o sistema de modulos ESModules (ECMAScript Modules) nativamente suportado pelo TypeScript e pelo bundler do Expo.

**Principio:** cada arquivo e um modulo independente e auto-suficiente. Ele declara explicitamente o que exporta e importa apenas o que precisa de outros modulos. Nao existe estado global implicito entre arquivos.

**Beneficios:**

- **Tree-shaking** — o bundler elimina codigo que nao e importado por ninguem, reduzindo o tamanho final do bundle.
- **Rastreabilidade** — e sempre possivel saber de onde vem cada funcao, tipo ou componente seguindo os imports.
- **Testabilidade** — modulos com dependencias explicitas sao faceis de isolar e testar.
- **Organizacao** — a estrutura de imports reflete diretamente a arquitetura de pastas.

**Exemplo correto — import nomeado e especifico:**

```typescript
// Correto: importa apenas o que e necessario
import { formatDate } from '../shared/utils/formatDate';
import { CustomButton } from '../shared/components/CustomButton';
import type { Task } from '../types/task';
```

**Exemplo incorreto — import de tudo sem necessidade:**

```typescript
// Incorreto: importa o modulo inteiro quando so uma funcao e necessaria
import * as utils from '../shared/utils/formatDate';

// Incorreto: misturar tipos e valores no mesmo import sem usar `import type`
import { Task, TaskStatus, formatDate } from '../types/task';
```

**Exportando de um modulo:**

```typescript
// utils/formatDate.ts
// Named export — o nome e preservado em quem importa
export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('pt-BR');
}
```

```typescript
// shared/components/CustomButton.tsx
// Named export para componentes — padrao recomendado no projeto
export function CustomButton({ label, onPress }: CustomButtonProps) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text>{label}</Text>
    </TouchableOpacity>
  );
}
```

Use `export default` apenas em screens e na raiz `App.tsx`, onde a convencao do React Navigation e do Expo espera esse padrao. Em todos os outros casos, prefira named exports — eles sao mais faceis de renomear com seguranca e aparecem com autocompletar correto nas IDEs.
