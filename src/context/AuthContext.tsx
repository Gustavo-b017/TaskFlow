import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { User } from '../types/user';
import { STORAGE_KEYS } from '../shared/constants/storageKeys';

// Modelo estrito para a fonte de dados hardcoded (contém password)
interface AuthUserSource extends User {
  password: string;
}

interface AuthContextData {
  user: User | null;
  loading: boolean;
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const users: AuthUserSource[] = [
  { id: 1, username: 'admin', password: '123', role: 'admin', name: 'Administrador' },
  { id: 2, username: 'user',  password: '123', role: 'user',  name: 'Usuário Comum' },
];

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Inicia como true para o boot

  useEffect(() => {
    async function loadStorageData() {
      try {
        const storagedUser = await AsyncStorage.getItem(STORAGE_KEYS.USER);
        if (storagedUser) {
          try {
            setUser(JSON.parse(storagedUser));
          } catch (parseError) {
            // Se o JSON estiver corrompido, limpa o storage para segurança
            await AsyncStorage.removeItem(STORAGE_KEYS.USER);
          }
        }
      } catch (error) {
        // Falha silenciosa no boot, usuário precisará logar novamente
      } finally {
        setLoading(false);
      }
    }

    loadStorageData();
  }, []);

  async function signIn(username: string, password: string): Promise<void> {
    setLoading(true);
    try {
      // Simulação de delay de rede para evitar race conditions e testar UI loaders
      await new Promise(resolve => setTimeout(resolve, 800));

      const found = users.find(u => u.username === username && u.password === password);
      if (!found) {
        throw new Error('Credenciais inválidas');
      }

      // Removemos a senha e retornamos apenas o domínio User
      const { password: _, ...userDomain } = found;

      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userDomain));
      setUser(userDomain);
    } finally {
      setLoading(false);
    }
  }

  async function signOut(): Promise<void> {
    setLoading(true);
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.USER);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
