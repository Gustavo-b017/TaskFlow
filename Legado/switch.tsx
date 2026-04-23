import { View, Text } from 'react-native';

export default function App() {
  const status: string = 'success';
  let message: string = '';

  switch (status) {
    case 'loading':
      message = 'Carregando';
      break;
    case 'success':
      message = 'Sucesso';
      break;
    case 'error':
      message = 'Erro';
      break;
    default:
      message = 'Status desconhecido';
  }

  return (
    <View style={{ padding: 20 }}>
      <Text>{message}</Text>
    </View>
  );
}