import { fetchCategories, fetchMotivationalQuote, BASE_URL } from '../api';

describe('api service', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('fetchCategories', () => {
    it('should return categories successfully when response is ok', async () => {
      const mockCategories = ['Electronics', 'Jewelery'];
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => mockCategories,
      });

      const categories = await fetchCategories();
      expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/products/categories`);
      expect(categories).toEqual(mockCategories);
    });

    it('should map categories correctly when API returns objects', async () => {
      const mockResponse = [{ name: 'Electronics' }, { name: 'Jewelery' }];
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const categories = await fetchCategories();
      expect(categories).toEqual(['Electronics', 'Jewelery']);
    });

    it('should throw an error when response is not ok', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 404,
      });

      await expect(fetchCategories()).rejects.toThrow('Falha ao buscar categorias: 404');
    });

    it('should throw an error when format is unexpected', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ unexpected: 'format' }), // Not an array
      });

      await expect(fetchCategories()).rejects.toThrow('Formato de resposta inesperado');
    });
  });

  describe('fetchMotivationalQuote', () => {
    it('should return a quote successfully when response is ok', async () => {
      const mockQuote = { quote: 'Believe in yourself' };
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => mockQuote,
      });

      const quote = await fetchMotivationalQuote();
      expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/quotes/random`);
      expect(quote).toEqual('Believe in yourself');
    });

    it('should throw an error when response is not ok', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
      });

      await expect(fetchMotivationalQuote()).rejects.toThrow('Falha ao buscar frase motivacional');
    });
  });
});
