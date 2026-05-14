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
      const value = descriptor.get.call(global);
      Object.defineProperty(global, name, {
        value,
        writable: true,
        configurable: true,
        enumerable: true,
      });
    }
  } catch {
    // ignore if module not available in test env
  }
});
