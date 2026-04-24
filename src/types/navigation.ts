export type TaskStackParamList = {
  TaskList: undefined;                  // sem parâmetros
  TaskForm: { taskId?: string };        // opcional: undefined = criação, string = edição
  TaskDetail: { taskId: string };       // obrigatório: ID da tarefa a exibir
};

export type TabParamList = {
  Home: undefined;
  Tasks: undefined;
  Settings: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
};
