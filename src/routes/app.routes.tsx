import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeStackRoutes } from './HomeStackRoutes';
import { TaskStackRoutes } from './TaskStackRoutes';
import { SettingsStackRoutes } from './SettingsStackRoutes';
import { TabParamList } from '../types/navigation';
import { useAuth } from '../hooks/useAuth';

const Tab = createBottomTabNavigator<TabParamList>();

export function AppRoutes() {
  const { user } = useAuth();
  
  // Regra FIAP-0024: Admin vai para Settings, User vai para Home por padrão
  const initialRoute = user?.role === 'admin' ? 'Settings' : 'Home';

  return (
    <Tab.Navigator 
      initialRouteName={initialRoute}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeStackRoutes} 
        options={{ headerShown: false, title: 'Home' }}
      />
      <Tab.Screen 
        name="Tasks" 
        component={TaskStackRoutes} 
        options={{ headerShown: false, title: 'Tarefas' }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsStackRoutes} 
        options={{ headerShown: false, title: 'Configurações' }}
      />
    </Tab.Navigator>
  );
}

