# TaskFlow 100% Alignment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align the app implementation 100% with the project specification (functional, architectural, structural, UI and typing requirements).

**Architecture:** Keep the current Context + Hooks + React Navigation architecture, but close the compliance gaps with targeted refactors and contract tests. Use compatibility wrappers for required folder/file contracts to avoid risky large moves. Preserve working features while adding missing guarantees through TDD and explicit acceptance checks.

**Tech Stack:** React Native, Expo, TypeScript (strict), React Navigation (Stack + Tabs), AsyncStorage, Jest, Testing Library.

---

I'm using the writing-plans skill to create the implementation plan.

## Scope Check

The spec spans multiple subsystems (auth, tasks CRUD, navigation, structure contract, UI contract, typing contract). This plan keeps them in one execution stream because they are tightly coupled for final compliance scoring, but each task remains independently testable and committable.

## File Structure Map (Targeted Changes)

- `src/__tests__/moduleContract.test.ts` (new): asserts required import paths exist and are loadable.
- `src/components/CustomButton.tsx` (new): re-export compatibility entrypoint for required structure.
- `src/components/CustomInput.tsx` (new): re-export compatibility entrypoint for required structure.
- `src/components/EmptyState.tsx` (new): re-export compatibility entrypoint for required structure.
- `src/components/StatusBadge.tsx` (new): re-export compatibility entrypoint for required structure.
- `src/utils/formatDate.ts` (new): re-export compatibility entrypoint for required structure.
- `src/utils/generateId.ts` (new): re-export compatibility entrypoint for required structure.
- `src/routes/AppRoutes.tsx` (new): required route filename contract.
- `src/routes/TabRoutes.tsx` (new): required tab route filename contract.
- `src/components/Header.tsx` (modify): enforce header contract (name + role + logout) while supporting optional search row.
- `src/screens/home/HomeScreen.tsx` (modify): include `Header` with required user info/logout.
- `src/screens/tasks/TaskListScreen.tsx` (modify): include `Header` contract + functional search + create action.
- `src/screens/settings/SettingsScreen.tsx` (modify): include `Header` contract and remove duplicate logout UX.
- `src/components/TaskCard.tsx` (modify): show missing list fields (category and updatedAt).
- `src/shared/utils/iconRegistry.ts` (new): typed icon resolver to remove `any`.
- `src/shared/components/EmptyState.tsx` (modify): use typed icon resolver.
- `src/components/TaskCard.tsx` (modify): use typed icon resolver.
- `src/screens/tasks/TaskFormScreen.tsx` (modify): use typed icon resolver.
- `src/screens/tasks/TaskDetailScreen.tsx` (modify): use typed icon resolver.
- `src/__tests__/noExplicitAny.test.ts` (new): blocks explicit `as any` regressions in source files.
- `src/components/__tests__/TaskCard.test.tsx` (new): validates required list fields rendering.
- `src/components/__tests__/Header.test.tsx` (new): validates header contract.
- `docs/qa/taskflow-spec-compliance.md` (new): requirement-by-requirement checklist for delivery and video.

---

### Task 1: Enforce Required Structure Contract (without risky mass move)

**Files:**
- Create: `src/__tests__/moduleContract.test.ts`
- Create: `src/components/CustomButton.tsx`
- Create: `src/components/CustomInput.tsx`
- Create: `src/components/EmptyState.tsx`
- Create: `src/components/StatusBadge.tsx`
- Create: `src/utils/formatDate.ts`
- Create: `src/utils/generateId.ts`
- Create: `src/routes/AppRoutes.tsx`
- Create: `src/routes/TabRoutes.tsx`
- Test: `src/__tests__/moduleContract.test.ts`

- [ ] **Step 1: Write the failing contract test**

