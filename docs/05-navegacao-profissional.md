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
    -   **Preferência de tratamento (Ex: Campo para selecionar Sr., Sra., Srta.).**

---

## 📚 Navegação por Pilha (Stack)

Dentro da aba de **Tarefas**, usamos uma pilha para permitir que o usuário navegue entre:
-   `TaskList`: Lista de todas as tarefas.
-   `TaskForm`: Tela para criar ou editar uma tarefa.
-   `TaskDetail`: Detalhes de uma tarefa específica.

### 🧭 Navegações Esperadas:
-   **Home para Tarefas:** Ir da tela inicial para a aba de listagem.
-   **Lista para Cadastro:** Botão na lista que leva ao formulário vazio.
-   **Lista para Detalhes:** Clicar em uma tarefa para ver seus detalhes.
-   **Detalhes para Edição:** Botão no detalhe que leva ao formulário preenchido.
-   **Botão Voltar:** Navegação natural da stack para retornar entre as telas.

---

## 💡 Por que esta estrutura?

-   **Abas:** Dão acesso rápido às funções principais do app.
-   **Pilhas:** Permitem que o usuário avance e volte (`back button`) de forma intuitiva, mantendo o histórico de navegação.

---
[Próximo: Estado Global com Context API](./06-estado-global-context-api.md)
