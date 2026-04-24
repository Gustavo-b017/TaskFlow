import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { TaskStackParamList } from '../types/navigation';
import TaskListScreen from '../screens/tasks/TaskListScreen';
import { TaskFormScreen } from '../screens/tasks/TaskFormScreen';
import { TaskDetailScreen } from '../screens/tasks/TaskDetailScreen';

const Stack = createNativeStackNavigator<TaskStackParamList>();

export function TaskStackRoutes() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="TaskList" 
        component={TaskListScreen} 
        options={{ title: 'Tarefas' }}
      />
      <Stack.Screen 
        name="TaskForm" 
        component={TaskFormScreen} 
        options={({ route }) => ({
          title: route.params?.taskId ? 'Editar Tarefa' : 'Nova Tarefa',
        })}
      />
      <Stack.Screen 
        name="TaskDetail" 
        component={TaskDetailScreen} 
        options={{ title: 'Detalhes' }}
      />
    </Stack.Navigator>
  );
}
