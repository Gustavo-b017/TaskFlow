import { generateId } from '../generateId';

describe('generateId', () => {
  it('retorna uma string não vazia', () => {
    expect(typeof generateId()).toBe('string');
    expect(generateId().length).toBeGreaterThan(0);
  });

  it('contém um hífen separando a parte de tempo da parte aleatória', () => {
    const id = generateId();
    expect(id).toMatch(/^[a-z0-9]+-[a-z0-9]+$/);
  });

  it('gera IDs únicos em chamadas consecutivas', () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateId()));
    expect(ids.size).toBe(100);
  });

  it('a parte aleatória tem sempre 8 caracteres mesmo quando Math.random retorna 0', () => {
    const spy = jest.spyOn(Math, 'random').mockReturnValueOnce(0);
    const id = generateId();
    const randomPart = id.split('-')[1];
    expect(randomPart).toHaveLength(8);
    spy.mockRestore();
  });

  it('não gera IDs com menos de 10 caracteres no total', () => {
    for (let i = 0; i < 50; i++) {
      expect(generateId().length).toBeGreaterThanOrEqual(10);
    }
  });
});
