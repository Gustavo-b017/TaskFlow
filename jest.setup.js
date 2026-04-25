// Força o carregamento eager dos lazy globals do Expo Winter Runtime.
// O jest-expo define propriedades via lazy getter em installGlobal.ts.
// Se acessadas APÓS leaveTestCode() (teardown), isInsideTestCode===false e
// jest-runtime lança ReferenceError. A solução é materializar cada getter
// durante setupFiles (quando isInsideTestCode===undefined, não false).

const globalsToEagerLoad = [
  '__ExpoImportMetaRegistry',
  'structuredClone',
  'TextDecoder',
  'TextDecoderStream',
  'TextEncoderStream',
  'URL',
  'URLSearchParams',
];

globalsToEagerLoad.forEach((name) => {
  try {
    const descriptor = Object.getOwnPropertyDescriptor(global, name);
    if (descriptor && typeof descriptor.get === 'function') {
      // Acessa o getter agora (isInsideTestCode===undefined, não false → sem erro)
      // e substitui o getter por um valor concreto.
      const value = descriptor.get.call(global);
      Object.defineProperty(global, name, {
        value,
        writable: true,
        configurable: true,
        enumerable: true,
      });
    }
  } catch {
    // Ignorar se o módulo não estiver disponível no ambiente de teste
  }
});