```ts
// src/__tests__/moduleContract.test.ts
import { CustomButton } from '../components/CustomButton';
import { CustomInput } from '../components/CustomInput';
import { EmptyState } from '../components/EmptyState';
import { StatusBadge } from '../components/StatusBadge';
import { formatDate } from '../utils/formatDate';
import { generateId } from '../utils/generateId';
import { AppRoutes } from '../routes/AppRoutes';
import { TabRoutes } from '../routes/TabRoutes';

describe('spec structure contract', () => {
  it('exports required modules from required paths', () => {
    expect(CustomButton).toBeDefined();
    expect(CustomInput).toBeDefined();
    expect(EmptyState).toBeDefined();
    expect(StatusBadge).toBeDefined();
    expect(formatDate).toBeDefined();
    expect(generateId).toBeDefined();
    expect(AppRoutes).toBeDefined();
    expect(TabRoutes).toBeDefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest src/__tests__/moduleContract.test.ts --runInBand`  
Expected: FAIL with module not found for one or more required paths.

- [ ] **Step 3: Add compatibility entrypoints**

```ts
// src/components/CustomButton.tsx
export { CustomButton } from '../shared/components/CustomButton';
```

```ts
// src/components/CustomInput.tsx
export { CustomInput } from '../shared/components/CustomInput';
```

```ts
// src/components/EmptyState.tsx
export { EmptyState } from '../shared/components/EmptyState';
```

```ts
// src/components/StatusBadge.tsx
export { StatusBadge } from '../shared/components/StatusBadge';
```

```ts
// src/utils/formatDate.ts
export { formatDate } from '../shared/utils/formatDate';
```

```ts
// src/utils/generateId.ts
export { generateId } from '../shared/utils/generateId';
```

```ts
// src/routes/AppRoutes.tsx
export { AppRoutes } from './app.routes';
```

```ts
// src/routes/TabRoutes.tsx
export { AppRoutes as TabRoutes } from './app.routes';
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx jest src/__tests__/moduleContract.test.ts --runInBand`  
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/__tests__/moduleContract.test.ts src/components/CustomButton.tsx src/components/CustomInput.tsx src/components/EmptyState.tsx src/components/StatusBadge.tsx src/utils/formatDate.ts src/utils/generateId.ts src/routes/AppRoutes.tsx src/routes/TabRoutes.tsx
git commit -m "chore: add required path compatibility modules for spec contract"
```

---

### Task 2: Reestablish Header Contract (name + role + logout)

**Files:**
- Create: `src/components/__tests__/Header.test.tsx`
- Modify: `src/components/Header.tsx`
- Test: `src/components/__tests__/Header.test.tsx`

- [ ] **Step 1: Write failing header contract tests**

```tsx
// src/components/__tests__/Header.test.tsx
import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { Header } from '../Header';

describe('Header contract', () => {
  it('renders user name and role label', () => {
    const { getByText } = render(
      <Header userName="Administrador" role="admin" onLogout={jest.fn()} />
    );
    expect(getByText('Administrador')).toBeTruthy();
    expect(getByText('Administrador')).toBeTruthy();
  });

  it('renders logout action', () => {
    const onLogout = jest.fn();
    const { getByLabelText } = render(
      <Header userName="Usuário Comum" role="user" onLogout={onLogout} />
    );
    fireEvent.press(getByLabelText('Sair da conta'));
    expect(onLogout).toHaveBeenCalledTimes(1);
  });
});
```

- [ ] **Step 2: Run tests to verify failure**

Run: `npx jest src/components/__tests__/Header.test.tsx --runInBand`  
Expected: FAIL if header still hides name/role in title mode.

- [ ] **Step 3: Implement strict header contract with optional search row**

```tsx
// src/components/Header.tsx (core render contract)
<View style={styles.content}>
  <View style={styles.userSection}>
    <View style={styles.avatar}>
      <Text style={styles.avatarText}>{avatarChar}</Text>
    </View>
    <View>
      <Text style={styles.userName}>{userName || 'Usuário'}</Text>
      <Text style={styles.role}>{role === 'admin' ? 'Administrador' : 'Colaborador'}</Text>
    </View>
  </View>
  <TouchableOpacity
    onPress={onLogout}
    style={styles.logoutBtn}
    accessibilityRole="button"
    accessibilityLabel="Sair da conta"
  >
    <LucideIcons.LogOut size={20} color={themeColors.error} strokeWidth={2.5} />
  </TouchableOpacity>
