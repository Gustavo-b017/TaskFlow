import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { Header } from '../../components/Header';
import { useAuth } from '../../hooks/useAuth';
import { CustomButton } from '../../shared/components/CustomButton';

export default function TaskListScreen() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Tarefas" />
      <View style={styles.content}>
        <Text style={styles.emptyText}>Nenhuma tarefa encontrada.</Text>
        
        {isAdmin && (
          <View style={styles.footer}>
            <CustomButton 
              label="Nova Tarefa" 
              onPress={() => {}} 
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#8E8E93',
  },
  footer: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
  },
});
