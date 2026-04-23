import { View, Text } from 'react-native';

export default function App() {
  const age: number = 20;
  let message: string = '';

  if (age >= 18) {
    message = 'Maior de idade';
  } else {
    message = 'Menor de idade';
  }

  return (
    <View style={{ padding: 20 }}>
      <Text>{message}</Text>
    </View>
  );
}