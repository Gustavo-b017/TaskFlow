import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './src/context/ThemeContext';
import { TreatmentProvider } from './src/context/TreatmentContext';
import { AuthProvider } from './src/context/AuthContext';
import { TaskProvider } from './src/context/TaskContext';
import { Routes } from './src/routes';

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <TreatmentProvider>
            <TaskProvider>
              <StatusBar style="auto" />
              <Routes />
            </TaskProvider>
          </TreatmentProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

