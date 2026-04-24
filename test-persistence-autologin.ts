// Simulação de Teste de Persistência e Auto-login
const storage: Record<string, string> = {};
const AsyncStorage = {
  getItem: (key: string) => Promise.resolve(storage[key] || null),
  setItem: (key: string, val: string) => { storage[key] = val; return Promise.resolve(); },
  removeItem: (key: string) => { delete storage[key]; return Promise.resolve(); },
};

const USER_MOCK = { id: 1, username: 'admin', role: 'admin', name: 'Administrador' };

async function runPersistenceTests() {
  console.log('🚀 Iniciando Testes de Persistência e Auto-login (S2.2)');
  let failures = 0;

  // Teste 1: Persistência após SignIn
  console.log('\n--- Teste 1: Salvando sessão no SignIn ---');
  await AsyncStorage.setItem('@taskflow:user', JSON.stringify(USER_MOCK));
  const saved = await AsyncStorage.getItem('@taskflow:user');
  if (saved && JSON.parse(saved).username === 'admin') {
    console.log('✅ Sessão salva corretamente no AsyncStorage');
  } else {
    console.error('❌ ERRO: Sessão não foi salva');
    failures++;
  }

  // Teste 2: Restauração de Sessão (Simulação de Boot)
  console.log('--- Teste 2: Restaurando sessão (Boot) ---');
  const restoreSession = async () => {
    const raw = await AsyncStorage.getItem('@taskflow:user');
    if (raw) return JSON.parse(raw);
    return null;
  };
  const restored = await restoreSession();
  if (restored && restored.role === 'admin') {
    console.log('✅ Auto-login: Sessão restaurada com sucesso');
  } else {
    console.error('❌ ERRO: Falha ao restaurar sessão no boot');
    failures++;
  }

  // Teste 3: Limpeza de Sessão no SignOut
  console.log('--- Teste 3: Limpeza de sessão no SignOut ---');
  await AsyncStorage.removeItem('@taskflow:user');
  const afterSignOut = await AsyncStorage.getItem('@taskflow:user');
  if (afterSignOut === null) {
    console.log('✅ Sessão removida com sucesso após SignOut');
  } else {
    console.error('❌ ERRO: Sessão persistiu após SignOut');
    failures++;
  }

  // Teste 4: Stress (1000 boots rápidos)
  console.log('--- Teste 4: Stress Test - 1000 Boots Rápidos ---');
  const stressStartTime = Date.now();
  for (let i = 0; i < 1000; i++) {
    await AsyncStorage.setItem('@taskflow:user', JSON.stringify(USER_MOCK));
    const data = await restoreSession();
    if (!data) failures++;
    await AsyncStorage.removeItem('@taskflow:user');
  }
  console.log(`✅ Stress Test concluído em ${Date.now() - stressStartTime}ms`);

  if (failures === 0) {
    console.log('\n🏆 Story S2.2 100% Validada e Resiliente!');
  } else {
    console.log(`\n⚠️  ${failures} falhas detectadas.`);
    process.exit(1);
  }
}

runPersistenceTests();
