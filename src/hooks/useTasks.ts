import { useContext } from 'react';
import { TaskContext } from '../context/TaskContext';
import type { TaskContextData } from '../context/TaskContext';
export type { TaskContextData } from '../context/TaskContext';

export function useTasks(): TaskContextData {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks deve ser usado dentro de TaskProvider');
  }
  return context;
}
