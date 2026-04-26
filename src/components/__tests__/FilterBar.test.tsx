import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { FilterBar } from '../FilterBar';

describe('FilterBar', () => {
  it('renderiza os labels completos dos filtros sem abreviar', () => {
    const { getByText } = render(<FilterBar selected="all" onSelect={jest.fn()} />);

    expect(getByText('Todos')).toBeTruthy();
    expect(getByText('Pendente')).toBeTruthy();
    expect(getByText('Em andamento')).toBeTruthy();
    expect(getByText('Concluída')).toBeTruthy();
  });

  it('chama onSelect com o status correto ao pressionar um filtro', () => {
    const onSelect = jest.fn();
    const { getByText } = render(<FilterBar selected="all" onSelect={onSelect} />);

    fireEvent.press(getByText('Em andamento'));

    expect(onSelect).toHaveBeenCalledWith('em_andamento');
  });
});
