import React from 'react';
import { renderHook, act } from '@testing-library/react-native';
import { useTasks } from '../useTasks';
import { TaskProvider } from '../../context/TaskContext';
import * as taskStorage from '../../services/taskStorage';

jest.mock('../../services/taskStorage', () => ({
  loadTasks: jest.fn().mockResolvedValue([]),
  saveTasks: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('../../shared/utils/generateId', () => ({
  generateId: jest.fn(() => 'mock-id'),
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <TaskProvider>{children}</TaskProvider>
);

beforeEach(() => {
  jest.clearAllMocks();
  (taskStorage.loadTasks as jest.Mock).mockResolvedValue([]);
  (taskStorage.saveTasks as jest.Mock).mockResolvedValue(undefined);
});

describe('useTasks', () => {
  it('retorna o contexto com tasks, loading e as funções quando dentro do TaskProvider', async () => {
    const { result } = renderHook(() => useTasks(), { wrapper });
    await act(async () => {});

    expect(result.current.tasks).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(typeof result.current.addTask).toBe('function');
    expect(typeof result.current.updateTask).toBe('function');
    expect(typeof result.current.removeTask).toBe('function');
  });

  it('lança erro "useTasks deve ser usado dentro de TaskProvider" quando fora do provider', () => {
    expect(() => renderHook(() => useTasks())).toThrow(
      'useTasks deve ser usado dentro de TaskProvider'
    );
  });
});
