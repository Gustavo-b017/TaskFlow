import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * Hook customizado para acessar o contexto de autenticação.
 * Garante que o hook seja utilizado apenas dentro de um AuthProvider.
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }

  return context;
}
