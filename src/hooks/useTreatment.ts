import { useState, useEffect } from 'react';
import { Treatment, TreatmentService } from '../services/treatmentService';

export function useTreatment() {
  const [treatment, setTreatment] = useState<Treatment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const saved = await TreatmentService.getTreatment();
      setTreatment(saved);
      setLoading(false);
    }
    load();
  }, []);

  async function updateTreatment(value: Treatment) {
    setTreatment(value);
    await TreatmentService.setTreatment(value);
  }

  return { treatment, updateTreatment, loading };
}
