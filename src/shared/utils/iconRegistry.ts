import type { ComponentType } from 'react';
import * as LucideIcons from 'lucide-react-native';
import type { LucideProps } from 'lucide-react-native';

export type LucideIconComponent = ComponentType<LucideProps>;

const iconMap = LucideIcons as unknown as Record<string, LucideIconComponent>;

export function resolveLucideIcon(iconName?: string): LucideIconComponent {
  if (!iconName) return LucideIcons.ClipboardList;
  return iconMap[iconName] ?? LucideIcons.ClipboardList;
}
