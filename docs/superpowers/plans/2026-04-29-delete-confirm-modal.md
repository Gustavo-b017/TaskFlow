# Delete Confirm Modal — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Substituir o `Alert.alert` nativo do fluxo de exclusão por um modal customizado que exibe o nome do card, respeita o tema light/dark do app e exige 3 segundos de espera antes de liberar o botão de confirmar.

**Architecture:** Componente isolado `DeleteConfirmModal` usando `Modal` do React Native com fade-in animado via `Animated.timing` (200ms ease-out). O contador regressivo é gerenciado por `setInterval` em `useEffect` disparado quando `visible` muda para `true`. A `TaskDetailScreen` substitui `handleDelete` para apenas abrir o modal.

**Tech Stack:** React Native (Modal, Animated, TouchableOpacity), TypeScript, `useTheme` hook, design tokens de `src/styles/theme.ts`, Lucide React Native, Jest + @testing-library/react-native.

---

## File Map

| Arquivo | Ação | Responsabilidade |
|---|---|---|
| `src/components/DeleteConfirmModal.tsx` | **Criar** | Componente de modal de confirmação com countdown |
| `src/components/__tests__/DeleteConfirmModal.test.tsx` | **Criar** | Testes do componente |
| `src/screens/tasks/TaskDetailScreen.tsx` | **Modificar** | Remover Alert/confirm, adicionar estado e renderizar modal |

---

## Task 1: Criar o componente `DeleteConfirmModal`

**Files:**
- Create: `src/components/DeleteConfirmModal.tsx`

- [ ] **Step 1: Criar o arquivo com a estrutura base**

```tsx
// src/components/DeleteConfirmModal.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import * as LucideIcons from 'lucide-react-native';
import { useTheme } from '../hooks/useTheme';
import { BORDER_RADIUS, COLORS, SPACING } from '../styles/theme';

const COUNTDOWN_START = 3;

interface DeleteConfirmModalProps {
  visible: boolean;
  taskName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmModal({
  visible,
  taskName,
  onConfirm,
  onCancel,
}: DeleteConfirmModalProps) {
  const { theme } = useTheme();
  const themeColors = COLORS[theme];
  const styles = createStyles(theme);

  const [countdown, setCountdown] = useState(COUNTDOWN_START);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Animação de entrada e reset do countdown
  useEffect(() => {
    if (visible) {
      setCountdown(COUNTDOWN_START);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();

      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    } else {
      fadeAnim.setValue(0);
    }
  }, [visible, fadeAnim]);

  const canConfirm = countdown === 0;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onCancel}
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={onCancel}>
        <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
          <TouchableWithoutFeedback>
            <View style={styles.card}>
              {/* Ícone */}
              <View style={styles.iconWrapper}>
                <LucideIcons.Trash2
                  size={28}
                  color={themeColors.error}
                  strokeWidth={2.5}
                />
              </View>

              {/* Título */}
              <Text style={styles.title}>Excluir tarefa?</Text>

              {/* Subtítulo com nome em negrito */}
              <Text style={styles.subtitle}>
                Você está prestes a excluir{' '}
                <Text style={styles.taskName}>"{taskName}"</Text>
                {'. Esta ação não pode ser desfeita.'}
              </Text>

              {/* Botões */}
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={onCancel}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityLabel="Cancelar exclusão"
                >
                  <Text style={styles.cancelText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.deleteButton,
                    !canConfirm && styles.deleteButtonDisabled,
                  ]}
                  onPress={canConfirm ? onConfirm : undefined}
                  disabled={!canConfirm}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityLabel={
                    canConfirm
                      ? 'Confirmar exclusão'
                      : `Aguarde ${countdown} segundos`
                  }
                  accessibilityState={{ disabled: !canConfirm }}
                >
                  <Text style={styles.deleteText}>
                    {canConfirm ? 'Excluir' : `Excluir (${countdown})`}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

function createStyles(theme: 'light' | 'dark') {
  const themeColors = COLORS[theme];
  return StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.55)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    card: {
      backgroundColor: themeColors.surface,
      borderRadius: BORDER_RADIUS.lg,
      borderWidth: 1.5,
      borderColor: themeColors.border,
      padding: SPACING.lg,
      marginHorizontal: SPACING.lg,
      width: '85%',
      alignItems: 'center',
    },
    iconWrapper: {
      width: 64,
      height: 64,
      borderRadius: BORDER_RADIUS.full,
      backgroundColor: `${themeColors.error}1A`,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: SPACING.md,
    },
    title: {
      fontSize: 20,
      fontWeight: '800',
      color: themeColors.text,
      marginBottom: SPACING.sm,
      textAlign: 'center',
      letterSpacing: -0.3,
    },
    subtitle: {
      fontSize: 14,
      color: themeColors.textMuted,
      textAlign: 'center',
      lineHeight: 21,
      marginBottom: SPACING.lg,
    },
    taskName: {
      fontWeight: '700',
      color: themeColors.text,
    },
    buttonRow: {
      flexDirection: 'row',
      gap: SPACING.sm,
      width: '100%',
    },
    cancelButton: {
      flex: 1,
      minHeight: 48,
      borderRadius: BORDER_RADIUS.full,
      borderWidth: 1.5,
      borderColor: themeColors.border,
      backgroundColor: themeColors.inputBg,
      justifyContent: 'center',
      alignItems: 'center',
    },
    cancelText: {
      fontSize: 15,
      fontWeight: '700',
      color: themeColors.text,
    },
    deleteButton: {
      flex: 1,
      minHeight: 48,
      borderRadius: BORDER_RADIUS.full,
      backgroundColor: themeColors.error,
      justifyContent: 'center',
      alignItems: 'center',
    },
    deleteButtonDisabled: {
      opacity: 0.45,
    },
    deleteText: {
      fontSize: 15,
      fontWeight: '700',
      color: '#FFFFFF',
    },
  });
}
```

