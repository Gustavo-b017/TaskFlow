import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../shared/constants/storageKeys';
import type { Task } from '../types/task';

export async function saveTasks(tasks: Task[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
}

export async function loadTasks(): Promise<Task[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.TASKS);
    if (!data) return [];
    return JSON.parse(data) as Task[];
  } catch {
    return [];
  }
}
