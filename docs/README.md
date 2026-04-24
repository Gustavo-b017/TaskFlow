# TaskFlow App — Documentação Técnica

TaskFlow é um aplicativo mobile open source de gerenciamento de tarefas pessoais construído com React Native e TypeScript. O projeto tem finalidade educacional e serve como referência prática para o ensino de desenvolvimento mobile moderno, cobrindo desde fundamentos do React Native até padrões de arquitetura profissional.

---

## Mapa de Capitulos

A documentação está organizada em capítulos sequenciais. Leia na ordem para construir o entendimento de forma progressiva.

| Arquivo | Conteúdo |
|---|---|
| [00-visao-geral.md](./00-visao-geral.md) | O que é o app, tecnologias utilizadas e o que o projeto ensina |
| [01-arquitetura-e-shared.md](./01-arquitetura-e-shared.md) | Estrutura de pastas, pasta shared/, separação de responsabilidades |
| [02-tipos-e-modelos.md](./02-tipos-e-modelos.md) | Modelos de dados, TypeScript, tipagem de navegação |
| [03-autenticacao-e-permissoes.md](./03-autenticacao-e-permissoes.md) | Login, perfis de usuário, matriz de permissões por role |
| [04-navegacao.md](./04-navegacao.md) | Stack e Tabs, HomeStack, TaskStack e SettingsStack |
| [05-estado-global-e-hooks.md](./05-estado-global-e-hooks.md) | AuthContext, TaskContext, ThemeContext e hooks customizados |
| [06-crud-e-regras-de-negocio.md](./06-crud-e-regras-de-negocio.md) | CRUD completo, validações e regras de negócio |
| [07-componentes-e-ui-mobile.md](./07-componentes-e-ui-mobile.md) | Componentes, mobile-first, FlatList e UI |
| [08-persistencia-e-api.md](./08-persistencia-e-api.md) | AsyncStorage, consumo de API externa, estados de loading e erro |
| [09-padroes-e-padronizacao.md](./09-padroes-e-padronizacao.md) | Convenções, nomenclatura, shared/ e diferenciais do projeto |

---

## Criterios de Avaliacao

| Criterio | Peso | O que sera avaliado |
|---|---|---|
| Funcionalidade | 45% | CRUD completo, navegacao Stack + Tabs, persistencia com AsyncStorage e consumo de API externa funcionando corretamente |
| Codigo | 25% | Codigo limpo, modularizado e 100% tipado — nenhum uso de `any` e logica de negocio fora das screens |
| UI | 20% | Interface consistente, layout limpo, feedbacks visuais e comportamento mobile-first |
| Apresentacao | 10% | Qualidade e clareza do video demonstrativo |

---

## Requisitos de Entrega

- Codigo completo e funcional seguindo a arquitetura definida nesta documentacao
- Video demonstrativo entre 3 e 7 minutos mostrando navegacao, CRUD, persistencia com AsyncStorage e consumo de API
- Entrega realizada via Microsoft Teams
- Grupos de no maximo 5 pessoas
- O video e o codigo devem incluir o nome completo e o RM de todos os integrantes do grupo
- **Data de entrega: 29/04/2026**

---

## Referencias Oficiais

- [React Native — Components and APIs](https://reactnative.dev/docs/components-and-apis)
- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
