export const COLORS = {
  light: {
    background: '#F8FAFC',
    surface: '#FFFFFF',
    border: '#E2E8F0',
    text: '#0F172A',
    textMuted: '#64748B',
    primary: '#0F766E',
    secondary: '#14B8A6',
    accent: '#F97316',
    error: '#EF4444',
    success: '#10B981',
    inputBg: '#F1F5F9',
  },
  dark: {
    background: '#020617',
    surface: '#0F172A',
    border: '#1E293B',
    text: '#F8FAFC',
    textMuted: '#94A3B8',
    primary: '#14B8A6',
    secondary: '#0D9488',
    accent: '#FB923C',
    error: '#F87171',
    success: '#34D399',
    inputBg: '#1E293B',
  },
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  full: 9999,
} as const;
