import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { Header } from '../../components/Header';
import { useAuth } from '../../hooks/useAuth';

export default function HomeScreen() {
  const { user } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Início" />
      <View style={styles.content}>
        <Text style={styles.welcome}>Bem-vindo,</Text>
        <Text style={styles.name}>{user?.name}!</Text>
        <View style={styles.card}>
          <Text style={styles.cardText}>
            Você está logado como: {user?.role === 'admin' ? 'Administrador' : 'Usuário'}
          </Text>
        </View>
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
  },
  welcome: {
    fontSize: 24,
    color: '#8E8E93',
  },
  name: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardText: {
    fontSize: 16,
    color: '#333',
  },
});
