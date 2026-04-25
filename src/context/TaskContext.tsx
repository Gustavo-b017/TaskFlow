import React, { createContext, useState, useEffect, useRef } from 'react';
import type { Task } from '../types/task';
import { saveTasks, loadTasks } from '../services/taskStorage';
import { generateId } from '../shared/utils/generateId';

export interface TaskContextData {
  tasks: Task[];
  loading: boolean;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTask: (id: string, data: Partial<Task>) => Promise<void>;
  removeTask: (id: string) => Promise<void>;
}

export const TaskContext = createContext<TaskContextData | null>(null);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  // Ref garante leitura do estado mais recente mesmo em chamadas consecutivas sem re-render
  const tasksRef = useRef<Task[]>([]);

  useEffect(() => {
    async function init() {
      try {
        const stored = await loadTasks();
        tasksRef.current = stored;
        setTasks(stored);
      } catch {
        // Falha silenciosa: usuário começa com lista vazia
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  async function addTask(input: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> {
    if (!input.title.trim()) {
      throw new Error('Título é obrigatório');
    }
    const now = new Date().toISOString();
    const newTask: Task = {
      ...input,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    const updated = [...tasksRef.current, newTask];
    tasksRef.current = updated;
    setTasks(updated);
    await saveTasks(updated);
  }

  async function updateTask(id: string, data: Partial<Task>): Promise<void> {
    const updated = tasksRef.current.map((task) =>
      task.id === id
        ? { ...task, ...data, id, updatedAt: new Date().toISOString() }
        : task
    );
    tasksRef.current = updated;
    setTasks(updated);
    await saveTasks(updated);
  }

  async function removeTask(id: string): Promise<void> {
    const updated = tasksRef.current.filter((task) => task.id !== id);
    tasksRef.current = updated;
    setTasks(updated);
    await saveTasks(updated);
  }

  return (
    <TaskContext.Provider value={{ tasks, loading, addTask, updateTask, removeTask }}>
      {children}
    </TaskContext.Provider>
  );
}
