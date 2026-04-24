import React, { createContext, useState } from 'react';
import type { User } from '../types/user';

interface AuthContextData {
  user: User | null;
  loading: boolean;
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const users: User[] = [
  { id: 1, username: 'admin', password: '123', role: 'admin', name: 'Administrador' },
  { id: 2, username: 'user',  password: '123', role: 'user',  name: 'Usuário Comum' },
];

export const AuthContext = createContext<AuthContextData | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false); // Inicia como false conforme requisito da S1.3

  async function signIn(username: string, password: string): Promise<void> {
    const found = users.find(u => u.username === username && u.password === password);
    if (!found) {
      throw new Error('Credenciais inválidas');
    }
    // Nota: A persistência no AsyncStorage será implementada na S2.2
    setUser(found);
  }

  async function signOut(): Promise<void> {
    // Nota: A limpeza do AsyncStorage será implementada na S2.2
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
