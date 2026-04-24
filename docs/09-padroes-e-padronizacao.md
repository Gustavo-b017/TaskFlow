# Padrões e Padronização

## Nomenclatura de arquivos e identificadores

| Tipo | Convenção | Exemplo |
|---|---|---|
| Componentes React | PascalCase | TaskCard.tsx, CustomButton.tsx |
| Screens | PascalCase com sufixo Screen | TaskListScreen.tsx |
| Contextos | PascalCase com sufixo Context | AuthContext.tsx |
| Hooks | camelCase com prefixo use | useTasks.ts, useAuth.ts |
| Services | camelCase | taskStorage.ts, api.ts |
| Utils | camelCase | formatDate.ts, generateId.ts |
| Types | camelCase | task.ts, navigation.ts |
| Constants | camelCase | storageKeys.ts, theme.ts |
| Interfaces e Types TS | PascalCase | Task, UserRole, TaskStackParamList |
| Variáveis e funções | camelCase | addTask, currentUser |
| Constantes globais | UPPER_SNAKE_CASE | STORAGE_KEYS, BASE_URL |

## Regras da pasta shared/

A pasta shared/ existe para eliminar duplicação entre features. Regras:

1. Se um componente, hook, util ou tipo é usado por mais de uma feature → vai para shared/
2. Se é específico de uma feature (ex: TaskCard conhece Task) → fica na pasta da feature
3. Componentes em shared/components/ não importam de context/ — são stateless ou recebem dados por props
4. Hooks em shared/hooks/ não dependem de um contexto específico do app

Verificação: antes de criar um arquivo, pergunte — "mais de uma tela ou feature vai usar isso?" Se sim, shared/.

## Padrão de exports

Preferir named exports em todos os arquivos:

```ts
// Correto
export function useTasks() { ... }
export interface Task { ... }
export const STORAGE_KEYS = { ... }

// Evitar default export (dificulta refatoração e busca)
export default function useTasks() { ... }
```

Exceção: screens e componentes de rota podem usar default export quando exigido pelo React Navigation.

## Organização de imports

Ordem obrigatória dentro de cada arquivo:

```ts
// 1. Dependências externas (node_modules)
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// 2. Imports internos do projeto (absolutos ou relativos)
import { useTasks } from '../../hooks/useTasks';
import { TaskCard } from '../../components/TaskCard';
import { EmptyState } from '../../shared/components/EmptyState';

// 3. Tipos
import type { Task } from '../../types/task';
import type { TaskStackParamList } from '../../types/navigation';
```

## Diferenciais

Os itens abaixo não são obrigatórios mas elevam a qualidade do projeto:

**Animações:**
- Transições entre telas com animação nativa do React Navigation
- Animação de entrada dos cards da lista (Animated API ou react-native-reanimated)
- Feedback de toque com escala (scale animation no pressIn)

**Validação avançada:**
- Validação de campos em tempo real (onChange) com feedback visual imediato
- Mensagens de erro específicas por campo
- Desabilitar botão de salvar enquanto há campos inválidos

**Loading states avançados:**
- Skeleton screens no lugar de ActivityIndicator genérico durante carregamento inicial
- Indicador de atualização (RefreshControl) na FlatList
- Estado de retry quando a API falha (botão "Tentar novamente")
