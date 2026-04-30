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
    const { getByLabelText } = render(
      <DeleteConfirmModal {...baseProps} onConfirm={onConfirm} />
    );
    fireEvent.press(getByLabelText(/Aguarde/));
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it('chama onConfirm ao pressionar Excluir após countdown', () => {
    const onConfirm = jest.fn();
    const { getByLabelText } = render(
      <DeleteConfirmModal {...baseProps} onConfirm={onConfirm} />
    );

    act(() => { jest.advanceTimersByTime(3000); });
    fireEvent.press(getByLabelText('Confirmar exclusão'));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('chama onCancel ao pressionar Cancelar', () => {
    const onCancel = jest.fn();
    const { getByLabelText } = render(
      <DeleteConfirmModal {...baseProps} onCancel={onCancel} />
    );
    fireEvent.press(getByLabelText('Cancelar exclusão'));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('não renderiza nada quando visible=false', () => {
    const { queryByText } = render(
      <DeleteConfirmModal {...baseProps} visible={false} />
    );
    expect(queryByText('Excluir tarefa?')).toBeNull();
  });
});
