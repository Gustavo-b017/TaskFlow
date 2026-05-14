import AsyncStorage from '@react-native-async-storage/async-storage';
import type { FormValues } from '../types/form';

const STORAGE_KEY = '@cp3_form_data';

export async function saveFormData(data: FormValues): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export async function loadFormData(): Promise<FormValues | null> {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    if (!json) return null;
    const parsed: unknown = JSON.parse(json);
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return null;
    return parsed as FormValues;
  } catch {
    return null;
  }
}

export async function clearFormData(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
