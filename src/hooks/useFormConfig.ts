import { useState, useEffect } from 'react';
import type { FormConfig } from '../types/form';
import { formConfig as localConfig } from '../config/formConfig';

function sanitize(config: FormConfig): FormConfig {
  const seen = new Set<string>();
  const deduped = config.fields.filter((field) => {
    if (seen.has(field.id)) {
      if (__DEV__) {
        console.warn(`[FormConfig] ID duplicado removido: "${field.id}"`);
      }
      return false;
    }
    seen.add(field.id);
    return true;
  });
  return { ...config, fields: deduped };
}

// Toggle: 'local' uses formConfig.ts directly.
//         'api'   fetches from FORM_CONFIG_URL and falls back to localConfig.
const SOURCE: 'local' | 'api' = 'local';
const FORM_CONFIG_URL = 'https://sua-api.com/form-config';

type UseFormConfigReturn = {
  config: FormConfig | null;
  loading: boolean;
  error: string | null;
};

export function useFormConfig(): UseFormConfigReturn {
  const [config, setConfig] = useState<FormConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState<string | null>(null);

  useEffect(() => {
    if (SOURCE === 'local') {
      try {
        setConfig(sanitize(localConfig));
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Erro desconhecido';
        setError(`Falha ao carregar config local: ${msg}`);
      } finally {
        setLoading(false);
      }
      return;
    }

    const controller = new AbortController();

    fetch(FORM_CONFIG_URL, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<FormConfig>;
      })
      .then((data) => {
        setConfig(sanitize(data));
      })
      .catch((err: unknown) => {
        if (err instanceof Error && err.name === 'AbortError') return;
        const message = err instanceof Error ? err.message : 'Erro desconhecido';
        setError(`Falha ao carregar config (${message}). Usando config local.`);
        setConfig(localConfig);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  return { config, loading, error };
}
