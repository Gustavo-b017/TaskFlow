export async function fetchMotivationalQuote(): Promise<string> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.9) {
        reject(new Error('Falha na rede'));
      } else {
        const quotes = [
          'A persistência realiza o impossível.',
          'O sucesso é a soma de pequenos esforços repetidos dia após dia.',
          'Seja a mudança que você deseja ver no mundo.',
          'Acredite que você pode e você já estará no meio do caminho.'
        ];
        resolve(quotes[Math.floor(Math.random() * quotes.length)]);
      }
    }, 1000);
  });
}
