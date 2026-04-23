# 🌐 Estado Global com Context API

Para que o **TaskFlow** seja eficiente e profissional, não podemos gerenciar todos os dados com `useState` em cada tela. O compartilhamento de informações importantes (como quem está logado, quais são as tarefas e o tema atual) deve ser feito de forma global.

Nesta prova, usamos a **Context API** para criar três contextos principais:

## 1. 🔐 AuthContext (Autenticação)
Gerencia quem é o usuário atual e se ele está logado. É este contexto que decide se o app mostra a tela de Login ou as Abas principais.

**O que ele faz?**
-   `user`: Armazena os dados do usuário atual (incluindo o perfil `admin` ou `user`).
-   `signIn`: Valida as credenciais hardcoded e salva a sessão no `AsyncStorage`.
-   `signOut`: Limpa os dados do usuário e do `AsyncStorage`.

## 2. 📝 TaskContext (Tarefas)
Gerencia o **CRUD** completo de tarefas. Centraliza a lógica para que qualquer tela possa adicionar, editar ou remover uma tarefa.

**O que ele faz?**
-   `tasks`: Lista todas as tarefas carregadas.
-   `addTask`: Cria uma nova tarefa com ID único e datas automáticas.
-   `updateTask`: Atualiza uma tarefa existente.
-   `removeTask`: Exclui uma tarefa com confirmação.

## 3. 🎨 ThemeContext (Temas)
Controla se o app deve ser exibido em **Dark Mode** ou **Light Mode**. A preferência de tema também deve ser salva localmente.

---

## 🏗️ Hooks Customizados

Para separar a lógica das telas (UI) e facilitar o uso dos contextos, criamos hooks customizados:

-   `useAuth()`: Acesso rápido aos dados do usuário.
-   `useTasks()`: Acesso rápido às tarefas e funções do CRUD.
-   `useTheme()`: Acesso rápido ao tema e função de troca de tema.

### Vantagens:
-   Código mais limpo nas telas.
-   Evita repetição de código.
-   Facilita a manutenção.

---
[Próximo: UI e Componentização](./07-componentizacao-e-ui.md)
