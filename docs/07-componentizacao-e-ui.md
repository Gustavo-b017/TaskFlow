# 🎨 UI e Componentização

No **TaskFlow**, a interface do usuário (UI) segue padrões modernos e limpos. Para garantir a consistência e a manutenção do código, adotamos a **Componentização**, onde cada elemento visual é um componente reutilizável.

## 🏗️ Componentes Obrigatórios

Conforme exigido na prova, criamos os seguintes componentes:

-   **`CustomButton`**: Botão estilizado com suporte a diferentes estados (loading, desativado).
-   **`CustomInput`**: Input de texto com tratamento de erros e estilização consistente.
-   **`Header`**: Cabeçalho que exibe o nome do usuário logado, o perfil (`admin`/`user`) e o botão de logout.
-   **`TaskCard`**: O card visual que representa uma tarefa na lista.
-   **`EmptyState`**: Exibido quando não há tarefas cadastradas.
-   **`StatusBadge`**: Pequeno indicador visual da cor do status da tarefa.
-   **`FilterBar`**: Barra para filtrar tarefas por status (pendente, em andamento, concluída).

---

## 📜 Listagem de Tarefas (`FlatList`)

Para exibir as tarefas, usamos o componente `FlatList`. Ele é mais eficiente que o `ScrollView` para listas longas, pois renderiza apenas o que está visível na tela.

**O que cada item da lista deve mostrar?**
1.  Título da tarefa.
2.  Status (com cor correspondente).
3.  Categoria e seu ícone.
4.  Prioridade.
5.  Datas de criação e atualização.

---

## ✨ Princípios de UI Aplicados

1.  **Layout Limpo:** Espaçamento consistente usando o `StyleSheet`.
2.  **Cores por Status:** Facilitam a identificação rápida da situação de cada tarefa.
3.  **Loading:** Feedback visual enquanto o app busca dados da API ou do AsyncStorage.
4.  **Empty State Amigável:** Mensagens claras quando a lista está vazia.

---
[Próximo: Persistência e APIs Externas](./08-persistencia-e-api.md)
