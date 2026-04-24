export type UserRole = 'admin' | 'user';

export interface User {
  id: number;
  username: string;
  role: UserRole;
  name: string;       // nome exibido na UI (ex: "Administrador", "Usuário Comum")
}
