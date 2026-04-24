# Componentes e UI Mobile

## Componentes obrigatorios

| Componente | Localizacao | Responsabilidade |
|---|---|---|
| CustomButton | shared/components/ | Botao estilizado com estados: normal, loading, desabilitado |
| CustomInput | shared/components/ | Input com label, estado de erro e estilizacao consistente |
| EmptyState | shared/components/ | Exibido quando uma lista esta vazia — mensagem e icone |
| StatusBadge | shared/components/ | Indicador visual colorido do status da tarefa |
| Header | components/ | Cabecalho com nome do usuario, perfil (admin/user) e botao de logout |
| TaskCard | components/ | Card de uma tarefa na lista — titulo, status, categoria, prioridade, datas |
| FilterBar | components/ | Barra de filtros por status (pendente, em andamento, concluida) |

CustomButton, CustomInput, EmptyState e StatusBadge ficam em `shared/components/` por serem genericos e reutilizaveis em qualquer parte do app. Header, TaskCard e FilterBar ficam em `components/` por terem conhecimento do dominio do app (conhecem Task, User, etc.).

## FlatList — requisitos da listagem

A listagem de tarefas usa obrigatoriamente FlatList (nunca ScrollView com map()).

Cada item da lista deve exibir:

1. Titulo da tarefa
2. Status com cor correspondente (via StatusBadge)
3. Categoria e seu icone ou imagem representativa
4. Prioridade
5. Data de criacao
6. Data de atualizacao

Comportamentos obrigatorios:

- Cada item e clicavel e navega para TaskDetailScreen
- Quando a lista esta vazia, exibe o componente EmptyState
- Suporta filtro por status via FilterBar

Exemplo de estrutura minima da FlatList:

```tsx
<FlatList
  data={filteredTasks}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => (
    <TaskCard
      task={item}
      onPress={() => navigation.navigate('TaskDetail', { taskId: item.id })}
    />
  )}
  ListEmptyComponent={<EmptyState message="Nenhuma tarefa encontrada." />}
/>
```

## UI Mobile-First

Principios aplicados por ser um app mobile:

**SafeAreaView:** todas as telas usam SafeAreaView para respeitar notch, barra de status e barra de navegacao do sistema operacional.

**Tamanho minimo de toque:** todos os elementos interativos (botoes, cards, icones) devem ter no minimo 44x44dp para garantir toque preciso em qualquer tamanho de dedo.

**KeyboardAvoidingView:** telas com formularios (TaskFormScreen, LoginScreen) usam KeyboardAvoidingView para o conteudo nao ficar oculto atras do teclado virtual.

**Unidades relativas:** usar Dimensions, percentuais ou flexbox — nunca pixels fixos que quebram em telas com densidades ou resolucoes diferentes.

**FlatList sobre ScrollView:** FlatList renderiza somente os itens visiveis na tela, economizando memoria em listas longas. ScrollView com map() carrega todos os itens de uma vez e deve ser evitada para colecoes de tamanho variavel.

## Principios de UI

| Principio | Detalhes |
|---|---|
| Layout limpo | Espacamento consistente definido via StyleSheet, sem valores arbitrarios inline |
| Cores por status | Pendente: vermelho — Em andamento: amarelo/laranja — Concluida: verde |
| Inputs estilizados | Bordas, estado de foco e estado de erro bem definidos via CustomInput |
| Loading | ActivityIndicator durante operacoes assincronas (busca de API, carregamento inicial) |
| Feedback ao salvar | Alert ou toast apos salvar/editar com sucesso |
| Confirmacao ao excluir | Alert.alert com botao destrutivo antes de deletar |
| Empty state amigavel | Mensagem clara e orientacao ao usuario quando a lista esta vazia |
| Mensagens de erro | Erros de validacao, campos obrigatorios e falhas de rede com mensagens visiveis |

## Tema Dark e Light

O tema e controlado pelo ThemeContext e aplicado em todos os StyleSheets. Nenhum componente usa cores hardcoded — todos consomem o tema via `useTheme()`.

```ts
// Exemplo de uso do tema em um componente
const { theme } = useTheme();
const styles = createStyles(theme);

// Fora do componente — funcao que gera os estilos com base no tema atual
function createStyles(theme: 'light' | 'dark') {
  return StyleSheet.create({
    container: {
      backgroundColor: theme === 'dark' ? '#121212' : '#FFFFFF',
    },
    text: {
      color: theme === 'dark' ? '#FFFFFF' : '#000000',
    },
    card: {
      backgroundColor: theme === 'dark' ? '#1E1E1E' : '#F5F5F5',
    },
  });
}
```

A preferencia de tema e persistida no AsyncStorage e restaurada ao reabrir o app, sem solicitar ao usuario novamente.

## Referencia de cores por status

| Status | Cor (Light) | Cor (Dark) | Uso |
|---|---|---|---|
| pendente | #EF4444 (vermelho) | #F87171 (vermelho claro) | StatusBadge, destaque no TaskCard |
| em_andamento | #F59E0B (amarelo/laranja) | #FCD34D (amarelo claro) | StatusBadge, destaque no TaskCard |
| concluida | #10B981 (verde) | #34D399 (verde claro) | StatusBadge, destaque no TaskCard |

As cores escurecem no dark mode para garantir contraste adequado sobre fundos escuros, seguindo as diretrizes de acessibilidade (WCAG AA, razao de contraste minima de 4.5:1 para texto normal).
