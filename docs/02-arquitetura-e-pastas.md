# 🏗️ Arquitetura e Estrutura de Pastas

Para que o projeto seja organizado e fácil de manter, adotamos uma arquitetura modular com **separação de responsabilidades**. Cada parte do código tem um único objetivo claro.

## 📂 Estrutura Obrigatória (`src/`)

Nesta prova, o código deve ser organizado exatamente assim:

```ts
src/
  components/
    CustomButton.tsx
    CustomInput.tsx
    Header.tsx
    TaskCard.tsx
    EmptyState.tsx
    StatusBadge.tsx
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

App.tsx
```

---

## 🏗️ Separação de Responsabilidades

1.  **UI (screens):** Só deve cuidar da exibição visual e eventos do usuário.
2.  **Lógica (hooks/services):** Onde os cálculos, buscas de dados e regras de negócio acontecem.
3.  **Estado Global (context):** Onde os dados que precisam estar em várias telas são armazenados.

### Exemplo Prático:

-   **`screens/tasks/TaskListScreen.tsx`**: A tela que mostra a lista.
-   **`components/TaskCard.tsx`**: O visual de um único item da lista.
-   **`hooks/useTasks.ts`**: A lógica que busca as tarefas do banco de dados local.

---

## ⚡ Por que usar ESModules?

Usamos o sistema de `import` e `export` do ESModules para que cada arquivo seja um módulo independente. Isso permite que você importe apenas o que precisa, tornando o app mais leve e organizado.

---
[Próximo: Tipagem Forte com TypeScript](./03-modelagem-e-typescript.md)
