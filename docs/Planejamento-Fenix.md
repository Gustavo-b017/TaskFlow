--//--
busque os seguintes cards no fenix knowladge e verifique se foram implementados seguindo as boas práticas: 
* FIAP-0012 [Story] — S2.2 — Persistência de Sessão e Auto-login -- backlog
    * FIAP-0025 [Task] — Integrar AsyncStorage no AuthContext — salvar e restaurar sessão -- backlog
    * FIAP-0026 [Task] — Implementar loading state no boot — exibir splash enquanto verifica sessão -- backlog

----
Quero que não deixe nada para traz e que confira sempre 2 vezes para ter certeza que não esqueceu de nada. Eu preciso que revise tudo que foi feito com o pensamento de que tem erro, e preciso encontralo; No /code-review quero que siga as boas praticas de desenvolvimento na auditoria ( e deve especificar o que se trata o code review para identificação posterior), sempre confime pelo menos 2 vezes afim de ver se deixou algum bug ou code smell, e assim que terminar escreva um documento detalhado em @docs/code-review, pois não permito falhas, nem de lógica, nem performace muito menos segurança, para isso confime com o CVE bugs que possa ter, se encontrar algum erro, volte e concerte o erro e repita o processo. Se estiver tudo completamente implementado, validado e testado, quero que mova somente os cards revisados card para Done no fenix

--//--

busque os seguintes cards no fenix knowladge e os implemente:

* FIAP-0014 [Story] — S3.1 — AppRoutes: Bottom Tabs e Stacks por Aba -- em andamento
       * FIAP-0034 [Task] — Criar routes/TabRoutes.tsx — Bottom Tab Navigator com 3 abas -- em andamento
       * FIAP-0035 [Task] — Criar routes/TaskStackRoutes.tsx — Stack TaskList → TaskForm → TaskDetail -- em andamento
       * FIAP-0050 [Task] — Criar HomeStackRoutes.tsx e SettingsStackRoutes.tsx -- em andamento
       * FIAP-0051 [Task] — Criar routes/AppRoutes.tsx — orquestrador da área logada -- em andamento
       * FIAP-0052 [Task] — Configurar App.tsx — providers, NavigationContainer e switch de rotas -- em andamento
----
Quero que não deixe nada para traz e que confira sempre 2 vezes para ter certeza que não esqueceu de nada. Eu preciso que quando estiver implementando siga as boas praticas de desenvolvimentom documente o que fez, sempre confime se deixou algum bug ou code smell, e assim que terminar de criar ou editar uma pagina, realize um code review, pois não permito falhas, nem de lógica, nem performace muito menos segurança, para isso confime com o CVE bugs que possa ter, se encontrar algum erro, volte e concerte o erro. E depois que não tiver nenhum erro, preciso que crie testes unitarios para testar o fluxo e testar o código estressando ele para verificar se está resiliente e sem nenhum tipo de falha, se encontrar algum problema durante os testes, crie um plano e resolva.
Caso o código esteja 100% testado e validado, e que não aponte nenhum erro dutante os teste e nem o estresse, quero que mova os cards feitos ou alterados/ para Code Review no fenix
 

--//--

preciso conecte-se ao fenix e busque o seguinte cards, seus filhos e os filhos dos filhos.          
---                        
FIAP-0009
F6 — Persistência Local e API Externa                                                                                                                                              
---
quero que quando buscar, traga o nome e o time.                                                                                                                                                   
exemplo:                             
"                                       
* TD-0229 — Comparativo de Cotações -- feito 100%                                                                                                                                                 
    * TD-0246 [API] Endpoint Comparativo + Aprovação -- feito 100%                                                                                                                                
    * TD-0247 [Front] Tela Comparativo Visual -- feito 100%                                                                                                                                       
"  

--//--

