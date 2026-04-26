const TASK_LIST_MAX_HEIGHT_RATIO = 0.68;
const TASK_LIST_MIN_HEIGHT = 320;

export function getTaskListMaxHeight(windowHeight: number): number {
  const proportionalHeight = Math.floor(windowHeight * TASK_LIST_MAX_HEIGHT_RATIO);
  return Math.max(TASK_LIST_MIN_HEIGHT, proportionalHeight);
}
