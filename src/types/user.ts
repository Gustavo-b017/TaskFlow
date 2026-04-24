export type UserRole = 'admin' | 'user';

export interface User {
  id: number;
  username: string;
  password: string;   // armazenado apenas para comparação — projeto educacional
  role: UserRole;
  name: string;       // nome exibido na UI (ex: "Administrador", "Usuário Comum")
}