* FIAP-0004 [Feature] — F1 — Fundação, Arquitetura e Tipagem -- em andamento
    * FIAP-0010 [Story] — S1.1 — Estrutura de Pastas e Setup do Projeto -- em andamento -- 100% feito
        * FIAP-0018 [Task] — Criar estrutura de pastas src/ conforme arquitetura -- em andamento -- 100% feito
        * FIAP-0019 [Task] — Criar shared/constants/storageKeys.ts com STORAGE_KEYS -- em andamento -- 100% feito
        * FIAP-0020 [Task] — Criar shared/utils/generateId.ts e formatDate.ts -- em andamento -- 100% feito
        * FIAP-0021 [Task] — Executar npx tsc --noEmit e corrigir todos os erros de tipagem -- em andamento -- 100% feito
    * FIAP-0027 [Story] — S1.2 — Contratos TypeScript: Modelos de Dados e Navegação -- em andamento -- 100% feito
        * FIAP-0043 [Task] — Criar src/types/task.ts — Task, TaskStatus, TaskPriority -- em andamento -- 100% feito
        * FIAP-0044 [Task] — Criar src/types/user.ts — User, UserRole -- em andamento -- 100% feito
        * FIAP-0045 [Task] — Criar src/types/navigation.ts — TaskStackParamList, TabParamList, AuthStackParamList -- em andamento -- 100% feito
        * FIAP-0046 [Task] — Auditar nomenclatura, exports e imports — padrões do projeto -- em andamento -- 100% feito
    * FIAP-0062 [Story] — S1.3 — Utilitários Shared e Padrões do Projeto -- em andamento -- 100% feito
        * FIAP-0063 [Task] — Verificar regras shared/ — componentes sem imports de context/ -- em andamento -- 100% feito
        * FIAP-0064 [Task] — Criar src/context/AuthContext.tsx com usuários hardcoded e signIn/signOut -- em andamento -- 100% feito
        * FIAP-0065 [Task] — Criar src/screens/auth/LoginScreen.tsx com validação de credenciais -- em andamento -- 100% feito
        * FIAP-0066 [Task] — Criar src/hooks/useAuth.ts com validação de Provider -- em andamento -- 100% feito


* FIAP-0005 [Feature] — F2 — Autenticação e Permissões -- backlog -- 100% feito
    * FIAP-0011 [Story] — S2.1 — AuthContext, useAuth e LoginScreen -- backlog -- 100% feito
        * FIAP-0022 [Task] — Implementar AuthContext e useAuth Hook -- backlog -- 100% feito
        * FIAP-0023 [Task] — Desenvolver UI da LoginScreen (CustomInput/Button) -- backlog -- 100% feito
        * FIAP-0024 [Task] — Lógica de Redirecionamento por Role (Admin/User) -- backlog -- 100% feito
    * FIAP-0012 [Story] — S2.2 — Persistência de Sessão e Auto-login -- backlog -- 100% feito
        * FIAP-0025 [Task] — Integrar AsyncStorage no AuthContext — salvar e restaurar sessão -- backlog -- 100% feito
        * FIAP-0026 [Task] — Implementar loading state no boot — exibir splash enquanto verifica sessão -- backlog -- 100% feito


* FIAP-0007 — F3 — Navegação -- em andamento
   * FIAP-0014 [Story] — S3.1 — AppRoutes: Bottom Tabs e Stacks por Aba -- em andamento
       * FIAP-0034 [Task] — Criar routes/TabRoutes.tsx — Bottom Tab Navigator com 3 abas -- em andamento
       * FIAP-0035 [Task] — Criar routes/TaskStackRoutes.tsx — Stack TaskList → TaskForm → TaskDetail -- em andamento
       * FIAP-0050 [Task] — Criar HomeStackRoutes.tsx e SettingsStackRoutes.tsx -- em andamento
       * FIAP-0051 [Task] — Criar routes/AppRoutes.tsx — orquestrador da área logada -- em andamento
       * FIAP-0052 [Task] — Configurar App.tsx — providers, NavigationContainer e switch de rotas -- em andamento
   * FIAP-0056 [Story] — S3.2 — AuthRoutes e Orquestração Raiz no App.tsx -- em andamento
       * FIAP-0057 [Task] — Criar routes/AuthRoutes.tsx — Stack isolado com LoginScreen -- em andamento


