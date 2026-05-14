import { useState, useEffect } from 'react';
import type { FormConfig } from '../types/form';
import { formConfig as localConfig } from '../config/formConfig';

// Bug fix: IDs duplicados → dois campos compartilham mesmo slot de valor.
// sanitize() remove duplicatas mantendo apenas a primeira ocorrência e avisa no console.
function sanitize(config: FormConfig): FormConfig {
  const seen = new Set<string>();
  const deduped = config.fields.filter((field) => {
    if (seen.has(field.id)) {
      console.warn(`[FormConfig] ID duplicado removido: "${field.id}"`);
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
      setConfig(sanitize(localConfig));
      setLoading(false);
      return;
    }

    // API mode: fetches JSON config from remote endpoint.
    // The response must match the FormConfig shape.
    fetch(FORM_CONFIG_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<FormConfig>;
      })
      .then((data) => {
        setConfig(sanitize(data));
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : 'Erro desconhecido';
        setError(`Falha ao carregar config (${message}). Usando config local.`);
        setConfig(localConfig);
      })
      .finally(() => setLoading(false));
  }, []);

  return { config, loading, error };
}
