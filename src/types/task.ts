export type TaskStatus = 'pendente' | 'em_andamento' | 'concluida';
export type TaskPriority = 'baixa' | 'media' | 'alta';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  category: string;
  categoryIcon: string;   // emoji ou URL de imagem representando a categoria
  createdAt: string;      // ISO 8601 string (ex: "2026-04-23T10:00:00.000Z")
  updatedAt: string;      // ISO 8601 string — atualizado a cada updateTask
}