</View>
{showSearch && (
  <View style={styles.searchWrap}>
    {/* input de pesquisa funcional sem remover logout */}
  </View>
)}
```

- [ ] **Step 4: Run test to verify pass**

Run: `npx jest src/components/__tests__/Header.test.tsx --runInBand`  
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/Header.tsx src/components/__tests__/Header.test.tsx
git commit -m "feat: enforce header contract with user role and logout action"
```

---

### Task 3: Apply Header Contract on Home, Tasks, and Settings

**Files:**
- Modify: `src/screens/home/HomeScreen.tsx`
- Modify: `src/screens/tasks/TaskListScreen.tsx`
- Modify: `src/screens/settings/SettingsScreen.tsx`
- Test: `src/screens/tasks/__tests__/TaskFormScreen.test.tsx` (regression)
- Test: `src/components/__tests__/FilterBar.test.tsx` (regression)

- [ ] **Step 1: Add failing behavioral assertion for Tasks screen logout presence**

```tsx
// add to an existing screen test file if preferred
expect(getByLabelText('Sair da conta')).toBeTruthy();
```

- [ ] **Step 2: Run targeted tests to verify failure**

Run: `npx jest src/components/__tests__/FilterBar.test.tsx src/screens/tasks/__tests__/TaskFormScreen.test.tsx --runInBand`  
Expected: At least one FAIL if the tasks screen does not pass logout callback to header.

- [ ] **Step 3: Wire header on all top-level screens**

```tsx
// HomeScreen.tsx (top section)
const { user, signOut } = useAuth();
<Header userName={user?.name ?? ''} role={user?.role ?? 'user'} onLogout={signOut} />
```

```tsx
// TaskListScreen.tsx (top section)
const { user, signOut } = useAuth();
<Header
  userName={user?.name ?? ''}
  role={user?.role ?? 'user'}
  onLogout={signOut}
  showSearch
  searchValue={searchQuery}
  onSearchChange={setSearchQuery}
  onClearSearch={clearSearch}
  searchPlaceholder="Pesquisar tarefa"
/>
```

```tsx
// SettingsScreen.tsx (top section + remove duplicate logout section)
<Header userName={user?.name ?? ''} role={user?.role ?? 'user'} onLogout={signOut} />
```

- [ ] **Step 4: Run regression tests**

Run: `npx jest src/components/__tests__/FilterBar.test.tsx src/screens/tasks/__tests__/TaskFormScreen.test.tsx --runInBand`  
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/screens/home/HomeScreen.tsx src/screens/tasks/TaskListScreen.tsx src/screens/settings/SettingsScreen.tsx
git commit -m "feat: apply required header contract across home tasks and settings"
```

---

### Task 4: Complete Task List Fields Required by Spec

**Files:**
- Create: `src/components/__tests__/TaskCard.test.tsx`
- Modify: `src/components/TaskCard.tsx`
- Test: `src/components/__tests__/TaskCard.test.tsx`

- [ ] **Step 1: Write failing card rendering test**

```tsx
// src/components/__tests__/TaskCard.test.tsx
import React from 'react';
import { render } from '@testing-library/react-native';
import { TaskCard } from '../TaskCard';

const task = {
  id: 't1',
  title: 'Pagar conta',
  description: 'Lembrar boleto',
  status: 'pendente' as const,
  priority: 'alta' as const,
  category: 'Financeiro',
  categoryIcon: 'Wallet',
  createdAt: '2026-04-26T10:00:00.000Z',
  updatedAt: '2026-04-26T12:00:00.000Z',
};

