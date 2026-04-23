import { View, Text } from 'react-native';

export default function App() {
  const isLogged = true;

  return (
    <View style={{ padding: 20 }}>
      <Text>{isLogged ? 'Bem-vindo!' : 'Faça login'}</Text>
    </View>
  );
}