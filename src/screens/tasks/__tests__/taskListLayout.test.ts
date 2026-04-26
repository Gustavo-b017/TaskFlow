import { getTaskListMaxHeight } from '../taskListLayout';

describe('taskListLayout', () => {
  it('usa altura proporcional da tela quando o valor é maior que o mínimo', () => {
    expect(getTaskListMaxHeight(1000)).toBe(680);
  });

  it('respeita altura mínima para telas pequenas', () => {
    expect(getTaskListMaxHeight(300)).toBe(320);
  });
});
