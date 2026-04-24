export type TaskStackParamList = {
  TaskList: undefined;
  TaskForm: { taskId?: string };
  TaskDetail: { taskId: string };
};

export type HomeStackParamList = {
  Home: undefined;
};

export type SettingsStackParamList = {
  Settings: undefined;
};

export type TabParamList = {
  Home: undefined;
  Tasks: undefined;
  Settings: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
};
