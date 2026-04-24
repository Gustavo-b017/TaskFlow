import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../shared/constants/storageKeys';

export type Treatment = 'Sr.' | 'Sra.' | 'Srta.';

export const TreatmentService = {
  async getTreatment(): Promise<Treatment | null> {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEYS.TREATMENT);
      if (saved === 'Sr.' || saved === 'Sra.' || saved === 'Srta.') {
        return saved as Treatment;
      }
      return null;
    } catch (e) {
      return null;
    }
  },

  async setTreatment(value: Treatment): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.TREATMENT, value);
    } catch (e) {
      // Falha silenciosa
    }
  }
};
