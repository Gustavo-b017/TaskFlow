import { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator } from 'react-native';

// Nota: Mantemos esta interface local temporariamente pois este App.tsx 
// consome uma API externa de teste (JSONPlaceholder) que difere do nosso modelo de domínio.
interface ExternalUser {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  company: {
    name: string;
  };
  address: {
    city: string;
    street: string;
    suite: string;
    zipcode: string;
  };
}

export default function App() {
  const [users, setUsers] = useState<ExternalUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<ExternalUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then((res) => {
        if (!res.ok) throw new Error('Falha ao carregar usuários');
        return res.json();
      })
      .then((data: ExternalUser[]) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
        <Button title="Tentar novamente" onPress={() => {
          setLoading(true);
          setError(null);
          // Recarregar lógica...
        }} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Usuários da API</Text>

      <View style={styles.table}>
        <View style={styles.headerRow}>
          <Text style={styles.headerCell}>Nome</Text>
          <Text style={styles.headerCell}>Email</Text>
          <Text style={styles.headerCell}>Ação</Text>
        </View>

        {users.map((user) => (
          <View key={user.id} style={styles.dataRow}>
            <Text style={styles.cell}>{user.name}</Text>
            <Text style={styles.cell} numberOfLines={1}>{user.email}</Text>
            <View style={styles.buttonCell}>
              <Button title="Ver" onPress={() => setSelectedUser(user)} />
            </View>
          </View>
        ))}
      </View>

      {selectedUser && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Dados do usuário</Text>
            <Text>Nome: {selectedUser.name}</Text>
            <Text>Usuário: {selectedUser.username}</Text>
            <Text>Email: {selectedUser.email}</Text>
            <Text>Telefone: {selectedUser.phone}</Text>
            <Text>Site: {selectedUser.website}</Text>
            <Text>Empresa: {selectedUser.company.name}</Text>
            <Text>Cidade: {selectedUser.address.city}</Text>
            <Text>Rua: {selectedUser.address.street}</Text>
            <View style={styles.closeButton}>
              <Button title="Fechar" onPress={() => setSelectedUser(null)} />
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  errorText: {
    color: '#FF3B30',
    marginBottom: 16,
    fontSize: 16,
  },
  table: {
    borderWidth: 1,
    borderColor: '#cccccc',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#e6e6e6',
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
  dataRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#dddddd',
    alignItems: 'center',
  },
  headerCell: {
    flex: 1,
    padding: 10,
    fontWeight: 'bold',
  },
  cell: {
    flex: 1,
    padding: 10,
  },
  buttonCell: {
    flex: 0.5,
    padding: 5,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalBox: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  closeButton: {
    marginTop: 16,
  },
});
