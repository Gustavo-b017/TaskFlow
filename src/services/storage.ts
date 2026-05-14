import AsyncStorage from '@react-native-async-storage/async-storage';
import type { FormValues } from '../types/form';

const STORAGE_KEY = '@cp3_form_data';

export async function saveFormData(data: FormValues): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export async function loadFormData(): Promise<FormValues | null> {
  const json = await AsyncStorage.getItem(STORAGE_KEY);
  if (!json) return null;
  return JSON.parse(json) as FormValues;
}

export async function clearFormData(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
