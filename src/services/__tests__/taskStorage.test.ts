import AsyncStorage from '@react-native-async-storage/async-storage';
import { saveTasks, loadTasks } from '../taskStorage';
import type { Task } from '../../types/task';
import { STORAGE_KEYS } from '../../shared/constants/storageKeys';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

const mockTask: Task = {
  id: 'task-1',
  title: 'Tarefa teste',
  description: 'Descrição da tarefa',
  status: 'pendente',
  priority: 'media',
  category: 'Trabalho',
  categoryIcon: '💼',
  createdAt: '2026-04-25T10:00:00.000Z',
  updatedAt: '2026-04-25T10:00:00.000Z',
};

describe('taskStorage', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('saveTasks', () => {
    it('persiste a lista serializada em JSON no AsyncStorage', async () => {
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
      await saveTasks([mockTask]);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.TASKS,
        JSON.stringify([mockTask])
      );
    });

    it('persiste array vazio sem lançar erro', async () => {
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
      await saveTasks([]);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(STORAGE_KEYS.TASKS, '[]');
    });
  });

  describe('loadTasks', () => {
    it('retorna tarefas salvas quando storage tem dados', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify([mockTask]));
      const result = await loadTasks();
      expect(result).toEqual([mockTask]);
    });

    it('retorna array vazio quando AsyncStorage está vazio', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      const result = await loadTasks();
      expect(result).toEqual([]);
    });

    it('retorna array vazio e não lança quando JSON está corrompido', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('{ json_invalido');
      const result = await loadTasks();
      expect(result).toEqual([]);
    });

    it('retorna array vazio e não lança quando AsyncStorage falha', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(new Error('Storage indisponível'));
      const result = await loadTasks();
      expect(result).toEqual([]);
    });
  });
});
