import React from 'react';
import { render, fireEvent, act, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { TaskFormScreen } from '../TaskFormScreen';

const mockGoBack = jest.fn();
const mockNavigate = jest.fn();

let mockRouteParams: { taskId?: string } = {};

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ goBack: mockGoBack, navigate: mockNavigate }),
  useRoute: () => ({ params: mockRouteParams }),
}));

const mockAddTask = jest.fn().mockResolvedValue(undefined);
const mockUpdateTask = jest.fn().mockResolvedValue(undefined);
const mockTasks = [
  {
    id: 'task-edit-1',
    title: 'Tarefa existente',
    description: 'Descrição existente',
    status: 'em_andamento' as const,
    priority: 'alta' as const,
    category: 'Estudos',
    categoryIcon: '📚',
    createdAt: '2026-04-25T10:00:00.000Z',
    updatedAt: '2026-04-25T10:00:00.000Z',
  },
];

jest.mock('../../../hooks/useTasks', () => ({
  useTasks: () => ({
    tasks: mockTasks,
    addTask: mockAddTask,
    updateTask: mockUpdateTask,
  }),
}));

describe('TaskFormScreen — modo criação', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRouteParams = {};
  });

  it('renderiza o formulário com campos vazios', () => {
    const { getByTestId } = render(<TaskFormScreen />);
    expect(getByTestId('input-title').props.value).toBe('');
    expect(getByTestId('input-description').props.value).toBe('');
  });

  it('exibe erro "Título é obrigatório" ao digitar e apagar o título', () => {
    const { getByTestId, getByText } = render(<TaskFormScreen />);
    const input = getByTestId('input-title');
    fireEvent.changeText(input, 'algo');
    fireEvent.changeText(input, '');
    expect(getByText('Título é obrigatório')).toBeTruthy();
  });

  it('remove o erro de título ao digitar texto válido', () => {
    const { getByTestId, queryByText } = render(<TaskFormScreen />);
    const input = getByTestId('input-title');
    fireEvent.changeText(input, '');
    fireEvent.changeText(input, 'Título válido');
    expect(queryByText('Título é obrigatório')).toBeNull();
  });

  it('botão de submit fica desabilitado quando título está vazio', () => {
    const { getByTestId } = render(<TaskFormScreen />);
    const btn = getByTestId('btn-submit');
    expect(btn.props.accessibilityState?.disabled).toBe(true);
  });

  it('botão de submit fica habilitado após preencher o título', () => {
    const { getByTestId } = render(<TaskFormScreen />);
    fireEvent.changeText(getByTestId('input-title'), 'Nova tarefa');
    const btn = getByTestId('btn-submit');
    expect(btn.props.accessibilityState?.disabled).toBeFalsy();
  });

  it('chama addTask com os dados corretos e navega de volta após submit', async () => {
    const { getByTestId } = render(<TaskFormScreen />);

    fireEvent.changeText(getByTestId('input-title'), 'Nova tarefa');
    fireEvent.changeText(getByTestId('input-description'), 'Minha descrição');
    fireEvent.press(getByTestId('status-concluida'));
    fireEvent.press(getByTestId('priority-alta'));

    await act(async () => {
      fireEvent.press(getByTestId('btn-submit'));
    });

    expect(mockAddTask).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Nova tarefa',
        description: 'Minha descrição',
        status: 'concluida',
        priority: 'alta',
      })
    );
    expect(mockGoBack).toHaveBeenCalled();
  });

  it('botão cancelar chama goBack sem salvar', () => {
    const { getByTestId } = render(<TaskFormScreen />);
    fireEvent.press(getByTestId('btn-cancel'));
    expect(mockGoBack).toHaveBeenCalled();
    expect(mockAddTask).not.toHaveBeenCalled();
  });

  it('exibe alerta de erro quando addTask rejeita', async () => {
    mockAddTask.mockRejectedValueOnce(new Error('falha inesperada'));
    const alertSpy = jest.spyOn(Alert, 'alert');

    const { getByTestId } = render(<TaskFormScreen />);
    fireEvent.changeText(getByTestId('input-title'), 'Nova tarefa');

    await act(async () => {
      fireEvent.press(getByTestId('btn-submit'));
    });

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith(
        'Erro',
        'Não foi possível salvar a tarefa. Tente novamente.'
      );
    });
  });
});

describe('TaskFormScreen — modo edição', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRouteParams = { taskId: 'task-edit-1' };
  });

  it('pré-preenche os campos com dados da tarefa existente', () => {
    const { getByTestId } = render(<TaskFormScreen />);
    expect(getByTestId('input-title').props.value).toBe('Tarefa existente');
    expect(getByTestId('input-description').props.value).toBe('Descrição existente');
    expect(getByTestId('input-category').props.value).toBe('Estudos');
    expect(getByTestId('input-category-icon').props.value).toBe('📚');
  });

  it('chama updateTask em vez de addTask ao salvar no modo edição', async () => {
    const { getByTestId } = render(<TaskFormScreen />);

    await act(async () => {
      fireEvent.press(getByTestId('btn-submit'));
    });

    expect(mockUpdateTask).toHaveBeenCalledWith('task-edit-1', expect.any(Object));
    expect(mockAddTask).not.toHaveBeenCalled();
  });
});