- [ ] **Step 2: Confirmar que o arquivo compila sem erros**

```bash
npx tsc --noEmit
```

Esperado: sem erros de tipo relacionados ao novo arquivo.

---

## Task 2: Testes do `DeleteConfirmModal`

**Files:**
- Create: `src/components/__tests__/DeleteConfirmModal.test.tsx`

- [ ] **Step 1: Escrever os testes**

```tsx
// src/components/__tests__/DeleteConfirmModal.test.tsx
import React from 'react';
import { act, fireEvent, render } from '@testing-library/react-native';
import { DeleteConfirmModal } from '../DeleteConfirmModal';

const baseProps = {
  visible: true,
  taskName: 'Comprar leite',
  onConfirm: jest.fn(),
  onCancel: jest.fn(),
};

describe('DeleteConfirmModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renderiza o nome da tarefa no subtítulo', () => {
    const { getByText } = render(<DeleteConfirmModal {...baseProps} />);
    expect(getByText(/"Comprar leite"/)).toBeTruthy();
  });

  it('exibe contador regressivo no botão Excluir ao abrir', () => {
    const { getByText } = render(<DeleteConfirmModal {...baseProps} />);
    expect(getByText('Excluir (3)')).toBeTruthy();
  });

  it('decrementa o contador a cada segundo', () => {
    const { getByText } = render(<DeleteConfirmModal {...baseProps} />);

    act(() => { jest.advanceTimersByTime(1000); });
    expect(getByText('Excluir (2)')).toBeTruthy();

    act(() => { jest.advanceTimersByTime(1000); });
    expect(getByText('Excluir (1)')).toBeTruthy();
  });

  it('habilita o botão Excluir após 3 segundos', () => {
    const { getByText } = render(<DeleteConfirmModal {...baseProps} />);

    act(() => { jest.advanceTimersByTime(3000); });
    expect(getByText('Excluir')).toBeTruthy();
  });

  it('não chama onConfirm antes do countdown zerar', () => {
    const onConfirm = jest.fn();
    const { getByA11yLabel } = render(
      <DeleteConfirmModal {...baseProps} onConfirm={onConfirm} />
    );
    fireEvent.press(getByA11yLabel(/Aguarde/));
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it('chama onConfirm ao pressionar Excluir após countdown', () => {
    const onConfirm = jest.fn();
    const { getByA11yLabel } = render(
      <DeleteConfirmModal {...baseProps} onConfirm={onConfirm} />
    );

    act(() => { jest.advanceTimersByTime(3000); });
    fireEvent.press(getByA11yLabel('Confirmar exclusão'));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('chama onCancel ao pressionar Cancelar', () => {
    const onCancel = jest.fn();
    const { getByA11yLabel } = render(
      <DeleteConfirmModal {...baseProps} onCancel={onCancel} />
    );
    fireEvent.press(getByA11yLabel('Cancelar exclusão'));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('não renderiza nada quando visible=false', () => {
    const { queryByText } = render(
      <DeleteConfirmModal {...baseProps} visible={false} />
    );
    expect(queryByText('Excluir tarefa?')).toBeNull();
  });
});
```

