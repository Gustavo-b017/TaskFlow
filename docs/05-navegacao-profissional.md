# 🗺️ Navegação Profissional

No **TaskFlow**, a navegação é o esqueleto do aplicativo. Seguimos o padrão de mercado combinando dois tipos de navegadores da biblioteca `React Navigation`: **Bottom Tabs** (Abas inferiores) e **Stack Navigation** (Pilha).

## 🏗️ Estrutura das Rotas

A navegação é dividida em dois grandes blocos:

### 1. **AuthRoutes (Pilha)**
Contém apenas a tela de Login. Se o usuário não está autenticado, ele fica preso aqui.

### 2. **AppRoutes (Abas + Pilhas)**
Onde a mágica acontece. O fluxo principal usa abas, mas cada aba pode ter sua própria pilha de telas.

---

## 🗂️ Organização das Abas (Bottom Tabs)

-   **Home:** Tela inicial contendo:
    -   Mensagem de boas-vindas.
    -   Frase motivacional do dia (consumida via API).
-   **Tarefas:** Central de gerenciamento de tarefas.
-   **Configurações:** Espaço para personalização contendo:
    -   Alteração de tema (Light/Dark) persistível.
    -   Perfil do usuário (Exibição de admin/user).
    -   **Preferência de tratamento (Sr., Sra., Srta.).**

---

## 📚 Navegação por Pilha (Stack)

Dentro da aba de **Tarefas**, usamos uma pilha para permitir que o usuário navegue entre:
-   `TaskList`: Lista de todas as tarefas.
-   `TaskForm`: Tela para criar ou editar uma tarefa.
-   `TaskDetail`: Detalhes de uma tarefa específica.

### Fluxos esperados:
-   `Home` -> `Tarefas` (mudar de aba)
-   `TaskList` -> `TaskForm` (ir para cadastro)
-   `TaskList` -> `TaskDetail` (ir para detalhes)
-   `TaskDetail` -> `TaskForm` (ir para edição)

---

## 💡 Por que esta estrutura?

-   **Abas:** Dão acesso rápido às funções principais do app.
-   **Pilhas:** Permitem que o usuário avance e volte (`back button`) de forma intuitiva, mantendo o histórico de navegação.

---
[Próximo: Estado Global com Context API](./06-estado-global-context-api.md)
