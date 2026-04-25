import React, { createContext, useState, useEffect, useRef } from 'react';
import type { Task } from '../types/task';
import { saveTasks, loadTasks } from '../services/taskStorage';
import { generateId } from '../shared/utils/generateId';

export interface TaskContextData {
  tasks: Task[];
  loading: boolean;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTask: (id: string, data: Omit<Partial<Task>, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
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
        // Guarda defensiva: loadTasks suprime erros internamente e nunca lança,
        // mas o catch preserva loading=false via finally mesmo em caso de mudança futura.
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
    const previous = tasksRef.current;
    const updated = [...previous, newTask];
    tasksRef.current = updated;
    setTasks(updated);
    try {
      await saveTasks(updated);
    } catch (error) {
      tasksRef.current = previous;
      setTasks(previous);
      throw error;
    }
  }

  async function updateTask(id: string, data: Omit<Partial<Task>, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> {
    if (data.title !== undefined && !data.title.trim()) {
      throw new Error('Título é obrigatório');
    }
    if (!tasksRef.current.some((t) => t.id === id)) return;
    const previous = tasksRef.current;
    const updated = previous.map((task) =>
      task.id === id
        ? { ...task, ...data, id, updatedAt: new Date().toISOString() }
        : task
    );
    tasksRef.current = updated;
    setTasks(updated);
    // ATENÇÃO: rollback captura o estado no momento da chamada.
    // Em mutações concorrentes sem await, o rollback desta falha pode sobrescrever
    // o estado de outra mutação bem-sucedida. Evite múltiplas mutações simultâneas.
    try {
      await saveTasks(updated);
    } catch (error) {
      tasksRef.current = previous;
      setTasks(previous);
      throw error;
    }
  }

  async function removeTask(id: string): Promise<void> {
    if (!tasksRef.current.some((t) => t.id === id)) return;
    const previous = tasksRef.current;
    const updated = previous.filter((task) => task.id !== id);
    tasksRef.current = updated;
    setTasks(updated);
    // ATENÇÃO: rollback captura o estado no momento da chamada.
    // Em mutações concorrentes sem await, o rollback desta falha pode sobrescrever
    // o estado de outra mutação bem-sucedida. Evite múltiplas mutações simultâneas.
    try {
      await saveTasks(updated);
    } catch (error) {
      tasksRef.current = previous;
      setTasks(previous);
      throw error;
    }
  }

  return (
    <TaskContext.Provider value={{ tasks, loading, addTask, updateTask, removeTask }}>
      {children}
    </TaskContext.Provider>
  );
}
