import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { SettingsStackParamList } from '../types/navigation';
import SettingsScreen from '../screens/settings/SettingsScreen';

const Stack = createNativeStackNavigator<SettingsStackParamList>();

export function SettingsStackRoutes() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}