- [ ] **Step 2: Rodar os testes e verificar que falham (TDD)**

```bash
npx jest src/components/__tests__/DeleteConfirmModal.test.tsx --no-coverage
```

Esperado: todos os testes **FAIL** com "Cannot find module '../DeleteConfirmModal'".
(O componente já foi criado no Task 1, então o erro esperado aqui é de lógica/implementação se algo não estiver correto.)

- [ ] **Step 3: Rodar os testes novamente após Task 1 e confirmar que passam**

```bash
npx jest src/components/__tests__/DeleteConfirmModal.test.tsx --no-coverage
```

Esperado: **8 passed**.

- [ ] **Step 4: Commit do componente e dos testes**

```bash
git add src/components/DeleteConfirmModal.tsx src/components/__tests__/DeleteConfirmModal.test.tsx
git commit -m "feat: add DeleteConfirmModal with 3s countdown and theme support"
```

---

## Task 3: Integrar o modal na `TaskDetailScreen`

**Files:**
- Modify: `src/screens/tasks/TaskDetailScreen.tsx`

- [ ] **Step 1: Adicionar import do componente**

No topo do arquivo, após os imports existentes, adicionar:

```tsx
import { DeleteConfirmModal } from '../../components/DeleteConfirmModal';
```

- [ ] **Step 2: Adicionar estado do modal**

Dentro de `TaskDetailScreen`, após os estados existentes (linha ~43), adicionar:

```tsx
const [deleteModalVisible, setDeleteModalVisible] = useState(false);
```

- [ ] **Step 3: Substituir `handleDelete`**

Localizar a função `handleDelete` (linha ~62) e substituir **completamente** por:

```tsx
function handleDelete() {
  setDeleteModalVisible(true);
}
```

(Remove o `Alert.alert`, o `window.confirm` e o bloco `Platform.OS === 'web'`.)

- [ ] **Step 4: Renderizar o modal no JSX**

Dentro do `return`, logo antes do fechamento do `<SafeAreaView>` (após o `<ScrollView>`), adicionar:

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

- [ ] **Step 5: Verificar que o import de `Alert` ainda está presente**

O `Alert` é mantido apenas para o fallback de erro. Confirmar que `Alert` permanece nos imports do React Native — não remover.

- [ ] **Step 6: Rodar testes da tela para garantir sem regressões**

```bash
npx jest --no-coverage
```

Esperado: todos os testes passando.

- [ ] **Step 7: Commit da integração**

```bash
git add src/screens/tasks/TaskDetailScreen.tsx
git commit -m "feat: replace Alert with DeleteConfirmModal in TaskDetailScreen"
```

---

## Checklist de Entrega (ui-ux-pro-max)

- [ ] Ícones: `Trash2` do Lucide (sem emoji)
- [ ] Touch targets: botões com `minHeight: 48` (≥ 44px)
- [ ] Animação: fade 200ms `ease-out`, sem `linear`
- [ ] Tema: todas as cores via `themeColors` (light/dark automático)
- [ ] Contraste: texto `themeColors.text` sobre `themeColors.surface` (≥ 4.5:1)
- [ ] Acessibilidade: `accessibilityRole`, `accessibilityLabel`, `accessibilityState` em todos os botões
- [ ] Backdrop tap cancela o modal (`onRequestClose`)
- [ ] `Animated` com `useNativeDriver: true` (UI thread)
