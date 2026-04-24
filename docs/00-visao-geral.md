# Visao Geral

## O que e o TaskFlow

TaskFlow e um aplicativo mobile open source de gerenciamento de tarefas pessoais. O projeto e educacional e foi construido com React Native e TypeScript para ensinar desenvolvimento mobile moderno na pratica. Todo o codigo e arquitetura foram pensados para refletir padroes reais de projetos profissionais, servindo como referencia de aprendizado para os temas cobertos na disciplina.

---

## O que o usuario pode fazer no app

As funcionalidades disponíveis variam conforme o perfil do usuario autenticado.

### Todos os perfis (admin e usuario comum)

- Fazer login com credenciais validas
- Visualizar a lista de tarefas cadastradas
- Filtrar tarefas por status (pendente, em andamento, concluida)
- Visualizar o detalhe de uma tarefa
- Alternar entre tema claro e escuro
- Definir preferencia de tratamento (Sr., Sra. ou Srta.) nas configuracoes

### Somente administrador (role: admin)

- Criar novas tarefas preenchendo titulo, descricao, prioridade e categoria
- Editar qualquer campo de uma tarefa existente
- Excluir tarefas do sistema

A interface reflete essas restricoes ocultando ou desabilitando os controles de criacao, edicao e exclusao para usuarios com role diferente de admin.

---

## Temas de aprendizado

O projeto cobre os 10 temas exigidos na segunda avaliacao (CP2):

1. Fundamentos do React Native — componentes nativos, StyleSheet e ciclo de vida
2. Navegacao entre telas — Stack Navigator e Bottom Tab Navigator com React Navigation
3. Armazenamento local com AsyncStorage — persistencia de dados no dispositivo
4. Consumo de API — requisicoes HTTP a servicos externos com Fetch ou Axios
5. Modularizacao com ESModules — import/export, separacao de responsabilidades por arquivo
6. Componentizacao — criacao de componentes reutilizaveis com props tipadas
7. CRUD — criar, listar, editar e excluir registros com validacao
8. Listagem com FlatList — renderizacao eficiente de listas longas no React Native
9. UI mobile-first — design pensado para telas pequenas, touch e densidade de pixels
10. Tipagem forte com TypeScript — interfaces, types, generics e proibicao de `any`

---

## Conceitos React Native aplicados

| Conceito | Descricao |
|---|---|
| `View` | Container principal de layout, equivalente a `div` no React Web |
| `Text` | Unico componente permitido para renderizar texto no React Native |
| `TextInput` | Campo de entrada de texto com suporte a teclado, mascara e eventos |
| `TouchableOpacity` / `Pressable` | Elementos clicaveis com feedback visual ao toque |
| `FlatList` | Componente otimizado para listas longas — renderiza apenas os itens visiveis |
| `StyleSheet` | API para definir estilos de forma performatica, separada do JSX |
| `useState` | Hook para gerenciar estado local de um componente |
| `useEffect` | Hook para side-effects: busca de dados, subscricoes, timers |
| Context API | Mecanismo nativo do React para estado global sem bibliotecas externas |
| Eventos de formulario | `onChangeText`, `onSubmitEditing`, `onBlur` para controlar inputs |
| Renderizacao condicional | Exibir ou ocultar partes da UI com base em estado, role ou dados |

---

## Tecnologias utilizadas

| Tecnologia | Versao recomendada | Motivo da escolha |
|---|---|---|
| React Native | latest | Framework cross-platform para Android e iOS com uma unica base de codigo |
| Expo | latest | Ecossistema simplificado que elimina a necessidade de ejetar o projeto para funcionalidades basicas |
| TypeScript | latest | Tipagem estatica que elimina classes inteiras de bugs em tempo de compilacao |
| React Navigation | v6 ou superior | Solucao de navegacao padrao e mais adotada pela comunidade React Native |
| AsyncStorage | latest | Persistencia de dados chave-valor no dispositivo, equivalente ao localStorage do browser |
| Fetch / Axios | — | Consumo de APIs REST externas com suporte a async/await e tratamento de erros |

---

## Diferenciais — pontos extras

Os itens abaixo nao sao obrigatorios para a entrega, mas elevam a nota e demonstram dominio tecnico alem do basico:

- **Animacoes de transicao entre telas** — uso da Animated API ou Reanimated para transicoes suaves ao navegar
- **Validacao de formularios em tempo real** — feedback visual imediato enquanto o usuario digita, antes de submeter o formulario
- **Estados de loading avancados** — skeletons, spinners contextuais e mensagens de erro com opcao de retry

---

## Regras de ouro do projeto

Estas cinco regras sao inegociaveis e serao verificadas na avaliacao do codigo:

1. **Proibido usar `any` em qualquer parte do codigo.** Se o tipo nao e conhecido, use generics, `unknown` ou crie uma interface adequada.

2. **Toda logica de negocio fica fora das telas.** Screens sao responsaveis apenas por exibicao e captura de eventos. Regras de negocio, transformacoes de dados e acesso a storage ficam em hooks e services.

3. **Estado global somente via Context API.** Nenhuma screen pode gerenciar estado que precisa ser compartilhado com outra screen usando `useState` local. Para isso existe AuthContext, TaskContext e ThemeContext.

4. **Se um componente, hook, util ou tipo e usado em mais de uma feature, ele vai para `shared/`.** Duplicar codigo entre features e proibido.

5. **Admin cria, edita e exclui. Usuario comum somente visualiza. A UI reflete isso ocultando as acoes de escrita** para quem nao tem permissao.
