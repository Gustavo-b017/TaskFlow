import { View, Text } from 'react-native';

interface User {
  id: number;
  name: string;
}

export default function App() {
  const users: User[] = [
    { id: 1, name: 'Anderson' },
    { id: 2, name: 'Maria' },
  ];

  const user = users.find((item) => item.id === 2);

  return (
    <View style={{ padding: 20 }}>
      <Text>{user ? user.name : 'Usuário não encontrado'}</Text>
    </View>
  );
}