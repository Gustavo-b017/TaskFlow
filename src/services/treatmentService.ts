import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../shared/constants/storageKeys';

export type Treatment = 'Sr.' | 'Sra.' | 'Srta.';

const VALID_TREATMENTS: Treatment[] = ['Sr.', 'Sra.', 'Srta.'];

export const TreatmentService = {
  async getTreatment(): Promise<Treatment | null> {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEYS.TREATMENT);
      if (VALID_TREATMENTS.includes(saved as Treatment)) {
        return saved as Treatment;
      }
      return null;
    } catch (e) {
      return null;
    }
  },

  async setTreatment(value: Treatment): Promise<void> {
    if (!VALID_TREATMENTS.includes(value)) return;
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.TREATMENT, value);
    } catch (e) {
      // Falha silenciosa registrada em telemetria se necessário
    }
  }
};
