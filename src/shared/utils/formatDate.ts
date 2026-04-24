export function formatDate(isoString: string): string {
  if (!isoString) return '';
  
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return 'Data inválida';

  // Usamos métodos UTC para garantir que a data não sofra shift por causa do timezone local (GMT-3)
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const year = date.getUTCFullYear();

  return `${day}/${month}/${year}`;
}
