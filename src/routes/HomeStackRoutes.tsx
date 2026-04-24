import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '../types/navigation';
import HomeScreen from '../screens/home/HomeScreen';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export function HomeStackRoutes() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
}
