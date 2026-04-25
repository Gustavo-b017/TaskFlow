import React from 'react';
import { act, renderHook } from '@testing-library/react-native';
import { TaskProvider } from '../TaskContext';
import { useTasks } from '../../hooks/useTasks';
import * as taskStorage from '../../services/taskStorage';
import * as generateIdModule from '../../shared/utils/generateId';

jest.mock('../../services/taskStorage', () => ({
  loadTasks: jest.fn().mockResolvedValue([]),
  saveTasks: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('../../shared/utils/generateId', () => ({
  generateId: jest.fn(() => 'mock-id-1'),
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <TaskProvider>{children}</TaskProvider>
);

const mockInput = {
  title: 'Tarefa teste',
  description: 'Descrição da tarefa',
  status: 'pendente' as const,
  priority: 'media' as const,
  category: 'Trabalho',
  categoryIcon: '💼',
};

describe('TaskContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (taskStorage.loadTasks as jest.Mock).mockResolvedValue([]);
    (taskStorage.saveTasks as jest.Mock).mockResolvedValue(undefined);
    (generateIdModule.generateId as jest.Mock).mockReturnValue('mock-id-1');
  });

  it('inicia com loading=true e tasks=[] antes do mount', () => {
    const { result } = renderHook(() => useTasks(), { wrapper });
    expect(result.current.loading).toBe(true);
    expect(result.current.tasks).toEqual([]);
  });

  it('carrega tarefas do storage e define loading=false após mount', async () => {
    const storedTasks = [
      {
        ...mockInput,
        id: 'existing-1',
        createdAt: '2026-04-25T10:00:00.000Z',
        updatedAt: '2026-04-25T10:00:00.000Z',
      },
    ];
    (taskStorage.loadTasks as jest.Mock).mockResolvedValue(storedTasks);

    const { result } = renderHook(() => useTasks(), { wrapper });
    await act(async () => {});

    expect(result.current.tasks).toEqual(storedTasks);
    expect(result.current.loading).toBe(false);
  });

  it('mantém loading=false mesmo quando loadTasks lança erro', async () => {
    (taskStorage.loadTasks as jest.Mock).mockRejectedValue(new Error('falha'));

    const { result } = renderHook(() => useTasks(), { wrapper });
    await act(async () => {});

    expect(result.current.loading).toBe(false);
    expect(result.current.tasks).toEqual([]);
  });

  describe('addTask', () => {
    it('adiciona tarefa com id, createdAt e updatedAt gerados automaticamente', async () => {
      const { result } = renderHook(() => useTasks(), { wrapper });
      await act(async () => {});

      await act(async () => {
        await result.current.addTask(mockInput);
      });

      expect(result.current.tasks).toHaveLength(1);
      expect(result.current.tasks[0]).toMatchObject({
        id: 'mock-id-1',
        title: 'Tarefa teste',
        status: 'pendente',
      });
      expect(result.current.tasks[0].createdAt).toBeTruthy();
      expect(result.current.tasks[0].updatedAt).toBeTruthy();
    });

    it('persiste a tarefa via saveTasks após adicionar', async () => {
      const { result } = renderHook(() => useTasks(), { wrapper });
      await act(async () => {});

      await act(async () => {
        await result.current.addTask(mockInput);
      });

      expect(taskStorage.saveTasks).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ id: 'mock-id-1', title: 'Tarefa teste' }),
        ])
      );
    });

    it('lança erro "Título é obrigatório" quando título é string vazia', async () => {
      const { result } = renderHook(() => useTasks(), { wrapper });
      await act(async () => {});

      await expect(
        act(async () => {
          await result.current.addTask({ ...mockInput, title: '' });
        })
      ).rejects.toThrow('Título é obrigatório');

      expect(result.current.tasks).toHaveLength(0);
    });

    it('lança erro "Título é obrigatório" quando título contém apenas espaços', async () => {
      const { result } = renderHook(() => useTasks(), { wrapper });
      await act(async () => {});

      await expect(
        act(async () => {
          await result.current.addTask({ ...mockInput, title: '   ' });
        })
      ).rejects.toThrow('Título é obrigatório');
    });

    it('não chama saveTasks quando título é inválido', async () => {
      const { result } = renderHook(() => useTasks(), { wrapper });
      await act(async () => {});

      try {
        await act(async () => {
          await result.current.addTask({ ...mockInput, title: '' });
        });
      } catch {}

      expect(taskStorage.saveTasks).not.toHaveBeenCalled();
    });
  });

  describe('updateTask', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2026-04-25T10:00:00.000Z'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('atualiza o campo informado preservando o id original', async () => {
      const { result } = renderHook(() => useTasks(), { wrapper });
      await act(async () => {});

      await act(async () => {
        await result.current.addTask(mockInput);
      });

      const originalId = result.current.tasks[0].id;

      jest.setSystemTime(new Date('2026-04-25T11:00:00.000Z'));

      await act(async () => {
        await result.current.updateTask(originalId, { title: 'Título atualizado' });
      });

      const updated = result.current.tasks.find((t) => t.id === originalId);
      expect(updated!.title).toBe('Título atualizado');
      expect(updated!.id).toBe(originalId);
    });

    it('atualiza updatedAt e mantém createdAt inalterado', async () => {
      const { result } = renderHook(() => useTasks(), { wrapper });
      await act(async () => {});

      await act(async () => {
        await result.current.addTask(mockInput);
      });

      const { id, createdAt } = result.current.tasks[0];

      jest.setSystemTime(new Date('2026-04-25T11:00:00.000Z'));

      await act(async () => {
        await result.current.updateTask(id, { title: 'Atualizado' });
      });

      const updated = result.current.tasks.find((t) => t.id === id)!;
      expect(updated.createdAt).toBe(createdAt);
      expect(updated.updatedAt).toBe('2026-04-25T11:00:00.000Z');
      expect(updated.updatedAt).not.toBe(updated.createdAt);
    });

    it('não altera outras tarefas da lista', async () => {
      let counter = 0;
      (generateIdModule.generateId as jest.Mock).mockImplementation(
        () => `id-${++counter}`
      );

      const { result } = renderHook(() => useTasks(), { wrapper });
      await act(async () => {});

      await act(async () => {
        await result.current.addTask(mockInput);
        await result.current.addTask({ ...mockInput, title: 'Segunda' });
      });

      const firstId = result.current.tasks[0].id;

      await act(async () => {
        await result.current.updateTask(firstId, { title: 'Primeiro atualizado' });
      });

      expect(result.current.tasks[1].title).toBe('Segunda');
    });

    it('persiste a lista atualizada via saveTasks', async () => {
      const { result } = renderHook(() => useTasks(), { wrapper });
      await act(async () => {});

      await act(async () => {
        await result.current.addTask(mockInput);
      });

      const id = result.current.tasks[0].id;
      jest.clearAllMocks();

      await act(async () => {
        await result.current.updateTask(id, { title: 'Novo título' });
      });

      expect(taskStorage.saveTasks).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ id, title: 'Novo título' }),
        ])
      );
    });
  });

  describe('removeTask', () => {
    it('remove a tarefa com o id informado', async () => {
      const { result } = renderHook(() => useTasks(), { wrapper });
      await act(async () => {});

      await act(async () => {
        await result.current.addTask(mockInput);
      });

      const taskId = result.current.tasks[0].id;

      await act(async () => {
        await result.current.removeTask(taskId);
      });

      expect(result.current.tasks).toHaveLength(0);
    });

    it('persiste a lista sem a tarefa removida via saveTasks', async () => {
      const { result } = renderHook(() => useTasks(), { wrapper });
      await act(async () => {});

      await act(async () => {
        await result.current.addTask(mockInput);
      });

      jest.clearAllMocks();
      const taskId = result.current.tasks[0].id;

      await act(async () => {
        await result.current.removeTask(taskId);
      });

      expect(taskStorage.saveTasks).toHaveBeenCalledWith([]);
    });

    it('não altera a lista quando id não existe', async () => {
      const { result } = renderHook(() => useTasks(), { wrapper });
      await act(async () => {});

      await act(async () => {
        await result.current.addTask(mockInput);
      });

      await act(async () => {
        await result.current.removeTask('id-inexistente');
      });

      expect(result.current.tasks).toHaveLength(1);
    });
  });
});
