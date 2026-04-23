import { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';

interface User {
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
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then((res) => res.json())
      .then((data: User[]) => setUsers(data));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Usuarios da API</Text>

      <View style={styles.table}>
        <View style={styles.headerRow}>
          <Text style={styles.headerCell}>Nome</Text>
          <Text style={styles.headerCell}>Email</Text>
          <Text style={styles.headerCell}>Acao</Text>
        </View>

        {users.map((user) => (
          <View key={user.id} style={styles.dataRow}>
            <Text style={styles.cell}>{user.name}</Text>
            <Text style={styles.cell}>{user.email}</Text>
            <View style={styles.buttonCell}>
              <Button title="Ver" onPress={() => setSelectedUser(user)} />
            </View>
          </View>
        ))}
      </View>

      {selectedUser ? (
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Dados do usuario</Text>
            <Text>Nome: {selectedUser.name}</Text>
            <Text>Usuario: {selectedUser.username}</Text>
            <Text>Email: {selectedUser.email}</Text>
            <Text>Telefone: {selectedUser.phone}</Text>
            <Text>Site: {selectedUser.website}</Text>
            <Text>Empresa: {selectedUser.company.name}</Text>
            <Text>Cidade: {selectedUser.address.city}</Text>
            <Text>Rua: {selectedUser.address.street}</Text>
            <Text>Suite: {selectedUser.address.suite}</Text>
            <Text>CEP: {selectedUser.address.zipcode}</Text>
            <View style={styles.closeButton}>
              <Button title="Fechar" onPress={() => setSelectedUser(null)} />
            </View>
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    marginBottom: 16,
  },
  table: {
    borderWidth: 1,
    borderColor: '#cccccc',
    backgroundColor: '#ffffff',
  },
  headerRow: {
    flexDirection: 'row' as const,
    backgroundColor: '#e6e6e6',
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
  dataRow: {
    flexDirection: 'row' as const,
    borderBottomWidth: 1,
    borderBottomColor: '#dddddd',
    alignItems: 'center' as const,
  },
  headerCell: {
    flex: 1,
    padding: 10,
    fontWeight: 'bold' as const,
  },
  cell: {
    flex: 1,
    padding: 10,
  },
  buttonCell: {
    flex: 1,
    padding: 10,
  },
  modalOverlay: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    padding: 20,
  },
  modalBox: {
    width: '100%' as const,
    maxWidth: 420,
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold' as const,
    marginBottom: 12,
  },
  closeButton: {
    marginTop: 16,
  },
};
