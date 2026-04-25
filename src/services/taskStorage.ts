import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../shared/constants/storageKeys';
import type { Task } from '../types/task';

/** Persiste a lista de tarefas. Propaga erros do AsyncStorage ao chamador. */
export async function saveTasks(tasks: Task[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
}

/**
 * Carrega a lista de tarefas.
 * Fronteira de supressão de erros: retorna [] em caso de dados ausentes,
 * JSON corrompido ou falha do AsyncStorage — nunca lança.
 */
export async function loadTasks(): Promise<Task[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.TASKS);
    if (!data) return [];
    const parsed: unknown = JSON.parse(data);
    if (!Array.isArray(parsed)) return [];
    return parsed as Task[];
  } catch {
    return [];
  }
}
