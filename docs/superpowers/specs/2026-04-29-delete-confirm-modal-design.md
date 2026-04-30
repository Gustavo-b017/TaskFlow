# Delete Confirm Modal — Design Spec

## Objetivo

Substituir o `Alert.alert` nativo (e `window.confirm` web) do fluxo de exclusão de tarefa por um modal customizado que segue o design system do app, exibe o nome do card e exige uma espera de 3 segundos antes de permitir a confirmação.

---

## Componente: `DeleteConfirmModal`

**Arquivo:** `src/components/DeleteConfirmModal.tsx`

### Props

```ts
interface DeleteConfirmModalProps {
  visible: boolean;
  taskName: string;
  onConfirm: () => void;
  onCancel: () => void;
}
```

### Estrutura visual

- **Backdrop:** overlay full-screen `rgba(0,0,0,0.55)`, `justifyContent: center`, `alignItems: center`; toque fora do card chama `onCancel`
- **Card:**
  - `backgroundColor: themeColors.surface`
  - `borderRadius: BORDER_RADIUS.lg`
  - `borderWidth: 1.5`, `borderColor: themeColors.border`
  - `padding: SPACING.lg`
  - `marginHorizontal: SPACING.lg`
- **Ícone:** `Trash2` do Lucide, cor `themeColors.error`, fundo circular `error + 15% opacidade`, centralizado no topo do card
- **Título:** "Excluir tarefa?" — `fontWeight: 800`, `color: themeColors.text`
- **Subtítulo:** `Você está prestes a excluir "{taskName}". Esta ação não pode ser desfeita.` — nome da tarefa em **negrito**, restante em `themeColors.textMuted`
- **Botões (linha):**
  - Cancelar: borda `themeColors.border`, texto `themeColors.text`, fundo `themeColors.inputBg`
  - Excluir: fundo `themeColors.error`, texto branco; quando inativo (countdown > 0): `opacity: 0.5`, `disabled: true`, texto `Excluir (N)`

### Lógica do contador

```
countdown: number  // estado local, inicia em 3
```

- `useEffect` disparado quando `visible` muda para `true`:
  - Reseta `countdown` para `3`
  - Inicia `setInterval` de 1000ms decrementando até `0`
  - Limpa o interval ao chegar em `0` ou quando `visible` muda para `false`
- Botão Excluir habilitado somente quando `countdown === 0`

---

## Integração: `TaskDetailScreen`

**Arquivo:** `src/screens/tasks/TaskDetailScreen.tsx`

1. Adicionar estado: `const [deleteModalVisible, setDeleteModalVisible] = useState(false)`
2. `handleDelete()` passa a apenas fazer `setDeleteModalVisible(true)` (remover `Alert.alert` e `window.confirm`)
3. Renderizar no JSX (dentro do `SafeAreaView`):

```tsx
<DeleteConfirmModal
  visible={deleteModalVisible}
  taskName={currentTask.title}
  onConfirm={async () => {
    setDeleteModalVisible(false);
    try {
      await removeTask(currentTask.id);
      navigation.goBack();
    } catch {
      Alert.alert('Erro', 'Não foi possível excluir a tarefa.');
    }
  }}
  onCancel={() => setDeleteModalVisible(false)}
/>
```

---

## Tema (light/dark)

O componente usa `useTheme()` + `COLORS[theme]` internamente. Não recebe cores como prop. Acompanha a preferência do usuário automaticamente.

---

## Arquivos afetados

| Arquivo | Ação |
|---|---|
| `src/components/DeleteConfirmModal.tsx` | Criar |
| `src/screens/tasks/TaskDetailScreen.tsx` | Modificar `handleDelete` + renderizar modal |

---

## Fora de escopo

- Animação de entrada/saída do modal (fade/slide)
- Swipe para fechar
- Uso do modal em outras telas além de `TaskDetailScreen`
