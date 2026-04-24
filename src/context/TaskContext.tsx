import React, { createContext } from 'react';
import type { Task } from '../types/task';

interface TaskContextData {
  tasks: Task[];
  loading: boolean;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}

export const TaskContext = createContext<TaskContextData | null>(null);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  return (
    <TaskContext.Provider value={{} as TaskContextData}>
      {children}
    </TaskContext.Provider>
  );
}
