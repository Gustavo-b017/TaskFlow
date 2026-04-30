import AsyncStorage from '@react-native-async-storage/async-storage';

export type Treatment = 'Sr.' | 'Sra.' | 'Srta.';

const VALID_TREATMENTS: Treatment[] = ['Sr.', 'Sra.', 'Srta.'];

function storageKey(userId: number) {
  return `@taskflow:treatment:${userId}`;
}

export const TreatmentService = {
  async getTreatment(userId: number): Promise<Treatment | null> {
    try {
      const saved = await AsyncStorage.getItem(storageKey(userId));
      if (VALID_TREATMENTS.includes(saved as Treatment)) {
        return saved as Treatment;
      }
      return null;
    } catch {
      return null;
    }
  },

  async setTreatment(userId: number, value: Treatment): Promise<void> {
    if (!VALID_TREATMENTS.includes(value)) return;
    try {
      await AsyncStorage.setItem(storageKey(userId), value);
    } catch {
      // silencioso
    }
  },
};
