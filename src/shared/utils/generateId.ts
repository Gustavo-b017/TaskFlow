export function generateId(): string {
  // Garantimos sempre um tamanho de 8 caracteres na parte randômica para evitar o edge-case de Math.random() === 0
  const randomPart = Math.random().toString(36).substring(2, 10).padEnd(8, '0');
  const timePart = Date.now().toString(36);
  return `${timePart}-${randomPart}`;
}
