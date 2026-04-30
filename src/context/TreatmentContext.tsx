import React, { createContext, useState, useEffect, useContext } from 'react';
import { Treatment, TreatmentService } from '../services/treatmentService';
import { AuthContext } from './AuthContext';

interface TreatmentContextData {
  treatment: Treatment | null;
  updateTreatment: (value: Treatment) => Promise<void>;
  loading: boolean;
}

export const TreatmentContext = createContext<TreatmentContextData | null>(null);

export function TreatmentProvider({ children }: { children: React.ReactNode }) {
  const { user } = useContext(AuthContext);
  const [treatment, setTreatment] = useState<Treatment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setTreatment(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    TreatmentService.getTreatment(user.id).then((saved) => {
      setTreatment(saved);
      setLoading(false);
    });
  }, [user?.id]);

  async function updateTreatment(value: Treatment) {
    if (!user) return;
    setTreatment(value);
    await TreatmentService.setTreatment(user.id, value);
  }

  return (
    <TreatmentContext.Provider value={{ treatment, updateTreatment, loading }}>
      {children}
    </TreatmentContext.Provider>
  );
}