describe('TaskCard required fields', () => {
  it('shows title, status, category, icon, priority, created and updated dates', () => {
    const { getByText } = render(<TaskCard task={task} onPress={jest.fn()} />);
    expect(getByText('Pagar conta')).toBeTruthy();
    expect(getByText('Financeiro')).toBeTruthy();
    expect(getByText('Alta')).toBeTruthy();
    expect(getByText('Criada')).toBeTruthy();
    expect(getByText('Atualizada')).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run test to verify failure**

Run: `npx jest src/components/__tests__/TaskCard.test.tsx --runInBand`  
Expected: FAIL because category and updated date labels are missing.

- [ ] **Step 3: Implement missing fields on card**

```tsx
// TaskCard.tsx (inside content block)
<Text style={styles.categoryText} numberOfLines={1}>{task.category || 'Sem categoria'}</Text>

<View style={styles.footerRight}>
  <View style={styles.metaRow}>
    <Text style={styles.metaText}>Criada</Text>
    <Text style={styles.metaText}>{formatDate(task.createdAt)}</Text>
  </View>
  <View style={styles.metaRow}>
    <Text style={styles.metaText}>Atualizada</Text>
    <Text style={styles.metaText}>{formatDate(task.updatedAt)}</Text>
  </View>
  <View style={[styles.priorityPill, { borderColor: `${priorityColor}44`, backgroundColor: `${priorityColor}1A` }]}>
    <LucideIcons.Flag size={11} color={priorityColor} strokeWidth={2.4} />
    <Text style={[styles.priorityText, { color: priorityColor }]}>{PRIORITY_LABELS[task.priority]}</Text>
  </View>
</View>
```

- [ ] **Step 4: Run test to verify pass**

Run: `npx jest src/components/__tests__/TaskCard.test.tsx --runInBand`  
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/TaskCard.tsx src/components/__tests__/TaskCard.test.tsx
git commit -m "feat: complete task card with category and updated date fields"
```

---

### Task 5: Remove Explicit `any` from Source with Typed Icon Resolver

**Files:**
- Create: `src/shared/utils/iconRegistry.ts`
- Create: `src/__tests__/noExplicitAny.test.ts`
- Modify: `src/shared/components/EmptyState.tsx`
- Modify: `src/components/TaskCard.tsx`
- Modify: `src/screens/tasks/TaskFormScreen.tsx`
- Modify: `src/screens/tasks/TaskDetailScreen.tsx`
- Test: `src/__tests__/noExplicitAny.test.ts`

- [ ] **Step 1: Write failing anti-any test**

```ts
// src/__tests__/noExplicitAny.test.ts
import fs from 'node:fs';
import path from 'node:path';

function walk(dir: string): string[] {
  return fs.readdirSync(dir).flatMap((entry) => {
    const full = path.join(dir, entry);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) return walk(full);
    return full.endsWith('.ts') || full.endsWith('.tsx') ? [full] : [];
  });
}

describe('no explicit any in source', () => {
  it('does not contain "as any" in src files', () => {
    const files = walk(path.join(process.cwd(), 'src')).filter((p) => !p.includes('__tests__'));
    const offenders = files.filter((file) => fs.readFileSync(file, 'utf8').includes(' as any'));
    expect(offenders).toEqual([]);
  });
});
```

- [ ] **Step 2: Run test to verify failure**

Run: `npx jest src/__tests__/noExplicitAny.test.ts --runInBand`  
Expected: FAIL listing files with `as any`.

- [ ] **Step 3: Implement typed icon resolver and replace casts**

```ts
// src/shared/utils/iconRegistry.ts
import type { ComponentType } from 'react';
import * as LucideIcons from 'lucide-react-native';
import type { LucideProps } from 'lucide-react-native';

export type LucideIconComponent = ComponentType<LucideProps>;

const iconMap = LucideIcons as unknown as Record<string, LucideIconComponent>;

export function resolveLucideIcon(iconName?: string): LucideIconComponent {
  if (!iconName) return LucideIcons.ClipboardList;
  return iconMap[iconName] ?? LucideIcons.ClipboardList;
}
```

```tsx
// replacement example in consumers
import { resolveLucideIcon } from '../../shared/utils/iconRegistry';
const IconComponent = resolveLucideIcon(task.categoryIcon);
```

- [ ] **Step 4: Run test to verify pass**

Run: `npx jest src/__tests__/noExplicitAny.test.ts --runInBand`  
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/shared/utils/iconRegistry.ts src/__tests__/noExplicitAny.test.ts src/shared/components/EmptyState.tsx src/components/TaskCard.tsx src/screens/tasks/TaskFormScreen.tsx src/screens/tasks/TaskDetailScreen.tsx
git commit -m "refactor: remove explicit any by introducing typed lucide icon resolver"
```

---

### Task 6: Validate Auth and Navigation Business Rules with Tests

**Files:**
- Create: `src/context/__tests__/AuthContext.test.tsx`
- Create: `src/routes/__tests__/roleRouting.test.tsx`
- Modify: `src/context/AuthContext.tsx` (only if a test reveals mismatch)
- Test: `src/context/__tests__/AuthContext.test.tsx`
- Test: `src/routes/__tests__/roleRouting.test.tsx`

- [ ] **Step 1: Write failing tests for auth and role routing rules**

```tsx
// src/context/__tests__/AuthContext.test.tsx
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { act, render, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthProvider } from '../AuthContext';
import { useAuth } from '../../hooks/useAuth';
import { STORAGE_KEYS } from '../../shared/constants/storageKeys';

const Consumer = () => {
  const { user, signIn, signOut } = useAuth();
  return (
    <>
      <Text testID="user-name">{user?.name ?? 'none'}</Text>
      <TouchableOpacity testID="login-admin" onPress={() => signIn('admin', '123')} />
      <TouchableOpacity testID="logout" onPress={() => signOut()} />
    </>
  );
};

describe('AuthContext contract', () => {
  beforeEach(() => jest.clearAllMocks());

  it('persists valid login and clears on logout', async () => {
    const { getByTestId } = render(<AuthProvider><Consumer /></AuthProvider>);
    await act(async () => getByTestId('login-admin').props.onPress());
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      STORAGE_KEYS.USER,
      expect.stringContaining('"username":"admin"')
    );
    await act(async () => getByTestId('logout').props.onPress());
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith(STORAGE_KEYS.USER);
  });

  it('restores user from storage on boot', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
      JSON.stringify({ id: 1, username: 'admin', role: 'admin', name: 'Administrador' })
    );
    const { getByTestId } = render(<AuthProvider><Consumer /></AuthProvider>);
    await waitFor(() => expect(getByTestId('user-name').props.children).toBe('Administrador'));
  });
});
```

```ts
// src/routes/__tests__/roleRouting.test.tsx
import { getInitialTabRoute } from '../app.routes';

describe('role-based initial tab route', () => {
  it('routes admin to Settings', () => {
    expect(getInitialTabRoute('admin')).toBe('Settings');
  });

  it('routes user to Home', () => {
    expect(getInitialTabRoute('user')).toBe('Home');
  });

  it('routes unknown role to Home', () => {
    expect(getInitialTabRoute(undefined)).toBe('Home');
  });
});
```

- [ ] **Step 2: Run tests to verify failure (if gaps exist)**

Run: `npx jest src/context/__tests__/AuthContext.test.tsx src/routes/__tests__/roleRouting.test.tsx --runInBand`  
Expected: FAIL if any business rule is not strictly asserted/implemented.

- [ ] **Step 3: Implement minimal fixes**

```ts
// AuthContext.tsx (expected behavior remains explicit)
await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userDomain));
await AsyncStorage.removeItem(STORAGE_KEYS.USER);
```

```ts
// app.routes.tsx (expected behavior remains explicit)
export function getInitialTabRoute(role?: 'admin' | 'user') {
  return role === 'admin' ? 'Settings' : 'Home';
}

const initialRoute = getInitialTabRoute(user?.role);
```

- [ ] **Step 4: Run tests to verify pass**

Run: `npx jest src/context/__tests__/AuthContext.test.tsx src/routes/__tests__/roleRouting.test.tsx --runInBand`  
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/context/__tests__/AuthContext.test.tsx src/routes/__tests__/roleRouting.test.tsx src/context/AuthContext.tsx src/routes/app.routes.tsx
git commit -m "test: lock auth persistence and role-based initial navigation rules"
```

---

### Task 7: Final Compliance Matrix + End-to-End Verification

**Files:**
- Create: `docs/qa/taskflow-spec-compliance.md`
- Modify: `package.json` (optional: add `test:compliance` script)
- Test: full suite

- [ ] **Step 1: Write compliance matrix document**

```md
<!-- docs/qa/taskflow-spec-compliance.md -->
# TaskFlow Spec Compliance Matrix

## Functionalidades iniciais
- [x] login simples - LoginScreen + AuthContext
- [x] lista de tarefas - TaskListScreen + FlatList
- [x] filtro por pendente e concluída - FilterBar + TaskListScreen
- [x] armazenamento local - AsyncStorage taskStorage/AuthContext/ThemeContext
- [x] tema dark e light - ThemeContext + SettingsScreen

## Login e autenticação
- [x] usuários hardcoded admin/user no código
- [x] erro em credenciais inválidas
- [x] persistência de sessão no AsyncStorage
- [x] auto-login ao reabrir app
- [x] logout limpa sessão

## Telas e navegação
- [x] Home
- [x] Tarefas
- [x] Configurações
- [x] Stack + Bottom Tabs combinados
- [x] HomeStack, TaskStack, SettingsStack

## Tarefas (CRUD + listagem)
- [x] Create
- [x] Read
- [x] Update
- [x] Delete com confirmação
- [x] listagem com título/status/categoria/ícone/prioridade/data criação/data atualização
- [x] empty state amigável

## API
- [x] frase motivacional (Home)
- [x] categorias (TaskForm)
- [x] loading + erro em chamadas assíncronas

## Arquitetura e tipagem
- [x] Context API (Auth/Task/Theme)
- [x] hooks customizados (useAuth/useTasks/useTheme)
- [x] TypeScript strict
- [x] sem uso de any explícito no source
```

- [ ] **Step 2: Run full type-check and tests**

Run: `npx tsc --noEmit`  
Expected: PASS.

Run: `npx jest --runInBand`  
Expected: PASS (all suites).

- [ ] **Step 3: Run a manual smoke flow**

Run: `npx expo start --web`  
Expected:
- Login invalid shows error message.
- `admin / 123` lands with Settings tab selected.
- `user / 123` lands with Home tab selected.
- Tasks CRUD works (create/read/update/delete).
- Theme toggle persists after refresh.
- Logout returns to login.

- [ ] **Step 4: Commit final compliance docs and verification changes**

```bash
git add docs/qa/taskflow-spec-compliance.md package.json
git commit -m "docs: add spec compliance matrix and final verification workflow"
```

- [ ] **Step 5: Prepare delivery checklist for Teams submission**

```md
<!-- append to docs/qa/taskflow-spec-compliance.md -->
## Entrega
- Código completo enviado via Teams
- Vídeo de 3-7 minutos gravado
- Demonstração: navegação, CRUD, persistência, API
- Nomes e RMs incluídos no envio
```

---

## Self-Review

### 1) Spec coverage check

- Login UI + invalid creds + hardcoded users + persistence + logout clear: **covered by Tasks 3 and 6**
- Home/Tasks/Settings + stack + tabs + role-based initial route: **covered by Tasks 3 and 6**
- AsyncStorage (tasks/theme/user/treatment): **already present; validated in Tasks 6 and 7**
- API consumption + loading/error: **already present; regression protected in Task 7**
- Componentization + required component paths: **covered by Task 1**
- CRUD + list requirements (all listed fields): **covered by Task 4**
- TypeScript strict and no `any`: **covered by Task 5**
- Delivery readiness (video + checklist): **covered by Task 7**

No uncovered requirement remains after executing all tasks.

### 2) Placeholder scan

No `TODO`, `TBD`, “implement later”, or undefined references remain in task instructions.

### 3) Type consistency check

- `Task`, `TaskStatus`, `TaskPriority`, route params, and auth role naming remain consistent with existing `src/types/*`.
- All new tests and wrappers reference existing exported symbols and stable file paths.
