export type UserRole = 'admin' | 'user';

export interface User {
  id: number;
  username: string;
  name: string;
  role: UserRole;
  password?: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
}
