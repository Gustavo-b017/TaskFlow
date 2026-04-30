import { useContext } from 'react';
import { TreatmentContext } from '../context/TreatmentContext';

export function useTreatment() {
  const context = useContext(TreatmentContext);
  if (!context) {
    throw new Error('useTreatment must be used within a TreatmentProvider');
  }
  return context;
}
