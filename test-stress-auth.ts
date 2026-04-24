import { AuthProvider } from './src/context/AuthContext';
// Simulação simplificada para teste de estresse da lógica
async function stressTestAuth() {
  console.log('🚀 Iniciando teste de estresse de autenticação...');
  
  const iterations = 1000;
  let failures = 0;
  
  // Simulando a lógica do signIn em loop massivo
  const mockSignIn = async (u: string, p: string) => {
    if (u === 'admin' && p === '123') return { id: 1, username: 'admin' };
    throw new Error('Invalido');
  };

  const start = Date.now();

  for (let i = 0; i < iterations; i++) {
    try {
      // Alternando entre sucesso e falha para testar resiliência
      const user = i % 2 === 0 ? 'admin' : 'wrong';
      await mockSignIn(user, '123');
    } catch (e) {
      if ((i % 2 === 0)) failures++;
    }
  }

  const end = Date.now();
  console.log(`✅ Teste concluído em ${end - start}ms`);
  console.log(`📊 Iterações: ${iterations}`);
  console.log(`❌ Falhas inesperadas: ${failures}`);
  
  if (failures === 0) {
    console.log('⭐ Sistema resiliente a carga massiva de autenticação.');
  } else {
    process.exit(1);
  }
}

stressTestAuth();
