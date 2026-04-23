import { View, Text } from 'react-native';

interface Address {
  city: string;
}

interface User {
  name: string;
  address?: Address;
}

export default function App() {
  const user: User = {
    name: 'Anderson',
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Nome: {user.name}</Text>
      <Text>Cidade: {user.address?.city ?? 'Não informada'}</Text>
    </View>
  );
}

// && significa E
// || significa OU
// ! inverte um booleano
// ?. evita erro ao acessar algo que pode ser undefined
// ?? define um valor padrão
