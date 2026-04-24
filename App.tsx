import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from './src/context/ThemeContext';
import { AuthProvider } from './src/context/AuthContext';
import { TaskProvider } from './src/context/TaskContext';
import { Routes } from './src/routes';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <TaskProvider>
          <StatusBar style="auto" />
          <Routes />
        </TaskProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

