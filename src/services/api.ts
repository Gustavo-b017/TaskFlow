export const BASE_URL = 'https://dummyjson.com';

// Categorias de tarefas — usadas no TaskFormScreen
export async function fetchCategories(): Promise<string[]> {
  const response = await fetch(`${BASE_URL}/products/categories`);
  if (!response.ok) {
    throw new Error(`Falha ao buscar categorias: ${response.status}`);
  }
  const data: unknown = await response.json();
  
  // DummyJSON retorna array de objetos ou strings dependendo da versão
  if (Array.isArray(data)) {
    return data.map((item) =>
      typeof item === 'string' ? item : (item as { name: string }).name
    );
  }
  throw new Error('Formato de resposta inesperado');
}

// Frase motivacional do dia — usada na HomeScreen
export async function fetchMotivationalQuote(): Promise<string> {
  // Usando DummyJSON Quotes para maior confiabilidade
  const response = await fetch(`${BASE_URL}/quotes/random`);
  if (!response.ok) {
    throw new Error('Falha ao buscar frase motivacional');
  }
  const data = (await response.json()) as { quote: string };
  return data.quote;
}