* FIAP-0006 — F4 — Estado Global e CRUD de Tarefas -- backlog
   * FIAP-0013 [Story] — S4.1 — TaskContext e useTasks Hook -- backlog
       * FIAP-0029 [Task] — Criar src/context/TaskContext.tsx — estado inicial, TaskContextData e TaskProvider -- backlog
       * FIAP-0030 [Task] — Implementar addTask no TaskContext — ID automático, timestamps e validação -- backlog
       * FIAP-0031 [Task] — Implementar updateTask e removeTask no TaskContext -- backlog
       * FIAP-0047 [Task] — Criar src/hooks/useTasks.ts com validação de Provider -- backlog
       * FIAP-0048 [Task] — Implementar validações de formulário na TaskFormScreen -- backlog
       * FIAP-0049 [Task] — Implementar filtro por status e confirmação de exclusão -- backlog
   * FIAP-0028 [Story] — S4.2 — taskStorage, Validações e Filtros -- backlog
       * FIAP-0032 [Task] — Criar src/services/taskStorage.ts — saveTasks e loadTasks -- backlog
       * FIAP-0033 [Task] — Integrar taskStorage no TaskContext — carregar no boot e salvar em cada mutação -- backlog


* FIAP-0008 — F5 — Componentes e UI Mobile -- backlog
   * FIAP-0015 [Story] — S5.1 — Componentes Shared (Sem Conhecimento de Domínio) -- backlog
       * FIAP-0036 [Task] — Criar EmptyState.tsx em shared/components/ -- backlog
       * FIAP-0037 [Task] — Criar StatusBadge.tsx em shared/components/ -- backlog
       * FIAP-0038 [Task] — Aplicar useTheme() em todos os componentes shared -- backlog
       * FIAP-0053 [Task] — Criar CustomButton.tsx em shared/components/ -- backlog
       * FIAP-0054 [Task] — Criar CustomInput.tsx em shared/components/ -- backlog
       * FIAP-0055 [Task] — Aplicar SafeAreaView e KeyboardAvoidingView nas telas obrigatórias -- backlog
       * FIAP-0058 [Task] — Implementar HomeScreen — boas-vindas com nome + frase motivacional -- backlog
       * FIAP-0059 [Task] — Implementar TaskFormScreen — formulário com validação -- backlog
       * FIAP-0060 [Task] — Implementar TaskDetailScreen — exibição completa + botões admin -- backlog
       * FIAP-0061 [Task] — Implementar SettingsScreen — tema, perfil e tratamento -- backlog
       * FIAP-0079 [Task] — [DIFERENCIAL] Implementar animações de transição -- backlog
   * FIAP-0067 [Story] — S5.2 — Componentes de Domínio: TaskCard, Header e FilterBar -- backlog
       * FIAP-0069 [Task] — Criar Header.tsx em components/ -- backlog
       * FIAP-0070 [Task] — Criar TaskCard.tsx em components/ -- backlog
       * FIAP-0071 [Task] — Criar FilterBar.tsx em components/ -- backlog
   * FIAP-0068 [Story] — S5.3 — Telas do Aplicativo -- backlog
       * FIAP-0072 [Task] — Implementar TaskListScreen — FlatList, FilterBar, EmptyState e navegação -- backlog
       * FIAP-0073 [Task] — Implementar controle de acesso por role em todas as screens -- backlog
       * FIAP-0074 [Task] — Implementar TaskListScreen e TaskDetailScreen — integração e navegação -- backlog
       * FIAP-0076 [Task] — Adicionar navegação da HomeScreen para aba de Tarefas -- backlog
       * FIAP-0077 [Task] — Feedback visual ao salvar e editar tarefa — Alert de sucesso -- backlog
       * FIAP-0080 [Task] — [DIFERENCIAL] Implementar RefreshControl e skeleton loading -- backlog


* FIAP-0009 — F6 — Persistência Local e API Externa -- backlog
   * FIAP-0016 [Story] — S6.1 — API Externa: Frases Motivacionais e Categorias -- backlog
       * FIAP-0039 [Task] — Criar services/api.ts — fetchCategories e fetchMotivationalQuote -- backlog
       * FIAP-0040 [Task] — Implementar consumo de frases motivacionais na HomeScreen -- backlog
       * FIAP-0075 [Task] — Integrar fetchCategories na TaskFormScreen -- To Do
   * FIAP-0017 [Story] — S6.2 — ThemeContext e Dark/Light Mode -- backlog
       * FIAP-0041 [Task] — Implementar ThemeContext e hook useTheme com persistência -- backlog
       * FIAP-0042 [Task] — Aplicar alternância de tema na SettingsScreen e componentes -- backlog