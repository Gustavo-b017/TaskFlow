# TaskFlow

Aplicativo mobile de gerenciamento de tarefas pessoais, desenvolvido com React Native e Expo como projeto acadêmico da FIAP.

---

## Participantes

| Nome | RM |
|---|---|
| Gabriel Mediotti Marques | RM 552632 |
| Gustavo Bezerra Assumção | RM 553076 |
| Jó Sales | RM 552679 |
| Miguel Garcez de Carvalho | RM 553768 |
| Vinicius Souza e Silva | RM 552781 |

---

## Video de demonstração

https://www.youtube.com/watch?v=uQgz-44HylE

---

## Como iniciar

### Pré-requisitos

- [Node.js](https://nodejs.org/) 18 ou superior
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- [Expo Go](https://expo.dev/client) instalado no celular (iOS ou Android) **ou** um emulador configurado

### Instalação e execução

```bash
# Clone o repositório
git clone <url-do-repositorio>
cd my-app

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm start
```

Após iniciar, escaneie o QR code exibido no terminal com o aplicativo **Expo Go** no celular, ou pressione:

- `a` — abrir no emulador Android
- `i` — abrir no simulador iOS
- `w` — abrir no navegador (web)

### Credenciais de acesso

| Usuário | Senha | Perfil        |
|---------|-------|---------------|
| admin   | 123   | Administrador |
| user    | 123   | Usuário Comum |

### Testes

```bash
npm test
```

---

## Dependências

| Pacote | Versão | Finalidade |
|---|---|---|
| `expo` | ~55.0.8 | Toolchain e runtime |
| `react-native` | 0.83.2 | Framework mobile multiplataforma |
| `react` | 19.2.0 | Biblioteca de UI |
| `typescript` | ~5.9.2 | Tipagem estática |
| `@react-navigation/native` | ^7.2.0 | Container de navegação |
| `@react-navigation/native-stack` | ^7.14.8 | Navegação em pilha |
| `@react-navigation/bottom-tabs` | ^7.15.9 | Navegação por abas |
| `@react-native-async-storage/async-storage` | 2.2.0 | Persistência local de dados |
| `lucide-react-native` | ^1.11.0 | Biblioteca de ícones |
| `react-native-safe-area-context` | ~5.6.2 | Suporte a safe area (iOS/Android) |
| `react-native-screens` | ~4.23.0 | Otimização de navegação nativa |
| `react-native-svg` | ^15.15.4 | Renderização de SVG |
| `react-native-web` | ^0.21.0 | Suporte à execução no navegador |
| `jest` + `jest-expo` | ^30.x / ^55.x | Testes unitários e de integração |

---

## O que foi usado

- **React Context API** — gerenciamento de estado global para autenticação, tarefas e tema
- **AsyncStorage** — persistência de sessão, tarefas e preferências do usuário
- **React Navigation** — navegação com Stack (telas em pilha) e Bottom Tabs (abas inferiores)
- **DummyJSON API** — fonte externa de categorias e frases motivacionais
- **Lucide React Native** — ícones vetoriais para categorias e interface
- **TypeScript** — tipagem completa sem uso de `any`
- **Jest + Testing Library** — cobertura de testes em utilitários, contextos, hooks e telas

---

## Funcionalidades principais

### Autenticação

O sistema de autenticação controla o acesso ao aplicativo e mantém a sessão entre reinicializações.

- **Login com usuário e senha** — validação de campos com feedback de erro em tempo real
- **Sessão persistente** — usuário autenticado é salvo no AsyncStorage; o app recupera a sessão ao reabrir sem necessidade de novo login
- **Dois perfis de acesso** — `admin` (Administrador) e `user` (Usuário Comum), com diferenciação visual no cabeçalho das telas
- **Logout seguro** — remove os dados do storage e redireciona para a tela de login
- **Proteção de rotas** — fluxo autenticado e não autenticado são separados em stacks distintos; o roteador redireciona automaticamente com base no estado de autenticação

### Tarefas

CRUD completo de tarefas com persistência local e categorização via API externa.

- **Listar tarefas** — visualização em lista com contadores por status, filtro por `Pendente`, `Em andamento` e `Concluída`, e busca por título, descrição ou categoria
- **Criar tarefa** — formulário com título (obrigatório), descrição opcional, status, prioridade e categoria com ícone
- **Editar tarefa** — formulário pré-preenchido ao selecionar uma tarefa existente
- **Excluir tarefa** — remoção com optimistic update e rollback automático em caso de falha
- **Status** — `Pendente`, `Em andamento`, `Concluída`
- **Prioridade** — `Baixa`, `Média`, `Alta`
- **Categorias dinâmicas** — lista carregada da API DummyJSON com mapeamento automático de ícones por categoria
- **Ícones personalizados** — seleção visual de ícone por categoria (Trabalho, Estudos, Saúde, Lazer e outros)
- **Persistência local** — todas as tarefas são salvas no AsyncStorage com sincronização automática
- **Skeleton loader** — indicador animado de carregamento enquanto os dados são lidos do storage
- **Estado vazio** — mensagem contextual diferente para lista vazia e busca sem resultados

### Mensagem

Funcionalidades de personalização da saudação e exibição de mensagens motivacionais.

- **Tratamento personalizado** — na tela de Ajustes, o usuário escolhe como prefere ser cumprimentado: `Sr.`, `Sra.` ou `Srta.`; a preferência é salva no AsyncStorage e persiste entre sessões
- **Saudação dinâmica** — a tela Home exibe `Olá, Sr. [Nome]!` (ou o tratamento selecionado), personalizando a mensagem de boas-vindas de acordo com a preferência do usuário
- **Frase motivacional do dia** — mensagem inspiracional aleatória carregada da DummyJSON API ao abrir a Home, com botão de atualização para solicitar uma nova frase a qualquer momento
- **Estados de carregamento e erro** — indicador de atividade durante o carregamento da frase e mensagem de erro amigável com tratamento de falha de rede

---

## Navegação

```
AuthStack
  └── LoginScreen

AppStack (autenticado)
  └── BottomTabs
        ├── Home → HomeScreen
        ├── Tasks → TaskStackNavigator
        │           ├── TaskListScreen
        │           ├── TaskDetailScreen
        │           └── TaskFormScreen
        └── Settings → SettingsStackNavigator
                        └── SettingsScreen
```

