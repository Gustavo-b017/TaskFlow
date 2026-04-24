import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/home/HomeScreen';
import TaskListScreen from '../screens/tasks/TaskListScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';
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
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Tasks" component={TaskListScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
