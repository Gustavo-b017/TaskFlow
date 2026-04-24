import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function TaskDetailScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalhes da Tarefa</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
