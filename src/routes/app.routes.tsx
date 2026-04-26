import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform, View } from 'react-native';
import { Home, ListTodo, Settings as SettingsIcon } from 'lucide-react-native';
import { HomeStackRoutes } from './HomeStackRoutes';
import { TaskStackRoutes } from './TaskStackRoutes';
import { SettingsStackRoutes } from './SettingsStackRoutes';
import { TabParamList } from '../types/navigation';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { BORDER_RADIUS, COLORS, SPACING } from '../styles/theme';

const Tab = createBottomTabNavigator<TabParamList>();

const TAB_LABELS: Record<keyof TabParamList, string> = {
  Home: 'Inicio',
  Tasks: 'Tarefas',
  Settings: 'Ajustes',
};

const TAB_ICONS = {
  Home,
  Tasks: ListTodo,
  Settings: SettingsIcon,
} as const;

function withOpacity(color: string, opacity: number) {
  if (/^#[0-9A-Fa-f]{6}$/.test(color)) {
    const alpha = Math.round(opacity * 255)
      .toString(16)
      .padStart(2, '0');
    return `${color}${alpha}`;
  }
  return color;
}

export function AppRoutes() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const colors = COLORS[theme];

  // Regra FIAP-0024: Admin vai para Settings, User vai para Home por padrao.
  const initialRoute = user?.role === 'admin' ? 'Settings' : 'Home';

  return (
    <Tab.Navigator
      initialRouteName={initialRoute}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginBottom: Platform.OS === 'android' ? 3 : 0,
        },
        tabBarItemStyle: {
          minHeight: 56,
          paddingVertical: 6,
        },
        tabBarStyle: {
          position: 'absolute',
          left: SPACING.md,
          right: SPACING.md,
          bottom: SPACING.md,
          height: 76,
          borderTopWidth: 0,
          borderRadius: BORDER_RADIUS.lg,
          backgroundColor: colors.surface,
          paddingHorizontal: SPACING.sm,
          paddingTop: 8,
          elevation: 10,
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: theme === 'dark' ? 0.35 : 0.12,
          shadowRadius: 14,
        },
        tabBarIcon: ({ color, focused }) => {
          const Icon = TAB_ICONS[route.name];
          return (
            <View
              accessible={false}
              style={{
                minWidth: 34,
                minHeight: 34,
                borderRadius: BORDER_RADIUS.full,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: focused ? withOpacity(color, 0.14) : 'transparent',
              }}
            >
              <Icon color={color} size={20} strokeWidth={focused ? 2.6 : 2.2} />
            </View>
          );
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackRoutes}
        options={{
          headerShown: false,
          title: 'Inicio',
          tabBarLabel: TAB_LABELS.Home,
          tabBarAccessibilityLabel: 'Aba Inicio',
        }}
      />
      <Tab.Screen
        name="Tasks"
        component={TaskStackRoutes}
        options={{
          headerShown: false,
          title: 'Tarefas',
          tabBarLabel: TAB_LABELS.Tasks,
          tabBarAccessibilityLabel: 'Aba Tarefas',
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsStackRoutes}
        options={{
          headerShown: false,
          title: 'Configuracoes',
          tabBarLabel: TAB_LABELS.Settings,
          tabBarAccessibilityLabel: 'Aba Ajustes',
        }}
      />
    </Tab.Navigator>
  );
}
