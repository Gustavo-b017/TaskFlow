# 🔐 Autenticação e Perfis de Usuário

O **TaskFlow** possui um sistema de autenticação simples mas completo, com perfis diferentes de acesso e persistência de sessão.

## 📱 Tela de Login

A aplicação deve iniciar obrigatoriamente na tela de login, contendo:
- **Campo de usuário:** TextInput para o username.
- **Campo de senha:** TextInput com `secureTextEntry`.
- **Botão de login:** Aciona a validação.
- **Mensagem de erro:** Exibida apenas para credenciais inválidas.

## 👤 Usuários e Perfis

Para fins didáticos e da prova, os usuários são fixos (**hardcoded**) diretamente no código:

```ts
const users = [
  { id: 1, username: 'admin', password: '123', role: 'admin', name: 'Administrador' },
  { id: 2, username: 'user', password: '123', role: 'user', name: 'Usuário Comum' },
];
```

---

## 🚦 Regras de Autenticação e Navegação

1.  **Redirecionamento por Perfil:**
    -   **Usuário `admin`** → Navegar automaticamente para a aba de **Configurações**.
    -   **Usuário `user`** → Navegar automaticamente para a aba **Home**.
2.  **Validação:** Se as credenciais estiverem incorretas, o sistema deve mostrar uma mensagem de erro clara.
3.  **Sessão Persistente:** O app deve lembrar que o usuário está logado mesmo se for fechado. Usamos o `AsyncStorage` para isso.
4.  **Auto-Login:** Ao abrir o app, se houver uma sessão salva, deve ir direto para a área logada (bypass login).
5.  **Logout:** Ao sair, o sistema limpa os dados salvos no AsyncStorage e retorna para a tela de Login.

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
