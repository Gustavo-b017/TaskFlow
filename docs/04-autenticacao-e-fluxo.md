# 🔐 Autenticação e Perfis de Usuário

O **TaskFlow** possui um sistema de autenticação simples mas completo, com perfis diferentes de acesso e persistência de sessão.

## 👤 Usuários e Perfis

Para fins didáticos e da prova, os usuários são fixos (**hardcoded**) diretamente no código:

-   **Admin (`admin`):** Acesso completo, navega para a tela de Configurações após o login.
-   **User (`user`):** Acesso padrão, navega para a tela Home após o login.

```ts
const users = [
  { id: 1, username: 'admin', password: '123', role: 'admin', name: 'Administrador' },
  { id: 2, username: 'user', password: '123', role: 'user', name: 'Usuário Comum' },
];
```

---

## 🚦 Regras de Autenticação

1.  **Validação:** Se as credenciais estiverem incorretas, o sistema deve mostrar uma mensagem de erro clara.
2.  **Sessão Persistente:** O app deve lembrar que o usuário está logado mesmo se for fechado. Usamos o `AsyncStorage` para isso.
3.  **Redirecionamento Automático:** Ao abrir o app:
    -   Se logado -> Vai direto para o sistema.
    -   Se não logado -> Mostra a tela de Login.
4.  **Logout:** Ao sair, o sistema limpa os dados salvos e retorna para a tela de Login.

---

## 🏗️ Implementação: AuthContext

O gerenciamento de quem está logado acontece no `AuthContext`. Isso permite que qualquer tela do app saiba quem é o usuário atual e qual o seu perfil (`admin` ou `user`).

**O que o AuthContext deve gerenciar?**
-   `user`: Dados do usuário logado.
-   `signIn`: Função para autenticar.
-   `signOut`: Função para deslogar.
-   `loading`: Estado para saber se estamos verificando a sessão antiga.

---
[Próximo: Navegação Profissional com Stack e Tabs](./05-navegacao-profissional.md)
