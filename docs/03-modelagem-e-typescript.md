# 🛡️ Tipagem Forte com TypeScript

Nesta prova, temos uma regra de ouro inegociável: **É terminantemente proibido o uso de `any` no código.**

O TypeScript está aqui para nos ajudar a evitar erros em tempo de execução, garantindo que saibamos exatamente qual tipo de dado estamos manipulando em cada parte do app.

## 📋 Regras de Tipagem

Tudo deve ser devidamente tipado:
- **Props:** As propriedades passadas entre componentes.
- **Estados:** O que está dentro do `useState`.
- **Funções:** O que entra e o que sai de cada função.
- **Contextos:** Os dados compartilhados via Context API.
- **Navegação:** As rotas e seus parâmetros.

---

## 🛠️ Modelagem de Dados

Conforme exigido, usamos os seguintes tipos para representar nossas tarefas:

```ts
export type TaskStatus = 'pendente' | 'em_andamento' | 'concluida';
export type TaskPriority = 'baixa' | 'media' | 'alta';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  category: string;
  categoryIcon: string;
  createdAt: string;
  updatedAt: string;
}
```

### Por que usar interfaces?
Interfaces nos ajudam a definir a "forma" de um objeto. Quando criamos uma tarefa, o TypeScript verificará se todas essas propriedades existem.

---

## 🧭 Tipagem na Navegação

Para que o app saiba quais telas existem e quais dados elas recebem, definimos parâmetros para nossas rotas:

```ts
// Exemplo: O que uma tela de detalhe de tarefa precisa receber?
export type TaskStackParamList = {
  TaskList: undefined;
  TaskForm: { taskId?: string }; //taskId é opcional na criação, obrigatório na edição
  TaskDetail: { taskId: string };
};
```

---
[Próximo: Autenticação e Regras de Negócio](./04-autenticacao-e-fluxo.md)
